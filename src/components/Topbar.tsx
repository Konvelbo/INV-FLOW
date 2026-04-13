"use client";

import React, { useState, useEffect } from "react";
import Logo from "./navbar-components/logo";
import NotificationMenu from "./navbar-components/notification-menu";
import UserMenu from "./navbar-components/user-menu";
import { SidebarTrigger } from "./ui/sidebar";
import { Building2, Zap, Crown, MessageSquare, Send, Star } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useSubscription, usePlanBadge } from "@/src/context/SubscriptionContext";
import { useLanguage } from "@/src/context/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "react-hot-toast";
import { useIPCAction } from "@/hooks/useIPCAction";
import { cn } from "@/lib/utils";

export default function Topbar() {
  const [activeCompany, setActiveCompany] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { subscription } = useSubscription();
  const { isPro, label: planLabel } = usePlanBadge();
  const { performAction } = useIPCAction();
  const { t } = useLanguage();

  const updateActiveCompany = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setActiveCompany(user.activeCompanyName || null);
    }
  };

  useEffect(() => {
    const init = async () => {
      updateActiveCompany();
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          // @ts-ignore
          const res = await window.electronAPI.getData("getActiveCompany", user.id);
          if (res.success && res.data) {
            user.activeCompanyId = res.data.id;
            user.activeCompanyName = res.data.name;
            localStorage.setItem("user", JSON.stringify(user));
            setActiveCompany(res.data.name);
          } else if (res.success && !res.data) {
            user.activeCompanyId = null;
            user.activeCompanyName = null;
            localStorage.setItem("user", JSON.stringify(user));
            setActiveCompany(null);
          }
        }
      } catch (err) {
        console.error("Failed to sync active company:", err);
      }
    };

    init();
    window.addEventListener("session-update", updateActiveCompany);
    return () => window.removeEventListener("session-update", updateActiveCompany);
  }, []);

  const handleSendFeedback = async () => {
    if (!feedback.trim()) return;
    setIsSubmitting(true);
    try {
      const userStr = localStorage.getItem("user");
      const token = userStr ? JSON.parse(userStr).token : null;
      const res = await performAction("feedback", "create", {
        content: feedback,
        rating,
        contactEmail: "",
      });
      if (res.success) {
        toast.success(t("feedbackSuccess"));
        setIsFeedbackOpen(false);
        setFeedback("");
        setRating(5);
      } else {
        toast.error(t("feedbackError"));
      }
    } catch {
      toast.error(t("genericError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-3">

        {/* Left: Logo + Sidebar Trigger */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Logo w={32} h={32} logoUrl="/black-caractere-non-black.png" />
          <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">

          {/* Active Company chip */}
          <AnimatePresence>
            {activeCompany && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.85, x: 10 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                <Link href="/companies" prefetch={false}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 hover:border-primary/40 transition-colors cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary truncate max-w-[130px]">
                      {activeCompany}
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ---- Subscription Reminder / Plan Badge ---- */}
          <AnimatePresence mode="wait">
            {!isPro ? (
              /* Free plan → pulsing "Upgrade" button */
              <motion.div
                key="upgrade-btn"
                initial={{ opacity: 0, scale: 0.8, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                <Link href="/pricing" prefetch={false}>
                  <motion.div
                    whileHover={{ scale: 1.06, y: -1 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full cursor-pointer overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--primary)/0.15), hsl(var(--primary)/0.05))",
                      border: "1px solid hsl(var(--primary)/0.3)",
                    }}
                  >
                    {/* Animated shimmer */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: "linear", repeatDelay: 1.5 }}
                    />
                    {/* Pulse dot */}
                    <span className="relative flex size-2 flex-shrink-0">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
                      <span className="relative inline-flex size-2 rounded-full bg-primary" />
                    </span>
                    <Zap className="size-3 text-primary flex-shrink-0" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-wider whitespace-nowrap">
                      {t("upgradeToPremium")}
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            ) : (
              /* Pro plan → subtle gold badge */
              <motion.div
                key="pro-badge"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                <Link href="/pricing" prefetch={false}>
                  <motion.div
                    whileHover={{ scale: 1.06, y: -1 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, rgba(234,179,8,0.15), rgba(234,179,8,0.05))",
                      border: "1px solid rgba(234,179,8,0.3)",
                    }}
                  >
                    <Crown className="size-3 text-yellow-400 flex-shrink-0" />
                    <span className="text-[10px] font-black text-yellow-400 uppercase tracking-wider whitespace-nowrap">
                      {planLabel}
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ---- Feedback Button ---- */}
          <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
            <DialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className={cn(
                  "relative size-8 rounded-xl flex items-center justify-center flex-shrink-0",
                  "bg-card/60 border border-border/50 backdrop-blur-sm",
                  "hover:bg-primary/10 hover:border-primary/30 hover:text-primary",
                  "text-muted-foreground transition-colors duration-200 cursor-pointer"
                )}
                title={t("sendFeedback")}
              >
                {/* Subtle pulse to draw attention */}
                <motion.div
                  className="absolute inset-0 rounded-xl border border-primary/30"
                  animate={{ opacity: [0, 0.5, 0], scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", repeatDelay: 2 }}
                />
                <MessageSquare className="size-3.5" />
              </motion.button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[420px] bg-card border-border/50 backdrop-blur-xl rounded-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg font-black">
                  <MessageSquare className="size-5 text-primary" />
                  {t("sendFeedback")}
                </DialogTitle>
                <DialogDescription>
                  {t("feedbackDescription")}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-6">
                {/* Star rating */}
                <div className="space-y-3 text-center">
                  <Label className="text-xs font-bold uppercase tracking-widest opacity-60">
                    {t("feedbackNote")}
                  </Label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        onClick={() => setRating(star)}
                        whileHover={{ scale: 1.25, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        className="cursor-pointer"
                      >
                        <Star
                          className={cn(
                            "size-8 transition-colors duration-200",
                            star <= rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"
                          )}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest opacity-60">
                    {t("feedbackMessage")}
                  </Label>
                  <Textarea
                    placeholder={t("howToImprove")}
                    className="min-h-[110px] bg-background border-border/50 rounded-xl resize-none focus:ring-primary/20"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>

                <p className="text-[10px] text-muted-foreground italic bg-primary/5 p-3 rounded-lg border border-primary/10">
                  {t("feedbackDisclaimer")}
                </p>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsFeedbackOpen(false)}
                  className="rounded-xl"
                >
                  {t("cancel")}
                </Button>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={handleSendFeedback}
                    className="rounded-xl bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20 min-w-[120px]"
                    disabled={!feedback.trim() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                    {t("send")}
                  </Button>
                </motion.div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Notification + User */}
          <div className="flex items-center gap-1.5">
            <NotificationMenu />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
