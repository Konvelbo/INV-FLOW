"use client";

import { Ref, useState, useEffect, useCallback } from "react";
import { useInvoice } from "@/src/context/InvoiceContext";
import DefaultTemplate from "./invoice-templates/DefaultTemplate";
import Style1Template from "./invoice-templates/Style1Template";
import Style2Template from "./invoice-templates/Style2Template";
import Style3Template from "./invoice-templates/Style3Template";
import Style4Template from "./invoice-templates/Style4Template";
import Style5Template from "./invoice-templates/Style5Template";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const templates = [
  {
    id: "default",
    name: "Default",
    color: "bg-white",
    border: "border-gray-200",
  },
  {
    id: "style1",
    name: "Modern",
    color: "bg-slate-800",
    border: "border-slate-600",
  },
  {
    id: "style2",
    name: "Corporate",
    color: "bg-blue-900",
    border: "border-blue-700",
  },
  {
    id: "style3",
    name: "Creative",
    color: "bg-purple-600",
    border: "border-purple-400",
  },
  {
    id: "style4",
    name: "Classic",
    color: "bg-[#fdfbf7]",
    border: "border-gray-400",
  },
  {
    id: "style5",
    name: "Tech",
    color: "bg-zinc-950",
    border: "border-green-500",
  },
];

export default function InvoiceCanvas({
  divRef,
}: {
  divRef: Ref<HTMLDivElement>;
}) {
  const { style, setStyle } = useInvoice();

  const [scale, setScale] = useState<number>(1.1);

  const increaseScale = useCallback(
    () => setScale((s) => Math.min(1.5, +(s + 0.1).toFixed(2))),
    [],
  );
  const decreaseScale = useCallback(
    () => setScale((s) => Math.max(0.5, +(s - 0.1).toFixed(2))),
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const addPressed =
        e.key === "+" || e.key === "=" || e.code === "NumpadAdd";
      const subPressed = e.key === "-" || e.code === "NumpadSubtract";
      if ((e.ctrlKey || e.metaKey) && addPressed) {
        e.preventDefault();
        increaseScale();
      } else if ((e.ctrlKey || e.metaKey) && subPressed) {
        e.preventDefault();
        decreaseScale();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [increaseScale, decreaseScale]);

  const renderTemplate = () => {
    switch (style) {
      case "style1":
        return <Style1Template divRef={divRef} scale={scale} />;
      case "style2":
        return <Style2Template divRef={divRef} scale={scale} />;
      case "style3":
        return <Style3Template divRef={divRef} scale={scale} />;
      case "style4":
        return <Style4Template divRef={divRef} scale={scale} />;
      case "style5":
        return <Style5Template divRef={divRef} scale={scale} />;
      default:
        return <DefaultTemplate divRef={divRef} scale={scale} />;
    }
  };

  return (
    <div className="w-full gap-8">
      {/* Visual Style Selector */}

      {/* Canvas Area */}
      <div className="canvas-viewer p-4 flex flex-col items-center w-full">
        {renderTemplate()}
      </div>
    </div>
  );
}

export const ChoiceInvoice = () => {
  const { style, setStyle } = useInvoice();
  return (
    <div className="w-full max-w-[700px] px-3">
      <div className="bg-white/80 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6 flex gap-6 overflow-x-auto justify-center">
        {templates.map((t) => (
          <button
            id="Invoice_Choice_btn"
            key={t.id}
            onClick={() => setStyle(t.id)}
            className={cn(
              "relative w-20 h-28 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-end overflow-hidden group shadow-sm hover:shadow-md cursor-pointer",
              style === t.id
                ? "border-primary rounded-xl! ring-2 ring-primary/30 scale-105 shadow-xl"
                : "border-transparent hover:border-gray-200 hover:scale-105 opacity-80 hover:opacity-100",
            )}
          >
            {/* Imitation of the invoice style */}
            <div className={cn("absolute inset-0 w-full h-full", t.color)}>
              {/* Abstract layout lines */}
              <div className="absolute top-4 left-4 right-4 h-2 bg-current opacity-20 rounded-full"></div>
              <div className="absolute top-8 left-4 w-1/3 h-2 bg-current opacity-20 rounded-full"></div>
              <div className="absolute top-16 left-4 right-4 bottom-12 bg-white/10 rounded-lg border border-white/5"></div>
            </div>

            {/* Checkmark overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center z-10 opacity-0 transition-opacity duration-300"
              style={{ opacity: style === t.id ? 1 : 0 }}
            >
              <div className="bg-primary text-white rounded-full p-2 shadow-lg scale-0 animate-in zoom-in duration-300">
                <Check className="w-5 h-5" />
              </div>
            </div>

            {/* Label */}
            <div className="relative z-20 w-full bg-white/95 backdrop-blur-sm py-2 text-center border-t border-gray-100">
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  style === t.id ? "text-primary" : "text-gray-500",
                )}
              >
                {t.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
