"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { RefreshCw, XCircle, CheckCircle2, Download } from "lucide-react";
import { Progress } from "@/src/components/ui/progress";
import { useLanguage } from "@/src/context/LanguageContext";

export default function UpdateManager() {
  const [status, setStatus] = useState<
    "idle" | "checking" | "available" | "not-available" | "downloading" | "downloaded" | "error"
  >("idle");
  const [updateInfo, setUpdateInfo] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (typeof window === "undefined" || !window.electronAPI) return;

    const unbindStatus = window.electronAPI.onUpdateStatus((newStatus: any, info: any) => {

      setStatus(newStatus);
      if (newStatus === "available") {
        setUpdateInfo(info);
        setShowModal(true);
      } else if (newStatus === "downloaded") {
        setUpdateInfo(info);
        setShowModal(true);
      } else if (newStatus === "error") {
        setError(info);
        // Silent logs for background checks to avoid technical toasts
        console.error("Update System Error:", info);

        // Only show toast for critical errors (not for checking failures)
        if (status === "downloading" || status === "downloaded") {
          toast.error(t("systemUpdateError"));
        }
      } else if (newStatus === "not-available") {
        // Silent for auto-check

      }
    });

    const unbindProgress = window.electronAPI.onUpdateProgress((progressObj: any) => {
      setProgress(progressObj.percent);
      setStatus("downloading");
    });

    // Initial check on mount
    window.electronAPI.checkForUpdates?.();

    return () => {
      unbindStatus();
      unbindProgress();
    };
  }, []);

  const handleStartDownload = async () => {
    if (window.electronAPI) {
      setStatus("downloading");
      await window.electronAPI.startDownload();
    }
  };

  const handleInstall = () => {
    if (window.electronAPI) {
      window.electronAPI.quitAndInstall();
    }
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-md bg-card border-border/50 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {status === "available" && <Download className="text-primary" />}
            {status === "downloading" && <RefreshCw className="animate-spin text-primary" />}
            {status === "downloaded" && <CheckCircle2 className="text-emerald-500" />}
            {status === "error" && <XCircle className="text-destructive" />}
            {t("updateSystem")}
          </DialogTitle>
          <DialogDescription>
            {status === "available" && t("updateAvailable").replace("{version}", updateInfo?.version || "")}
            {status === "downloading" && t("updateDownloading")}
            {status === "downloaded" && t("updateDownloaded")}
            {status === "error" && t("systemUpdateError")}
          </DialogDescription>
        </DialogHeader>

        {status === "downloading" && (
          <div className="py-4 space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              {t("percentDownloaded").replace("{percent}", Math.round(progress).toString())}
            </p>
          </div>
        )}

        <DialogFooter className="flex sm:justify-between gap-2">
          <Button variant="ghost" onClick={() => setShowModal(false)} className="rounded-xl">
            {t("later")}
          </Button>

          {status === "available" && (
            <Button onClick={handleStartDownload} className="rounded-xl bg-primary hover:bg-primary/90">
              {t("downloadNow")}
            </Button>
          )}

          {status === "downloaded" && (
            <Button onClick={handleInstall} className="rounded-xl bg-emerald-600 hover:bg-emerald-700">
              {t("installAndRestart")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
