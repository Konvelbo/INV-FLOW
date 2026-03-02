import { Ref, useState, useCallback, useMemo } from "react";
import { InvoiceItemWithId, useInvoice } from "@/src/context/InvoiceContext";
import { useLanguage } from "@/src/context/LanguageContext";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash2, Hexagon } from "lucide-react";
import { Button } from "../ui/button";
import OptimizedInput from "../OptimizedInput";

export default function Style3Template({
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
  const { dict } = useLanguage();

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

  const addItem = useCallback(() => {
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
  }, [itemsArr, newItem, setItemsArr]);

  const totalGeneral = useMemo(
    () =>
      itemsArr.reduce(
        (sum, item) =>
          sum +
          Number(
            item.totalPrice ?? Number(item.quantity) * Number(item.unitPrice),
          ),
        0,
      ),
    [itemsArr],
  );

  const totalMaterialGeneral = useMemo(
    () => itemsArr.reduce((sum, item) => sum + Number(item.quantity), 0),
    [itemsArr],
  );

  const updateItem = useCallback(
    (id: string | number, field: string, value: string | number) => {
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
          quantity:
            field === "quantity" ? Number(value) : Number(item.quantity),
          unitPrice:
            field === "unitPrice" ? Number(value) : Number(item.unitPrice),
          totalPrice: 0,
          id: item.id,
        };

        updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
        return updatedItem;
      });
      setItemsArr(updatedItems);
    },
    [itemsArr, setItemsArr],
  );

  const deleteItem = useCallback(
    (id: number | string) => {
      const filteredItems = itemsArr.filter(
        (item: InvoiceItemWithId) => item.id !== id,
      );
      setItemsArr(filteredItems);
    },
    [itemsArr, setItemsArr],
  );

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
        className={`bg-white w-[794px] min-h-[1123px] text-gray-800 relative shadow-xl ${scale < 0.8 ? "scale-small" : ""}`}
      >
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400 rounded-bl-[100px] opacity-20 z-0"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-tr-[100px] opacity-20 z-0"></div>

        {/* Content Container */}
        <div className="p-12 relative z-10">
          {/* Header */}
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4 text-purple-600">
                <Hexagon className="w-8 h-8 fill-current" />
                <span className="font-bold text-2xl tracking-tighter">
                  CREATIVE
                </span>
              </div>
              <div className="text-gray-500">
                <OptimizedInput
                  value={city}
                  onValueChange={setCity}
                  placeholder="City"
                  className="bg-transparent w-32 border-b border-dashed border-gray-300 focus:border-purple-400"
                />
                <div className="text-sm mt-1">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="text-right absolute -top-10 right-4 -z-100">
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-orange-400 opacity-80">
                {dict.invoice}
              </h1>
              <div className="flex items-center justify-end gap-2 mt-2">
                <span className="font-bold text-gray-400">#</span>
                <OptimizedInput
                  value={reference}
                  onValueChange={setReference}
                  placeholder="REF"
                  className="text-right font-mono text-xl w-32 bg-transparent text-gray-700 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Client & Project */}
          <div className="flex gap-8 mb-12">
            <div className="w-1/2 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-purple-500 font-bold text-xs uppercase mb-4">
                {dict.billedTo}
              </h3>
              <OptimizedInput
                value={clientName}
                onValueChange={setClientName}
                placeholder="Client Name"
                className="text-2xl font-bold text-gray-800 w-full mb-1 bg-transparent"
              />
              <OptimizedInput
                value={clientAddress}
                onValueChange={setClientAddress}
                placeholder="Address"
                className="text-gray-500 w-full text-sm bg-transparent"
              />
              <div className="flex gap-2 mt-2">
                <OptimizedInput
                  value={clientPOBox}
                  onValueChange={setClientPOBox}
                  placeholder="Zip"
                  className="text-gray-500 w-20 text-sm bg-white rounded px-2"
                />
                <OptimizedInput
                  value={clientContact}
                  onValueChange={setClientContact}
                  placeholder="Contact"
                  className="text-gray-500 w-full text-sm bg-white rounded px-2"
                />
              </div>
            </div>
            <div className="w-1/2 flex flex-col justify-center pl-6 border-l-4 border-orange-300">
              <h3 className="text-orange-400 font-bold text-xs uppercase mb-2">
                {dict.projectDetails}
              </h3>
              <OptimizedInput
                value={object}
                onValueChange={setObject}
                placeholder="Brief description of the work..."
                className="text-lg text-gray-700 italic w-full bg-transparent"
              />
            </div>
          </div>

          {/* Items */}
          <div className="mb-8">
            <div className="grid grid-cols-12 gap-4 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider px-4">
              <div className="col-span-5">{dict.description}</div>
              <div className="col-span-1 text-center">{dict.unit}</div>
              <div className="col-span-2 text-center">{dict.qty}</div>
              <div className="col-span-4 text-right">{dict.total}</div>
            </div>

            <div className="space-y-4">
              {itemsArr.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 items-center bg-white border border-gray-100 shadow-xs rounded-xl p-4 hover:shadow-md transition-shadow relative group"
                >
                  <div className="col-span-5">
                    <OptimizedInput
                      value={item.designation}
                      onValueChange={(val) =>
                        updateItem(item.id, "designation", val)
                      }
                      className="font-semibold text-gray-800 w-full bg-transparent"
                    />
                    <div className="text-xs text-gray-400 mt-1 flex gap-2">
                      <span>Price:</span>
                      <OptimizedInput
                        value={item.unitPrice}
                        onValueChange={(val) =>
                          updateItem(item.id, "unitPrice", Number(val))
                        }
                        className="w-20 bg-gray-50 rounded px-1"
                      />
                    </div>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="absolute -left-3 top-1/2 -translate-y-1/2 bg-red-100 text-red-500 p-1 rounded-full transition-opacity cursor-pointer shadow-sm"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="col-span-1 text-center">
                    <OptimizedInput
                      value={item.unit}
                      onValueChange={(val) => updateItem(item.id, "unit", val)}
                      className="text-center w-full bg-transparent text-gray-500 text-sm"
                    />
                  </div>
                  <div className="col-span-2 text-center">
                    <OptimizedInput
                      value={item.quantity}
                      onValueChange={(val) =>
                        updateItem(item.id, "quantity", Number(val))
                      }
                      className="text-center w-14 mx-auto bg-purple-50 text-purple-700 font-bold rounded-lg py-1"
                    />
                  </div>
                  <div className="col-span-4 text-right font-bold text-gray-800 tabular-nums whitespace-nowrap">
                    {formatCurrency(item.totalPrice)}
                  </div>
                </div>
              ))}

              {/* New Item */}
              <div className="grid grid-cols-12 gap-4 items-center border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors">
                <div className="col-span-5 flex gap-2 items-center">
                  <Button
                    size="icon"
                    className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 cursor-pointer"
                    onClick={addItem}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <OptimizedInput
                    value={newItem.designation}
                    onValueChange={(val) =>
                      setNewItem({ ...newItem, designation: val })
                    }
                    placeholder="Add item..."
                    className="bg-transparent text-gray-500 w-full"
                  />
                </div>
                <div className="col-span-1">
                  <OptimizedInput
                    value={newItem.unit}
                    onValueChange={(val) =>
                      setNewItem({ ...newItem, unit: val })
                    }
                    className="text-center w-full bg-transparent text-gray-400 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <OptimizedInput
                    value={newItem.quantity}
                    onValueChange={(val) => {
                      const q = Number(val);
                      setNewItem((prev) => ({
                        ...prev,
                        quantity: q,
                        totalPrice: q * prev.unitPrice,
                      }));
                    }}
                    className="text-center w-14 mx-auto bg-gray-50 rounded py-1"
                  />
                </div>
                <div className="col-span-4 text-right">
                  <OptimizedInput
                    value={newItem.unitPrice}
                    onValueChange={(val) => {
                      const p = Number(val);
                      setNewItem((prev) => ({
                        ...prev,
                        unitPrice: p,
                        totalPrice: prev.quantity * p,
                      }));
                    }}
                    placeholder="Price"
                    className="text-right w-20 ml-auto bg-transparent tabular-nums"
                  />
                  <div className="text-xs text-gray-400 pr-2">
                    {formatCurrency(newItem.totalPrice)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col items-end mt-12">
            <div className="bg-slate-900 text-white p-8 rounded-2xl min-w-[350px] max-w-full shadow-2xl relative overflow-hidden tabular-nums">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
              <div className="flex flex-col sm:flex-row justify-between gap-8 relative z-10">
                <div className="min-w-fit">
                  <div className="text-gray-400 text-xs uppercase mb-1">
                    {dict.totalMaterial}
                  </div>
                  <div className="text-xl font-bold break-all">
                    {totalMaterialGeneral}
                  </div>
                </div>
                <div className="text-right flex-1">
                  <div className="text-gray-400 text-xs uppercase mb-1">
                    {dict.total}
                  </div>
                  <div className="text-4xl font-black text-orange-400 break-all leading-tight">
                    {formatCurrency(totalGeneral)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center w-full">
              <OptimizedInput
                value={managerName}
                onValueChange={setManagerName}
                placeholder="Manager Signature"
                className="text-center font-handwriting text-2xl text-purple-800 w-64 mx-auto border-b border-purple-200 pb-2"
              />
              <div className="text-xs text-gray-400 uppercase tracking-widest mt-2">
                {dict.authorizedSignature}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
