import { Ref, useState, useCallback, useMemo } from "react";
import { InvoiceItemWithId, useInvoice } from "@/src/context/InvoiceContext";
import { useLanguage } from "@/src/context/LanguageContext";
import { v4 as uuidv4 } from "uuid";
import { ArrowDown, CookingPot } from "lucide-react";
import { Button } from "../ui/button";
import OptimizedInput from "../OptimizedInput";

export default function DefaultTemplate({
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

  const totalmaterial = useMemo(
    () => itemsArr.reduce((sum, item) => sum + Number(item.quantity), 0),
    [itemsArr],
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
        className={`bg-white w-[794px] text-black relative ${scale < 0.8 ? "scale-small" : ""}`}
      >
        <div className="flex justify-between items-center relative w-full mb-2">
          <div>
            <h1 className="mb-3">
              {dict.proforma} :{" "}
              {
                <OptimizedInput
                  value={reference}
                  onValueChange={setReference}
                  placeholder={dict.reference}
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
              placeholder={dict.city}
              className="w-60 pr-2"
            />
            {dict.date}{" "}
            {new Date().toLocaleDateString(
              language === "fr" ? "fr-FR" : "en-US",
            )}
          </h2>
        </div>
        <div className="border h-35 w-full min-h-70">
          <div className="flex justify-between">
            <div className="border-b h-15 p-5 w-full">
              <h2>{dict.billingAddress}</h2>
            </div>
            <div className="border-b border-l h-15 p-5 w-full">
              <h2>{dict.deliveryAddress}:</h2>
            </div>
          </div>
          <div className="px-5 mt-2 space-y-2">
            <div className="flex flex-col gap-2"></div>
            <div className="flex justify-between items-center gap-2 text-sm w-full">
              <div>
                {dict.address}:
                <OptimizedInput
                  value={clientAddress}
                  onValueChange={setClientAddress}
                  placeholder={`${dict.address} (Optional)`}
                  className="w-full pl-2 border-b"
                />
              </div>
              <div>
                {dict.contact}:
                <OptimizedInput
                  value={clientContact}
                  onValueChange={setClientContact}
                  placeholder={`${dict.contact} (Optional)`}
                  className="w-full pl-2 border-b"
                />
              </div>
              <div>
                {dict.poBox}:
                <OptimizedInput
                  value={clientPOBox}
                  onValueChange={setClientPOBox}
                  placeholder={`${dict.poBox} (Optional)`}
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
              {dict.object}:
              <OptimizedInput
                value={object}
                onValueChange={setObject}
                placeholder={dict.object}
                className="w-full pl-2 border-b"
              />
            </h1>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>{dict.designation}</th>
              <th>{dict.unit}</th>
              <th>{dict.quantity}</th>
              <th>{dict.unitPrice}</th>
              <th>{dict.totalPrice}</th>
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
                    placeholder={dict.designation}
                    className="border-none outline-none w-full bg-transparent"
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
                    placeholder={dict.unit}
                    // className="border-none outline-none w-15"
                  />
                </td>

                <td>
                  <OptimizedInput
                    value={item.quantity}
                    onValueChange={(val) =>
                      updateItem(item.id, "quantity", Number(val))
                    }
                    placeholder={dict.quantity}
                    // className="border-none outline-none w-20"
                  />
                </td>
                <td>
                  <OptimizedInput
                    value={item.unitPrice}
                    onValueChange={(val) =>
                      updateItem(item.id, "unitPrice", Number(val))
                    }
                    placeholder={dict.unitPrice}
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
                  placeholder={dict.designation}
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
                  onValueChange={(val) => setNewItem({ ...newItem, unit: val })}
                  placeholder={dict.unit}
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
                  placeholder={dict.quantity}
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
                  placeholder={dict.unitPrice}
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
              <td>{dict.totalMaterial}</td>
              <td>{totalmaterial}</td>
            </tr>
            <tr>
              <td>{dict.totalHT}</td>
              <td>{formatCurrency(totalGeneral)}</td>
            </tr>
          </tbody>
        </table>

        <div className="signature">
          <h2 className="font-semibold mb-3">{dict.managerName}</h2>
          <OptimizedInput
            value={managerName}
            onValueChange={setManagerName}
            dir="rtl"
            placeholder={dict.managerName}
            className="border-none outline-none w-90"
          />
        </div>

        <Button
          onClick={clearAllItems}
          className="mt-4 p-5 bg-red-500 text-white"
        >
          {dict.clearAll}
        </Button>
      </div>
    </div>
  );
}
