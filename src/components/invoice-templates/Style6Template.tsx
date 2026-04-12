import { Ref, useState, useCallback, useMemo, ReactNode } from "react";
import { InvoiceItemWithId, useInvoice } from "@/src/context/InvoiceContext";
import { useLanguage } from "@/src/context/LanguageContext";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash2 } from "lucide-react";
import OptimizedInput from "../OptimizedInput";
import OptimizedTextarea from "../OptimizedTextarea";
import { Button } from "../ui/button";

export default function Style6Template({
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
    invoiceType,
    companyName,
    setCompanyName,
    description,
    setDescription,
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
        return <span className="text-[10px] text-zinc-400 shrink-0">F CFA</span>;
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
        className={`bg-white w-[794px] min-h-[1123px] pb-32 text-slate-800 relative shadow-2xl ${scale < 0.8 ? "scale-small" : ""}`}
      >
        <div className="p-12 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-7xl font-bold tracking-tighter text-zinc-900 mb-4 uppercase">
                {invoiceType === 'quote' ? dict.proforma : dict.invoice}
              </h1>
              <div className="flex gap-2">
                <div className="flex items-center px-4 py-1 border border-zinc-900 rounded-full text-sm font-medium gap-1">
                  <span>{dict.invoice} n°</span>
                  <OptimizedInput
                    value={reference}
                    onValueChange={setReference}
                    placeholder="2024-001"
                    className="bg-transparent border-none p-0 w-24 focus:ring-0 text-sm font-medium h-auto"
                  />
                </div>
                <div className="px-4 py-1 border border-zinc-900 rounded-full text-sm font-medium">
                  {new Date().toLocaleDateString(language === "fr" ? "fr-FR" : "en-US")}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-zinc-300 my-8"></div>

          {/* Contact Info */}
          <div className="flex justify-between mb-12 text-sm">
            <div className="w-1/2">
              <OptimizedInput
                value={companyName}
                onValueChange={setCompanyName}
                placeholder={dict.companyName || "Compagnie Essor"}
                className="font-bold text-lg mb-2 bg-transparent w-full p-0 border-none focus:ring-0"
              />
              <div className="text-zinc-600 space-y-1">
                <OptimizedInput
                  value={city}
                  onValueChange={setCity}
                  placeholder="Abidjan, Côte d'Ivoire"
                  className="bg-transparent text-sm w-full p-0 border-none focus:ring-0"
                />
                <p>contact@essor.ci</p>
                <p>+225 01 02 03 04 05</p>
              </div>
            </div>
            <div className="w-1/2 text-right">
              <div className="font-bold text-xs uppercase tracking-widest text-zinc-400 mb-2">
                {dict.billedTo}
              </div>
              <OptimizedInput
                value={clientName}
                onValueChange={setClientName}
                placeholder={dict.client}
                className="font-bold text-lg mb-1 bg-transparent w-full p-0 border-none focus:ring-0 text-right"
              />
              <div className="text-zinc-600 space-y-1">
                <OptimizedInput
                  value={clientAddress}
                  onValueChange={setClientAddress}
                  placeholder={dict.address}
                  className="bg-transparent text-sm w-full p-0 border-none focus:ring-0 text-right"
                />
                <OptimizedInput
                  value={clientContact}
                  onValueChange={setClientContact}
                  placeholder={dict.contact}
                  className="bg-transparent text-sm w-full p-0 border-none focus:ring-0 text-right"
                />
                <OptimizedInput
                  value={clientPOBox}
                  onValueChange={setClientPOBox}
                  placeholder={dict.poBox}
                  className="bg-transparent text-sm w-full p-0 border-none focus:ring-0 text-right"
                />
              </div>
            </div>
          </div>

          {/* Object Section */}
          <div className="mb-8">
            <div className="font-bold text-xs uppercase tracking-widest text-zinc-400 mb-2">
              {dict.object}
            </div>
            <OptimizedTextarea
              value={object}
              onValueChange={setObject}
              placeholder={dict.object}
              className="text-zinc-800 font-medium bg-transparent border-none p-0 w-full focus:ring-0"
            />
          </div>

          {/* Table */}
          <div className="flex-1">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-zinc-900 text-white">
                  <th className="py-3 px-4 text-left font-bold uppercase text-[10px] tracking-widest">{dict.description}</th>
                  <th className="py-3 px-4 text-center font-bold uppercase text-[10px] tracking-widest whitespace-nowrap">{dict.price}</th>
                  <th className="py-3 px-4 text-center font-bold uppercase text-[10px] tracking-widest whitespace-nowrap">{dict.qty}</th>
                  <th className="py-3 px-4 text-right font-bold uppercase text-[10px] tracking-widest whitespace-nowrap">{dict.total}</th>
                </tr>
              </thead>
              <tbody className="border-x border-b border-zinc-200">
                {itemsArr.map((item) => (
                  <tr key={item.id} className="border-b border-zinc-100 group relative">
                    <td className="py-4 px-4 align-top">
                      <OptimizedInput
                        value={item.designation}
                        onValueChange={(val) => updateItem(item.id, "designation", val)}
                        className="w-full bg-transparent font-medium"
                      />
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="absolute -left-6 top-1/2 -translate-y-1/2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="py-4 px-4 text-center align-top tabular-nums">
                      <OptimizedInput
                        value={item.unitPrice}
                        onValueChange={(val) => updateItem(item.id, "unitPrice", Number(val))}
                        className="bg-transparent text-center w-24"
                      />
                    </td>
                    <td className="py-4 px-4 text-center align-top tabular-nums">
                      <OptimizedInput
                        value={item.quantity}
                        onValueChange={(val) => updateItem(item.id, "quantity", Number(val))}
                        className="bg-transparent text-center w-12"
                      />
                    </td>
                    <td className="py-4 px-4 text-right align-top font-bold tabular-nums">
                      {formatCurrency(item.totalPrice)}
                    </td>
                  </tr>
                ))}

                {/* Add Item */}
                <tr className="border-dashed border-t-2 border-zinc-200 bg-zinc-50/50">
                  <td className="py-4 px-4 flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full bg-zinc-200"
                      onClick={addItem}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <OptimizedInput
                      value={newItem.designation}
                      onValueChange={(val) => setNewItem({ ...newItem, designation: val })}
                      placeholder={dict.add}
                      className="bg-transparent w-full"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <OptimizedInput
                      value={newItem.unitPrice}
                      onValueChange={(val) => {
                      const numVal = Number(val);
                      const up = isNaN(numVal) ? newItem.unitPrice : numVal;
                      setNewItem({ ...newItem, unitPrice: up, totalPrice: up * newItem.quantity });
                    }}
                      className="bg-transparent text-center w-full"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <OptimizedInput
                      value={newItem.quantity}
                      onValueChange={(val) => {
                      const numVal = Number(val);
                      const q = isNaN(numVal) ? newItem.quantity : numVal;
                      setNewItem({ ...newItem, quantity: q, totalPrice: q * newItem.unitPrice });
                    }}
                      className="bg-transparent text-center w-full"
                    />
                  </td>
                  <td className="py-4 px-4 text-right font-medium text-zinc-400">
                    {formatCurrency(newItem.totalPrice)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Totals */}
            <div className="mt-8 flex justify-between items-end gap-12">
              <div className="flex-1 flex flex-col items-start gap-1 pb-4">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em]">{dict.description}</span>
                <OptimizedTextarea
                  value={description}
                  onValueChange={setDescription}
                  placeholder={dict.description}
                  className="bg-transparent text-sm w-full italic text-zinc-600 border-b border-transparent hover:border-zinc-200 focus:border-zinc-300 pb-1"
                />
              </div>

              <div className="flex flex-col items-end gap-2 w-[50%] min-w-[300px]">
              <div className="flex justify-between w-64 text-sm">
                <span className="text-zinc-500 font-bold uppercase tracking-wider">{dict.subtotal} :</span>
                <span className="font-bold tabular-nums">{formatCurrency(totalGeneral)}</span>
              </div>
              <div className="flex justify-between w-64 text-sm pb-4">
                <span className="text-zinc-500 font-bold uppercase tracking-wider">TVA (0%) :</span>
                <span className="font-bold tabular-nums">{formatCurrency(0)}</span>
              </div>
              <div className="bg-zinc-900 text-white w-full py-4 px-8 flex justify-between items-center rounded-lg">
                <span className="font-bold text-xl uppercase tracking-tighter">TOTAL :</span>
                <span className="font-black text-3xl tabular-nums">{formatCurrency(totalGeneral)}</span>
              </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-zinc-200 flex justify-between items-end">
            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em]">
              MERCI DE VOTRE CONFIANCE
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 text-center">
                {dict.manager}
              </div>
              <OptimizedInput
                value={managerName}
                onValueChange={setManagerName}
                placeholder={dict.managerName}
                className="bg-transparent text-2xl font-bold text-zinc-900 text-center border-b border-zinc-200 pb-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
