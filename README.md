# MarketLink - Fresh Market & Agri-Commerce Dashboard

MarketLink is a modern, responsive, role-based agricultural marketplace and management dashboard designed for **Admins**, **Farmers / Vendors**, and **Customers**. Built with React, TypeScript, Tailwind CSS, Lucide icons, and Recharts.

---

## ✨ Features

### 1. 🛡️ Admin Dashboard
- **System Overview:** Real-time platform gross merchandise value (GMV), active vendors, customer count, platform commissions, and resolution rates.
- **Vendor Verification & Moderation:** KYB review queue with one-click verification, documentation audit, and vendor status controls.
- **Analytics & Platform Health:** Revenue breakdowns, commission tracking, dispute rates, and platform uptime monitoring.
- **Dispute Resolution:** Escalation triage with full case details, buyer/vendor claims, and resolution workflow.

### 2. 🚜 Farmer / Vendor Dashboard
- **Store & Inventory Hub:** Real-time metrics for daily sales, order fulfillment, harvest yield, and low-stock alerts.
- **Product & Stock Management:** Add, edit, price, and track produce batches with organic certification badges and stock thresholds.
- **Live Orders & Logistics:** Real-time order status tracking (Pending, Packed, In Transit, Delivered) with carrier assignments.
- **Crop Planning & Weather Advisory:** Real-time localized weather telemetry and seasonal crop yield forecasting.

### 3. 🛒 Customer Dashboard
- **Fresh Market Catalog:** Category filtering (Vegetables, Fruits, Dairy, Honey & Organic), live search, origin tracking, and instant carting.
- **Farm-to-Door Delivery Tracking:** Interactive delivery route visualization with live status milestones, driver details, and contact options.
- **Cart & Direct Checkout:** Full order review, doorstep delivery time selection, payment method choices, and order confirmation.
- **Farm Discovery & Reviews:** Direct vendor profile discovery with farm certifications and customer ratings.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Lucide React Icons
- **Data Visualization:** Recharts
- **Design System:** Custom MarketEase emerald & modern slate layout

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Mujtaba19938/Marketlink.git
   cd Marketlink
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Set your Gemini API key in `.env.local` for AI-assisted market analytics:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

---

## 👥 Roles & Access

Use the top role switcher in the header to effortlessly test and navigate between:
- **Admin:** Oversight, moderation, revenue analytics, and system audit logs.
- **Farmer / Vendor:** Inventory management, live order dispatch, and farm analytics.
- **Customer:** Fresh market shopping, cart checkout, and live order tracking.

