"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type InvoiceItemProps = {
  designation: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export interface InvoiceItemWithId extends InvoiceItemProps {
  id: string;
}

export interface InvoiceContextType {
  reference: string;
  setReference: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  clientName: string;
  setClientName: (value: string) => void;
  object: string;
  setObject: (value: string) => void;
  designation: string;
  setDesignation: (value: string) => void;
  unit: string;
  setUnit: (value: string) => void;
  quantity: number;
  setQuantity: (value: number) => void;
  unitPrice: number;
  setUnitPrice: (value: number) => void;
  totalPrice: number;
  setTotalPrice: (value: number) => void;
  totalMaterial: number;
  setTotalMaterial: (value: number) => void;
  totalHT: number;
  setTotalHT: (value: number) => void;
  amountWords: string;
  setAmoutWorlds: (value: string) => void;
  managerName: string;
  setManagerName: (value: string) => void;
  itemsArr: InvoiceItemWithId[];
  setItemsArr: (value: InvoiceItemWithId[]) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [reference, setReference] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");
  const [object, setObject] = useState<string>("");
  const [designation, setDesignation] = useState<string>("");
  const [unit, setUnit] = useState<string>("U");
  const [quantity, setQuantity] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalMaterial, setTotalMaterial] = useState<number>(0);
  const [totalHT, setTotalHT] = useState<number>(0);
  const [managerName, setManagerName] = useState<string>("");
  const [amountWords, setAmoutWorlds] = useState<string>("dsfdfsfsdf");
  const [itemsArr, setItemsArr] = useState<InvoiceItemWithId[]>([]);

  return (
    <InvoiceContext.Provider
      value={{
        reference,
        setReference,
        city,
        setCity,
        clientName,
        setClientName,
        object,
        setObject,
        designation,
        setDesignation,
        unit,
        setUnit,
        quantity,
        setQuantity,
        unitPrice,
        setUnitPrice,
        totalPrice,
        setTotalPrice,
        totalMaterial,
        setTotalMaterial,
        totalHT,
        setTotalHT,
        amountWords,
        setAmoutWorlds,
        managerName,
        setManagerName,
        itemsArr,
        setItemsArr,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoice() {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoice must be used within InvoiceProvider");
  }
  return context;
}
