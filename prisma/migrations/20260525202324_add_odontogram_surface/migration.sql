-- CreateTable
CREATE TABLE "OdontogramSurface" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "toothNumber" INTEGER NOT NULL,
    "surface" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OdontogramSurface_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OdontogramSurface_patientId_toothNumber_surface_key" ON "OdontogramSurface"("patientId", "toothNumber", "surface");

-- AddForeignKey
ALTER TABLE "OdontogramSurface" ADD CONSTRAINT "OdontogramSurface_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
