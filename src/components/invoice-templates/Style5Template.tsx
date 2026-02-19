import { Ref, useState } from "react";
import { InvoiceItemWithId, useInvoice } from "@/src/context/InvoiceContext";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash2, Command, Zap } from "lucide-react";
import { Button } from "../ui/button";
import OptimizedInput from "../OptimizedInput";

export default function Style5Template({
  divRef,
  scale,
}: {
  divRef: Ref<HTMLDivElement>;
  scale: number;
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
    currency,
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
      currency: currency || "XOF",
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

  const totalGeneral = itemsArr.reduce(
    (sum, item) =>
      sum +
      Number(item.totalPrice ?? Number(item.quantity) * Number(item.unitPrice)),
    0,
  );

  const totalMaterialGeneral = itemsArr.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  const updateItem = (
    id: string | number,
    field: string,
    value: string | number,
  ) => {
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

  return (
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
        className={`bg-white w-[794px] min-h-[1123px] text-zinc-900 relative shadow-xl font-sans ${scale < 0.8 ? "scale-small" : ""}`}
      >
        <div className="p-12 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-16 select-none">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                SaaS.bill
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
              <div className="px-3 py-1 bg-zinc-100 rounded-md">
                REF: <span className="text-zinc-900 ml-1">{reference}</span>
              </div>
              <div>
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Main Info Block */}
          <div className="bg-zinc-50 rounded-2xl p-8 mb-12 border border-zinc-100">
            <div className="flex gap-12">
              <div className="w-1/2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 block">
                  From
                </label>
                <div className="font-bold text-zinc-900 mb-1">Company Inc.</div>
                <div className="text-sm text-zinc-500">
                  123 Tech Boulevard
                  <br />
                  San Francisco, CA
                  <br />
                  <city className="inline-block mt-1">{city}</city>
                </div>
              </div>
              <div className="w-1/2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 block">
                  Billed To
                </label>
                <OptimizedInput
                  value={clientName}
                  onValueChange={setClientName}
                  placeholder="Client Name"
                  className="bg-transparent font-bold text-zinc-900 w-full mb-1 p-0 h-auto border-none focus:ring-0"
                />
                <OptimizedInput
                  value={clientAddress}
                  onValueChange={setClientAddress}
                  placeholder="Client Address"
                  className="bg-transparent text-sm text-zinc-500 w-full p-0 h-auto border-none focus:ring-0"
                />
                <div className="flex gap-2">
                  <OptimizedInput
                    value={clientContact}
                    onValueChange={setClientContact}
                    placeholder="Contact"
                    className="bg-transparent text-sm text-zinc-500 w-full p-0 h-auto border-none focus:ring-0"
                  />
                  <OptimizedInput
                    value={clientPOBox}
                    onValueChange={setClientPOBox}
                    placeholder="Zip"
                    className="bg-transparent text-sm text-zinc-500 w-24 p-0 h-auto border-none focus:ring-0"
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-zinc-200">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
                Project Description
              </label>
              <OptimizedInput
                value={object}
                onValueChange={setObject}
                placeholder="Description of the project or services..."
                className="bg-transparent text-zinc-700 w-full font-medium"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-zinc-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider mb-4">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-center">Unit</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Price</div>
            </div>
            <div className="space-y-2">
              {itemsArr.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 px-4 py-3 bg-white border border-zinc-100 rounded-lg items-center hover:border-zinc-300 transition-colors group relative"
                >
                  <div className="col-span-6 font-medium text-zinc-800">
                    <OptimizedInput
                      value={item.designation}
                      onValueChange={(val) =>
                        updateItem(item.id, "designation", val)
                      }
                      className="w-full bg-transparent"
                    />
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="absolute -left-3 top-1/2 -translate-y-1/2 text-red-400 opacity-0 group-hover:opacity-100 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="col-span-2">
                    <OptimizedInput
                      value={item.unit}
                      onValueChange={(val) => updateItem(item.id, "unit", val)}
                      className="w-full text-center text-zinc-500 bg-transparent text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <OptimizedInput
                      value={item.quantity}
                      onValueChange={(val) =>
                        updateItem(item.id, "quantity", Number(val))
                      }
                      className="w-full text-center font-mono bg-zinc-50 rounded text-zinc-700 text-sm py-1"
                    />
                  </div>
                  <div className="col-span-2 text-right font-mono font-medium text-zinc-900">
                    <OptimizedInput
                      value={item.unitPrice}
                      onValueChange={(val) =>
                        updateItem(item.id, "unitPrice", Number(val))
                      }
                      className="w-full text-right bg-transparent text-sm"
                    />
                  </div>
                </div>
              ))}
              {/* Add New */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 border border-dashed border-zinc-200 rounded-lg items-center hover:bg-zinc-50 transition-colors cursor-text">
                <div className="col-span-6 flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded bg-zinc-100 flex items-center justify-center text-zinc-400"
                    onClick={addItem}
                  >
                    <Plus className="w-3 h-3" />
                  </div>
                  <OptimizedInput
                    value={newItem.designation}
                    onValueChange={(val) =>
                      setNewItem({ ...newItem, designation: val })
                    }
                    placeholder="Add line item..."
                    className="w-full bg-transparent text-sm text-zinc-500"
                  />
                </div>
                <div className="col-span-2">
                  <OptimizedInput
                    value={newItem.unit}
                    onValueChange={(val) =>
                      setNewItem({ ...newItem, unit: val })
                    }
                    className="w-full text-center bg-transparent text-sm text-zinc-400"
                  />
                </div>
                <div className="col-span-2 text-center">
                  <OptimizedInput
                    value={newItem.quantity}
                    onValueChange={(val) =>
                      setNewItem({
                        ...newItem,
                        quantity: Number(val),
                        totalPrice: Number(val) * newItem.unitPrice,
                      })
                    }
                    className="w-full text-center bg-transparent text-sm text-zinc-400"
                  />
                </div>
                <div className="col-span-2 text-right">
                  <OptimizedInput
                    value={newItem.unitPrice}
                    onValueChange={(val) =>
                      setNewItem({
                        ...newItem,
                        unitPrice: Number(val),
                        totalPrice: newItem.quantity * Number(val),
                      })
                    }
                    className="w-full text-right bg-transparent text-sm text-zinc-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-zinc-100 pt-8 mt-8">
            <div className="flex justify-between items-end">
              <div className="w-1/2">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                  Authorized Signature
                </div>
                <OptimizedInput
                  value={managerName}
                  onValueChange={setManagerName}
                  placeholder="Sign here"
                  className="bg-transparent text-xl font-handwriting text-zinc-800 w-full border-b border-zinc-200 pb-2"
                />
              </div>
              <div className="w-1/3">
                <div className="flex justify-between mb-3 text-sm text-zinc-500">
                  <span>Subtotal</span>
                  <span className="font-mono">
                    {formatCurrency(totalGeneral)}
                  </span>
                </div>
                <div className="flex justify-between mb-3 text-sm text-zinc-500">
                  <span>Tax</span>
                  <span className="font-mono"> - </span>
                </div>
                <div className="flex justify-between pt-4 border-t border-zinc-200 text-lg font-bold text-zinc-900">
                  <span>Total Due</span>
                  <span className="font-mono">
                    {formatCurrency(totalGeneral)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-12 text-center text-xs text-zinc-400">
              <p>Powered by SaaS.bill • Terms & Conditions Apply</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
