const fs = require("fs")
const path = require("path")

console.log("🚀 Setting up PulseVest...")

// Create .env.local file if it doesn't exist
const envPath = path.join(process.cwd(), ".env.local")
if (!fs.existsSync(envPath)) {
  const envTemplate = `# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string_here

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
`

  fs.writeFileSync(envPath, envTemplate)
  console.log("✅ Created .env.local template")
} else {
  console.log("✅ .env.local already exists")
}

console.log("🎉 Setup complete!")
console.log("\n📝 Next steps:")
console.log("1. Update .env.local with your actual credentials")
console.log("2. Run: npm run dev")
console.log("3. Visit: http://localhost:3000")
