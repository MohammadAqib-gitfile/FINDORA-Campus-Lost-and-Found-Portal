# FINDORA — Automated API & Feature Testing Report
## Test Harness Execution Evidence & Validation Results
**Academic Assessment:** Test 2 Alternative — Web Technology & Internet Programming  
**Institution:** Sai University | School of Computing and Data Science  
**Total Tests:** 24  
**Passed:** 24 (100.0%)  
**Failed:** 0 (0%)  
**Execution Host:** `http://127.0.0.1:5055/api` (Local Test Harness) & `http://localhost:5000/api` (Production)

---

### Executive Test Summary Matrix

| # | Test Name & Endpoint | Method | Expected Status | Result | Key Assertion Verified |
| :-: | :--- | :-: | :-: | :-: | :--- |
| **01** | System Health Check (`/api/health`) | `GET` | `200 OK` | **PASS** | Server is online; version 1.0.0 verified. |
| **02** | Student Login (`/api/auth/demo/student`) | `POST` | `200 OK` | **PASS** | Returns signed JWT for role `student`. |
| **03** | Admin Login (`/api/auth/demo/admin`) | `POST` | `200 OK` | **PASS** | Returns signed JWT for role `admin`. |
| **04** | Input Validation (`/api/auth/register`) | `POST` | `400 Bad Request` | **PASS** | Rejects empty payloads; protects database integrity. |
| **05** | Unauthorized Route Block (`/api/items/my-items`) | `GET` | `401 Unauthorized` | **PASS** | Rejects requests lacking `Bearer` token. |
| **06** | Student RBAC Guard (`/api/claims/admin/all`) | `GET` | `403 Forbidden` | **PASS** | Blocks student token from admin-only endpoints. |
| **07** | Search & Building Filter (`/api/items`) | `GET` | `200 OK` | **PASS** | Correctly filters items by campus building code. |
| **08** | Report Item with AB-1 & Secret (`/api/items`) | `POST` | `201 Created` | **PASS** | Stores AB-1 building, floor, room, and confidential mark. |
| **09** | Item Details & Smart Match (`/api/items/:id`) | `GET` | `200 OK` | **PASS** | Computes algorithmic score for reciprocal candidates. |
| **10** | Submit Ownership Claim (`/api/claims`) | `POST` | `201 Created` | **PASS** | Creates claim with proof description and contact phone. |
| **11** | Claim Approval & Sync (`/api/claims/:id/status`) | `PATCH` | `200 OK` | **PASS** | Updates claim to `approved` and item to `claimed`. |
| **12** | Analytics Dashboard (`/api/stats/dashboard`) | `GET` | `200 OK` | **PASS** | Aggregates campus recovery rate and active counts. |
| **13** | Multi-Tier Location (`/api/items?building=AB-1&floor=Ground`) | `GET` | `200 OK` | **PASS** | Filters items by specific building AND floor level. |
| **14** | Handover Confirmation (`/api/claims/:id/handover`) | `PATCH` | `200 OK` | **PASS** | Updates item to `received` and awards +50 Hero points. |
| **15** | Idempotent Handover (`/api/claims/:id/handover`) | `PATCH` | `400 Bad Request` | **PASS** | Prevents duplicate physical handovers. |
| **16** | 5-Star Feedback (`/api/claims/:id/feedback`) | `POST` | `200 OK` | **PASS** | Records star rating and awards +10 bonus points. |
| **17** | Rating Limit Guard (`/api/claims/:id/feedback`) | `POST` | `400 Bad Request` | **PASS** | Enforces strict "one rating per return" rule. |
| **18** | Weekly Leaderboard (`/api/heroes/leaderboard`) | `GET` | `200 OK` | **PASS** | Verifies ranked leaderboard and campus badges. |
| **19** | Anti-Cheat Audit Trail (`/api/heroes/admin/logs`) | `GET` | `200 OK` | **PASS** | Logs timestamped transaction records for all rewards. |
| **20** | UI Validation (Browse Online & Disclaimer) | UI Test | DOM Match | **PASS** | Validates globe icon, 4 search fields, and disclaimer text. |
| **21** | Dynamic Google Search URL | Unit Test | URL Match | **PASS** | Constructs URL-safe, percent-encoded Google search queries. |
| **22** | Dynamic Bing Search URL | Unit Test | URL Match | **PASS** | Constructs URL-safe Bing search query with parameters. |
| **23** | 5 Suggested Categories & Keyless Safety | UI Test | Spec Match | **PASS** | Validates Laptops, Phones, Wallets, IDs, and Other. |
| **24** | Database Isolation Guarantee | DB Test | Count Invariant | **PASS** | Proves external searches perform zero writes to database. |

---

### Verifiable Console Output Evidence

```text
====================================================
 FINDORA Campus Portal — API & Feature Test Suite (24 Tests)
====================================================

Target: http://127.0.0.1:5055/api
Testing all core and upgraded requirements from Sai University Specification...

[01] ✓ PASS - GET /api/health (Server Online)
     Status: 200, Version: 1.0.0
[02] ✓ PASS - POST /api/auth/demo/student (Acquire Student JWT)
     User: Aarav Sharma (student)
[03] ✓ PASS - POST /api/auth/demo/admin (Acquire Admin JWT)
     Role: admin
[04] ✓ PASS - POST /api/auth/register (Invalid Input Rejection 400)
     Correctly rejected: "Name, email, and password are required fields."
[05] ✓ PASS - GET /api/items/my-items (Unauthorized Without Token 401)
     Response: "Access denied. No authentication token provided."
[06] ✓ PASS - GET /api/claims/admin/all (Student Forbidden from Admin 403)
     Access blocked: "Forbidden. Administrator privileges required."
[07] ✓ PASS - GET /api/items (Search & Campus Building Filter)
     Found 1 matching listing(s)
[08] ✓ PASS - POST /api/items (Report Found Item with AB-1/Floor & Secret Mark)
     Created Item ID: #mwluiiohl6xx54k
[09] ✓ PASS - GET /api/items/:id (Item Details & Smart Match Engine)
     Matches Evaluated: 2 candidate(s)
[10] ✓ PASS - POST /api/claims (Submit Claim with Proof of Ownership)
     Created Claim ID: #mwluiiqh04k3shk
[11] ✓ PASS - PATCH /api/claims/:id/status (Claim Approval & State Sync)
     Status updated to approved
[12] ✓ PASS - GET /api/stats/dashboard (Recovery Rate & Analytics)
     Total Items: 27, Recovery Rate: 63%
[13] ✓ PASS - GET /api/items?building=AB-1&floor=Ground (Multi-tier Location Filter)
     Matched 13 item(s) in AB-1 Ground Floor Lab
[14] ✓ PASS - PATCH /api/claims/:id/handover (Confirm Handover & Status Received)
     Item Status: received, Points Awarded: 50
[15] ✓ PASS - PATCH /api/claims/:id/handover (Prevent Duplicate Handover)
     Correctly rejected: "Handover has already been confirmed for this claim."
[16] ✓ PASS - POST /api/claims/:id/feedback (Submit 5-Star Feedback & +10 Points)
     Rating: 5★, Bonus: +10 pts
[17] ✓ PASS - POST /api/claims/:id/feedback (Enforce One Rating Per Return)
     Correctly rejected: "Feedback has already been submitted for this return (one rating per return)."
[18] ✓ PASS - GET /api/heroes/leaderboard (Weekly Leaderboard & Campus Honor Badges)
     Top Hero: Aarav Sharma (845 weekly pts, Badge: Campus Hero)
[19] ✓ PASS - GET /api/heroes/admin/logs (Admin Anti-Cheat Reward Audit Trail)
     Recorded 39 verified reward audit log(s)
[20] ✓ PASS - UI Validation - Browse Online Mode, Globe Icon, Form Fields & Disclaimer
     Verified two search modes, globe icon, 4 search fields, and exact required disclaimer text.
[21] ✓ PASS - External Search - Dynamic Google Search Query Construction & Encoding
     Generated: https://www.google.com/search?q=lost%20%22Apple%20MacBook%20Pro%2016%22%20%22Laptops%22%20%22Chennai%22%20metro%20serial
[22] ✓ PASS - External Search - Dynamic Bing Search URL with Safe Character Encoding
     Generated: https://www.bing.com/search?q=lost%20%22Titan%20Watch%20%26%20Gold%20Ring%22%20%22Accessories%22%20%22Kelambakkam%20%2F%20OMR%22%20bus%20%23102
[23] ✓ PASS - Suggested Searches - 5 Required Categories & Keyless Privacy Safeguards
     Covered: laptops, phones, wallets, IDs, and other. Zero API keys exposed.
[24] ✓ PASS - Database Isolation - External Search Stays Completely Separate from Campus DB
     Campus DB items before (27) == items after (27). No records altered.

----------------------------------------------------
✓ ALL 24 TEST CASES PASSED SUCCESSFULLY (100%)
----------------------------------------------------
```
