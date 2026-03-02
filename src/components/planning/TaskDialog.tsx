"use client";

import React, { useState, memo } from "react";
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
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useLanguage as useLang } from "@/src/context/LanguageContext";
import { todoSchema } from "@/lib/validations";
import { toast } from "react-hot-toast";

export interface TaskFormValues {
  id?: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "done";
  category: string;
}

interface TaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TaskFormValues) => void;
  onSuggestSlot?: () => { start: string; end: string } | null;
  initialValues?: TaskFormValues | null;
  onDelete?: (id: string) => void;
}

export const TaskDialog = memo(function TaskDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  onSuggestSlot,
  initialValues,
  onDelete,
}: TaskDialogProps) {
  const { dict, t } = useLang();
  const [form, setForm] = useState<TaskFormValues>({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    priority: "medium",
    status: "todo",
    category: "work",
  });

  const [prevInitialValues, setPrevInitialValues] = useState(initialValues);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (initialValues !== prevInitialValues || isOpen !== prevIsOpen) {
    setPrevInitialValues(initialValues);
    setPrevIsOpen(isOpen);
    setForm(
      initialValues
        ? {
            ...initialValues,
            startTime: initialValues.startTime?.slice(0, 16) || "",
            endTime: initialValues.endTime?.slice(0, 16) || "",
          }
        : {
            title: "",
            description: "",
            startTime: "",
            endTime: "",
            priority: "medium",
            status: "todo",
            category: "work",
          },
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = todoSchema.safeParse({
      ...form,
      startTime: form.startTime || null,
      endTime: form.endTime || null,
    });

    if (!result.success) {
      const firstError = result.error.issues[0].message;
      toast.error(firstError);
      return;
    }

    onSubmit(form);
    onOpenChange(false);
  };

  const handleSuggest = () => {
    if (onSuggestSlot) {
      const slot = onSuggestSlot();
      if (slot) {
        setForm({ ...form, startTime: slot.start, endTime: slot.end });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <DialogTitle>
              {initialValues?.id ? dict.editTask : dict.addTask}
            </DialogTitle>
            <DialogDescription>{t("taskDialogDescription")}</DialogDescription>
          </div>
          {!initialValues?.id && onSuggestSlot && (
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={handleSuggest}
              className="text-xs text-primary font-bold"
            >
              {dict.suggestFreeSlot}
            </Button>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">{dict.taskTitle}</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder={dict.taskTitlePlaceholder}
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">{dict.taskDescriptionLabel}</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder={dict.taskDescriptionPlaceholder}
              className="resize-none h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startTime">{dict.startTimeLabel}</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={form.startTime}
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endTime">{dict.endTimeLabel}</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>{dict.priorityLabel}</Label>
              <Select
                value={form.priority}
                onValueChange={(val: "low" | "medium" | "high") =>
                  setForm({ ...form, priority: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{dict.lowPriority}</SelectItem>
                  <SelectItem value="medium">{dict.mediumPriority}</SelectItem>
                  <SelectItem value="high">{dict.highPriority}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>{dict.categoryLabel}</Label>
              <Select
                value={form.category}
                onValueChange={(val) => setForm({ ...form, category: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">{dict.workCategory}</SelectItem>
                  <SelectItem value="personal">
                    {dict.personalCategory}
                  </SelectItem>
                  <SelectItem value="study">{dict.studyCategory}</SelectItem>
                  <SelectItem value="sport">{dict.sportCategory}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>{dict.statusLabel}</Label>
            <Select
              value={form.status}
              onValueChange={(val: "todo" | "in_progress" | "done") =>
                setForm({ ...form, status: val })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">{dict.todoStatus}</SelectItem>
                <SelectItem value="in_progress">
                  {dict.inProgressStatus}
                </SelectItem>
                <SelectItem value="done">{dict.doneStatus}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4 flex items-center justify-between sm:justify-between w-full">
            {initialValues?.id ? (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (onDelete && initialValues.id) {
                    onDelete(initialValues.id);
                    onOpenChange(false);
                  }
                }}
                className="bg-rose-500 hover:bg-rose-600"
              >
                {t("delete")}
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {dict.cancel}
              </Button>
              <Button type="submit" disabled={!form.title.trim()}>
                {dict.save}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});
