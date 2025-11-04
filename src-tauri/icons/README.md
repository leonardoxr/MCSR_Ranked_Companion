# Tauri Icons

Place your app icons in this directory. The following files are required:

## Required Icons

- `32x32.png` - 32x32 pixel PNG icon
- `128x128.png` - 128x128 pixel PNG icon  
- `128x128@2x.png` - 256x256 pixel PNG icon (for Retina displays)
- `icon.icns` - macOS icon bundle
- `icon.ico` - Windows icon file

## Generating Icons

You can generate these icons from a single source image using:

1. **Tauri Icon Generator** (recommended):
   ```bash
   npx @tauri-apps/cli icon path/to/your-icon.png
   ```

2. **Online Tools**:
   - Convert PNG to ICO: https://convertio.co/png-ico/
   - Convert PNG to ICNS: https://cloudconvert.com/png-to-icns

3. **Manual Creation**:
   - Use image editing software (GIMP, Photoshop, etc.)
   - Export at the required sizes
   - Use icon conversion tools for `.ico` and `.icns` formats

## Temporary Solution

For development, you can temporarily use the Next.js favicon or create simple placeholder icons. The app will still run, but you'll need proper icons for production builds.

