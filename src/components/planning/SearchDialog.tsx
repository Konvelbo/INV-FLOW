"use client";

import React, { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useLanguage } from "@/src/context/LanguageContext";

interface SearchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  searchTitle: string;
  setSearchTitle: (val: string) => void;
  searchDate: string;
  setSearchDate: (val: string) => void;
  onClear: () => void;
}

export const SearchDialog = memo(function SearchDialog({
  isOpen,
  onOpenChange,
  searchTitle,
  setSearchTitle,
  searchDate,
  setSearchDate,
  onClear,
}: SearchDialogProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("searchTasks")}</DialogTitle>
          <DialogDescription>{t("searchTasksDescription")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="searchTitle">{t("taskTitle")}</Label>
            <Input
              id="searchTitle"
              placeholder={t("taskTitlePlaceholder")}
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="searchDate">{t("searchDate")}</Label>
            <Input
              id="searchDate"
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between w-full">
          <Button variant="outline" onClick={onClear}>
            {t("clear")}
          </Button>
          <Button onClick={() => onOpenChange(false)}>{t("close")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
