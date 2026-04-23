"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  rowKey: (row: T) => string;
  /** Render actions at the end of each row */
  renderActions?: (row: T) => React.ReactNode;
  /** Empty state message */
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  /** Label shown in "X row(s) selected out of Y" */
  selectedLabel?: string;
  rowsPerPageLabel?: string;
  pageLabel?: string;
  ofLabel?: string;
  defaultPageSize?: number;
  headerRowClassName?: string;
  onDeleteSelected?: (ids: string[]) => void;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export function DataTable<T>({
  data,
  columns,
  rowKey,
  renderActions,
  emptyMessage = "Aucune donnée",
  emptyIcon,
  selectedLabel,
  rowsPerPageLabel = "Lignes par page",
  pageLabel = "Page",
  ofLabel = "sur",
  defaultPageSize = 10,
  headerRowClassName,
  onDeleteSelected,
}: DataTableProps<T>) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const pagedData = useMemo(
    () => data.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [data, currentPage, pageSize],
  );

  // Reset to page 1 when data or pageSize changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data.length, pageSize]);

  const allPageSelected =
    pagedData.length > 0 && pagedData.every((row) => selected.has(rowKey(row)));

  const toggleAll = () => {
    if (allPageSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        pagedData.forEach((row) => next.delete(rowKey(row)));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        pagedData.forEach((row) => next.add(rowKey(row)));
        return next;
      });
    }
  };

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDeleteSelected = () => {
    if (onDeleteSelected) {
      onDeleteSelected(Array.from(selected));
      setSelected(new Set());
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-border/50 overflow-hidden bg-card shadow-sm">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={cn("border-b border-border/50", headerRowClassName)}>
              {/* Checkbox column */}
              <th className="w-12 px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-border text-primary accent-primary cursor-pointer"
                    aria-label="Sélectionner tout"
                  />
                  {selected.size > 0 && onDeleteSelected && (
                    <button
                      onClick={handleDeleteSelected}
                      className="p-1 rounded bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all animate-in zoom-in-50 duration-200"
                      title="Supprimer la sélection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap",
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </th>
              ))}
              {renderActions && (
                <th className="w-16 px-4 py-3 text-center" aria-label="Actions" />
              )}
            </tr>
          </thead>
          <tbody>
            {pagedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (renderActions ? 2 : 1)}
                  className="py-20 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-3">
                    {emptyIcon && (
                      <div className="opacity-30">{emptyIcon}</div>
                    )}
                    <p className="text-sm font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              pagedData.map((row, idx) => {
                const id = rowKey(row);
                const isSelected = selected.has(id);
                return (
                  <tr
                    key={id}
                    className={cn(
                      "border-b border-border/30 transition-colors duration-150",
                      isSelected
                        ? "bg-primary/5"
                        : idx % 2 === 0
                          ? "bg-transparent"
                          : "bg-muted/10",
                      "hover:bg-muted/20",
                    )}
                  >
                    <td className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(id)}
                        className="w-4 h-4 rounded border-border text-primary accent-primary cursor-pointer"
                        aria-label={`Sélectionner la ligne ${id}`}
                      />
                    </td>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-4 py-3 text-sm text-foreground",
                          col.className,
                        )}
                      >
                        {col.render ? col.render(row) : (row as any)[col.key]}
                      </td>
                    ))}
                    {renderActions && (
                      <td className="px-4 py-3 text-right">
                        {renderActions(row)}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-t border-border/30 bg-muted/20 text-xs text-muted-foreground">
        {/* Left: selection count */}
        <span className="font-medium shrink-0">
          {selected.size} {selectedLabel ?? "ligne(s) sélectionnée(s)"} {ofLabel}{" "}
          {data.length}.
        </span>

        {/* Right: rows per page + page navigation */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <span className="font-medium whitespace-nowrap">{rowsPerPageLabel}</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
              className="h-7 rounded border border-border/50 bg-background px-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {PAGE_SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Page info */}
          <span className="font-bold whitespace-nowrap">
            {pageLabel} {currentPage} {ofLabel} {totalPages}
          </span>

          {/* Navigation buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Première page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Page précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Page suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Dernière page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
