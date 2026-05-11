// Simple script to create a square icon for Tauri
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const width = 1024;
const height = 1024;

// Create a Minecraft-themed gradient icon
// Using emerald and cyan colors from the app theme
console.log('Creating app icon...');

// Create SVG with gradient
const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#grad)" />
  <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="180" font-weight="bold" 
        fill="white" text-anchor="middle" dominant-baseline="middle">MCSR</text>
  <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="80" 
        fill="rgba(255,255,255,0.9)" text-anchor="middle" dominant-baseline="middle">Ranked</text>
</svg>
`;

// Ensure icons directory exists
const iconsDir = path.join(__dirname, '..', 'src-tauri', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Convert SVG to PNG
sharp(Buffer.from(svg))
  .png()
  .toFile(path.join(iconsDir, 'app-icon.png'))
  .then(() => {
    console.log('✅ Created app-icon.png');
    console.log('Generating Tauri icons...');
    
    // Generate Tauri icons using the CLI
    const { execSync } = require('child_process');
    try {
      execSync(`npx @tauri-apps/cli icon ${path.join(iconsDir, 'app-icon.png')} -o ${iconsDir}`, {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log('\n✅ All Tauri icons generated successfully!');
    } catch (error) {
      console.error('\n❌ Error generating Tauri icons:', error.message);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Error creating icon:', err.message);
    process.exit(1);
  });
