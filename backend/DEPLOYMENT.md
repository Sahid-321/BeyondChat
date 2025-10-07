# Backend Vercel Deployment Guide

## 🚀 Deploy Backend to Vercel

### Step 1: Prepare Environment Variables
In Vercel dashboard, add these environment variables:

```env
MONGODB_URI=mongodb+srv://sahid:Hd5TKV4MzCy90RKm@ecommerce.qxk5j1r.mongodb.net/beyondchat?retryWrites=true&w=majority
OPENROUTER_API_KEY=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
PORT=5000
NODE_ENV=production
```

### Step 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. **Important**: Set Root Directory to `backend`
5. Framework Preset: `Other`
6. Build Command: `npm install`
7. Output Directory: Leave empty
8. Install Command: `npm install`

### Step 3: Verify Deployment

After deployment, test these endpoints:
- `https://your-backend.vercel.app/` - Should return API running message
- `https://your-backend.vercel.app/api/health` - Should return health status

### Step 4: Update Frontend API URL

If deploying frontend separately, update the API base URL in your frontend to point to your Vercel backend URL.

## ✅ What's Fixed:

1. **Package.json** - Updated to use `server.js` as main entry point
2. **Vercel.json** - Configured for serverless deployment with proper routing
3. **Server.js** - Modified to export as serverless function with database connection caching
4. **Environment** - Set up for production deployment with error handling

Your backend should now deploy successfully on Vercel! 🎯
