# 🧱 Brick Negotiate

**Brick Negotiate** is a high-fidelity, Gen Z-focused negotiation simulator styled with a premium **Neobrutalism** aesthetic. Players lock in as "Master Builders," haggle with a sophisticated AI Merchant (powered by Gemini/Groq), and attempt to acquire exclusive digital construction sets for their inventory without depleting their starting budget (Studs).

![Neobrutalism Aesthetics](https://img.shields.io/badge/UI-Neobrutalism-FFE600?style=for-the-badge&logo=css3&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

---

## ✨ Key Features

1. **🤖 Advanced AI Negotiation Engine**:
   - The AI natively understands and generates **Hinglish**, **Hindi**, and **English**.
   - Utilizes deep "Sales Psychology." It remembers your lowball offers, gets angry, praises good reasoning, and will *Walk Away* if you insult the product.
2. **🎮 Gamified Economy**:
   - Users sign up with **500 Starter Studs**.
   - Successfully negotiated sets are added to the user's **Dashboard Display Case**.
3. **🔐 Secure Authentication**:
   - Integrated **Credentials (Email/Password)** and **Google OAuth** login paths using NextAuth.
   - Passwords are strictly hashed via `bcryptjs`.
4. **📊 Analytics & Feedback Loop**:
   - Real-time **Google Analytics 4 (GA4)** & Vercel Web Analytics.
   - Built-in floating **Feedback System** for users to report bugs or submit feature praise.
5. **🎨 Premium UI / UX**:
   - Custom `framer-motion` Interactive Hero Grid.
   - Custom 404 "Missing Brick" Animations.
   - Lightning-fast Dashboard **Skeleton Loaders**.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router), React, Tailwind CSS.
- **Animations**: Framer Motion.
- **Backend**: Next.js Serverless API Routes.
- **Database**: MongoDB (via `mongoose`).
- **Auth**: NextAuth.js (v4).
- **AI Models**: Google Gemini (Primary) & Groq (Fallback Engine).
- **CDN**: ImageKit (High-availability static asset hosting).

---

## 🚀 Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/ApnaShashank/brick-negotiate.git
cd brick-negotiate
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following keys. **Do not expose these keys publicly.**

```env
# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/brick-negotiate

# Authentication
NEXTAUTH_SECRET=your_super_secret_random_string
NEXTAUTH_URL=http://localhost:3000

# Google Login OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI APIs
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key

# Analytics (Optional for Local)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 4. Run the Development Server
```bash
npm run dev
```

The application will be running at `http://localhost:3000`.

---

## 🌍 Production Deployment (Vercel)
This project is fully tailored for one-click deployment on **Vercel**. 
1. Link your GitHub repository to Vercel.
2. Ensure you copy all the Environment Variables from `.env.local` into the Vercel Dashboard **Settings > Environment Variables**.
3. Deploy!

---

*“Build your empire, one brick at a time.”*
