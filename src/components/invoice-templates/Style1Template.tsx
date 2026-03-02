import { Ref, useState, useCallback, useMemo } from "react";
import { InvoiceItemWithId, useInvoice } from "@/src/context/InvoiceContext";
import { useLanguage } from "@/src/context/LanguageContext";
import { v4 as uuidv4 } from "uuid";
import { ArrowDown, CookingPot, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import OptimizedInput from "../OptimizedInput";

export default function Style1Template({
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

  const clearAllItems = useCallback(() => {
    setItemsArr([]);
  }, [setItemsArr]);

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
        className={`bg-white w-[794px] min-h-[1123px] text-slate-800 relative shadow-lg ${scale < 0.8 ? "scale-small" : ""}`}
      >
        {/* Header Section */}
        <div className="bg-slate-900 text-white p-12 flex justify-between items-start">
          <div className="w-1/2">
            <h1 className="text-4xl font-light tracking-wide mb-2">
              {dict.invoice}
            </h1>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-sm uppercase tracking-wider">
                {dict.reference}:
              </span>
              <OptimizedInput
                value={reference}
                onValueChange={setReference}
                placeholder="IV-2024-001"
                className="bg-transparent border-b border-slate-700 text-white w-40 focus:border-white transition-colors"
              />
            </div>
          </div>
          <div className="w-1/2 text-right">
            <div className="flex justify-end items-center gap-2 mb-1">
              <OptimizedInput
                value={city}
                onValueChange={setCity}
                placeholder="City"
                className="bg-transparent border-b border-slate-700 text-white text-right w-32 focus:border-white"
              />
              <span className="text-slate-400">
                , {new Date().toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>
        </div>

        {/* Client Info Section */}
        <div className="p-12 pb-6 grid grid-cols-2 gap-12">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              {dict.billedTo}
            </h3>
            <div className="space-y-2">
              <OptimizedInput
                value={clientName}
                onValueChange={setClientName}
                placeholder="Client Company Name"
                className="text-xl font-bold text-slate-900 w-full placeholder:text-slate-300"
              />
              <OptimizedInput
                value={clientAddress}
                onValueChange={setClientAddress}
                placeholder="Street Address"
                className="text-sm text-slate-600 w-full"
              />
              <div className="flex gap-4">
                <OptimizedInput
                  value={clientContact}
                  onValueChange={setClientContact}
                  placeholder="Contact Person"
                  className="text-sm text-slate-600 w-full"
                />
                <OptimizedInput
                  value={clientPOBox}
                  onValueChange={setClientPOBox}
                  placeholder="BP"
                  className="text-sm text-slate-600 w-24"
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              {dict.projectDetails}
            </h3>
            <div className="bg-slate-50 p-6 rounded-lg">
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Object / Description
              </label>
              <OptimizedInput
                value={object}
                onValueChange={setObject}
                placeholder="Project description or service details..."
                className="w-full text-slate-800 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="px-12 py-6">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-100">
                <th className="py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-1/2">
                  {dict.description}
                </th>
                <th className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {dict.unit}
                </th>
                <th className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {dict.qty}
                </th>
                <th className="py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {dict.unitPrice}
                </th>
                <th className="py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {dict.totalPrice}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {itemsArr.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-slate-50 transition-colors"
                >
                  <td className="py-4 relative">
                    <OptimizedInput
                      value={item.designation}
                      onValueChange={(val) =>
                        updateItem(item.id, "designation", val)
                      }
                      placeholder="Item description"
                      className="w-full font-medium text-slate-700"
                    />
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="absolute -left-8 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 transition-all p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="py-4 text-center">
                    <OptimizedInput
                      value={item.unit}
                      onValueChange={(val) => updateItem(item.id, "unit", val)}
                      className="text-center text-slate-500 w-16 mx-auto"
                    />
                  </td>
                  <td className="py-4 text-center">
                    <OptimizedInput
                      value={item.quantity}
                      onValueChange={(val) =>
                        updateItem(item.id, "quantity", Number(val))
                      }
                      className="text-center font-semibold text-slate-700 w-16 mx-auto"
                    />
                  </td>
                  <td className="py-4 text-right">
                    <OptimizedInput
                      value={item.unitPrice}
                      onValueChange={(val) =>
                        updateItem(item.id, "unitPrice", Number(val))
                      }
                      className="text-right text-slate-500 w-24 ml-auto"
                    />
                  </td>
                  <td className="py-4 text-right font-bold text-slate-800">
                    {formatCurrency(item.totalPrice)}
                  </td>
                </tr>
              ))}

              {/* Add New Item Row */}
              <tr className="bg-slate-50">
                <td className="py-4 relative pl-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600"
                      onClick={addItem}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <OptimizedInput
                      value={newItem.designation}
                      onValueChange={(val) =>
                        setNewItem({ ...newItem, designation: val })
                      }
                      placeholder="Add new item..."
                      className="w-full text-slate-500 italic bg-transparent"
                    />
                  </div>
                </td>
                <td className="py-4 text-center">
                  <OptimizedInput
                    value={newItem.unit}
                    onValueChange={(val) =>
                      setNewItem({ ...newItem, unit: val })
                    }
                    className="text-center text-slate-400 w-16 mx-auto bg-transparent"
                  />
                </td>
                <td className="py-4 text-center">
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
                    className="text-center text-slate-400 w-16 mx-auto bg-transparent"
                  />
                </td>
                <td className="py-4 text-right">
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
                    className="text-right text-slate-400 w-24 ml-auto bg-transparent"
                  />
                </td>
                <td className="py-4 text-right font-medium text-slate-400 pr-4">
                  {formatCurrency(newItem.totalPrice)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer / Totals & Signature Section */}
        <div className="px-12 mt-12 flex justify-between items-end gap-12">
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              {dict.authorizedSignature}
            </p>
            <OptimizedInput
              value={managerName}
              onValueChange={setManagerName}
              placeholder="Manager Name"
              className="font-script text-2xl text-slate-800 w-full max-w-[250px] border-b border-slate-200 pb-2"
            />
          </div>

          <div className="min-w-[300px] max-w-[50%] space-y-3">
            <div className="flex justify-between items-center gap-4 text-slate-500 text-sm tabular-nums">
              <span className="whitespace-nowrap">{dict.totalMaterial}</span>
              <span className="text-right break-all font-medium">
                {totalMaterialGeneral}
              </span>
            </div>
            <div className="flex justify-between items-center gap-4 pt-4 border-t border-slate-200 tabular-nums">
              <span className="font-bold text-lg text-slate-900 whitespace-nowrap">
                {dict.total}
              </span>
              <span className="font-bold text-2xl text-slate-900 text-right break-all leading-tight">
                {formatCurrency(totalGeneral)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
