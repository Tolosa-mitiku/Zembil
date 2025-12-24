# 🚀 Frontend Deployment Guide (Vercel)

## ✅ Pre-Deployment Checklist

- [x] Build tested and working
- [x] TypeScript config optimized for production
- [x] Code pushed to GitHub main branch
- [x] Backend deployed at: `zembil-backend.vercel.app`

## 📋 Step-by-Step Deployment

### Step 1: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import `Tolosa-mitiku/Zembil` repository
4. Click **"Import"**

### Step 2: Configure Project Settings

| Setting              | Value                          |
| -------------------- | ------------------------------ |
| **Project Name**     | `zembil-web` (or your choice)  |
| **Framework Preset** | **Vite**                       |
| **Root Directory**   | `frontend/web` ← **CRITICAL!** |
| **Build Command**    | `npm run build` (default)      |
| **Output Directory** | `dist` (default)               |
| **Install Command**  | `npm install` (default)        |

**Important:** Click "Edit" next to "Root Directory" and set it to `frontend/web`

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add these **one by one**:

#### 🔴 Required - Backend Connection

```bash
# Variable Name: VITE_API_BASE_URL
# Value:
https://zembil-backend.vercel.app/api/v1
```

```bash
# Variable Name: VITE_API_URL
# Value:
https://zembil-backend.vercel.app
```

#### 🔴 Required - Firebase Configuration

Get these from Firebase Console > Project Settings > General

```bash
# Variable Name: VITE_FIREBASE_API_KEY
# Value: (Your Firebase API Key)
AIzaSyC_gPRQl6qNZlLOr2xUE6YGG2qoIjvCdMk

# Variable Name: VITE_FIREBASE_AUTH_DOMAIN
# Value: (Your project auth domain)
zembil1010.firebaseapp.com

# Variable Name: VITE_FIREBASE_PROJECT_ID
# Value:
zembil1010

# Variable Name: VITE_FIREBASE_STORAGE_BUCKET
# Value:
zembil1010.appspot.com

# Variable Name: VITE_FIREBASE_MESSAGING_SENDER_ID
# Value: (Your messaging sender ID)
523458678157

# Variable Name: VITE_FIREBASE_APP_ID
# Value: (Your app ID)
1:523458678157:web:0c4c89dc8c9e7a39df3e6b
```

**For all variables, select:** Production, Preview, and Development

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. You'll get a URL like: `https://zembil-web.vercel.app`

## 🔄 Step 5: Update Backend CORS Settings

**CRITICAL:** After frontend deploys, update the backend environment variables:

1. Go to Vercel Dashboard → Backend Project
2. Settings → Environment Variables
3. Find `ALLOWED_ORIGINS`
4. Click "Edit" and update to:

```
https://your-frontend-url.vercel.app,http://localhost:3000,http://localhost:5173
```

5. Go to **Deployments** tab → Click "..." → **Redeploy**

## 🧪 Test Your Deployment

Once deployed, test these:

### Health Check

```
https://your-frontend-url.vercel.app
```

### API Connection

Open browser console and check:

- No CORS errors
- API requests go to `zembil-backend.vercel.app`
- Firebase authentication works

## 🎨 Customization

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow Vercel's DNS instructions
4. Update backend CORS to include your custom domain

### Environment Variables Per Branch

Vercel automatically creates preview deployments for PRs:

- **Production**: Uses Production environment variables
- **Preview**: Uses Preview environment variables (optional)
- **Development**: Uses Development environment variables (optional)

## 🔧 Troubleshooting

### Build Fails

**Error:** TypeScript errors

- **Solution:** We've disabled strict TypeScript checking for Vercel. If needed, run `npm run build:check` locally to see type errors.

### CORS Errors

**Error:** "CORS policy: No 'Access-Control-Allow-Origin'"

- **Solution:** Make sure backend `ALLOWED_ORIGINS` includes your frontend URL

### Firebase Not Working

**Error:** Firebase configuration errors

- **Solution:** Double-check all Firebase env variables are correct
- Make sure no quotes around the values in Vercel
- Verify Firebase project settings

### API Requests Fail

**Error:** Network errors or 404s

- **Solution:** Check `VITE_API_BASE_URL` points to `https://zembil-backend.vercel.app/api/v1`
- Verify backend is running (visit `/api/v1/health`)

### Blank Page After Deploy

**Error:** White screen, no errors

- **Solution:** Check browser console for errors
- Verify all environment variables are set
- Check Vercel deployment logs

## 📝 Post-Deployment Checklist

- [ ] Frontend loads successfully
- [ ] Can sign in with Google
- [ ] API requests work (check Network tab)
- [ ] Firebase authentication works
- [ ] No CORS errors
- [ ] Backend CORS updated with frontend URL
- [ ] Images load properly
- [ ] Navigation works across all pages

## 🔄 Redeploying

Vercel automatically redeploys when you push to `main`:

```bash
git push origin main
```

Or manually redeploy:

1. Vercel Dashboard → Your Project
2. Deployments tab
3. Click "..." → Redeploy

---

## 🎉 You're Done!

Your full-stack Zembil e-commerce platform is now live!

- **Frontend:** https://your-frontend-url.vercel.app
- **Backend:** https://zembil-backend.vercel.app

Need help? Check the Vercel logs or ask me! 🚀
