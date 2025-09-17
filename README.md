# PulseVest - Creative Project Funding Platform

A real-time platform where creators can upload their projects and fans/investors can discover and support them.

## Quick Setup

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Run setup script:**
   \`\`\`bash
   npm run setup
   \`\`\`

3. **Configure environment variables:**
   Update `.env.local` with your actual credentials:
   - MongoDB connection string
   - Cloudinary credentials

4. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

## Features

- **Creator Dashboard**: Upload projects with AI analysis
- **Fan Discovery**: Browse and support projects in real-time
- **Investor Portal**: Track and invest in promising projects
- **Real-time Updates**: Projects appear instantly across all dashboards

## Environment Variables

\`\`\`env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
\`\`\`

## Troubleshooting

If you encounter MongoDB installation issues on Windows:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. The simplified MongoDB configuration should resolve native dependency issues
