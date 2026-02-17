"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";

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
  clientAddress: string;
  setClientAddress: (value: string) => void;
  clientContact: string;
  setClientContact: (value: string) => void;
  clientPOBox: string;
  setClientPOBox: (value: string) => void;
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
  totalHT: number;
  amountWords: string;
  setAmountWords: (value: string) => void;
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
  const [clientAddress, setClientAddress] = useState<string>("");
  const [clientContact, setClientContact] = useState<string>("");
  const [clientPOBox, setClientPOBox] = useState<string>("");
  const [object, setObject] = useState<string>("");
  const [designation, setDesignation] = useState<string>("");
  const [unit, setUnit] = useState<string>("U");
  const [quantity, setQuantity] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [managerName, setManagerName] = useState<string>("");
  const [amountWords, setAmountWords] = useState<string>("");
  const [itemsArr, setItemsArr] = useState<InvoiceItemWithId[]>([]);

  // Derived values from itemsArr
  const totalHT = itemsArr.reduce(
    (sum, item) => sum + (item.totalPrice || 0),
    0,
  );
  const totalMaterial = itemsArr.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );

  // setInvoiceData no longer needs to set totalHT or totalMaterial
  const setInvoiceData = (data: any) => {
    setReference(data.reference || "");
    setCity(data.city || "");
    setClientName(data.clientName || "");
    setClientAddress(data.clientAddress || "");
    setClientContact(data.clientContact || "");
    setClientPOBox(data.clientPOBox || "");
    setObject(data.object || "");
    setManagerName(data.managerName || "");
    // totalHT and totalMaterial are derived
    setAmountWords(data.amountWords || "");
    setItemsArr(data.items || []);
  };

  const value = useMemo(
    () => ({
      reference,
      setReference,
      setInvoiceData,

      city,
      setCity,
      clientName,
      setClientName,
      clientAddress,
      setClientAddress,
      clientContact,
      setClientContact,
      clientPOBox,
      setClientPOBox,
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
      // Removed setTotalMaterial
      totalHT,
      // Removed setTotalHT
      amountWords,
      setAmountWords,
      managerName,
      setManagerName,
      itemsArr,
      setItemsArr,
    }),
    [
      reference,
      city,
      clientName,
      clientAddress,
      clientContact,
      clientPOBox,
      object,
      designation,
      unit,
      quantity,
      unitPrice,
      totalPrice,
      totalMaterial,
      totalHT,
      amountWords,
      managerName,
      itemsArr,
      // setInvoiceData is constant if defined outside or wrapped, but here it depends on setters which are stable.
      // However, we redfine it every render? No it's defined in function body.
      // Better to keep it as dependency or useCallback it.
      // Since we removed useCallback in previous steps (or I thought I did?), let's check.
      // I will just leave it in dependency array as it's recreated every render so it correctly breaks memo if not stable,
      // but setters are stable.
    ],
  );

  return (
    <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
  );
}

export function useInvoice() {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoice must be used within InvoiceProvider");
  }
  return context;
}
