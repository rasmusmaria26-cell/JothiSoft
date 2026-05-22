# 🪐 JothiSoft Project Handoff & Client Transfer Guide

This document outlines the step-by-step procedure to securely transfer ownership of the JothiSoft codebase, cloud infrastructure, third-party integrations, and database environments to your client.

---

## 🏛️ 1. Infrastructure & Services Checklist

JothiSoft's production environment is powered by the following services. You will need to transfer ownership of each to the client:

| Service | Purpose | Recommended Transfer Method |
| :--- | :--- | :--- |
| **GitHub** | Source Code & Version Control | Repository Transfer (to client's GitHub account) |
| **Supabase** | PostgreSQL Database & Email Auth | Invite Client as Owner $\rightarrow$ Leave Organization |
| **Render** | API Express Server Hosting | Team Invite / Billing Transfer |
| **Vercel** | Next.js Frontend Dashboard Web Portal | Team Access Invite / Transfer Project |
| **Razorpay** | Payment Gateway (Subscription activation) | Invite as Administrator $\rightarrow$ Change Account Owner |

---

## 🚀 2. Step-by-Step Transfer Operations

### 📦 Step A: GitHub Repository Transfer
To transfer the source code repository (`JothiSoft`) to your client's GitHub account:
1. Go to the repository page on GitHub: `https://github.com/rasmusmaria26-cell/JothiSoft`.
2. Click on the **Settings** tab.
3. Scroll to the very bottom to the **Danger Zone**.
4. Click **Transfer ownership**.
5. Enter the client's GitHub username or organization name.
6. The client will receive an invitation email. Once they accept, the repository will automatically move to their account (preserving all commit history and branches).

---

### ⚡ Step B: Supabase Project & Auth Transfer
JothiSoft utilizes Supabase for database operations and server-side authentication:
1. Log in to the [Supabase Dashboard](https://supabase.com/dashboard).
2. Select the organization containing the `JothiSoft` project.
3. Go to **Organization Settings** $\rightarrow$ **Team**.
4. Click **Invite Member** and input the client's email address.
5. Set their role to **Owner** (gives them full billing and credential access).
6. Once the client accepts the invite and adds their billing details, you can safely remove your own account from the team to complete the handoff.

---

### 🚀 Step C: Vercel Frontend Portal Transfer
Vercel hosts the Next.js frontend (`jothi-soft-api.vercel.app`). Since Hobby accounts are strictly single-member, you cannot transfer a project directly between two Hobby accounts using the Vercel UI. Use the **Redeploy Method** (free & recommended):
1. **GitHub First**: Make sure the client has accepted the GitHub repository transfer (Step A).
2. **Remove Custom Domains (Your Side)**: Go to your project's **Settings** $\rightarrow$ **Domains** and delete the custom domains so Vercel releases them.
3. **Import on Client's Side**: The client logs in to their Vercel dashboard, clicks **Add New** $\rightarrow$ **Project**, imports the transferred GitHub repository, adds the environment variables, and clicks **Deploy**.
4. **Add Custom Domains (Client's Side)**: Once deployed, the client adds the custom domains to their new Vercel project.
5. **Clean Up**: Delete the project from your own Vercel account.

*(Note: If the client already has a Vercel Pro Team account, they can invite you to their team, and you can then use Vercel's built-in **Settings** $\rightarrow$ **General** $\rightarrow$ **Transfer Project** tool to transfer it directly to their team).*

---

### 🖥️ Step D: Render API Server Transfer
Render hosts the Express API service (`jothisoft-api.onrender.com`). Render does not support team members or direct service transfers on the Free/Hobby plan:
1. **Manually Recreate Service**: Since the client owns the GitHub repository, they must log into their own Render account, click **New +** $\rightarrow$ **Web Service**, and connect the transferred GitHub repository.
2. **Configure Settings**:
   * Set the **Build Command** to: `npm run build` or whatever build script is configured (or direct runtime).
   * Set the **Start Command** to: `npm start` (or standard entrypoint).
3. **Environment Variables**: Copy all variables from the secure `.env` list (Step 3) into their new Render web service's environment configuration.
4. **Custom Domain**: Update the DNS settings or point custom API domains to the new Render URL, then delete the old service from your account.

---

### 💳 Step E: Razorpay Account Transfer
Razorpay processes subscription upgrades for premium features:
1. Log in to the [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Navigate to **Settings** $\rightarrow$ **Team/Users**.
3. Invite the client as an **Administrator** or **Owner** using their official corporate email.
4. Update the KYC (Know Your Customer) and bank payout details to link to the client's business bank account.

---

## 🔒 3. Production Environment Secret Rotation

When handing over, you must supply the client with a secure list of credentials. **Do not post these on GitHub**. Create a secure password folder or use a secret manager (like Bitwarden or 1Password) to share:

```env
# ------------------------------------------------------------------------------
# JOTHISOFT SECURE HANDOVER CONFIGURATION (.env)
# ------------------------------------------------------------------------------

# Database Access (Supabase)
SUPABASE_DB_HOST=aws-0-us-east-1.pooler.supabase.com
SUPABASE_DB_USER=postgres.xxxxxxxxxx
SUPABASE_DB_PASSWORD=YourSecureDatabasePassword Here

# Supabase Auth Credentials
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YourAnonKeyHere
SUPABASE_SERVICE_ROLE_KEY=YourServiceRoleKeyHere  # Keep extremely secure!

# Express API Configurations
PORT=4000
NODE_ENV=production
API_URL=https://jothisoft-api.onrender.com

# Razorpay Subscriptions
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx       # Switch to Live key for client launch
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxx
```

---

## 📋 4. Final Client Verification & Launch checklist
Before you officially log off the project, ensure the client runs these quick checks:
1. **DNS Update**: Add custom domain (e.g., `jothisoft.com`) CNAME/A records pointing to Vercel/Render.
2. **Supabase SMTP**: In Supabase Dashboard $\rightarrow$ Auth $\rightarrow$ Providers $\rightarrow$ SMTP, toggle off the rate-limited "Supabase Built-in SMTP" and hook up a custom SMTP service (like Twilio SendGrid or Amazon SES) for sending email/password confirmations.
3. **Razorpay Live Mode**: Toggle Razorpay from "Test Mode" to "Live Mode" and update the `.env` variables on Render to start accepting real payments.

---
