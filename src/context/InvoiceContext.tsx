"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from "react";

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

export interface InvoiceActionsType {
  setReference: (value: string) => void;
  setCity: (value: string) => void;
  setClientName: (value: string) => void;
  setClientAddress: (value: string) => void;
  setClientContact: (value: string) => void;
  setClientPOBox: (value: string) => void;
  setObject: (value: string) => void;
  setDesignation: (value: string) => void;
  setUnit: (value: string) => void;
  setQuantity: (value: number) => void;
  setUnitPrice: (value: number) => void;
  setTotalPrice: (value: number) => void;
  setAmountWords: (value: string) => void;
  setManagerName: (value: string) => void;
  setItemsArr: (value: InvoiceItemWithId[]) => void;
  setCurrency: (value: string) => void;
  setStyle: (value: string) => void;
  setInvoiceData: (
    data: Partial<InvoiceStateContextType> & { items?: InvoiceItemWithId[] },
  ) => void;
  clearInvoiceData: () => void;
}

export interface InvoiceStateContextType {
  reference: string;
  city: string;
  clientName: string;
  clientAddress: string;
  clientContact: string;
  clientPOBox: string;
  object: string;
  designation: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  totalMaterial: number;
  totalHT: number;
  amountWords: string;
  managerName: string;
  itemsArr: InvoiceItemWithId[];
  currency: string;
  style: string;
}

const InvoiceStateContext = createContext<InvoiceStateContextType | undefined>(
  undefined,
);
const InvoiceActionsContext = createContext<InvoiceActionsType | undefined>(
  undefined,
);

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
  const [currency, setCurrencyState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("invoice_currency") || "XOF";
    }
    return "XOF";
  });
  const [style, setStyle] = useState<string>("default");

  const setCurrency = useCallback((val: string) => {
    setCurrencyState(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("invoice_currency", val);
    }
  }, []);

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
  const setInvoiceData = useCallback(
    (
      data: Partial<InvoiceStateContextType> & { items?: InvoiceItemWithId[] },
    ) => {
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
      setStyle(data.style || "default");
    },
    [],
  );

  const clearInvoiceData = useCallback(() => {
    setReference("");
    setCity("");
    setClientName("");
    setClientAddress("");
    setClientContact("");
    setClientPOBox("");
    setObject("");
    setManagerName("");
    setAmountWords("");
    setItemsArr([]);
    setStyle("default");
  }, []);

  const stateValue = useMemo(
    () => ({
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
      currency,
      style,
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
      currency,
      style,
    ],
  );

  const actionsValue = useMemo(
    () => ({
      setReference,
      setCity,
      setClientName,
      setClientAddress,
      setClientContact,
      setClientPOBox,
      setObject,
      setDesignation,
      setUnit,
      setQuantity,
      setUnitPrice,
      setTotalPrice,
      setAmountWords,
      setManagerName,
      setItemsArr,
      setCurrency,
      setStyle,
      setInvoiceData,
      clearInvoiceData,
    }),
    [setCurrency, setStyle, setInvoiceData, clearInvoiceData],
  );

  return (
    <InvoiceStateContext.Provider value={stateValue}>
      <InvoiceActionsContext.Provider value={actionsValue}>
        {children}
      </InvoiceActionsContext.Provider>
    </InvoiceStateContext.Provider>
  );
}

export function useInvoice() {
  const state = useContext(InvoiceStateContext);
  const actions = useContext(InvoiceActionsContext);
  if (!state || !actions) {
    throw new Error("useInvoice must be used within InvoiceProvider");
  }
  return { ...state, ...actions };
}

export function useInvoiceState() {
  const context = useContext(InvoiceStateContext);
  if (context === undefined) {
    throw new Error("useInvoiceState must be used within a InvoiceProvider");
  }
  return context;
}

export function useInvoiceActions() {
  const context = useContext(InvoiceActionsContext);
  if (context === undefined) {
    throw new Error("useInvoiceActions must be used within a InvoiceProvider");
  }
  return context;
}
