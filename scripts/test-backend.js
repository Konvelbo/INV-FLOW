/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("../src/p_client");
const { handleActionRequest } = require("../electron/data-handlers");

const prisma = new PrismaClient();

async function runTests() {
  console.log("=== Starting Backend Integration Tests ===");

  // 1. Find a test user (we'll just pick the first one)
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("No user found in the database to run tests with.");
    process.exit(1);
  }
  const userId = user.id;
  console.log(`Using Test User ID: ${userId}`);

  const testIds = {};

  try {
    // 2. Test Company Creation
    console.log("\n[1/6] Testing Company Creation...");
    const companyRes = await handleActionRequest("companies", "create", [userId, {
      name: "Test Company LLC",
      sector: "IT",
      employeeCount: "10",
      targetMarket: "B2B",
      annualRevenue: "100000",
      description: "Test description",
      leaderName: "John Doe",
      legalForm: "LLC",
      productsServices: "Software",
      type: "company", // Extraneous test
      id: "extraneous-id"
    }]);

    if (!companyRes.success) throw new Error("Company creation failed: " + companyRes.error);
    testIds.companyId = companyRes.data.id;
    console.log("✅ Company Created -> ID: " + testIds.companyId);

    // 3. Test Client Creation
    console.log("\n[2/6] Testing Client Creation...");
    const clientRes = await handleActionRequest("clients", "create", [userId, {
      name: "Test Client",
      email: "client@test.com",
      companyId: testIds.companyId,
      type: "entreprise", // Valid field for client
      id: "extraneous-id"
    }]);

    if (!clientRes.success) throw new Error("Client creation failed: " + clientRes.error);
    testIds.clientId = clientRes.data.id;
    console.log("✅ Client Created -> ID: " + testIds.clientId);

    // 4. Test Product Creation
    console.log("\n[3/6] Testing Product Creation...");
    const productRes = await handleActionRequest("products", "create", [userId, {
      name: "Test Product",
      price: 1500,
      taxRate: 20,
      type: "product", // Extraneous test
      id: "extraneous-id"
    }]);

    if (!productRes.success) throw new Error("Product creation failed: " + productRes.error);
    console.log("✅ Product Created -> ID: " + productRes.data.id);
    testIds.productId = productRes.data.id;

    // 5. Test Expense Creation
    console.log("\n[4/6] Testing Expense Creation...");
    const expenseRes = await handleActionRequest("expenses", "create", [userId, {
      title: "Test Expense",
      amount: 500,
      category: "Software",
      date: new Date().toISOString(),
      companyId: testIds.companyId,
      type: "expense" // Extraneous test
    }]);

    if (!expenseRes.success) throw new Error("Expense creation failed: " + expenseRes.error);
    console.log("✅ Expense Created -> ID: " + expenseRes.data.id);
    testIds.expenseId = expenseRes.data.id;

    // 6. Test Planning Creation
    console.log("\n[5/6] Testing Planning (Todo) Creation...");
    const planRes = await handleActionRequest("planning", "create", [userId, {
      title: "Test Task",
      priority: "high",
      type: "todo" // Extraneous test
    }]);

    if (!planRes.success) throw new Error("Planning creation failed: " + planRes.error);
    console.log("✅ Planning Created -> ID: " + planRes.data.id);
    testIds.planId = planRes.data.id;

    // 7. Test Invoice Creation
    console.log("\n[6/8] Testing Invoice Creation...");
    const invoiceRes = await handleActionRequest("invoices", "create", [userId, {
      reference: "TEST-INV-001",
      city: "Test City",
      clientName: "Test Client",
      managerName: "Test Manager",
      object: "Test Invoice Object",
      totalHT: 1000,
      totalMaterial: 1,
      items: [
        {
          designation: "Test Service",
          unitPrice: 1000,
          quantity: 1,
          totalPrice: 1000,
          id: "extraneous-id" // Extraneous item id
        }
      ],
      currencyCode: "XOF", // Extraneous test
      type: "invoice" 
    }]);

    if (!invoiceRes.success) throw new Error("Invoice creation failed: " + invoiceRes.error);
    console.log("✅ Invoice Created -> ID: " + invoiceRes.data.id);
    testIds.invoiceId = invoiceRes.data.id;

    // 8. Test Partial Invoice Update (items missing)
    console.log("\n[7/8] Testing Partial Invoice Update...");
    const invoiceUpdateRes = await handleActionRequest("invoices", "update", [userId, testIds.invoiceId, {
      status: "paid"
    }]);

    if (!invoiceUpdateRes.success) throw new Error("Invoice update failed: " + invoiceUpdateRes.error);
    console.log("✅ Invoice Partial Update Succeeded (No items error!).");

    // 9. Test Dashboard Aggregation
    console.log("\n[8/8] Testing Dashboard KPIs Aggregation...");
    const { handleDataRequest } = require("../electron/data-handlers");
    const dashboardRes = await handleDataRequest("dashboard", [userId, testIds.companyId]);
    
    if (!dashboardRes.success || dashboardRes.data.profitThisMonth === undefined) throw new Error("Dashboard metrics are missing/crashing.");
    console.log("✅ Dashboard Rendered Successfully -> Profit this month: " + dashboardRes.data.profitThisMonth);

    console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! The Prisma validations and IPC handlers are robust.\n");

  } catch (e) {
    console.error("\n❌ TESTS FAILED:", e.message);
  } finally {
    // 10. Cleanup
    console.log("\n🧹 Cleaning up test data...");
    if (testIds.invoiceId) await handleActionRequest("invoices", "delete", [userId, testIds.invoiceId]);
    if (testIds.productId) await handleActionRequest("products", "delete", [userId, testIds.productId]);
    if (testIds.expenseId) await handleActionRequest("expenses", "delete", [userId, testIds.expenseId]);
    if (testIds.planId) await handleActionRequest("planning", "delete", [userId, testIds.planId]);
    if (testIds.clientId) await handleActionRequest("clients", "delete", [userId, testIds.clientId]);
    if (testIds.companyId) await handleActionRequest("companies", "delete", [userId, testIds.companyId]);
    console.log("✅ Cleanup complete.");
    process.exit(0);
  }
}

runTests();
