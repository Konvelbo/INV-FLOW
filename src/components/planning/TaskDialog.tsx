"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

export function TaskDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  onSuggestSlot,
  initialValues,
  onDelete,
}: TaskDialogProps) {
  const { dict } = useLang();
  const [form, setForm] = useState<TaskFormValues>({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    priority: "medium",
    status: "todo",
    category: "work",
  });

  useEffect(() => {
    if (initialValues) {
      setForm(initialValues);
    } else {
      setForm({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        priority: "medium",
        status: "todo",
        category: "work",
      });
    }
  }, [initialValues, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = todoSchema.safeParse({
      ...form,
      startTime: form.startTime || null,
      endTime: form.endTime || null,
    });

    if (!result.success) {
      const firstError = result.error.errors[0].message;
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
          <DialogTitle>
            {initialValues?.id ? "Modifier la tâche" : dict.addTask}
          </DialogTitle>
          {!initialValues?.id && onSuggestSlot && (
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={handleSuggest}
              className="text-xs text-primary font-bold"
            >
              Suggérer un créneau libre
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
              placeholder="Ex : Réunion de projet"
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description détaillée</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Ajoutez des détails sur cette tâche..."
              className="resize-none h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startTime">Heure de début</Label>
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
              <Label htmlFor="endTime">Heure de fin</Label>
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
              <Label>Priorité</Label>
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
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Catégorie</Label>
              <Select
                value={form.category}
                onValueChange={(val) => setForm({ ...form, category: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Travail</SelectItem>
                  <SelectItem value="personal">Personnel</SelectItem>
                  <SelectItem value="study">Études</SelectItem>
                  <SelectItem value="sport">Sport</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Statut</Label>
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
                <SelectItem value="todo">À faire</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="done">Terminé</SelectItem>
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
                Supprimer
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
                Annuler
              </Button>
              <Button type="submit" disabled={!form.title.trim()}>
                Enregistrer
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
