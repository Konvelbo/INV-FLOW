const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function run() {
  const projectRoot = path.resolve(__dirname, "..");
  const apiDir = path.join(projectRoot, "app", "api");
  const apiTempDir = path.join(projectRoot, "app", ".tmp_api");
  let apiMoved = false;

  console.log("🚀 Starting Electron Build Process...");

  try {
    // 1. Cleanup old build artifacts
    if (fs.existsSync(path.join(projectRoot, "out"))) {
      console.log("🧹 Cleaning up old out/ directory...");
      fs.rmSync(path.join(projectRoot, "out"), {
        recursive: true,
        force: true,
      });
    }
    if (fs.existsSync(path.join(projectRoot, ".next"))) {
      console.log("🧹 Cleaning up .next/ cache...");
      fs.rmSync(path.join(projectRoot, ".next"), {
        recursive: true,
        force: true,
      });
    }

    // 2. Temporarily move API routes (Next.js static export doesn't support them)
    if (fs.existsSync(apiDir)) {
      console.log("📦 Temporarily moving app/api to app/_api...");
      fs.renameSync(apiDir, apiTempDir);
      apiMoved = true;
    }

    // 3. Generate Prisma Client
    console.log("💎 Generating Prisma client...");
    execSync("npx prisma generate", { stdio: "inherit", cwd: projectRoot });

    // 4. Run Next.js Export
    console.log("🏗️ Running Next.js build (static export)...");
    execSync("npx next build", { stdio: "inherit", cwd: projectRoot });

    console.log("✅ Next.js build completed successfully.");
  } catch (error) {
    console.error("❌ Build failed:", error.message);
    process.exit(1);
  } finally {
    // 5. Restore API routes
    if (apiMoved && fs.existsSync(apiTempDir)) {
      console.log("↩️ Restoring app/api from app/_api...");
      fs.renameSync(apiTempDir, apiDir);
    }
  }
}

run();
