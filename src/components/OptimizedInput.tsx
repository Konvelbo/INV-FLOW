"use client";

import { useEffect, useState, InputHTMLAttributes, useRef } from "react";

interface OptimizedInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  value: string | number;
  onValueChange: (value: string) => void;
  debounce?: number; // Time in ms, if 0 it acts like onBlur only
}

export default function OptimizedInput({
  value,
  onValueChange,
  debounce = 300,
  ...props
}: OptimizedInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const lastValueProp = useRef(value);

  // Sync state if prop changes externally (e.g. loaded from API)
  if (value !== lastValueProp.current) {
    setLocalValue(value);
    lastValueProp.current = value;
  }

  useEffect(() => {
    if (debounce > 0) {
      const timeout = setTimeout(() => {
        if (localValue !== value) {
          onValueChange(String(localValue));
        }
      }, debounce);

      return () => clearTimeout(timeout);
    }
  }, [localValue, debounce, onValueChange, value]);

  const handleBlur = () => {
    if (localValue !== value) {
      onValueChange(String(localValue));
    }
  };

  return (
    <input
      {...props}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
    />
  );
}
