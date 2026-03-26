/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("../src/p_client");
const prisma = new PrismaClient();
const { Resend } = require("resend");
const bcrypt = require("bcryptjs");
const { generateExcel } = require("./excel-service");
require("dotenv").config();
const InvoiceEmail = require("../src/components/emails/InvoiceEmail.js");

// Initialize Resend (API key should be in .env)
const resendAPIKey = process.env.RESEND_API_KEY;

const resend = new Resend(resendAPIKey);

const getOTPEmailHtml = (otp, lang = "fr") => {
  const isEn = lang === "en";
  const title = isEn ? "Password Recovery" : "Récupération de mot de passe";
  const hello = isEn ? "Hello," : "Bonjour,";
  const intro = isEn
    ? "You requested to reset your password on ESSOR. Here is your verification code (OTP):"
    : "Vous avez demandé la réinitialisation de votre mot de passe sur ESSOR. Voici votre code de vérification (OTP) :";
  const validFor = isEn
    ? "This code is valid for 10 minutes. If you did not make this request, you can safely ignore this email."
    : "Ce code est valable pendant 10 minutes. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité.";
  const footer = isEn
    ? "ESSOR ARCHITECTURE - Security & Performance."
    : "ESSOR ARCHITECTURE - Sécurité & Performance.";

  return `
    <div style="font-family: sans-serif; background-color: #f6f9fc; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e1e8f0;">
        <div style="background-color: #0f172a; padding: 40px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.025em;">${title}</h1>
        </div>
        <div style="padding: 40px;">
          <p style="color: #1e293b; font-size: 18px; font-weight: 600; margin-bottom: 16px;">${hello}</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">${intro}</p>
          <div style="background-color: #f8fafc; padding: 32px; border-radius: 16px; text-align: center; margin: 32px 0; border: 2px dashed #e2e8f0;">
            <p style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #0f172a; margin: 0; font-family: monospace;">${otp}</p>
          </div>
          <p style="color: #94a3b8; font-size: 14px; text-align: center; margin-bottom: 0;">${validFor}</p>
        </div>
        <div style="padding: 24px; text-align: center; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 12px; font-weight: 600; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">${footer}</p>
        </div>
      </div>
    </div>
  `;
};

const sanitizeError = (error) => {
  const message = error.message || "Une erreur est survenue";
  console.error("Original Error:", error);

  if (
    message.includes("Prisma") ||
    message.includes("database") ||
    message.includes("invocation")
  ) {
    if (message.includes("Unique constraint"))
      return "Cet élément existe déjà.";
    if (message.includes("Foreign key constraint"))
      return "Action impossible : cet élément est lié à d'autres données.";
    return "Une erreur de base de données est survenue.";
  }
  return message;
};

const getActiveCompanyId = async (userId) => {
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { activeCompanyId: true },
  });
  return user?.activeCompanyId || null;
};

// Ported from lib/data-fetching/
const handlers = {
  dashboard: async (userId, companyId) => {
    const activeId = companyId || (await getActiveCompanyId(userId));
    const where = { userId };
    if (activeId) {
      where.companyId = activeId;
    }

    const whereInvoice = { ...where, type: "invoice" };
    const whereExpense = { ...where };
    const whereTodo = { userId };

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const currentYearStart = new Date(currentYear, 0, 1);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const targetCompanyId = companyId || (await getActiveCompanyId(userId));

    const [
      activeCompany,
      revenuesThisMonth,
      revenuesLastMonth,
      revenuesThisYear,
      unpaidInvoicesStats,
      revenuesScaledThisMonth,
      revenuesScaledLastMonth,
      revenuesScaledAllTime,
      revenuesNonScaledAllTime,
      recentInvoices,
      unpaidInvoices,
      chartInvoices,
      chartExpenses,
      todos,
      activeClientsCount,
      expensesThisMonth,
      expensesThisYear,
      recentProducts,
    ] = await Promise.all([
      targetCompanyId
        ? prisma.company.findUnique({ where: { id: targetCompanyId } })
        : Promise.resolve(null),
      prisma.invoice.aggregate({
        where: {
          ...whereInvoice,
          createdAt: { gte: currentMonthStart },
          OR: [{ status: "paid" }, { isScaled: true }],
        },
        _sum: { totalTTC: true, totalHT: true },
      }),
      prisma.invoice.aggregate({
        where: {
          ...whereInvoice,
          createdAt: { gte: lastMonthStart, lt: currentMonthStart },
          OR: [{ status: "paid" }, { isScaled: true }],
        },
        _sum: { totalTTC: true, totalHT: true },
      }),
      prisma.invoice.aggregate({
        where: {
          ...whereInvoice,
          createdAt: { gte: currentYearStart },
          OR: [{ status: "paid" }, { isScaled: true }],
        },
        _sum: { totalTTC: true, totalHT: true },
      }),
      prisma.invoice.aggregate({
        where: {
          ...whereInvoice,
          status: { in: ["pending", "overdue", "draft"] },
        },
        _sum: { totalTTC: true, totalHT: true },
        _count: true,
      }),
      prisma.invoice.aggregate({
        where: {
          ...whereInvoice,
          createdAt: { gte: currentMonthStart },
          isScaled: true,
        },
        _sum: { totalTTC: true, totalHT: true },
      }),
      prisma.invoice.aggregate({
        where: {
          ...whereInvoice,
          createdAt: { gte: lastMonthStart, lt: currentMonthStart },
          isScaled: true,
        },
        _sum: { totalTTC: true, totalHT: true },
      }),
      prisma.invoice.aggregate({
        where: { ...whereInvoice, isScaled: true },
        _sum: { totalTTC: true, totalHT: true },
        _count: true,
      }),
      prisma.invoice.aggregate({
        where: {
          ...whereInvoice,
          OR: [{ status: { in: ["pending", "draft"] } }, { isScaled: false }],
        },
        _sum: { totalTTC: true, totalHT: true },
        _count: true,
      }),
      prisma.invoice.findMany({
        where: whereInvoice,
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          reference: true,
          clientName: true,
          totalHT: true,
          status: true,
          isScaled: true,
          createdAt: true,
        },
      }),
      prisma.invoice.findMany({
        where: {
          ...whereInvoice,
          status: { in: ["pending", "overdue", "draft"] },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.invoice.findMany({
        where: {
          ...whereInvoice,
          createdAt: { gte: sixMonthsAgo },
          OR: [{ status: "paid" }, { isScaled: true }],
        },
        select: { createdAt: true, totalTTC: true, totalHT: true },
      }),
      prisma.expense.findMany({
        where: { ...whereExpense, date: { gte: sixMonthsAgo } },
        select: { date: true, amount: true },
      }),
      prisma.todo.findMany({
        where: whereTodo,
        orderBy: { startTime: "asc" },
      }),
      prisma.client.count({
        where: { userId, ...(activeId ? { companyId: activeId } : {}) },
      }),
      prisma.expense.aggregate({
        where: { ...whereExpense, date: { gte: currentMonthStart } },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.expense.aggregate({
        where: { ...whereExpense, date: { gte: currentYearStart } },
        _sum: { amount: true },
      }),
      prisma.product.findMany({
        where: { ...where, userId },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    // Chart Data Processing
    const monthlyData = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthYear = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
      monthlyData[monthYear] = { revenue: 0, expenses: 0 };
    }

    chartInvoices.forEach((inv) => {
      const d = new Date(inv.createdAt);
      const m = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
      if (monthlyData[m]) {
        monthlyData[m].revenue += inv.totalTTC || inv.totalHT || 0;
      }
    });

    chartExpenses.forEach((exp) => {
      const d = new Date(exp.date);
      const m = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
      if (monthlyData[m]) {
        monthlyData[m].expenses += exp.amount;
      }
    });

    const chartData = Object.keys(monthlyData).map((month) => ({
      name: month,
      Revenus: monthlyData[month].revenue,
      Dépenses: monthlyData[month].expenses,
      Profit: monthlyData[month].revenue - monthlyData[month].expenses,
    }));

    return {
      revenuesThisMonth:
        revenuesThisMonth._sum.totalTTC || revenuesThisMonth._sum.totalHT || 0,
      revenuesLastMonth:
        revenuesLastMonth._sum.totalTTC || revenuesLastMonth._sum.totalHT || 0,
      revenuesThisYear:
        revenuesThisYear._sum.totalTTC || revenuesThisYear._sum.totalHT || 0,
      unpaidInvoicesTotal:
        unpaidInvoicesStats._sum.totalTTC ||
        unpaidInvoicesStats._sum.totalHT ||
        0,
      unpaidInvoicesCount: unpaidInvoicesStats._count,
      activeClientsCount,
      expensesThisMonth: expensesThisMonth._sum.amount || 0,
      expensesCountThisMonth: expensesThisMonth._count,
      profitThisMonth:
        (revenuesThisMonth._sum.totalTTC ||
          revenuesThisMonth._sum.totalHT ||
          0) - (expensesThisMonth._sum.amount || 0),
      profitThisYear:
        (revenuesThisYear._sum.totalTTC || revenuesThisYear._sum.totalHT || 0) -
        (expensesThisYear._sum.amount || 0),
      recentInvoices: recentInvoices.map((inv) => ({
        ...inv,
        clientName: inv.clientName || "",
        totalHT: inv.totalHT || 0,
        isScaled: inv.isScaled || false,
        createdAt: inv.createdAt ? inv.createdAt.toISOString() : "",
      })),
      revenuesScaledThisMonth:
        revenuesScaledThisMonth._sum.totalTTC ||
        revenuesScaledThisMonth._sum.totalHT ||
        0,
      revenuesScaledLastMonth:
        revenuesScaledLastMonth._sum.totalTTC ||
        revenuesScaledLastMonth._sum.totalHT ||
        0,
      revenuesScaledAllTime:
        revenuesScaledAllTime._sum.totalTTC ||
        revenuesScaledAllTime._sum.totalHT ||
        0,
      countScaledAllTime: revenuesScaledAllTime._count,
      revenuesScaledThisYear: 0,
      lastScaledInvoiceAmount: 0,
      secondLastScaledInvoiceAmount: 0,
      revenuesNonScaledAllTime:
        revenuesNonScaledAllTime._sum.totalTTC ||
        revenuesNonScaledAllTime._sum.totalHT ||
        0,
      countNonScaledAllTime: revenuesNonScaledAllTime._count,
      recentProducts: recentProducts.map((p) => ({
        ...p,
        createdAt: p.createdAt ? p.createdAt.toISOString() : null,
      })),
      unpaidInvoices: unpaidInvoices.map((inv) => ({
        ...inv,
        createdAt: inv.createdAt ? inv.createdAt.toISOString() : "",
      })),
      chartData,
      todos: todos.map((t) => ({
        ...t,
        startTime: t.startTime ? t.startTime.toISOString() : null,
        endTime: t.endTime ? t.endTime.toISOString() : null,
        createdAt: t.createdAt ? t.createdAt.toISOString() : null,
      })),
      activeCompanyName: activeCompany?.name || null,
    };
  },

  clients: async (userId, companyId) => {
    const activeId = companyId || (await getActiveCompanyId(userId));
    const where = { userId };
    if (activeId) where.companyId = activeId;

    const clients = await prisma.client.findMany({
      where,
      include: {
        company: true,
        invoices: {
          select: {
            status: true,
            totalTTC: true,
            totalHT: true,
            isScaled: true,
          },
        },
        _count: {
          select: { invoices: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return clients.map((client) => {
      const totalSpent = client.invoices
        .filter((inv) => inv.status === "paid" || inv.isScaled)
        .reduce((acc, inv) => acc + (inv.totalTTC || inv.totalHT || 0), 0);

      const paidInvoicesCount = client.invoices.filter(
        (inv) => inv.status === "paid" || inv.isScaled,
      ).length;
      const unpaidInvoicesCount = client.invoices.filter((inv) =>
        ["pending", "overdue", "draft"].includes(inv.status),
      ).length;

      const { invoices, ...rest } = client;
      return {
        ...rest,
        totalSpent,
        paidInvoicesCount,
        unpaidInvoicesCount,
        createdAt: client.createdAt ? client.createdAt.toISOString() : null,
      };
    });
  },

  products: async (userId, companyId) => {
    const activeId = companyId || (await getActiveCompanyId(userId));
    const where = { userId };
    if (activeId) where.companyId = activeId;

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return products.map((p) => ({
      ...p,
      createdAt: p.createdAt ? p.createdAt.toISOString() : null,
    }));
  },

  expenses: async (userId, companyId) => {
    const activeId = companyId || (await getActiveCompanyId(userId));
    const where = { userId };
    if (activeId) where.companyId = activeId;

    const [expenses, companies] = await Promise.all([
      prisma.expense.findMany({
        where,
        orderBy: { date: "desc" },
      }),
      prisma.company.findMany({
        where: { userId },
      }),
    ]);

    return {
      expenses: expenses.map((e) => ({
        ...e,
        date: e.date ? e.date.toISOString() : null,
        createdAt: e.createdAt ? e.createdAt.toISOString() : null,
      })),
      companies,
    };
  },

  invoices: async (userId, id = null, passedCompanyId = null) => {
    if (id) {
      // Single invoice for editor
      const invoice = await prisma.invoice.findFirst({
        where: { id, userId },
        include: {
          items: true,
          client: true,
          company: true,
        },
      });
      if (invoice) {
        return {
          ...invoice,
          createdAt: invoice.createdAt ? invoice.createdAt.toISOString() : null,
          dueDate: invoice.dueDate ? invoice.dueDate.toISOString() : null,
          items: invoice.items.map((item) => ({
            ...item,
            createdAt: item.createdAt ? item.createdAt.toISOString() : null,
          })),
        };
      }
      return null;
    } else {
      // List of invoices for history/dashboard
      const activeId = passedCompanyId || (await getActiveCompanyId(userId));
      const where = { userId };
      if (activeId) where.companyId = activeId;

      const invoices = await prisma.invoice.findMany({
        where,
        include: {
          client: true,
          company: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return invoices.map((inv) => ({
        ...inv,
        createdAt: inv.createdAt ? inv.createdAt.toISOString() : null,
        dueDate: inv.dueDate ? inv.dueDate.toISOString() : null,
      }));
    }
  },

  companies: async (userId) => {
    const [companies, totalInvoices, totalExpenses, totalClients] =
      await Promise.all([
        prisma.company.findMany({ where: { userId } }),
        prisma.invoice.aggregate({
          where: { userId, OR: [{ status: "paid" }, { isScaled: true }] },
          _sum: { totalTTC: true, totalHT: true },
        }),
        prisma.expense.aggregate({
          where: { userId },
          _sum: { amount: true },
        }),
        prisma.client.count({ where: { userId } }),
      ]);

    const rev = totalInvoices._sum.totalTTC || totalInvoices._sum.totalHT || 0;
    const exp = totalExpenses._sum.amount || 0;
    const net = rev - exp;

    return {
      companies,
      stats: {
        totalRevenue: Math.max(0, net),
        totalLoss: Math.abs(Math.min(0, net)),
        totalExpenses: exp,
        totalClients: totalClients,
      },
    };
  },

  getActiveCompany: async (userId) => {
    const activeId = await getActiveCompanyId(userId);
    if (!activeId) return null;
    return await prisma.company.findUnique({
      where: { id: activeId },
    });
  },
  export: async (userId, type, companyId) => {
    const whereClause = { userId };
    if (companyId) whereClause.companyId = companyId;

    let columns = [];
    let rows = [];
    let title = "Export";

    switch (type) {
      case "invoices":
        title = "Factures";
        columns = [
          { header: "Référence", key: "ref" },
          { header: "N°", key: "num" },
          { header: "Type", key: "type" },
          { header: "Statut", key: "status" },
          { header: "Date", key: "date" },
          { header: "Client", key: "client" },
          { header: "Total HT", key: "ht" },
          { header: "Total TTC", key: "ttc" },
          { header: "Payé", key: "paid" },
          { header: "Reste", key: "rem" },
          { header: "Échéance", key: "due" },
        ];
        const invoices = await prisma.invoice.findMany({
          where: whereClause,
          include: { client: true },
        });
        rows = invoices.map((i) => ({
          ref: i.reference,
          num: i.invoiceNumber,
          type: i.type === "invoice" ? "Facture" : "Devis",
          status: i.status,
          date: i.createdAt ? i.createdAt.toISOString().split("T")[0] : "",
          client: i.clientName || i.client?.name || "",
          ht: i.totalHT,
          ttc: i.totalTTC || i.totalHT,
          paid: i.paidAmount,
          rem: (i.totalTTC || i.totalHT) - i.paidAmount,
          due: i.dueDate ? i.dueDate.toISOString().split("T")[0] : "",
        }));
        break;
      case "clients":
        title = "Clients";
        columns = [
          { header: "Nom", key: "name" },
          { header: "Type", key: "type" },
          { header: "Statut", key: "status" },
          { header: "Email", key: "email" },
          { header: "Téléphone", key: "phone" },
          { header: "Ville", key: "city" },
          { header: "Pays", key: "country" },
          { header: "Total Payé", key: "spent" },
          { header: "Docs", key: "count" },
        ];
        const clients = await prisma.client.findMany({ where: whereClause });
        rows = clients.map((c) => ({
          name: c.name,
          type: c.type === "company" ? "Entreprise" : "Particulier",
          status: c.status || "Actif",
          email: c.email || "",
          phone: c.phone || "",
          city: c.city || "",
          country: c.country || "",
          spent: c.totalSpent || 0,
          count: c.paidInvoicesCount || 0,
        }));
        break;
      case "expenses":
        title = "Dépenses";
        columns = [
          { header: "Titre", key: "title" },
          { header: "Montant", key: "amount" },
          { header: "Catégorie", key: "cat" },
          { header: "Date", key: "date" },
          { header: "Description", key: "desc" },
        ];
        const expenses = await prisma.expense.findMany({ where: whereClause });
        rows = expenses.map((e) => ({
          title: e.title,
          amount: e.amount,
          cat: e.category,
          date: e.date.toISOString().split("T")[0],
          desc: e.description || "",
        }));
        break;
      case "products":
        title = "Catalogue";
        columns = [
          { header: "Nom", key: "name" },
          { header: "Prix HT", key: "price" },
          { header: "TVA (%)", key: "tax" },
          { header: "Unité", key: "unit" },
          { header: "Description", key: "desc" },
        ];
        const products = await prisma.product.findMany({ where: { userId } });
        rows = products.map((p) => ({
          name: p.name,
          price: p.price,
          tax: p.taxRate,
          unit: p.unit || "U",
          desc: p.description || "",
        }));
        break;
      case "overview":
        title = "Vue d'ensemble";
        columns = [
          { header: "Indicateur", key: "label" },
          { header: "Valeur", key: "value" },
        ];
        const statsRes = await handlers.companies(userId);
        rows = [
          { label: "Revenu Total", value: statsRes.stats.totalRevenue },
          { label: "Pertes Totales", value: statsRes.stats.totalLoss },
          { label: "Somme des Dépenses", value: statsRes.stats.totalExpenses },
          { label: "Total Clients", value: statsRes.stats.totalClients },
        ];
        break;
      default:
        throw new Error("Invalid export type");
    }

    if (rows.length === 0 && type !== "overview") return null;
    return await generateExcel(title, columns, rows);
  },

  history: async (userId) => {
    return await handlers.invoices(userId, null, null);
  },

  feedback: async (userId) => {
    return await prisma.feedback.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  planning: async (userId) => {
    const todos = await prisma.todo.findMany({
      where: { userId },
      orderBy: { startTime: "asc" },
    });
    return todos.map((t) => ({
      ...t,
      startTime: t.startTime ? t.startTime.toISOString() : null,
      endTime: t.endTime ? t.endTime.toISOString() : null,
      createdAt: t.createdAt ? t.createdAt.toISOString() : null,
    }));
  },

  management: async (userId, companyId) => {
    const [clients, products, expenses, companies] = await Promise.all([
      handlers.clients(userId, companyId),
      handlers.products(userId),
      handlers.expenses(userId),
      handlers.companies(userId),
    ]);
    return {
      clients,
      products,
      expenses: expenses.expenses,
      companies,
    };
  },
};
const sanitizeData = (data, excludeType = false) => {
  const { id, createdAt, updatedAt, userId, _id, ...rest } = data;
  if (excludeType) {
    delete rest.type;
  }
  // Sanitize empty strings for IDs
  if (rest.companyId === "") delete rest.companyId;
  return rest;
};

const actionHandlers = {
  companies: {
    create: async (userId, data) => {
      const validData = sanitizeData(data, true);
      return await prisma.company.create({
        data: {
          ...validData,
          userId,
          annualRevenue: validData.annualRevenue
            ? parseFloat(validData.annualRevenue)
            : null,
          monthlyRevenue: validData.monthlyRevenue
            ? parseFloat(validData.monthlyRevenue)
            : null,
          employeeCount: validData.employeeCount
            ? parseInt(validData.employeeCount, 10)
            : null,
        },
      });
    },
    update: async (userId, id, data) => {
      const validData = sanitizeData(data, true);
      return await prisma.company.update({
        where: { id, userId },
        data: {
          ...validData,
          annualRevenue: validData.annualRevenue
            ? parseFloat(validData.annualRevenue)
            : null,
          monthlyRevenue: validData.monthlyRevenue
            ? parseFloat(validData.monthlyRevenue)
            : null,
          employeeCount: validData.employeeCount
            ? parseInt(validData.employeeCount, 10)
            : null,
        },
      });
    },
    delete: async (userId, id) => {
      return await prisma.company.delete({
        where: { id, userId },
      });
    },
    logo: async (userId, { image, companyId }) => {
      if (companyId) {
        const company = await prisma.company.update({
          where: { id: companyId, userId },
          data: { logoUrl: image },
        });
        return { success: true, logoUrl: company.logoUrl };
      }
      return { success: true, logoUrl: image };
    },
    setActive: async (userId, companyId) => {
      return await prisma.user.update({
        where: { id: userId },
        data: { activeCompanyId: companyId },
      });
    },
    getActive: async (userId) => {
      const activeId = await getActiveCompanyId(userId);
      if (!activeId) return null;
      return await prisma.company.findUnique({
        where: { id: activeId },
      });
    },
  },
  clients: {
    create: async (userId, data) => {
      const activeCompanyId = await getActiveCompanyId(userId);
      return await prisma.client.create({
        data: {
          ...sanitizeData(data, false),
          userId,
          companyId: data.companyId || activeCompanyId,
        },
      });
    },
    update: async (userId, id, data) => {
      return await prisma.client.update({
        where: { id, userId },
        data: sanitizeData(data, false),
      });
    },
    delete: async (userId, id) => {
      return await prisma.client.delete({
        where: { id, userId },
      });
    },
  },
  products: {
    create: async (userId, data) => {
      const activeCompanyId = await getActiveCompanyId(userId);
      return await prisma.product.create({
        data: {
          ...sanitizeData(data, false),
          userId,
          companyId: data.companyId || activeCompanyId,
        },
      });
    },
    update: async (userId, id, data) => {
      return await prisma.product.update({
        where: { id, userId },
        data: sanitizeData(data, false),
      });
    },
    delete: async (userId, id) => {
      return await prisma.product.delete({
        where: { id, userId },
      });
    },
  },
  expenses: {
    create: async (userId, data) => {
      const activeCompanyId = await getActiveCompanyId(userId);
      return await prisma.expense.create({
        data: {
          ...sanitizeData(data, true),
          userId,
          companyId: data.companyId || activeCompanyId,
          date: new Date(data.date),
        },
      });
    },
    update: async (userId, id, data) => {
      return await prisma.expense.update({
        where: { id, userId },
        data: {
          ...sanitizeData(data, true),
          date: data.date ? new Date(data.date) : undefined,
        },
      });
    },
    delete: async (userId, id) => {
      return await prisma.expense.delete({
        where: { id, userId },
      });
    },
  },
  invoices: {
    create: async (userId, data) => {
      // Logic from app/api/invoices/route.ts
      const { items, currencyCode, ...invoiceData } = sanitizeData(data, false);
      const activeCompanyId = await getActiveCompanyId(userId);

      // Enforce status logic: Simplified to Draft, Paid, Pending
      if (invoiceData.status === "paid" || invoiceData.isScaled === true) {
        invoiceData.status = "paid";
        invoiceData.isScaled = true;
      } else if (invoiceData.status === "draft") {
        invoiceData.status = "draft";
        invoiceData.isScaled = false;
      } else {
        invoiceData.status = "pending";
        invoiceData.isScaled = false;
      }

      return await prisma.invoice.create({
        data: {
          ...invoiceData,
          userId,
          companyId: invoiceData.companyId || activeCompanyId,
          dueDate: invoiceData.dueDate ? new Date(invoiceData.dueDate) : null,
          items: {
            create: (items || []).map((item) => ({
              designation: item.designation,
              unit: item.unit || "U",
              quantity: Number(item.quantity),
              unitPrice: Number(item.unitPrice),
              totalPrice: Number(item.totalPrice),
              productId: item.productId || null,
            })),
          },
        },
      });
    },
    send: async (userId, invoiceId, targetEmail) => {
      try {
        if (!targetEmail) {
          throw new Error(
            "Please provide a valid email address to send the invoice !",
          );
        }

        const invoice = await prisma.invoice.findFirst({
          where: {
            id: invoiceId,
            userId: userId,
          },
          include: {
            author: true,
          },
        });

        if (!invoice) {
          throw new Error("Invoice not found !");
        }

        const appUrl =
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const downloadLink = `${appUrl}/api/public/download/${invoice.id}`;

        // On utilise la dépendance resend pour envoyer l'email
        const { render } = await import("@react-email/components");
        const emailHtml = await render(
          InvoiceEmail({
            clientName: invoice.clientName,
            invoiceReference: invoice.reference,
            downloadLink: downloadLink,
            senderName: invoice.author.name || "Votre Partenaire",
            amount: invoice.totalTTC
              ? `${invoice.totalTTC} XOF`
              : `${invoice.totalHT} XOF`,
            invoiceId: invoice.id,
          }),
        );

        const data = await resend.emails.send({
          from: "ProFacture <onboarding@resend.dev>",
          to: [targetEmail],
          subject: `Nouvelle Facture ${invoice.reference}`,
          html: emailHtml,
        });

        return { success: true, data };
      } catch (error) {
        console.error("Erreur d'envoi d'e-mail:", error);
        throw error;
      }
    },
    update: async (userId, id, data) => {
      // Logic from app/api/invoices/[id]/route.ts (PUT)
      const { items, currencyCode, ...invoiceData } = sanitizeData(data, false);

      // Enforce status logic
      if (invoiceData.isScaled === true) {
        invoiceData.status = "paid";
      } else if (invoiceData.isScaled === false) {
        if (invoiceData.status !== "draft") {
          invoiceData.status = "pending";
        }
      }
      if (invoiceData.status === "draft") {
        invoiceData.isScaled = false;
      }

      const updatePayload = {
        ...invoiceData,
        dueDate: invoiceData.dueDate ? new Date(invoiceData.dueDate) : null,
      };

      if (items) {
        updatePayload.items = {
          deleteMany: {},
          create: items.map((item) => ({
            designation: item.designation,
            unit: item.unit || "U",
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            totalPrice: Number(item.totalPrice),
            productId: item.productId || null,
          })),
        };
      }

      return await prisma.invoice.update({
        where: { id, userId },
        data: updatePayload,
      });
    },
    patch: async (userId, id, data) => {
      // Enforce logic for patches too
      const invoice = await prisma.invoice.findUnique({
        where: { id, userId },
      });
      if (!invoice) throw new Error("Facture non trouvée");

      const updateData = { ...data };
      const currentStatus = updateData.status ?? invoice.status;
      const currentIsScaled = updateData.isScaled ?? invoice.isScaled;

      if (currentStatus === "paid" || currentIsScaled === true) {
        updateData.status = "paid";
        updateData.isScaled = true;
      } else if (currentStatus === "draft") {
        updateData.status = "draft";
        updateData.isScaled = false;
      } else {
        updateData.status = "pending";
        updateData.isScaled = false;
      }

      return await prisma.invoice.update({
        where: { id, userId },
        data: updateData,
      });
    },
    delete: async (userId, id) => {
      return await prisma.invoice.delete({
        where: { id, userId },
      });
    },
  },
  feedback: {
    create: async (userId, data) => {
      const { content, rating, contactEmail } = data;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      
      // Save to Database
      await prisma.feedback.create({
        data: {
          content,
          rating: rating || 5,
          userId,
        }
      });
      
      const emailContent = `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Nouveau Retour Utilisateur</h2>
          <p><strong>Utilisateur:</strong> ${user?.name || 'Inconnu'} (${user?.email || 'Non renseigné'})</p>
          <p><strong>Email de contact:</strong> ${contactEmail || user?.email || 'Non renseigné'}</p>
          <p><strong>Sujet:</strong> <br/>Feedback - Note: ${rating}/5</p>
          <p><strong>Détails:</strong><br/> <div style="background:#f4f4f4;padding:10px;border-radius:5px;">${content}</div></p>
        </div>
      `;
      
      const toEmail = process.env.ADMIN_EMAIL || "contact@essor.com";
      
      try {
        const resendRes = await resend.emails.send({
          from: "Essor Feedback <onboarding@resend.dev>",
          to: [toEmail],
          replyTo: contactEmail || user?.email,
          subject: `Feedback Essor: Note ${rating}/5`,
          html: emailContent,
        });
        
        if (resendRes.error) {
          console.error("Resend Error:", resendRes.error);
          throw new Error(resendRes.error.message);
        }
      } catch (error) {
        console.error("Failed to send email via Resend:", error);
        // Fallback or explicit warning mechanism could be placed here
        // We still return success:true so the user sees the confirmation UI since the DB save succeeded
        // but throw an error? Let's just return success so user is happy, but log the error
        // Or throw error if they strictly want to know the email failed.
        // The user says "je veux que les feedback sois stocker en backend", so let's allow return success but attach a warning
        return { success: true, message: "Feedback saved to database, but email notification failed." };
      }
      
      return { success: true, message: "Feedback sent and saved!" };
    },
  },
  auth: {
    login: async ({ email, password }) => {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { companies: true },
      });
      if (!user) throw new Error("Utilisateur non trouvé");

      // Use bcrypt to compare password
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        throw new Error("Mot de passe incorrect");
      }

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    },
    register: async (data) => {
      // Hash password before saving
      const hashedPassword = bcrypt.hashSync(data.password, 10);
      const user = await prisma.user.create({
        data: { ...data, password: hashedPassword },
        include: { companies: true },
      });
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    },
    avatar: async (userId, { image }) => {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { avatar: image },
      });
      return { success: true, avatar: user.avatar };
    },
    forgotPassword: async (data) => {
      const { email, lang = "fr" } = data;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("Aucun utilisateur trouvé avec cet e-mail.");

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await prisma.user.update({
        where: { email },
        data: {
          resetOtp: otp,
          resetOtpExpiry: expiry,
        },
      });

      // Send Email via Resend
      const html = getOTPEmailHtml(otp, lang);
      const subject =
        lang === "en"
          ? "Verification Code - ESSOR"
          : "Code de vérification - ESSOR";

      try {
        const emailRes = await resend.emails.send({
          from: "ESSOR <onboarding@resend.dev>", // Replace with verified domain if possible
          to: email,
          subject: subject,
          html: html,
        });

        if (emailRes.error) {
          console.error("Resend Error:", emailRes.error);
          throw new Error("Erreur lors de l'envoi de l'email.");
        }

        return { success: true };
      } catch (err) {
        console.error("Email Sending Failed:", err);
        throw new Error("Erreur lors de l'envoi de l'email.");
      }
    },
    resetPassword: async (data) => {
      const { email, otp, newPassword } = data;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("Utilisateur non trouvé.");

      if (!user.resetOtp || user.resetOtp !== otp) {
        throw new Error("Code OTP invalide.");
      }

      if (!user.resetOtpExpiry || user.resetOtpExpiry < new Date()) {
        throw new Error("Code OTP expiré.");
      }

      // Update password and clear OTP
      const hashedPassword = bcrypt.hashSync(newPassword, 10);
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          resetOtp: null,
          resetOtpExpiry: null,
        },
      });

      return { success: true };
    },
  },
  planning: {
    create: async (userId, data) => {
      return await prisma.todo.create({
        data: {
          ...sanitizeData(data, true),
          userId,
          startTime: data.startTime ? new Date(data.startTime) : null,
          endTime: data.endTime ? new Date(data.endTime) : null,
        },
      });
    },
    update: async (userId, id, data) => {
      return await prisma.todo.update({
        where: { id, userId },
        data: {
          ...sanitizeData(data, true),
          startTime: data.startTime ? new Date(data.startTime) : undefined,
          endTime: data.endTime ? new Date(data.endTime) : undefined,
        },
      });
    },
    delete: async (userId, id) => {
      return await prisma.todo.delete({
        where: { id, userId },
      });
    },
  },
};

async function handleDataRequest(type, params) {
  if (handlers[type]) {
    try {
      const data = await handlers[type](...params);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: sanitizeError(error) };
    }
  }
  return { success: false, error: `Unknown handler type: ${type}` };
}

async function handleActionRequest(type, method, params) {
  if (actionHandlers[type] && actionHandlers[type][method]) {
    try {
      const data = await actionHandlers[type][method](...params);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: sanitizeError(error) };
    }
  }
  return {
    success: false,
    error: `Unknown action type/method: ${type}.${method}`,
  };
}

module.exports = { handleDataRequest, handleActionRequest };
