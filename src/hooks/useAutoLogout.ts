"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";

export function useAutoLogout(timeout = 10 *60* 1000) { // ⏱ 5 sekundi (test)
    const timer = useRef<NodeJS.Timeout | null>(null);
    const warningTimer = useRef<NodeJS.Timeout | null>(null);
    const [showWarning, setShowWarning] = useState(false);

    const logout = () => {
        signOut({ callbackUrl: "/" });
    };

    const resetTimer = () => {

        if (showWarning) {
            setShowWarning(false);
        }


        if (timer.current) clearTimeout(timer.current);
        if (warningTimer.current) clearTimeout(warningTimer.current);


        timer.current = setTimeout(() => {
            setShowWarning(true);

            // nakon warninga → logout
            warningTimer.current = setTimeout(() => {
                logout();
            }, 60 * 1000);
        }, timeout);
    };

    useEffect(() => {
        const events = ["mousemove", "keydown", "click", "scroll"];

        events.forEach((event) =>
            window.addEventListener(event, resetTimer)
        );

        resetTimer();

        return () => {
            if (timer.current) clearTimeout(timer.current);
            if (warningTimer.current) clearTimeout(warningTimer.current);

            events.forEach((event) =>
                window.removeEventListener(event, resetTimer)
            );
        };
    }, []);

    return { showWarning, setShowWarning, resetTimer };
}