import { Ref, useState } from "react";
import { InvoiceItemWithId, useInvoice } from "@/src/context/InvoiceContext";
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
                  INVOICE
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
              Invoice To
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
              Description
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
                  Description
                </th>
                <th className="py-3 px-4 text-center font-semibold text-sm">
                  Unit
                </th>
                <th className="py-3 px-4 text-center font-semibold text-sm">
                  Qty
                </th>
                <th className="py-3 px-4 text-right font-semibold text-sm">
                  Price
                </th>
                <th className="py-3 px-4 text-right font-semibold text-sm">
                  Total
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
                      className="w-full font-medium text-gray-800 bg-transparent"
                    />
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="absolute -left-6 top-3 text-red-500 hover:text-red-700"
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
                  <td className="py-3 px-4 text-right font-bold text-gray-800">
                    {formatCurrency(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-2 flex items-center justify-center border-t border-dashed border-gray-300 py-2">
            <Button
              variant="outline"
              size="sm"
              onClick={addItem}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Item
            </Button>
          </div>
        </div>

        {/* Totals */}
        <div className="px-10 mt-8 flex justify-end">
          <div className="w-1/2 bg-gray-100 p-6 rounded-lg">
            <div className="flex justify-between mb-2 text-gray-600">
              <span className="font-semibold">Items Count</span>
              <span>{itemsArr.length}</span>
            </div>
            <div className="flex justify-between mb-2 text-gray-600">
              <span className="font-semibold">Total Material</span>
              <span>{totalMaterialGeneral}</span>
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-300">
              <span className="font-bold text-2xl text-blue-900">Total</span>
              <span className="font-bold text-2xl text-blue-900">
                {formatCurrency(totalGeneral)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full bg-blue-900 h-12"></div>
        <div className="absolute bottom-16 left-10">
          <div className="text-xs text-gray-400">Authorized Signatory</div>
          <OptimizedInput
            value={managerName}
            onValueChange={setManagerName}
            placeholder="Manager Name"
            className="text-lg font-serif italic text-gray-800 mt-2 w-64"
          />
        </div>
      </div>
    </div>
  );
}
