"use client";

import { useEffect, useState, useRef, TextareaHTMLAttributes } from "react";

interface OptimizedTextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange"
> {
  value: string;
  onValueChange: (value: string) => void;
  debounce?: number; // Time in ms
}

export default function OptimizedTextarea({
  value,
  onValueChange,
  debounce = 300,
  ...props
}: OptimizedTextareaProps) {
  const [localValue, setLocalValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [localValue]);

  useEffect(() => {
    if (debounce > 0) {
      const timeout = setTimeout(() => {
        if (localValue !== value) {
          onValueChange(localValue);
        }
      }, debounce);

      return () => clearTimeout(timeout);
    }
  }, [localValue, debounce, onValueChange, value]);

  const handleBlur = () => {
    if (localValue !== value) {
      onValueChange(localValue);
    }
  };

  return (
    <textarea
      {...props}
      ref={textareaRef}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      style={{ overflow: "hidden", ...props.style }}
    />
  );
}
