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
import { Download, RefreshCw, XCircle, CheckCircle2 } from "lucide-react";
import { Progress } from "@/src/components/ui/progress";

export default function UpdateManager() {
  const [status, setStatus] = useState<
    "idle" | "checking" | "available" | "not-available" | "downloading" | "downloaded" | "error"
  >("idle");
  const [updateInfo, setUpdateInfo] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.electronAPI) return;

    const unbindStatus = window.electronAPI.onUpdateStatus((newStatus: any, info: any) => {
      console.log("Update Status:", newStatus, info);
      setStatus(newStatus);
      if (newStatus === "available") {
        setUpdateInfo(info);
        setShowModal(true);
      } else if (newStatus === "downloaded") {
        setUpdateInfo(info);
        setShowModal(true);
      } else if (newStatus === "error") {
        setError(info);
        toast.error(`Erreur mise à jour: ${info}`);
      } else if (newStatus === "not-available") {
        toast.success("Votre application est à jour !");
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
            Mise à jour système
          </DialogTitle>
          <DialogDescription>
            {status === "available" && `Une nouvelle version (${updateInfo?.version}) est disponible.`}
            {status === "downloading" && "Téléchargement de la mise à jour..."}
            {status === "downloaded" && "La mise à jour a été téléchargée et est prête à être installée."}
            {status === "error" && "Une erreur est survenue lors de la mise à jour."}
          </DialogDescription>
        </DialogHeader>

        {status === "downloading" && (
          <div className="py-4 space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              {Math.round(progress)}% téléchargé
            </p>
          </div>
        )}

        <DialogFooter className="flex sm:justify-between gap-2">
          <Button variant="ghost" onClick={() => setShowModal(false)} className="rounded-xl">
            Plus tard
          </Button>
          
          {status === "available" && (
            <Button onClick={handleStartDownload} className="rounded-xl bg-primary hover:bg-primary/90">
              Télécharger maintenant
            </Button>
          )}

          {status === "downloaded" && (
            <Button onClick={handleInstall} className="rounded-xl bg-emerald-600 hover:bg-emerald-700">
              Installer et redémarrer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
