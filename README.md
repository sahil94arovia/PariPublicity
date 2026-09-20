# Pari Publicity (परी पब्लिसिटी) - Official Website Documentation

A ₹50,000 agency-grade, flagship web experience crafted for **Pari Publicity**, the premier advertising, printing, and outdoor branding agency located in **Morena, Madhya Pradesh**.

Designed with an **Apple & Samsung Keynote dark luxury aesthetic** (`#030712` obsidian black, cosmic sapphire, frosted glass `backdrop-filter: blur(24px)`, neon cobalt & magenta accents, 3D tilt interactions, and dynamic cursor spotlights).

---

## 🌟 Features Overview

- **Brand Aesthetic**: Flagship dark glassmorphism (`#030712` Obsidian background, `#0B132B` deep midnight cards, `#2B7FFF` neon cobalt blue, `#FF007A` neon magenta, and `#FFB800` warm gold accents).
- **Transparent 3D Dual-P Logo**: Calibrated high-resolution transparent 3D logo with crisp white & neon magenta lettering optimized for ultra-dark backgrounds.
- **Hero 3D Stage**: Interactive 3D perspective cards responding dynamically to mouse movement, showcasing hoardings, flex banners, LED shop boards, and luxury stationery.
- **All 14 Core Services Included**:
  1. Logo Design & Brand Identity
  2. Flex Banner Printing
  3. Star Flex Banners
  4. Hoardings & Outdoor Advertising
  5. Vinyl Printing & Shop Branding
  6. Brochure Design & Printing
  7. Flyers, Pamphlets & Posters
  8. Visiting Cards & Business Stationery
  9. Stickers, Labels & Promotional Printing
  10. Shop Boards & Signage
  11. Vehicle Branding
  12. Event Backdrops, Standees & Display Branding
  13. Social Media Creative Design
  14. Election, School, Coaching & Real Estate Promotion Material
- **Owner & Management Leads CRM (Passkey Protected)**: Secure, confidential local inquiries dashboard (`PP@Anoop123`) in the footer with 1-click WhatsApp/Call triggers, search filtering, and CSV export.
- **Interactive Portfolio Showcase**: Filterable gallery with responsive Lightbox modal and direct WhatsApp enquiry.
- **Direct WhatsApp Quote Generator**: Automatic routing to WhatsApp (`+91 97558 12374`) formatted with customer name, phone, business name, service type, and project details.
- **Mobile Action Bar**: Floating bottom navigation on mobile devices with instant "Call Anoop Jain", "WhatsApp", and "Get Quote" triggers.
- **Local SEO & Schema.org**: Fully structured `LocalBusiness` JSON-LD schema with GMB integration targeting Morena and Chambal region.

---

## 📍 Verified Business Information

- **Brand**: Pari Publicity (परी पब्लिसिटी)
- **Proprietor / Contact**: Anoop Jain
- **Direct Phone**: `+91 97558 12374` / `097558 12374`
- **WhatsApp**: `+91 97558 12374` (`https://wa.me/919755812374`)
- **Address**: Near Rakesh Mavai Koti, Futi Puliya, Ganeshpura, Morena, Madhya Pradesh - 476001
- **Business Hours**:
  - Monday – Saturday: 10:00 AM – 8:00 PM
  - Sunday: Available on Call / Emergency Orders
- **Social Media**:
  - Instagram: [paripublicity.in](https://www.instagram.com/paripublicity.in/)
  - Facebook: [publicitypari15](https://www.facebook.com/publicitypari15)

---

## 🚀 How to Run & Build

### Development Server
```bash
npm install
npm run dev
```
Open the localhost URL shown in the terminal (default: `http://localhost:5173`).

### Production Build
```bash
npm run build
npm run preview
```
The optimized production distribution will be generated in `dist/`.

### Standalone Local Server (Python)
```bash
python3 -m http.server 8000
```
Visit `http://localhost:8000` in your web browser.

---

## 📂 Project Structure

```
PariPublicity/
├── index.html                 # Flagship HTML with Schema.org & SEO
├── css/
│   ├── style.css              # Apple/Samsung flagship dark glass styling & animations
│   └── responsive.css         # Breakpoints for mobile, tablet, desktop, and ultra-wide
├── js/
│   ├── config.js              # Centralized verified contact data & rate card
│   └── main.js                # 3D card tilt, cursor spotlight, lightbox, price calculator
├── assets/
│   └── images/                # Transparent 3D logos, custom SVG mockups, hero visuals
├── public/                    # Static assets mirrored for Vite production build
├── dist/                      # Production-ready minified bundle
├── package.json               # Scripts & dependencies
└── README.md                  # Project documentation
```
