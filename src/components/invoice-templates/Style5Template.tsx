import { Ref, useState, useCallback, useMemo, ReactNode } from "react";
import { InvoiceItemWithId, useInvoice } from "@/src/context/InvoiceContext";
import { useLanguage } from "@/src/context/LanguageContext";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash2, Zap } from "lucide-react";
import OptimizedInput from "../OptimizedInput";
import { Button } from "../ui/button";

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
    invoiceType,
    companyName,
    setCompanyName,
    amountWords,
    setAmountWords,
  } = useInvoice();
  const { language, dict } = useLanguage();

  const [newItem, setNewItem] = useState({
    designation: "",
    unit: "U",
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(language === "fr" ? "fr-FR" : "en-US", {
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
            field === "quantity" ? (isNaN(Number(value)) ? item.quantity : Number(value)) : Number(item.quantity),
          unitPrice:
            field === "unitPrice" ? (isNaN(Number(value)) ? item.unitPrice : Number(value)) : Number(item.unitPrice),
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

  const curr: () => ReactNode = () => {
    switch (currency) {
      case "XOF":
        return (
          <span className="text-[10px] text-zinc-400 shrink-0">F CFA</span>
        );
      case "EUR":
        return <span className="text-[10px] text-zinc-400 shrink-0">€</span>;
      case "USD":
        return <span className="text-[10px] text-zinc-400 shrink-0">$US</span>;
      case "GBP":
        return <span className="text-[10px] text-zinc-400 shrink-0">£GB</span>;
      default:
        return "";
    }
  };

  return (
    <div
      className="canvas-wrapper"
      style={{
        transform: `scale(${scale})`,
        transition: "transform 150ms ease",
      }}
    >
      <div
        ref={divRef}
        id="canvas"
        className={`bg-white w-[794px] min-h-[1123px] pb-32 text-zinc-900 relative shadow-xl font-sans ${scale < 0.8 ? "scale-small" : ""}`}
      >
        <div className="p-12 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-16 select-none">
            <div className="flex items-center gap-2">
              <span className="font-bold text-2xl tracking-tight uppercase">
                {invoiceType === 'quote' ? dict.proforma : dict.invoice}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
              <div className="px-3 py-1 bg-zinc-100 rounded-md flex items-center gap-1">
                {dict.reference}:
                <OptimizedInput
                  value={reference}
                  onValueChange={setReference}
                  placeholder="REF-XXXX"
                  className="bg-transparent text-zinc-900 w-24 p-0 h-auto border-none focus:ring-0 text-sm font-bold"
                />
              </div>
              <div>
                {new Date().toLocaleDateString(
                  language === "fr" ? "fr-FR" : "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                )}
              </div>
            </div>
          </div>

          {/* Main Info Block */}
          <div className="bg-zinc-50 rounded-2xl p-8 mb-12 border border-zinc-100">
            <div className="flex gap-12">
              <div className="w-1/2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 block">
                  {dict.from}
                </label>
                <OptimizedInput
                  value={companyName}
                  onValueChange={setCompanyName}
                  placeholder={dict.companyName || "Company Inc."}
                  className="bg-transparent font-bold text-zinc-900 w-full mb-1 p-0 h-auto border-none focus:ring-0"
                />
                <div className="text-sm text-zinc-500">
                  123 Tech Boulevard
                  <br />
                  San Francisco, CA
                  <br />
                  <span className="inline-block mt-1">{city}</span>
                </div>
              </div>
              <div className="w-1/2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 block">
                  {dict.billedTo}
                </label>
                <OptimizedInput
                  value={clientName}
                  onValueChange={setClientName}
                  placeholder={dict.client}
                  className="bg-transparent font-bold text-zinc-900 w-full mb-1 p-0 h-auto border-none focus:ring-0"
                />
                <OptimizedInput
                  value={clientAddress}
                  onValueChange={setClientAddress}
                  placeholder={dict.address}
                  className="bg-transparent text-sm text-zinc-500 w-full p-0 h-auto border-none focus:ring-0"
                />
                <div className="flex gap-2">
                  <OptimizedInput
                    value={clientContact}
                    onValueChange={setClientContact}
                    placeholder={dict.contact}
                    className="bg-transparent text-sm text-zinc-500 w-full p-0 h-auto border-none focus:ring-0"
                  />
                  <OptimizedInput
                    value={clientPOBox}
                    onValueChange={setClientPOBox}
                    placeholder={dict.poBox}
                    className="bg-transparent text-sm text-zinc-500 w-24 p-0 h-auto border-none focus:ring-0"
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-zinc-200">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
                {dict.projectDetails}
              </label>
              <OptimizedInput
                value={object}
                onValueChange={setObject}
                placeholder={dict.object}
                className="bg-transparent text-zinc-700 w-full font-medium wrap-break-word whitespace-pre-wrap"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-zinc-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider mb-4">
              <div className="col-span-4">{dict.description}</div>
              <div className="col-span-1 text-center">{dict.unit}</div>
              <div className="col-span-1 text-center">{dict.qty}</div>
              <div className="col-span-3 text-right">{dict.unitPrice}</div>
              <div className="col-span-3 text-right">{dict.total}</div>
            </div>
            <div className="space-y-4">
              {itemsArr.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 px-6 py-5 bg-white border border-zinc-100 rounded-lg items-center hover:border-zinc-300 transition-colors group relative"
                >
                  <div className="col-span-4 font-medium text-zinc-800">
                    <OptimizedInput
                      value={item.designation}
                      onValueChange={(val) =>
                        updateItem(item.id, "designation", val)
                      }
                      className="w-full bg-transparent wrap-break-word whitespace-pre-wrap"
                    />
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="absolute -left-3 top-1/2 -translate-y-1/2 text-white p-1 cursor-pointer z-50 bg-red-500 rounded-md shadow-sm hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="col-span-1">
                    <OptimizedInput
                      value={item.unit}
                      onValueChange={(val) => updateItem(item.id, "unit", val)}
                      className="w-full text-center text-zinc-500 bg-transparent text-sm"
                    />
                  </div>
                  <div className="col-span-1">
                    <OptimizedInput
                      value={item.quantity}
                      onValueChange={(val) =>
                        updateItem(item.id, "quantity", Number(val))
                      }
                      className="w-full text-center font-mono bg-zinc-50 rounded text-zinc-700 text-sm py-1"
                    />
                  </div>
                  <div className="col-span-3 flex items-center justify-end gap-1 font-mono font-medium text-zinc-900 overflow-hidden">
                    <OptimizedInput
                      value={item.unitPrice}
                      onValueChange={(val) =>
                        updateItem(item.id, "unitPrice", Number(val))
                      }
                      className="w-full text-right bg-zinc-50 rounded text-sm py-1 px-1"
                    />
                    {curr()}
                  </div>
                  <div className="col-span-3 flex items-center justify-end gap-1 font-mono font-bold text-zinc-900 overflow-hidden">
                    <span className="text-sm">
                      {formatCurrency(item.totalPrice).replace(
                        /\s?[A-Z$€£]{1,3}$/,
                        "",
                      )}
                    </span>
                    {curr()}
                  </div>
                </div>
              ))}
              {/* Add New */}
              <div className="grid grid-cols-12 gap-4 px-6 py-5 border border-dashed border-zinc-200 rounded-lg items-center hover:bg-zinc-50 transition-colors cursor-text">
                <div className="col-span-4 flex items-center gap-2">
                  <Button
                    className="w-6 h-6 rounded bg-zinc-100 flex items-center justify-center text-zinc-400 cursor-pointer"
                    onClick={addItem}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  <OptimizedInput
                    value={newItem.designation}
                    onValueChange={(val) =>
                      setNewItem({ ...newItem, designation: val })
                    }
                    placeholder={dict.add}
                    className="w-full bg-transparent text-sm text-zinc-500"
                  />
                </div>
                <div className="col-span-1">
                  <OptimizedInput
                    value={newItem.unit}
                    onValueChange={(val) =>
                      setNewItem({ ...newItem, unit: val })
                    }
                    className="w-full text-center bg-transparent text-sm text-zinc-400"
                  />
                </div>
                <div className="col-span-1 text-center">
                  <OptimizedInput
                    value={newItem.quantity}
                    onValueChange={(val) => {
                      const numVal = Number(val);
                      const q = isNaN(numVal) ? newItem.quantity : numVal;
                      setNewItem((prev) => ({
                        ...prev,
                        quantity: q,
                        totalPrice: q * Number(prev.unitPrice),
                      }));
                    }}
                    className="w-full text-center bg-transparent text-sm text-zinc-400"
                  />
                </div>
                <div className="col-span-3 flex items-center justify-end gap-1 font-mono font-medium text-zinc-900 overflow-hidden">
                  <OptimizedInput
                    value={newItem.unitPrice}
                    onValueChange={(val) => {
                      const numVal = Number(val);
                      const up = isNaN(numVal) ? newItem.unitPrice : numVal;
                      setNewItem((prev) => ({
                        ...prev,
                        unitPrice: up,
                        totalPrice: up * Number(prev.quantity),
                      }));
                    }}
                    className="w-full text-right bg-zinc-50 rounded text-sm py-1 px-1"
                  />
                  {curr()}
                </div>
                <div className="col-span-3 flex items-center justify-end gap-1 font-mono font-medium text-zinc-400 overflow-hidden">
                  <span className="text-sm">
                    {formatCurrency(newItem.totalPrice).replace(
                      /\s?[A-Z$€£]{1,3}$/,
                      "",
                    )}
                  </span>
                  {curr()}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Totals */}
          <div className="border-t border-zinc-100 pt-8 mt-8">
            <div className="flex justify-between items-end gap-12 mb-12">
              <div className="flex-1 pb-4">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  {dict.amountWords}
                </div>
                <OptimizedInput
                  value={amountWords}
                  onValueChange={setAmountWords}
                  placeholder={dict.amountWordsPlaceholder}
                  className="bg-transparent text-sm italic w-full border-b border-transparent hover:border-zinc-200 focus:border-zinc-300 pb-1 text-zinc-600"
                />
              </div>

              <div className="w-[40%] min-w-[300px]">
                <div className="flex justify-between mb-3 text-sm text-zinc-500">
                  <span>{dict.subtotal}</span>
                  <span className="font-mono">
                    {formatCurrency(totalGeneral)}
                  </span>
                </div>
                <div className="flex justify-between mb-3 text-sm text-zinc-500">
                  <span>{dict.totalMaterial}</span>
                  <span>{totalMaterialGeneral}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-zinc-200 text-base font-bold text-zinc-900 gap-6">
                  <span className="whitespace-nowrap uppercase tracking-wider">{dict.totalDue}</span>
                  <span className="font-mono text-xl text-right text-zinc-950">
                    {formatCurrency(totalGeneral)}
                  </span>
                </div>
              </div>
            </div>

            {/* Signature Section - Moved Below */}
            <div className="flex justify-end pt-8 border-t border-dashed border-zinc-100">
              <div className="w-[30%] text-center">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                  {dict.authorizedSignature}
                </div>
                <OptimizedInput
                  value={managerName}
                  onValueChange={setManagerName}
                  placeholder={dict.managerName}
                  className="bg-transparent text-xl font-handwriting text-zinc-800 w-full border-b border-zinc-200 pb-2 text-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
