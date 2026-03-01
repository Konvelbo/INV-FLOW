import { Ref, useState } from "react";
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
        className={`bg-white w-[794px] min-h-[1123px] text-slate-800 relative shadow-xl font-sans ${scale < 0.8 ? "scale-small" : ""}`}
      >
        {/* Elegant Top Border */}
        <div className="h-2 w-full bg-[#1e293b]"></div>

        <div className="p-16">
          {/* Header */}
          <div className="flex justify-between items-start mb-16">
            <div>
              <h1 className="text-4xl font-serif text-[#1e293b] tracking-tight mb-2">
                {dict.invoice}
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
              <div className="text-2xl font-serif text-[#1e293b] mb-1">
                Company Name
              </div>
              <div className="text-sm text-slate-500">
                <OptimizedInput
                  value={city}
                  onValueChange={setCity}
                  placeholder="City, Country"
                  className="text-right w-48 bg-transparent"
                />
                <div>
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
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
                placeholder="Client Name"
                className="text-xl font-serif text-[#1e293b] w-full mb-1"
              />
              <OptimizedInput
                value={clientAddress}
                onValueChange={setClientAddress}
                placeholder="Address Line 1"
                className="text-sm text-slate-500 w-full"
              />
              <OptimizedInput
                value={clientContact}
                onValueChange={setClientContact}
                placeholder="Contact Info"
                className="text-sm text-slate-500 w-full"
              />
              <OptimizedInput
                value={clientPOBox}
                onValueChange={setClientPOBox}
                placeholder="Zip Code"
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
                placeholder="Description of services or project..."
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
                      placeholder="Add item..."
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
                      onValueChange={(val) =>
                        setNewItem({
                          ...newItem,
                          quantity: Number(val),
                          totalPrice: Number(val) * newItem.unitPrice,
                        })
                      }
                      className="w-full text-center bg-transparent text-sm text-slate-400"
                    />
                  </td>
                  <td className="py-3 text-right">
                    <OptimizedInput
                      value={newItem.unitPrice}
                      onValueChange={(val) =>
                        setNewItem({
                          ...newItem,
                          unitPrice: Number(val),
                          totalPrice: newItem.quantity * Number(val),
                        })
                      }
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
          <div className="flex justify-end mb-20">
            <div className="min-w-[320px] max-w-full space-y-1 tabular-nums">
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
                placeholder="Sign here"
                className="text-center font-cursive text-2xl text-[#1e293b] w-full mb-2"
              />
              <div className="border-t border-slate-300 pt-2 text-xs uppercase tracking-widest text-slate-400">
                {dict.authorizedSignature}
              </div>
            </div>
          </div>
        </div>

        {/* Elegant Bottom Border */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-[#1e293b]"></div>
      </div>
    </div>
  );
}
