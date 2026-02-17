"use client";

import { Ref, useState, useEffect, useCallback } from "react";
import { InvoiceItemWithId, useInvoice } from "@/src/context/InvoiceContext";
import { UUIDTypes, v4 as uuidv4 } from "uuid";
import { ArrowDown, CookingPot } from "lucide-react";
import { Button } from "./ui/button";
import OptimizedInput from "./OptimizedInput";
import OptimizedTextarea from "./OptimizedTextarea";

export type itemsProps = {
  id: UUIDTypes;
  unit: string | number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  designation: string;
};

export default function InvoiceCanvas({
  divRef,
}: {
  divRef: Ref<HTMLDivElement>;
}) {
  const {
    reference,
    setReference,
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
    managerName,
    setManagerName,
    itemsArr,
    setItemsArr,
    setTotalHT,
    totalMaterial,
    setTotalMaterial,
  } = useInvoice();

  const [newItem, setNewItem] = useState({
    designation: "",
    unit: "U",
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 2,
    }).format(value);

  const addItem = () => {
    if (newItem.designation === "" && newItem.quantity === 0) return;
    const itemWithId = {
      ...newItem,
      id: uuidv4(),
      totalPrice: Number(newItem.quantity) * Number(newItem.unitPrice),
    };
    setItemsArr([...itemsArr, itemWithId]);
    setNewItem({
      designation: "",
      unit: "U",
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
    });
  };

  // Total général (somme des totaux de lignes)
  const totalGeneral = itemsArr.reduce(
    (sum, item) =>
      sum +
      Number(item.totalPrice ?? Number(item.quantity) * Number(item.unitPrice)),
    0,
  );
  const totalMaterialGeneral = itemsArr.reduce(
    (sum, item) => sum + Number(totalMaterial ?? Number(item.quantity)),
    0,
  );

  // Synchroniser le total global dans le contexte (totalHT / totalMaterial)
  useEffect(() => {
    if (typeof setTotalHT === "function") {
      setTotalHT((prev: number) =>
        prev !== totalGeneral ? totalGeneral : prev,
      );
    }
    if (typeof setTotalMaterial === "function") {
      setTotalMaterial((prev: number) =>
        prev !== totalMaterialGeneral ? totalMaterialGeneral : prev,
      );
    }
  }, [totalGeneral, totalMaterialGeneral, setTotalHT, setTotalMaterial]);
  type updateItemProps = (
    id: string | number,
    field: string,
    value: string | number,
  ) => void;

  const updateItem: updateItemProps = (id, field, value) => {
    const updatedItems = itemsArr.map((item: InvoiceItemWithId) => {
      if (item.designation === "" && item.quantity === 0) return item;
      if (item.id !== id) return item;

      const updatedItem: InvoiceItemWithId = {
        ...item,
        designation:
          field === "designation" && typeof value === "string"
            ? value
            : item.designation,
        unit:
          field === "unit" && typeof value === "string"
            ? String(value)
            : item.unit,
        quantity: field === "quantity" ? Number(value) : Number(item.quantity),
        unitPrice:
          field === "unitPrice" ? Number(value) : Number(item.unitPrice),
        totalPrice: 0,
        id: item.id,
      };

      // Recalculate totalPrice
      updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
      return updatedItem;
    });
    setItemsArr(updatedItems);
  };

  const deleteItem = (id: number | string) => {
    const filteredItems = itemsArr.filter(
      (item: InvoiceItemWithId) => item.id !== id,
    );
    setItemsArr(filteredItems);
  };

  const clearAllItems = () => {
    setItemsArr([]);
  };

  const [scale, setScale] = useState<number>(1);

  const increaseScale = useCallback(
    () => setScale((s) => Math.min(1.5, +(s + 0.1).toFixed(2))),
    [],
  );
  const decreaseScale = useCallback(
    () => setScale((s) => Math.max(0.5, +(s - 0.1).toFixed(2))),
    [],
  );

  // Keyboard shortcuts: Ctrl + +  and Ctrl + -
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const addPressed =
        e.key === "+" || e.key === "=" || e.code === "NumpadAdd";
      const subPressed = e.key === "-" || e.code === "NumpadSubtract";
      if ((e.ctrlKey || e.metaKey) && addPressed) {
        e.preventDefault();
        increaseScale();
      } else if ((e.ctrlKey || e.metaKey) && subPressed) {
        e.preventDefault();
        decreaseScale();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [increaseScale, decreaseScale]);

  const totalmaterial = itemsArr.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  return (
    <div className="canvas-viewer p-4 flex flex-col items-center w-full">
      <div
        className="canvas-wrapper overflow-hidden"
        style={{
          transform: `scale(${scale})`,
          transition: "transform 150ms ease",
        }}
      >
        <div
          ref={divRef}
          id="canvas"
          className={`bg-white w-[794px] text-black relative ${scale < 0.8 ? "scale-small" : ""}`}
        >
          <div className="flex justify-between items-centerrelative w-full mb-2">
            <div>
              <h1 className="mb-3">
                PROFORMA :{" "}
                {
                  <OptimizedInput
                    value={reference}
                    onValueChange={setReference}
                    placeholder="Reference"
                    className="w-60 pl-2"
                  />
                }
              </h1>
            </div>
            <h2>
              <OptimizedInput
                value={city}
                dir="rtl"
                onValueChange={setCity}
                placeholder="City"
                className="w-60 pr-2"
              />
              le {new Date().toLocaleDateString("fr-FR")}
            </h2>
          </div>
          <div className="border h-35 w-full min-h-70">
            <div className="flex justify-between">
              <div className="border-b h-15 p-5 w-full">
                <h2>Adress de facture</h2>
              </div>
              <div className="border-b border-l h-15 p-5 w-full">
                <h2>Adress de livraison:</h2>
              </div>
            </div>
            <div className="px-5 mt-2 space-y-2">
              <div className="flex flex-col gap-2"></div>
              <div className="flex justify-between items-center gap-2 text-sm w-full">
                <div>
                  Address:
                  <OptimizedInput
                    value={clientAddress}
                    onValueChange={setClientAddress}
                    placeholder="Address (Optional)"
                    className="w-full pl-2 border-b"
                  />
                </div>
                <div>
                  Contact:
                  <OptimizedInput
                    value={clientContact}
                    onValueChange={setClientContact}
                    placeholder="Contact (Optional)"
                    className="w-full pl-2 border-b"
                  />
                </div>
                <div>
                  PO Box:
                  <OptimizedInput
                    value={clientPOBox}
                    onValueChange={setClientPOBox}
                    placeholder="BP (Optional)"
                    className="w-full pl-2 border-b"
                  />
                </div>
              </div>
              <h1 className="w-1/2">
                Client:
                <OptimizedInput
                  value={clientName}
                  onValueChange={setClientName}
                  placeholder="Client Name"
                  className="w-full pl-2 border-b"
                />
              </h1>
              <h1 className="w-1/2">
                Object:
                <OptimizedInput
                  value={object}
                  onValueChange={setObject}
                  placeholder="Object"
                  className="w-full pl-2 border-b"
                />
              </h1>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>DESIGNATION</th>
                <th>UNIT</th>
                <th>QUANTITY</th>
                <th>U.PRICE</th>
                <th>TOTALPRICE</th>
              </tr>
            </thead>
            <tbody className="relative">
              {itemsArr.map((item: InvoiceItemWithId) => (
                <tr key={item.id}>
                  <td className="relative">
                    <OptimizedInput
                      value={item.designation}
                      onValueChange={(val) =>
                        updateItem(item.id, "designation", val)
                      }
                      placeholder="Designation"
                      className="border-none outline-none w-full bg-blac"
                    />
                    <CookingPot
                      id="Delete"
                      onClick={() => deleteItem(item.id)}
                      className="delete text-black absolute -left-7 bottom-1 size-5"
                    />
                  </td>
                  <td>
                    <OptimizedInput
                      value={item.unit}
                      onValueChange={(val) => updateItem(item.id, "unit", val)}
                      placeholder="Unit"
                      // className="border-none outline-none w-15"
                    />
                  </td>

                  <td>
                    <OptimizedInput
                      value={item.quantity}
                      onValueChange={(val) =>
                        updateItem(item.id, "quantity", Number(val))
                      }
                      placeholder="Quantity"
                      // className="border-none outline-none w-20"
                    />
                  </td>
                  <td>
                    <OptimizedInput
                      value={item.unitPrice}
                      onValueChange={(val) =>
                        updateItem(item.id, "unitPrice", Number(val))
                      }
                      placeholder="Unit price"
                      // className="border-none outline-none w-40"
                    />
                  </td>
                  <td>
                    <h2>{formatCurrency(item.totalPrice)}</h2>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="relative">
                  <OptimizedInput
                    value={newItem.designation}
                    onValueChange={(val) =>
                      setNewItem({ ...newItem, designation: val })
                    }
                    placeholder="Designation"
                    className="border-none outline-none w-full"
                  />
                  <ArrowDown
                    onClick={addItem}
                    className="uploade text-black absolute -left-7 bottom-1 size-6"
                  />
                </td>
                <td>
                  <OptimizedInput
                    value={newItem.unit}
                    onValueChange={(val) =>
                      setNewItem({ ...newItem, unit: val })
                    }
                    placeholder="Unit"
                    // className="border-none outline-none w-15"
                  />
                </td>
                <td>
                  <OptimizedInput
                    value={newItem.quantity}
                    onValueChange={(val) => {
                      const q = Number(val);
                      setNewItem((prev) => ({
                        ...prev,
                        quantity: q,
                        totalPrice: q * Number(prev.unitPrice),
                      }));
                    }}
                    placeholder="Quantity"
                    // className="border-none outline-none w-20"
                  />
                </td>
                <td>
                  <OptimizedInput
                    value={newItem.unitPrice}
                    onValueChange={(val) => {
                      const up = Number(val);
                      setNewItem((prev) => ({
                        ...prev,
                        unitPrice: up,
                        totalPrice: up * Number(prev.quantity),
                      }));
                    }}
                    placeholder="Unit price"
                    // className="border-none outline-none w-40"
                  />
                </td>
                <td>
                  <h2>{formatCurrency(newItem.totalPrice)}</h2>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="totals">
            <tbody>
              <tr>
                <td>TOTAL MATERIEL</td>
                <td>{totalmaterial}</td>
              </tr>
              <tr>
                <td>TOTAL HT</td>
                <td>{formatCurrency(totalGeneral)}</td>
              </tr>
            </tbody>
          </table>

          <div className="signature">
            <h2 className="font-semibold mb-3">Manager name</h2>
            <OptimizedInput
              value={managerName}
              onValueChange={setManagerName}
              dir="rtl"
              placeholder="Name"
              className="border-none outline-none w-90"
            />
          </div>

          <Button
            onClick={clearAllItems}
            className="mt-4 p-5 bg-red-500 text-white"
          >
            Clear All Items
          </Button>
        </div>
      </div>
    </div>
  );
}
