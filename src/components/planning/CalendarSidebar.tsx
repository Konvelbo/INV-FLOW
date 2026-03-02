"use client";

import React from "react";
import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Plus, ChevronDown } from "lucide-react";
import { fr, enUS } from "date-fns/locale";
import { useLanguage } from "@/src/context/LanguageContext";

interface CalendarSidebarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onCreateClick: () => void;
  filterCompleted: boolean;
  setFilterCompleted: (val: boolean) => void;
}

export function CalendarSidebar({
  selectedDate,
  onDateSelect,
  onCreateClick,
  filterCompleted,
  setFilterCompleted,
}: CalendarSidebarProps) {
  const { t, language } = useLanguage();
  const locale = language === "fr" ? fr : enUS;

  return (
    <div className="w-64 flex flex-col p-4 space-y-8 bg-background">
      {/* Create Button */}
      <Button
        onClick={onCreateClick}
        className="w-fit px-6 py-6 rounded-full shadow-md hover:shadow-lg transition-all bg-background text-foreground border hover:bg-muted gap-3"
      >
        <Plus className="size-6 text-primary" />
        <span className="font-medium">{t("create")}</span>
        <ChevronDown className="size-4 text-muted-foreground ml-2" />
      </Button>

      {/* Mini Calendar */}
      <div className="w-full">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          locale={locale}
          className="rounded-md border-none p-0"
        />
      </div>

      {/* Task Categories / Filters */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold px-2">{t("myCalendars")}</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-3 px-2 py-1 rounded hover:bg-muted cursor-pointer transition-colors">
            <Checkbox
              id="completed-tasks"
              checked={filterCompleted}
              onCheckedChange={(checked) =>
                setFilterCompleted(checked === true)
              }
              className="border-primary data-[state=checked]:bg-primary"
            />
            <label
              htmlFor="completed-tasks"
              className="text-sm cursor-pointer select-none truncate"
            >
              {t("completedTasks")}
            </label>
          </div>
          <div className="flex items-center space-x-3 px-2 py-1 rounded hover:bg-muted cursor-pointer transition-colors">
            <Checkbox
              id="pending-tasks"
              defaultChecked
              className="border-blue-500 data-[state=checked]:bg-blue-500"
            />
            <label
              htmlFor="pending-tasks"
              className="text-sm cursor-pointer select-none truncate"
            >
              {t("reminders")}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
