"use client";

import { useEffect, useState } from "react";
import PriceListTemplate from "@/invoice-template/price-list-template";
import { dentalServices as initialServices } from "~/data/dentalServices";

type DentalService = {
  code: string;
  name: string;
  price: number;
};

export default function Page() {
  const [services, setServices] =
    useState<DentalService[]>(initialServices);

  useEffect(() => {
    const storedServices =
      localStorage.getItem("priceListServices");

    if (storedServices) {
      setServices(JSON.parse(storedServices));
    }
  }, []);

  return (
    <PriceListTemplate services={services} />
  );
}