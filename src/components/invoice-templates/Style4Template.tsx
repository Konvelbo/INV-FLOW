import { Ref, useState, useCallback, useMemo } from "react";
import { InvoiceItemWithId, useInvoice } from "@/src/context/InvoiceContext";
import { useLanguage } from "@/src/context/LanguageContext";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import OptimizedInput from "../OptimizedInput";

export default function Style4Template({
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
        className={`bg-white w-[794px] min-h-[1123px] pb-32 text-gray-800 relative shadow-xl font-serif ${scale < 0.8 ? "scale-small" : ""}`}
      >
        {/* Elegant Top Border */}
        <div className="h-2 w-full bg-[#1e293b]"></div>

        <div className="p-16">
          {/* Header */}
          <div className="flex justify-between items-start mb-16">
            <div>
              <h1 className="text-4xl font-serif text-[#1e293b] tracking-tight mb-2 uppercase">
                {invoiceType === 'quote' ? dict.proforma : dict.invoice}
              </h1>
              <div className="text-sm text-slate-500 uppercase tracking-widest font-medium">
                {dict.reference}:{" "}
                <OptimizedInput
                  value={reference}
                  onValueChange={setReference}
                  placeholder="INV-001"
                  className="w-32 inline-block bg-transparent text-slate-700"
                />
              </div>
            </div>
            <div className="text-right">
              <OptimizedInput
                value={companyName}
                onValueChange={setCompanyName}
                placeholder={dict.companyName || "Company Name"}
                className="text-right text-2xl font-serif text-[#1e293b] mb-1 bg-transparent border-b border-transparent focus:border-gray-300 w-full"
              />
              <div className="text-sm text-slate-500">
                <OptimizedInput
                  value={city}
                  onValueChange={setCity}
                  placeholder="City, Country"
                  className="text-right w-48 bg-transparent"
                />
                <div>
                  {new Date().toLocaleDateString(
                    language === "fr" ? "fr-FR" : "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Client & Project Info */}
          <div className="grid grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
                {dict.billedTo}
              </h3>
              <OptimizedInput
                value={clientName}
                onValueChange={setClientName}
                placeholder={dict.client}
                className="text-xl font-serif text-[#1e293b] w-full mb-1"
              />
              <OptimizedInput
                value={clientAddress}
                onValueChange={setClientAddress}
                placeholder={dict.address}
                className="text-sm text-slate-500 w-full"
              />
              <OptimizedInput
                value={clientContact}
                onValueChange={setClientContact}
                placeholder={dict.contact}
                className="text-sm text-slate-500 w-full"
              />
              <OptimizedInput
                value={clientPOBox}
                onValueChange={setClientPOBox}
                placeholder={dict.poBox}
                className="text-sm text-slate-500 w-24"
              />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
                {dict.projectDetails}
              </h3>
              <OptimizedInput
                value={object}
                onValueChange={setObject}
                placeholder={dict.object}
                className="text-md text-slate-700 w-full h-24 resize-none bg-slate-50 p-3 rounded-md"
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-12">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#1e293b]">
                  <th className="py-3 text-left text-xs font-bold text-[#1e293b] uppercase tracking-wider">
                    {dict.description}
                  </th>
                  <th className="py-3 text-center text-xs font-bold text-[#1e293b] uppercase tracking-wider w-24">
                    {dict.unit}
                  </th>
                  <th className="py-3 text-center text-xs font-bold text-[#1e293b] uppercase tracking-wider w-24">
                    {dict.qty}
                  </th>
                  <th className="py-3 text-right text-xs font-bold text-[#1e293b] uppercase tracking-wider w-32">
                    {dict.price}
                  </th>
                  <th className="py-3 text-right text-xs font-bold text-[#1e293b] uppercase tracking-wider w-32">
                    {dict.total}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {itemsArr.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50">
                    <td className="py-4 relative">
                      <OptimizedInput
                        value={item.designation}
                        onValueChange={(val) =>
                          updateItem(item.id, "designation", val)
                        }
                        className="w-full font-medium text-slate-700 bg-transparent"
                      />
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="absolute -left-6 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="py-4">
                      <OptimizedInput
                        value={item.unit}
                        onValueChange={(val) =>
                          updateItem(item.id, "unit", val)
                        }
                        className="w-full text-center text-slate-500 bg-transparent"
                      />
                    </td>
                    <td className="py-4">
                      <OptimizedInput
                        value={item.quantity}
                        onValueChange={(val) =>
                          updateItem(item.id, "quantity", Number(val))
                        }
                        className="w-full text-center text-slate-500 bg-transparent"
                      />
                    </td>
                    <td className="py-4 text-right">
                      <OptimizedInput
                        value={item.unitPrice}
                        onValueChange={(val) =>
                          updateItem(item.id, "unitPrice", Number(val))
                        }
                        className="w-full text-right text-slate-500 bg-transparent"
                      />
                    </td>
                    <td className="py-4 text-right font-medium text-slate-900">
                      {formatCurrency(item.totalPrice)}
                    </td>
                  </tr>
                ))}
                {/* New Item Row */}
                <tr className="bg-slate-50/50">
                  <td className="py-3 pl-2 flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={addItem}
                      className="h-6 w-6 text-slate-400 hover:text-[#1e293b]"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <OptimizedInput
                      value={newItem.designation}
                      onValueChange={(val) =>
                        setNewItem({ ...newItem, designation: val })
                      }
                      placeholder={dict.add}
                      className="w-full bg-transparent text-sm"
                    />
                  </td>
                  <td className="py-3">
                    <OptimizedInput
                      value={newItem.unit}
                      onValueChange={(val) =>
                        setNewItem({ ...newItem, unit: val })
                      }
                      className="w-full text-center bg-transparent text-sm text-slate-400"
                    />
                  </td>
                  <td className="py-3">
                    <OptimizedInput
                        value={newItem.quantity}
                        onValueChange={(val) => {
                          const numVal = Number(val);
                          const q = isNaN(numVal) ? 0 : numVal;
                          setNewItem((prev) => ({
                            ...prev,
                            quantity: q,
                            totalPrice: q * Number(prev.unitPrice),
                          }));
                        }}
                      className="w-full text-center bg-transparent text-sm text-slate-400"
                    />
                  </td>
                  <td className="py-3 text-right">
                    <OptimizedInput
                        value={newItem.unitPrice}
                        onValueChange={(val) => {
                          const numVal = Number(val);
                          const up = isNaN(numVal) ? 0 : numVal;
                          setNewItem((prev) => ({
                            ...prev,
                            unitPrice: up,
                            totalPrice: up * Number(prev.quantity),
                          }));
                        }}
                      className="w-full text-right bg-transparent text-sm text-slate-400"
                    />
                  </td>
                  <td className="py-3 text-right text-sm text-slate-400 pr-2">
                    {formatCurrency(newItem.totalPrice)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer Totals */}
          <div className="flex justify-between items-end mb-20 gap-8">
            <div className="flex-1 flex flex-col items-start gap-1">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-widest border-b border-slate-200 pb-2 mb-2 w-full">{dict.description}</span>
              <OptimizedInput
                value={description}
                onValueChange={setDescription}
                placeholder={dict.description}
                className="bg-transparent font-serif text-sm w-full italic text-slate-700 border-b border-transparent hover:border-slate-200 focus:border-slate-400 pb-1"
              />
            </div>
            <div className="min-w-[320px] max-w-[50%] space-y-1 tabular-nums">
              <div className="flex justify-between items-center gap-6 py-2 border-b border-slate-100 text-sm text-slate-500">
                <span className="whitespace-nowrap">{dict.subtotal}</span>
                <span className="text-right break-all">
                  {formatCurrency(totalGeneral)}
                </span>
              </div>
              <div className="flex justify-between items-center gap-6 py-2 border-b border-slate-100 text-sm text-slate-500">
                <span className="whitespace-nowrap">{dict.tax}</span>
                <span className="text-right break-all">
                  {formatCurrency(0)}
                </span>
              </div>
              <div className="flex justify-between items-center gap-8 py-4 border-b-2 border-[#1e293b] text-xl font-serif text-[#1e293b]">
                <span className="font-bold uppercase tracking-wider whitespace-nowrap">
                  {dict.total}
                </span>
                <span className="font-bold break-all text-right">
                  {formatCurrency(totalGeneral)}
                </span>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="flex justify-between items-end">
            <div className="text-xs text-slate-400">
              {/*<p>Thank you for your business.</p>
              <p>Payment is due within 30 days.</p>*/}
            </div>
            <div className="text-center w-64">
              <OptimizedInput
                value={managerName}
                onValueChange={setManagerName}
                placeholder={dict.managerName}
                className="text-center font-cursive text-2xl text-[#1e293b] w-full mb-2"
              />
              <div className="border-t border-slate-300 pt-2 text-xs uppercase tracking-widest text-slate-400">
                {dict.authorizedSignature}
              </div>
            </div>
          </div>
        </div>

        {/* Elegant Bottom Border */}
      </div>
    </div>
  );
}
