import { addWeeks, addMonths, addYears } from "date-fns";

/**
 * Calculates the next issue date based on the given frequency.
 * @param fromDate The starting date (usually now)
 * @param frequency The recurrence frequency (weekly, monthly, yearly)
 * @returns The next date for the invoice
 */
export function calculateNextIssueDate(fromDate: Date, frequency: string): Date {
  switch (frequency) {
    case "weekly":
      return addWeeks(fromDate, 1);
    case "monthly":
      return addMonths(fromDate, 1);
    case "yearly":
      return addYears(fromDate, 1);
    default:
      return addMonths(fromDate, 1); // Default to monthly if unknown
  }
}
