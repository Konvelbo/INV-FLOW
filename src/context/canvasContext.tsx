"use client"

import { createContext, useState, useContext, ReactNode } from "react";

type canvasProps = {
    increase: number;
    setIncrease: (value: number) => void;
    decrease: number;
    setDecrease: (value: number) => void;
}

const canvasontext = createContext<canvasProps | null>(null)

export default function CanvasProvider({ children }: { children: ReactNode }) {
    const [increase, setIncrease] = useState<number>(0);
    const [decrease, setDecrease] = useState<number>(0);

    return (
        <canvasontext.Provider value={{increase, setIncrease, decrease, setDecrease}}>
            {children}
        </canvasontext.Provider>
        )
}

export function useCanvas() {
    const canvas = useContext(canvasontext)
    if(!canvas) {
        return 
    }

    return canvas
}