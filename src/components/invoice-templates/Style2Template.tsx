import { Ref, useState, useCallback, useMemo } from "react";
import { InvoiceItemWithId, useInvoice } from "@/src/context/InvoiceContext";
import { useLanguage } from "@/src/context/LanguageContext";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import OptimizedInput from "../OptimizedInput";

export default function Style2Template({
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
        className={`bg-white w-[794px] min-h-[1123px] text-gray-800 relative shadow-xl font-serif ${scale < 0.8 ? "scale-small" : ""}`}
      >
        {/* Header with Color Block */}
        <div className="flex h-48">
          <div className="w-1/3 bg-blue-900 p-8 flex flex-col justify-center text-white">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-white rounded-full"></div>
            </div>
            <h2 className="font-bold text-xl tracking-wider">COMPANY</h2>
          </div>
          <div className="w-2/3 bg-gray-100 p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-5xl font-bold text-blue-900 mb-2">
                  {dict.invoice}
                </h1>
                <div className="flex items-center gap-2 text-gray-500">
                  <span>#</span>
                  <OptimizedInput
                    value={reference}
                    onValueChange={setReference}
                    placeholder="INV-0000"
                    className="bg-transparent text-gray-600 w-32 focus:ring-0"
                  />
                </div>
              </div>
              <div className="text-right">
                <OptimizedInput
                  value={city}
                  onValueChange={setCity}
                  placeholder="City"
                  className="text-right text-gray-600 w-32 bg-transparent"
                />
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address & Info */}
        <div className="p-10 flex gap-12">
          <div className="w-1/2">
            <h3 className="text-blue-900 font-bold uppercase text-xs tracking-widest mb-4 border-b-2 border-blue-900 pb-2 inline-block">
              {dict.billedTo}
            </h3>
            <OptimizedInput
              value={clientName}
              onValueChange={setClientName}
              placeholder="Recipient Name"
              className="text-2xl font-bold text-gray-900 w-full mb-2 block"
            />
            <OptimizedInput
              value={clientAddress}
              onValueChange={setClientAddress}
              placeholder="Address Line"
              className="text-gray-600 w-full text-sm"
            />
            <div className="flex gap-2">
              <OptimizedInput
                value={clientPOBox}
                onValueChange={setClientPOBox}
                placeholder="Zip/Postal"
                className="text-gray-600 w-24 text-sm"
              />
              <OptimizedInput
                value={clientContact}
                onValueChange={setClientContact}
                placeholder="Contact Info"
                className="text-gray-600 w-full text-sm"
              />
            </div>
          </div>
          <div className="w-1/2">
            <h3 className="text-blue-900 font-bold uppercase text-xs tracking-widest mb-4 border-b-2 border-blue-900 pb-2 inline-block">
              {dict.projectDetails}
            </h3>
            <OptimizedInput
              value={object}
              onValueChange={setObject}
              placeholder="Project or Service Description..."
              className="w-full text-gray-700 bg-gray-50 p-2 border-l-4 border-gray-300"
            />
          </div>
        </div>

        {/* Table */}
        <div className="px-10 mt-4">
          <table className="w-full">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-sm">
                  {dict.description}
                </th>
                <th className="py-3 px-4 text-center font-semibold text-sm">
                  {dict.unit}
                </th>
                <th className="py-3 px-4 text-center font-semibold text-sm">
                  {dict.qty}
                </th>
                <th className="py-3 px-4 text-right font-semibold text-sm">
                  {dict.price}
                </th>
                <th className="py-3 px-4 text-right font-semibold text-sm">
                  {dict.total}
                </th>
              </tr>
            </thead>
            <tbody>
              {itemsArr.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-3 px-4 relative">
                    <OptimizedInput
                      value={item.designation}
                      onValueChange={(val) =>
                        updateItem(item.id, "designation", val)
                      }
                      className="w-full font-medium text-gray-800 bg-transparent wrap-break-word whitespace-pre-wrap min-h-[1.5rem]"
                    />
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="absolute -left-6 top-3 text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <OptimizedInput
                      value={item.unit}
                      onValueChange={(val) => updateItem(item.id, "unit", val)}
                      className="text-center w-12 mx-auto bg-transparent"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <OptimizedInput
                      value={item.quantity}
                      onValueChange={(val) =>
                        updateItem(item.id, "quantity", Number(val))
                      }
                      className="text-center w-12 mx-auto bg-transparent"
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <OptimizedInput
                      value={item.unitPrice}
                      onValueChange={(val) =>
                        updateItem(item.id, "unitPrice", Number(val))
                      }
                      className="text-right w-24 ml-auto bg-transparent"
                    />
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-gray-800 tabular-nums">
                    {formatCurrency(item.totalPrice)}
                  </td>
                </tr>
              ))}
              {/* Add New Item Input Row */}
              <tr className="bg-blue-50/50 outline outline-blue-200 outline-dashed">
                <td className="py-3 px-4">
                  <OptimizedInput
                    value={newItem.designation}
                    onValueChange={(val) =>
                      setNewItem({ ...newItem, designation: val })
                    }
                    placeholder="New Item Name..."
                    className="w-full bg-transparent font-medium"
                  />
                </td>
                <td className="py-3 px-4 text-center">
                  <OptimizedInput
                    value={newItem.unit}
                    onValueChange={(val) =>
                      setNewItem({ ...newItem, unit: val })
                    }
                    className="text-center w-12 mx-auto bg-transparent"
                  />
                </td>
                <td className="py-3 px-4 text-center">
                  <OptimizedInput
                    value={newItem.quantity}
                    onValueChange={(val) =>
                      setNewItem({
                        ...newItem,
                        quantity: Number(val),
                        totalPrice: Number(val) * newItem.unitPrice,
                      })
                    }
                    className="text-center w-12 mx-auto bg-transparent font-mono"
                  />
                </td>
                <td className="py-3 px-4 text-right">
                  <OptimizedInput
                    value={newItem.unitPrice}
                    onValueChange={(val) =>
                      setNewItem({
                        ...newItem,
                        unitPrice: Number(val),
                        totalPrice: newItem.quantity * Number(val),
                      })
                    }
                    className="text-right w-24 ml-auto bg-transparent font-mono"
                  />
                </td>
                <td className="py-3 px-4 text-right font-bold text-blue-700">
                  {formatCurrency(newItem.quantity * newItem.unitPrice)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 flex items-center justify-center">
            <Button
              variant="default"
              size="sm"
              onClick={addItem}
              className="bg-blue-900 hover:bg-blue-800 text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" /> Confirm Add Item
            </Button>
          </div>
        </div>

        {/* Totals & Signature Section */}
        <div className="px-10 mt-12 flex justify-between items-end gap-12 pb-16">
          <div className="flex-1">
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-4">
              {dict.authorizedSignature}
            </div>
            <OptimizedInput
              value={managerName}
              onValueChange={setManagerName}
              placeholder="Manager Name"
              className="text-lg font-serif italic text-gray-800 border-b border-gray-200 pb-1 w-full max-w-[250px]"
            />
          </div>

          <div className="min-w-[400px] max-w-[50%] bg-blue-900 text-white p-8 rounded-2xl shadow-xl space-y-4 tabular-nums">
            <div className="flex justify-between items-center gap-4 text-blue-100/70">
              <span className="text-sm font-medium uppercase tracking-wider">
                {dict.totalMaterial}
              </span>
              <span className="text-xl font-bold break-all">
                {totalMaterialGeneral}
              </span>
            </div>
            <div className="pt-4 border-t border-blue-800 flex justify-between items-center gap-6">
              <span className="text-lg font-bold uppercase tracking-widest text-blue-200">
                {dict.total}
              </span>
              <span className="text-2xl font-black text-white break-all text-right leading-tight">
                {formatCurrency(totalGeneral)}
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Line (Non-absolute) */}
        <div className="w-full bg-blue-900 h-4 mt-auto"></div>
      </div>
    </div>
  );
}
