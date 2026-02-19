"use client";

import React, { useState, useEffect } from "react";
import { Rocket, Sparkles, TrendingUp, Zap, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export function InteractivePulse({ stats }: { stats: any }) {
  const [boostActive, setBoostActive] = useState(false);
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState(0);

  // Constants
  const REVENUE_GOAL = 50000; // Monthly goal
  const currentRevenue = stats?.totalRevenue || 0;

  useEffect(() => {
    // Calculate progress and level based on revenue
    const newProgress = Math.min((currentRevenue / REVENUE_GOAL) * 100, 100);
    setProgress(newProgress);

    if (newProgress > 80) setLevel(5);
    else if (newProgress > 60) setLevel(4);
    else if (newProgress > 40) setLevel(3);
    else if (newProgress > 20) setLevel(2);
    else setLevel(1);
  }, [currentRevenue]);

  const handleBoost = () => {
    setBoostActive(true);
    setTimeout(() => setBoostActive(false), 2000);
  };

  return (
    <div className="relative p-8 rounded-[2rem] bg-card border border-border/50 backdrop-blur-2xl shadow-2xl overflow-hidden h-full flex flex-col justify-between group">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: boostActive ? [1, 1.2, 1] : 1,
            opacity: boostActive ? 0.3 : 0.1,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/20 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative z-10 flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary fill-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              Niveau {level} • Pulse™ Active
            </span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground font-sans">
            Pulse Financial <span className="text-primary italic">Rocket</span>
          </h3>
          <p className="text-muted-foreground text-xs font-sans max-w-[200px]">
            Explosez vos objectifs mensuels et propulsez votre business vers de
            nouveaux sommets.
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="text-3xl font-black text-foreground font-mono">
            {progress.toFixed(0)}%
          </div>
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
            Objectif Atteint
          </span>
        </div>
      </div>

      {/* Main Interactive Illustration Area */}
      <div className="relative flex-1 flex items-center justify-center my-8">
        <motion.div
          onClick={handleBoost}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: boostActive ? [0, -60, 0] : [0, -12, 0],
            rotate: boostActive ? [0, 8, -8, 8, -8, 0] : [0, 2, -2, 0],
            scale: boostActive ? 1.25 : 1,
          }}
          transition={{
            duration: boostActive ? 0.4 : 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative cursor-pointer z-20"
        >
          {/* Rocket Icon */}
          <div className="relative z-20">
            <Rocket
              className={cn(
                "w-32 h-32 transition-colors duration-500",
                boostActive ? "text-primary fill-primary/20" : "text-slate-400",
              )}
            />
          </div>

          {/* Flame Effects */}
          <AnimatePresence>
            {(boostActive || level > 1) && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-10"
              >
                <div
                  className={cn(
                    "w-12 h-20 rounded-full blur-xl animate-pulse",
                    boostActive ? "bg-orange-500" : "bg-primary/40",
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sparkles */}
          <AnimatePresence>
            {boostActive && (
              <motion.div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      x: (Math.random() - 0.5) * 200,
                      y: (Math.random() - 0.5) * 200,
                    }}
                    className="absolute top-1/2 left-1/2"
                  >
                    <Sparkles className="w-6 h-6 text-primary" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Bottom Interface */}
      <div className="relative z-10 space-y-6">
        <div className="w-full h-3 bg-slate-900/50 rounded-full border border-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className="h-full bg-linear-to-r from-primary to-emerald-400 relative"
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </motion.div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleBoost}
            disabled={boostActive}
            className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary-hover text-primary-foreground font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 group/btn overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Zap className="w-4 h-4 fill-current" />
              Active Boost IA
            </span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
          </Button>

          <div className="flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all cursor-help relative group/tip">
            <Target className="w-6 h-6" />
            <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-48 p-3 rounded-xl bg-popover/90 backdrop-blur-md border border-white/10 text-[10px] leading-relaxed opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all">
              Objectif conseillé :{" "}
              <strong>
                {REVENUE_GOAL.toLocaleString()} {stats?.currency || "XOF"}
              </strong>{" "}
              pour optimiser votre rentabilité ce trimestre.
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 pt-2">
          <div className="text-[10px] font-bold text-muted-foreground flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            STABLE
          </div>
          <div className="text-[10px] font-bold text-muted-foreground flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            FLUIDE
          </div>
          <div className="text-[10px] font-bold text-muted-foreground flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
            ANALYSE ACTIVE
          </div>
        </div>
      </div>
    </div>
  );
}
