const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * This script handles the build process differently depending on the environment.
 * - On Vercel: Performs a standard Next.js build with API routes preserved.
 * - Local / Electron: Performs a static export build using the electron-build.js script.
 */

try {
  if (process.env.VERCEL) {
    console.log('🌐 Vercel environment detected. Running standard production build...');
    
    // 1. Prisma Generate
    console.log('💎 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // 2. Next Build
    console.log('🏗️ Building Next.js application...');
    execSync('next build', { stdio: 'inherit' });
    
  } else {
    console.log('🖥️ Local/Electron environment detected. Running static export build...');
    
    // Require and run the specialized electron build script
    const electronBuildScript = path.join(__dirname, 'electron-build.js');
    if (fs.existsSync(electronBuildScript)) {
        require(electronBuildScript);
    } else {
        console.error('❌ Error: scripts/electron-build.js not found.');
        process.exit(1);
    }
  }
} catch (error) {
  console.error('❌ Build Switch Command failed:', error.message);
  process.exit(1);
}
