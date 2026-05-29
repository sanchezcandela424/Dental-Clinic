"use client";
 
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { api } from "~/trpc/react";
 
type AppointmentFormProps = {
    patientId: string;
    initialData?: {
        id:        string;
        startTime: Date;
        endTime?:  Date;
        reason?:   string | null;
    };
    onSuccess?: () => void;
};
 
export default function AppointmentFormSheet({
    patientId,
    initialData,
    onSuccess,
}: AppointmentFormProps) {
    const [isOpen,  setIsOpen]  = useState(false);
    const [date,    setDate]    = useState("");
    const [time,    setTime]    = useState("");
    const [endTime, setEndTime] = useState("");
    const [reason,  setReason]  = useState("");
    const [availabilityError, setAvailabilityError] = useState<string | null>(null);
 
    const isUpdateMode = !!initialData;
    const utils = api.useUtils();
 
    // Popuni formu pri otvaranju
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                const d = new Date(initialData.startTime);
                const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
                    .toISOString()
                    .split("T")[0];
                const localTime = d.toTimeString().slice(0, 5);
                setDate(localDate ?? "");
                setTime(localTime ?? "");
 
                if (initialData.endTime) {
                    const e = new Date(initialData.endTime);
                    setEndTime(e.toTimeString().slice(0, 5));
                } else {
                    setEndTime("");
                }
                setReason(initialData.reason ?? "");
            } else {
                setDate("");
                setTime("");
                setEndTime("");
                setReason("");
            }
            setAvailabilityError(null);
        }
    }, [isOpen, initialData]);
 
    const checkAvailability = api.appointment.checkAvailability.useMutation();
 
    const createAppointment = api.appointment.create.useMutation({
        onSuccess: () => {
            setIsOpen(false);
            void utils.appointment.getCalendarEvents.invalidate();
            void utils.appointment.getDashboardStats.invalidate();
            void utils.patients.getById.invalidate({ id: patientId });
            onSuccess?.();
        },
        onError: (error) => {
            setAvailabilityError(error.message);
        },
    });
 
    const updateAppointment = api.appointment.update.useMutation({
        onSuccess: () => {
            setIsOpen(false);
            void utils.appointment.getCalendarEvents.invalidate();
            void utils.appointment.getDashboardStats.invalidate();
            void utils.patients.getById.invalidate({ id: patientId });
            onSuccess?.();
        },
        onError: (error) => {
            setAvailabilityError(error.message);
        },
    });
 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAvailabilityError(null);
 
        if (!date || !time) {
            setAvailabilityError("Molimo odaberite datum i vrijeme.");
            return;
        }
 
        const startDateTime = new Date(`${date}T${time}`);
        const endDateTime   = endTime
            ? new Date(`${date}T${endTime}`)
            : new Date(startDateTime.getTime() + 30 * 60 * 1000);
 
        const availability = await checkAvailability.mutateAsync({
            startTime:  startDateTime,
            endTime:    endDateTime,
            excludeId:  initialData?.id,
        });
 
        if (!availability.available) {
            setAvailabilityError(
                "Odabrano vrijeme je već zauzeto. Molimo odaberite drugi termin."
            );
            return;
        }
 
        if (isUpdateMode && initialData) {
            updateAppointment.mutate({
                id:        initialData.id,
                startTime: startDateTime,
                endTime:   endDateTime,
                reason,
            });
        } else {
            createAppointment.mutate({
                patientId,
                startTime: startDateTime,
                endTime:   endDateTime,
                reason,
            });
        }
    };
 
    const isPending = createAppointment.isPending || updateAppointment.isPending || checkAvailability.isPending;
 
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                {isUpdateMode ? (
                    <Button
                        variant="outline"
                        className="rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-2"
                    >
                        ✏️ Uredi
                    </Button>
                ) : (
                    <Button className="rounded-xl bg-orange-600 px-4 py-2 text-white font-medium transition hover:bg-orange-700 flex items-center gap-2 h-auto">
                        📅 Dodaj termin
                    </Button>
                )}
            </SheetTrigger>
 
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle className="text-xl">
                        {isUpdateMode ? "Ažuriranje termina" : "Zakazivanje novog termina"}
                    </SheetTitle>
                </SheetHeader>
 
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Datum</label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => { setDate(e.target.value); setAvailabilityError(null); }}
                            required
                            className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                    </div>
 
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Početak</label>
                            <Input
                                type="time"
                                value={time}
                                onChange={(e) => { setTime(e.target.value); setAvailabilityError(null); }}
                                required
                                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Kraj <span className="text-gray-400 text-xs">(opciono, default +30min)</span>
                            </label>
                            <Input
                                type="time"
                                value={endTime}
                                onChange={(e) => { setEndTime(e.target.value); setAvailabilityError(null); }}
                                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                            />
                        </div>
                    </div>
 
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Razlog posjete <span className="text-gray-400 text-xs">(opciono)</span>
                        </label>
                        <Input
                            type="text"
                            placeholder="Npr. Čišćenje kamenca"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                    </div>
                    
                    {availabilityError && (
                        <div className="rounded-xl border border-red-100 bg-red-50 p-3">
                            <p className="text-sm font-medium text-red-600">{availabilityError}</p>
                        </div>
                    )}
 
                    <div className="mt-4 flex justify-end gap-3">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="rounded-xl px-4 py-2"
                        >
                            Odustani
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-4 py-2 disabled:opacity-50"
                        >
                            {isPending
                                ? "Provjera..."
                                : isUpdateMode
                                    ? "Sačuvaj izmjene"
                                    : "Sačuvaj termin"}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}