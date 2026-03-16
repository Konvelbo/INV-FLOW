export interface Insight {
  id: string;
  type: "opportunity" | "warning" | "tip";
  title: string;
  description: string;
}

export interface RecentInvoice {
  id: string;
  reference: string;
  clientName: string;
  totalHT: number;
  isScaled: boolean;
  createdAt: string;
}

export interface DashboardStats {
  revenuesThisMonth: number;
  revenuesThisYear: number;
  unpaidInvoicesTotal: number;
  activeClientsCount: number;
  expensesThisMonth: number;
  profitThisMonth: number;
  profitThisYear: number;
  chartData: Array<{
    name: string;
    Revenus: number;
    Dépenses: number;
    Profit: number;
  }>;
  recentInvoices: RecentInvoice[];
  unpaidInvoices: RecentInvoice[];
  unpaidInvoicesCount: number;
  revenuesScaledThisMonth: number;
  revenuesScaledThisYear: number;
  lastScaledInvoiceAmount: number;
  secondLastScaledInvoiceAmount: number;
  recentProducts: string[];
  currency?: string;
}

export interface Todo {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  startTime?: string | null;
  endTime?: string | null;
  priority?: "low" | "medium" | "high";
  category?: string;
}

export interface User {
  name: string;
  email: string;
  token: string;
}
