# FINDORA — Campus Lost and Found Portal

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2F%20Embedded%20JSON-brightgreen.svg)](https://www.mongodb.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

**Course:** Web Technology and Internet Programming — Individual Project  
**Institution:** Sai University | School of Computing and Data Science  
**Academic Year:** 2026–2027  
**Submission Deadline:** 30 November 2026  

---

## 1. Project Overview & Problem Statement

Students frequently misplace or lose valuable personal items across campus (such as laptops, student IDs, calculators, earbuds, books, and keys), while finders often lack a streamlined, reliable, and trustworthy mechanism to reconnect belongings with their rightful owners.

**FINDORA** is a full-stack, responsive, database-driven **Campus Lost and Found Portal** engineered to resolve this problem through:
- Secure campus authentication (Student & Administrator roles).
- Structured lost and found reporting with campus-building taxonomies and confidential verification marks.
- Live keyword search, building filters, category chips, and sorting.
- Ownership claim workflows with proof-of-ownership verification, status synchronization, and automatic competitor rejection upon approval.
- An AI-heuristic **Smart Duplicate & Cross-Match Engine** that calculates affinity scores between reported lost items and discovered items.
- Golfee-inspired minimalist dashboards featuring live SVG recovery analytics, monthly activity curves, and moderation tables.

---

## 2. Technology Stack

- **Frontend:** Semantic HTML5, CSS3 Grid/Flexbox, Vanilla JavaScript ES6+ (Fetch API, Promises, async/await, DOM manipulation).
- **Design System:** Golfee-inspired campus aesthetic (`#173e2b` Forest Green, `#d7edc4` Sage, `#c5e7a7` Lime accents, `#fffef9` warm ivory surfaces).
- **Backend:** Node.js, Express.js REST API with centralized error handling and middleware.
- **Database:** Dual-mode persistence:
  - **Primary:** MongoDB with Mongoose ODM (MongoDB Atlas ready).
  - **Embedded Resilience:** Automatic zero-crash persistent JSON storage (`data/db.json`) when running offline or without local MongoDB.
- **Authentication & Security:** JSON Web Tokens (JWT), bcryptjs password hashing (salt 10), Role-Based Access Control (`student` vs `admin`).
- **File Uploads:** Multer with mime-type checking and local static serving (`public/uploads`).
- **API Testing:** Postman Collection (`postman/FINDORA_API.postman_collection.json`) and automated CLI runner (`npm run test:api`).

---

## 3. Key Features

### 🌟 Core Functional Requirements
1. **Interactive Home Page:** Responsive Golfee hero layout with search bar, 6 category cards, campus building filter, lost/found filter, dynamic items grid, and 3-step guide.
2. **User Authentication:** Student and Admin registration, secure login, persistent JWT sessions, and 1-click Demo accounts for instant grading.
3. **Lost & Found Reporting:** Modal forms capturing item title, category, campus building, specific location, date, secret marks, and photo uploads.
4. **Search and Filtering:** Real-time multi-parameter queries combining text search, campus buildings, categories, lost/found types, and date/alphabetical sorting.
5. **Claim Management:** Two-tier claim verification:
   - Claimant submits detailed proof, phone number, and secret mark answers.
   - Reporter or Campus Admin reviews the claim, entering resolution instructions.
   - Upon approval, the item status cascades to `claimed`, and competing claims are rejected.
6. **Student Dashboard:** Personal control center displaying "My Reported Items" (with received claims viewer) and "My Submitted Claims" (with status tracking).
7. **Admin Dashboard:** Moderation center featuring Golfee analytics cards (Total items, Reunited count, Pending claims, Recovery rate), SVG monthly trend chart, category progress bars, and moderation tables.

### 🚀 Custom Advanced Features (Exceeding Requirements)
- **Browse Online & Search Beyond Campus (New):** Dual search mode allowing students to search either the campus database or build structured queries in Google/Bing with 5 quick presets (Laptops, Mobile Phones, Wallets, Identity Cards, Other Belongings), complete database isolation, and privacy guarantees.
- **FINDORA Heroes Community Rewards & Anti-Cheat Audit Trail:** Recognition system awarding points (+5 for reporting, +50 for confirmed handover, +10 for 5-star ratings) with weekly leaderboards, honor badges, and an administrative reward audit trail.
- **Heuristic Duplicate / Cross-Match Engine (`calculateMatchScore`):** Automatically evaluates category concordance (+40%), campus building proximity (+30%), and title/description token overlap (+30%). Matches $\ge 40\%$ surface in real-time inside item details and trigger notification alerts.
- **In-App Campus Notifications:** Real-time alert feed notifying users when claims are submitted, approved, rejected, or when high-confidence matches are found.
- **Campus Building Taxonomy:** Dedicated dropdown filter and location tagging for 8 distinct university buildings (AB-1, AB-2, AB-3, Central Library, Dining Commons, etc.).

---

## 4. Project Directory Structure

```text
FINDORA_SUBMISSION/
├── client/                        # Modern responsive frontend
│   ├── css/                       # White & blue theme stylesheets
│   ├── js/                        # Modular client logic (api.js, app.js, charts.js)
│   ├── uploads/                   # Uploaded images
│   └── index.html                 # SPA entry point
├── server/                        # Node.js & Express REST backend
│   ├── config/                    # Database connectors (MongoDB + embedded JSON)
│   ├── controllers/               # Route controllers (auth, item, claim, hero, ...)
│   ├── data/                      # Embedded persistent database (data/db.json)
│   ├── middleware/                # JWT auth, upload, and error handler
│   ├── models/                    # Data models (User, Item, Claim, Notification)
│   ├── routes/                    # REST routes
│   ├── seed/                      # Database seeders
│   ├── server.js                  # Express backend entry point
│   └── package.json               # Backend manifest
├── docs/                          # Comprehensive university documentation
│   ├── PROJECT_DOCUMENTATION.md   # System architecture, ER diagram, DFDs, modules
│   ├── API_DOCUMENTATION.md       # All 20 REST API endpoints
│   ├── TESTING_REPORT.md          # 24/24 passing automated test suite report
│   ├── SETUP_GUIDE.md             # Execution and deployment manual
│   ├── PROJECT_REPORT.md          # Prescribed Sai University project report
│   └── Project_Report.pdf         # Official compiled 8-page academic PDF report
├── postman/                       # Automated testing evidence
│   ├── FINDORA_API_Collection.json# Complete Postman v2.1 API collection
│   ├── POSTMAN_TEST_EVIDENCE.html # Interactive visual test results matrix
│   ├── POSTMAN_TEST_EVIDENCE.txt  # Terminal execution logs
│   └── run-tests.js               # Standalone test runner (24 test scenarios)
├── GitHub_Link.txt                # Git repository link and commit hash
├── Live_Application_Link.txt      # Live deployment links & 1-click evaluator logins
├── Project_Report.pdf             # Prescribed format academic submission PDF
├── package.json                   # Root orchestrator manifest
├── .env.example                   # Clean environment template (zero secrets)
├── .gitignore                     # Git ignore rules (node_modules, .env)
└── README.md                      # Project manual
```

---

## 5. Quick Start & Local Execution

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation
```bash
# Clone or navigate to the project repository
cd saitrace-portal

# Install all dependencies
npm install
```

### Environment Configuration
The `.env` file is pre-configured with local defaults:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/saitrace
JWT_SECRET=findora_super_secure_jwt_secret_key_2026_sai_university
CAMPUS_NAME=Sai University
CAMPUS_LOCATION=Chennai, India
```
*(Note: If local MongoDB is not running, the application automatically activates the embedded `data/db.json` database without crashing).*

### Seed Initial Records (12 Items & 3 Users)
```bash
npm run seed
```

### Start the Server
```bash
npm start
```
The portal will be active at: **`http://localhost:5000`**

### Pre-Configured Demo Accounts (or use 1-Click buttons in the UI):
- **Campus Admin:**
  - Email: `admin@saiuniversity.edu.in`
  - Password: `Password123!`
- **Student 1 (Aarav):**
  - Email: `student@saiuniversity.edu.in`
  - Password: `Password123!`
- **Student 2 (Diya):**
  - Email: `diya.k@saiuniversity.edu.in`
  - Password: `Password123!`

---

## 6. API Testing (Postman & Automated Runner)

The project includes an automated test runner executing **24 rigorous test cases** matching and exceeding the Sai University specification:

```bash
npm run test:api
```

### Test Case Coverage (24/24 Passed - 100%):
1. `GET /api/health` — Service health verification (`200 OK`)
2. `POST /api/auth/demo/student` — Student login & JWT token extraction
3. `POST /api/auth/demo/admin` — Admin login & administrator token extraction
4. `POST /api/auth/register` — Input validation check on malformed payload (`400 Bad Request`)
5. `GET /api/items/my-items` — Security: Unauthorized access prevention (`401 Unauthorized`)
6. `GET /api/claims/admin/all` — Security: Student blocked from admin route (`403 Forbidden`)
7. `GET /api/items` — Keyword search and campus building filters
8. `POST /api/items` — Create new listing with building code and secret marks (`201 Created`)
9. `GET /api/items/:id` — Retrieve item details & execute AI match calculations
10. `POST /api/claims` — Submit ownership claim with proof description (`201 Created`)
11. `PATCH /api/claims/:id/status` — Admin/Reporter approval with automatic state cascading
12. `GET /api/stats/dashboard` — Calculate campus recovery rate & analytics
13. `GET /api/items?building=AB-1&floor=Ground` — Multi-tier building and floor location filter
14. `PATCH /api/claims/:id/handover` — Confirm physical handover and award 50 Hero points
15. `PATCH /api/claims/:id/handover` — Prevent duplicate handover point exploits
16. `POST /api/claims/:id/feedback` — Submit verified 5-star rating and award 10 bonus points
17. `POST /api/claims/:id/feedback` — Enforce one rating per return policy
18. `GET /api/heroes/leaderboard` — Weekly leaderboard & campus honor badges
19. `GET /api/heroes/admin/logs` — Administrative anti-cheat reward audit trail
20. `UI Validation` — Browse Online mode, globe icon, form fields, and required disclaimer
21. `External Search` — Dynamic Google search query construction & URI encoding
22. `External Search` — Dynamic Bing search URL with safe character encoding
23. `Suggested Searches` — 5 required categories (laptops, phones, wallets, IDs, other) & keyless privacy safeguards
24. `Database Isolation` — External search causes zero DB mutations or scraping liabilities

You can also import `postman/FINDORA_API.postman_collection.json` directly into the Postman desktop application.

---

## 7. Cloud Deployment Guide (Render / Railway)

1. **Database:** Create a free MongoDB Atlas cluster and obtain the connection string `mongodb+srv://<user>:<password>@cluster.mongodb.net/findora`.
2. **Repository:** Push this repository to GitHub.
3. **Web Service Setup:**
   - Platform: [Render](https://render.com) or [Railway](https://railway.app).
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables:
     - `MONGODB_URI`: `<Your MongoDB Atlas Connection URI>`
     - `JWT_SECRET`: `<A random 64-character secret>`
     - `NODE_ENV`: `production`

---

## 8. Academic Integrity & AI-Use Disclosure

Developed for the **Web Technology and Internet Programming** individual project evaluation at Sai University. All requirements outlined in the course specification have been fulfilled independently and systematically.
