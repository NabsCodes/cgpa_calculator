/* eslint-disable @typescript-eslint/no-require-imports */
// Script to generate PWA icons from the existing app icon
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Sizes for PWA icons
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Source icon path
const sourceIcon = path.join(__dirname, "../src/app/icon.png");

// Destination directory
const destDir = path.join(__dirname, "../public/icons");

// Ensure the destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Generate icons for each size
async function generateIcons() {
  try {
    console.log("Generating PWA icons...");

    // Check if source icon exists
    if (!fs.existsSync(sourceIcon)) {
      console.error(`Source icon not found at ${sourceIcon}`);
      console.log("Trying fallback to favicon...");

      // Try using favicon as fallback
      const faviconPath = path.join(__dirname, "../src/app/favicon.ico");

      if (!fs.existsSync(faviconPath)) {
        throw new Error(
          "Neither icon.png nor favicon.ico found. Cannot generate PWA icons.",
        );
      }

      // Use favicon as source
      await generateIconsFromSource(faviconPath);
    } else {
      // Use the original source
      await generateIconsFromSource(sourceIcon);
    }

    console.log("All PWA icons generated successfully!");
  } catch (error) {
    console.error("Error generating PWA icons:", error);
  }
}

async function generateIconsFromSource(source) {
  for (const size of sizes) {
    const fileName = `icon-${size}x${size}.png`;
    const destPath = path.join(destDir, fileName);

    await sharp(source).resize(size, size).toFile(destPath);

    console.log(`Generated ${fileName}`);
  }

  // Also create a standard apple-touch-icon
  await sharp(source)
    .resize(180, 180)
    .toFile(path.join(destDir, "apple-touch-icon.png"));

  console.log("Generated apple-touch-icon.png");
}

generateIcons();
