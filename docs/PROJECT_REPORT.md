# SAI UNIVERSITY
## School of Computing and Data Science
### B.Tech Computer Science | Academic Year 2026–2027
**Course:** Web Technology and Internet Programming  
**Project Title:** Campus Lost and Found Portal (**FINDORA**)  
**Student Name:** Individual Project Submission  
**Submission Date:** November 2026  

---

## 1. Project Objectives & Problem Statement

### 1.1 Problem Statement
Universities are bustling environments where students, faculty, and administrative staff inadvertently lose personal belongings—such as laptops, student ID cards, notebooks, earbuds, calculators, and keys. Conversely, honest finders routinely pick up these belongings without a designated, safe, and transparent platform to contact the owner. Physical lost-and-found noticeboards or informal WhatsApp/chat groups frequently result in lost items remaining unclaimed, false ownership claims, lack of verification, and communication friction.

### 1.2 Objectives
The primary objective of this project is to develop **FINDORA**, a robust, database-driven, full-stack web application that serves as the official lost-and-found portal for Sai University. Specific objectives include:
1. Providing an intuitive, responsive user interface following the modern, clean **Golfee** design system.
2. Enabling students to submit structured reports for both *Lost* and *Found* items with image uploads and campus building classification.
3. Implementing secure token-based authentication (JWT) with password hashing (bcrypt) and Role-Based Access Control (RBAC) separating student users from campus security administrators.
4. Designing a multi-attribute filtering engine supporting free-text search, campus buildings, item categories, and listing types.
5. Establishing a formal **Claim Management** workflow with proof-of-ownership verification, secret verification marks, and status cascading (`open` → `claimed` → `resolved`).
6. Engineering a custom **Smart Match / Duplicate Detection Engine** that automatically calculates cross-matching scores between lost and found listings.
7. Providing personalized dashboards for students to manage their personal reports and claims, as well as an administrative control center with live SVG data visualizations.
8. Validating the entire REST API using automated Postman test suites.

---

## 2. System Architecture & Technical Specifications

### 2.1 High-Level Architecture
FINDORA follows a decoupled, three-tier Model-View-Controller (MVC) architecture:
- **Presentation Tier (Client):** Semantic HTML5, CSS3 Grid/Flexbox, and vanilla JavaScript ES6+ modules leveraging the modern Fetch API and asynchronous Promises.
- **Application Tier (Server):** Node.js runtime with Express.js web framework handling REST routing, multipart file processing via Multer, token authentication middleware, and business validation logic.
- **Data Persistence Tier (Storage):** Dual-mode database architecture utilizing MongoDB with Mongoose ODM for production cloud deployments, coupled with a zero-crash, embedded JSON database engine (`storeHelper.js` + `data/db.json`) for seamless offline local evaluation.

### 2.2 Technology Stack Justification
| Layer | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript ES6+ | Satisfies course technical requirements without bloated external frameworks; guarantees sub-second load times and native browser compatibility. |
| **Styling** | Golfee Design System | Professional, accessible palette (Forest Green `#173e2b`, Sage `#d7edc4`, Lime `#c5e7a7`, Ivory `#fffef9`) with subtle drop shadows and micro-animations. |
| **Backend** | Node.js & Express.js | High-concurrency event-driven I/O ideal for handling real-time search, concurrent claims, and JSON API serialization. |
| **Database** | MongoDB / Embedded Engine | Document-oriented storage naturally accommodates heterogeneous item metadata, variable secret verification fields, and nested claim records. |
| **Security** | JWT & bcryptjs | Stateless session management through standard Bearer tokens; industry-standard salting and hashing prevent rainbow-table credential attacks. |
| **API Testing** | Postman & Newman-compatible runner | Verifies REST conformance, status code integrity, validation error handling, and authorization boundaries. |

---

## 3. Database Design & Schemas

The database schema models four primary entities: `Users`, `Items`, `Claims`, and `Notifications`.

### 3.1 User Entity
- `_id`: String (Unique identifier)
- `name`: String (Required)
- `email`: String (Required, unique, lowercase, trimmed)
- `password`: String (Bcrypt salted hash)
- `role`: String (Enum: `student`, `admin`; default: `student`)
- `campusId`: String (e.g., `SAI-2026-CS042`)
- `phone`: String
- `avatar`: String (SVG avatar URI)
- `createdAt` / `updatedAt`: Timestamps

### 3.2 Item Entity
- `_id`: String (Unique identifier)
- `title`: String (Required, trimmed)
- `type`: String (Enum: `lost`, `found`; required)
- `category`: String (Enum: `Electronics`, `Accessories`, `Books`, `Clothing`, `ID & Cards`, `Other`)
- `description`: String (Required)
- `location`: String (Required; specific location description)
- `building`: String (Enum: `Academic Block`, `Central Library`, `Robotics & Tech Lab`, `Dining Commons`, `Sports Complex`, `Student Hostels`, `Main Gate & Parking`, `Auditorium`, `Other`)
- `date`: String (ISO date string of incident)
- `imageUrl`: String (Local upload path or web URL)
- `status`: String (Enum: `open`, `claimed`, `resolved`; default: `open`)
- `reportedBy`: String (User ID or `guest`)
- `reportedByName`: String
- `contactEmail`: String
- `contactPhone`: String
- `secretDetails`: String (Confidential identifying marks kept hidden from public view)

### 3.3 Claim Entity
- `_id`: String (Unique identifier)
- `itemId`: String (Reference to Item)
- `itemTitle`: String
- `claimantId`: String (Reference to User)
- `claimantName`: String
- `claimantEmail`: String
- `contactPhone`: String
- `proofDescription`: String (Required; unique identifying features provided by claimant)
- `proofImageUrl`: String (Optional receipt or photo proof)
- `verificationAnswer`: String (Answer matching secret details)
- `status`: String (Enum: `pending`, `approved`, `rejected`; default: `pending`)
- `reviewNotes`: String (Feedback provided by reviewer)
- `reviewedBy`: String (Admin or reporter name)

### 3.4 Notification Entity
- `_id`: String (Unique identifier)
- `userId`: String (Target user ID)
- `title`: String
- `message`: String
- `type`: String (Enum: `claim_submitted`, `claim_approved`, `claim_rejected`, `match_alert`, `system`)
- `link`: String (Client navigation link)
- `isRead`: Boolean (Default: `false`)

---

## 4. REST API Endpoint Specifications

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System status and version verification |
| `POST` | `/api/auth/register` | Public | Register new student or admin account |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT |
| `GET` | `/api/auth/me` | Protected | Fetch authenticated user profile |
| `POST` | `/api/auth/demo/:role` | Public | 1-Click login for student or admin evaluator |
| `GET` | `/api/items` | Public | Query listings with search, building, category, type, and sort filters |
| `GET` | `/api/items/:id` | Public | Retrieve item details and compute smart duplicate matches |
| `POST` | `/api/items` | Protected | Submit lost or found report with Multer photo upload |
| `PUT` | `/api/items/:id` | Owner / Admin | Modify existing item listing |
| `DELETE`| `/api/items/:id` | Owner / Admin | Delete listing permanently |
| `GET` | `/api/items/my-items` | Protected | Retrieve all items reported by current user |
| `POST` | `/api/claims` | Protected | Submit ownership claim with proof description and phone |
| `GET` | `/api/claims/my-claims` | Protected | Retrieve claims submitted by current user |
| `GET` | `/api/claims/admin/all` | Admin Only | Administrative view of all campus claims |
| `GET` | `/api/claims/item/:id` | Owner / Admin | View received claims for a specific listing |
| `PATCH`| `/api/claims/:id/status`| Owner / Admin | Approve or reject claim; cascades item to `claimed` |
| `GET` | `/api/notifications` | Protected | Retrieve user notifications and unread count |
| `PATCH`| `/api/notifications/:id/read` | Protected | Mark notification as read |
| `GET` | `/api/stats/dashboard` | Public | Retrieve campus analytics, recovery rates, and trend data |

---

## 5. Custom Feature Implementations (Exceeding Requirements)

In accordance with Section 5 of the project syllabus (*"Each student must also implement one additional feature assigned or approved by the instructor"*), FINDORA implements four complementary enhancements:

### 5.1 Smart Heuristic Cross-Match & Duplicate Alert Engine
Implemented in `src/controllers/itemController.js` via `calculateMatchScore(itemA, itemB)`:
- **Complementary Type Requirement:** Item pairs must be opposites (one `lost`, one `found`).
- **Category Match:** Grants $+40\%$ if categories align.
- **Campus Building Proximity:** Grants $+30\%$ if occurring in the same campus building.
- **Keyword & Token Overlap:** Sanitizes, normalizes, and tokenizes titles and descriptions into $N$-grams, granting up to $+30\%$ for overlapping vocabulary.
- **Trigger:** Scores $\ge 40\%$ automatically render in the item detail view as *Possible Matches*, and scores $\ge 50\%$ trigger automatic in-app alerts to the reporter upon submission.

### 5.2 Campus Building Taxonomy & Spatial Filtering
Items are mapped to specific Sai University physical zones: `Academic Block`, `Central Library`, `Robotics & Tech Lab`, `Dining Commons`, `Sports Complex`, `Student Hostels`, `Main Gate & Parking`, and `Auditorium`. This enables localized recovery without broad campus searches.

### 5.3 Live SVG Analytics & Recovery Visualizer
Implemented in `public/js/charts.js`:
- Renders lightweight, responsive vector graphics without external chart library overhead.
- Includes a 6-month activity curve featuring dual-gradient paths (Reports vs. Reunited) with neon emerald glow filters (`feGaussianBlur`), gridlines, and interactive points.
- Features category progress bars dynamically computing percentage distributions.

### 5.4 Real-Time Notification Center
A persistent bell counter in the navigation bar alerts users of claim submissions, administrative approvals, rejections, and heuristic match detections.

### 5.5 Browse Online & Search Beyond Campus Engine
Enables students to expand their search beyond physical campus boundaries to external web portals, police databases, community forums, and city classifieds:
- **Two Distinct Search Modes:** Seamless toggle between *Search Campus* (querying the local university database) and *Browse Online* (crafting structured external search queries).
- **Dynamic Query Synthesizer:** Constructs URL-safe, context-aware queries targeting Google or Bing combining item name, category, city/location, and situational keywords.
- **5 One-Click Presets:** Instant pre-population and execution for high-frequency lost items: Laptops, Mobile Phones, Wallets, Identity Cards, and Other Belongings.
- **Privacy & Safety Guarantees:** 100% client-side keyless URL generation; operates in complete isolation from the campus MongoDB database, prevents web scraping liabilities, exposes zero API keys, and displays the mandatory verification disclaimer: *"These results come from external websites and are not verified by FINDORA."*
- **Seamless Return:** Provides an instant *← Back to FINDORA* option to return to internal campus listings without page reloads.

---

## 6. Postman & Automated Testing Evidence

The API and feature suite was subjected to the automated test harness (`postman/run-tests.js`) covering 24 comprehensive scenarios. All 24 test cases executed with **100% pass rate**:

```text
====================================================
 FINDORA Campus Portal — API & Feature Test Suite (24 Tests)
====================================================
Target: http://127.0.0.1:5055/api
Testing all core and upgraded requirements from Sai University Specification...

[01] ✓ PASS - GET /api/health (Server Online)
[02] ✓ PASS - POST /api/auth/demo/student (Acquire Student JWT)
[03] ✓ PASS - POST /api/auth/demo/admin (Acquire Admin JWT)
[04] ✓ PASS - POST /api/auth/register (Invalid Input Rejection 400)
[05] ✓ PASS - GET /api/items/my-items (Unauthorized Without Token 401)
[06] ✓ PASS - GET /api/claims/admin/all (Student Forbidden from Admin 403)
[07] ✓ PASS - GET /api/items (Search & Campus Building Filter)
[08] ✓ PASS - POST /api/items (Report Found Item with AB-1/Floor & Secret Mark)
[09] ✓ PASS - GET /api/items/:id (Item Details & Smart Match Engine)
[10] ✓ PASS - POST /api/claims (Submit Claim with Proof of Ownership)
[11] ✓ PASS - PATCH /api/claims/:id/status (Claim Approval & State Sync)
[12] ✓ PASS - GET /api/stats/dashboard (Recovery Rate & Analytics)
[13] ✓ PASS - GET /api/items?building=AB-1&floor=Ground (Multi-tier Location Filter)
[14] ✓ PASS - PATCH /api/claims/:id/handover (Confirm Handover & Status Received)
[15] ✓ PASS - PATCH /api/claims/:id/handover (Prevent Duplicate Handover)
[16] ✓ PASS - POST /api/claims/:id/feedback (Submit 5-Star Feedback & +10 Points)
[17] ✓ PASS - POST /api/claims/:id/feedback (Enforce One Rating Per Return)
[18] ✓ PASS - GET /api/heroes/leaderboard (Weekly Leaderboard & Campus Honor Badges)
[19] ✓ PASS - GET /api/heroes/admin/logs (Admin Anti-Cheat Reward Audit Trail)
[20] ✓ PASS - UI Validation - Browse Online Mode, Globe Icon, Form Fields & Disclaimer
[21] ✓ PASS - External Search - Dynamic Google Search Query Construction & Encoding
[22] ✓ PASS - External Search - Dynamic Bing Search URL with Safe Character Encoding
[23] ✓ PASS - Suggested Searches - 5 Required Categories & Keyless Privacy Safeguards
[24] ✓ PASS - Database Isolation - External Search Stays Completely Separate from Campus DB

----------------------------------------------------
✓ ALL 24 TEST CASES PASSED SUCCESSFULLY (100%)
----------------------------------------------------
```

---

## 7. Results & Key Deliverables

1. **Working Application:** A responsive single-page full-stack application running at `http://localhost:5000`.
2. **Initial Dataset:** Seeded with 12 realistic item listings and 3 pre-configured user accounts.
3. **Responsive UI:** Fully fluid layout adapting smoothly across mobile (<390px), tablet (768px), and widescreen desktop (1440px).
4. **Postman Deliverable:** Complete JSON collection saved at `postman/FINDORA_API.postman_collection.json`.

---

## 8. Conclusion

**FINDORA** satisfies every technical and functional requirement established by Sai University's School of Computing and Data Science. The application transitions lost-and-found management from an informal, manual process into a structured, auditable, and secure campus utility. The clean Golfee design system fosters community trust, while the smart matching engine actively accelerates property recovery.

---

## 9. AI-Use Disclosure

In accordance with university evaluation guidelines, AI assistance (Antigravity Assistant, Google DeepMind) was utilized during the development lifecycle for code inspection, architectural structuring, responsive styling refactoring, and automated test suite authoring. All generated code was reviewed, validated, and verified locally by the student.
