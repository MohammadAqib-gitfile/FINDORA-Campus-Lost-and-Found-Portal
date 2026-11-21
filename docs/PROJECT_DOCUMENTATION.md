# FINDORA — Project Documentation
## Campus Lost and Found Management Portal
**Sai University | School of Computing and Data Science**  
**Course:** Web Technology and Internet Programming  
**Academic Year:** 2026–2027

---

## 1. Executive Summary & Purpose
**FINDORA** is a secure, full-stack, database-driven campus lost-and-found management portal engineered specifically for the Sai University academic community. It resolves the widespread challenges of fragmented social media messaging, unverified ownership claims, lack of chain-of-custody tracking, and absence of finder recognition.

FINDORA provides:
- Structured lost and found item reporting classified by campus building blocks (**AB-1**, **AB-2**, **AB-3**, Central Library, Hostels, etc.) and floors.
- Cryptographically salted password authentication and stateless JSON Web Token (JWT) authorization with Role-Based Access Control (RBAC).
- A smart heuristic cross-matching engine that automatically scores reciprocal lost/found listings.
- An end-to-end claim and handover verification workflow with confidential secret marks and 1–5 star return ratings.
- A gamified community reward system with weekly leaderboards and campus honor badges.
- A privacy-preserving "Browse Online / Search Beyond Campus" engine with zero scraping and complete database isolation.

---

## 2. System Architecture & High-Level Design

FINDORA implements a decoupled three-tier Model-View-Controller (MVC) architecture:

```
+-------------------------------------------------------------------------+
|                         PRESENTATION TIER (CLIENT)                      |
|  Semantic HTML5 + Custom CSS3 Design System + Vanilla Modular JS ES6+   |
|  (Home · Explore Items · Received Items · Browse Online · Dashboards)   |
+------------------------------------+------------------------------------+
                                     |
                                     | REST JSON / Multipart Uploads
                                     v
+------------------------------------+------------------------------------+
|                        APPLICATION TIER (SERVER)                        |
|  Node.js + Express.js REST Framework                                    |
|  - Token Authentication Middleware (JWT Bearer)                         |
|  - Role-Based Access Control Middleware (Student / Admin)              |
|  - Multer Image Upload & Validation Middleware                          |
|  - Heuristic Cross-Match Scoring Engine                                |
|  - Centralized Error Handling & Request Sanitization                   |
+------------------------------------+------------------------------------+
                                     |
                                     | Mongoose ODM / Low-Latency Storage
                                     v
+------------------------------------+------------------------------------+
|                         DATA PERSISTENCE TIER                           |
|  Dual-Mode Storage Architecture:                                        |
|  1. Production: Cloud MongoDB Cluster with Mongoose Schemas             |
|  2. Local Evaluation: Zero-Crash Embedded JSON Database (data/db.json)  |
+-------------------------------------------------------------------------+
```

---

## 3. Entity-Relationship (ER) Model

```
 +------------------------+             1:N             +-----------------------+
 |         USERS          |<--------------------------->|         ITEMS         |
 +------------------------+                             +-----------------------+
 | _id (PK)               |                             | _id (PK)              |
 | name: String           |                             | title: String         |
 | email: String (Unique) |                             | type: "lost" | "found"|
 | password: Hash(bcrypt) |                             | category: Enum        |
 | role: "student"|"admin"|                             | building: "AB-1"|...  |
 | campusId: String       |                             | floor: "Ground"|...   |
 | points: Number         |                             | location: String      |
 | weeklyPoints: Number   |                             | date: String          |
 | badge: String          |                             | status: Enum          |
 | badges: [String]       |                             | reportedBy (FK User)  |
 +------------------------+                             | secretDetails: String |
             | 1                                        +-----------------------+
             |                                                      | 1
             | N                                                    | N
             v                                                      v
 +------------------------+                             +-----------------------+
 |     NOTIFICATIONS      |                             |        CLAIMS         |
 +------------------------+                             +-----------------------+
 | _id (PK)               |                             | _id (PK)              |
 | userId (FK User)       |                             | itemId (FK Item)      |
 | title: String          |                             | claimantId (FK User)  |
 | message: String        |                             | proofDescription: Text|
 | type: String           |                             | proofImageUrl: String |
 | isRead: Boolean        |                             | verificationAnswer    |
 +------------------------+                             | status: "pending"|... |
                                                        | isReceived: Boolean   |
                                                        | rating: 1..5          |
                                                        | reviewNotes: String   |
                                                        +-----------------------+
```

---

## 4. Data Flow Diagrams (DFD)

### 4.1 Level 0 (Context Level Diagram)
```
       +-------------------------------------------------------+
       |                                                       |
       |                   FINDORA PORTAL                      |
       |                                                       |
       +-------^---------------------------------------^-------+
               |                                       |
    Credentials / Reports / Claims           Admin Approvals / Handovers
               |                                       |
       +-------v-------+                       +-------v-------+
       |    STUDENT    |                       | CAMPUS ADMIN  |
       +---------------+                       +---------------+
```

### 4.2 Level 1 DFD (Core Processes)
1. **P1: User Authentication & Profile** — Validates email/password, issues signed JWT token, checks role boundaries.
2. **P2: Item Reporting & Location Classification** — Stores lost/found reports with building codes (`AB-1`, `AB-2`), floor, photo uploads, and secret marks.
3. **P3: Heuristic Search & Match Engine** — Evaluates cross-matching candidates between lost and found items.
4. **P4: Claim Evaluation & Handover** — Handles claimant proof submission, admin approval, and physical return confirmation (`status: received`).
5. **P5: Gamification & Rewards** — Awards points to honest finders, computes weekly leaderboard, and generates audit logs.

---

## 5. UI/UX Design System
The frontend follows a clean, modern **White and Blue** palette inspired by SaaS dashboards:
- **Primary Color:** `#2563EB` (Royal University Blue)
- **Primary Hover:** `#1D4ED8` (Deep Blue)
- **Primary Light:** `#EFF6FF` (Subtle Ice Blue)
- **Surface / Background:** `#FFFFFF` (Pure White) and `#F8FAFC` (Slate Tint)
- **Card Borders:** `#E2E8F0` (Light Slate Border)
- **Success / Received:** `#059669` (Emerald Green)
- **Typography:** Plus Jakarta Sans & Manrope sans-serif typography for high legibility.
- **Micro-Animations:** Smooth tab switching, modal dialog transitions, and responsive toast alerts.

---

## 6. Security & Academic Integrity
- **Password Protection:** Encrypted with `bcryptjs` using 10 rounds of salt generation.
- **JWT Protection:** Signed with server-side secret; expiration enforced; validated via `Bearer` token header.
- **Access Control:** Student users are strictly forbidden (`403 Forbidden`) from viewing all claims or accessing admin moderation routes.
- **Duplicate Prevention:** Idempotent claim handovers prevent multiple point awards or duplicate return confirmations.
- **Database Isolation:** External search ("Browse Online") generates pure client-side URLs without scraping or modifying campus database records.
