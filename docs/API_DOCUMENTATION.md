# FINDORA — REST API Documentation
## Comprehensive Endpoint Specifications
**Base URL:** `http://localhost:5000/api` (or deployed cloud URL)

---

### Authentication & User Endpoints

#### 1. System Health Check
- **Endpoint:** `GET /health`
- **Access:** Public
- **Description:** Verifies server uptime, portal name, version, and timestamp.
- **Response `200 OK`:**
```json
{
  "status": "online",
  "portal": "FINDORA — Sai University Campus Lost & Found Portal",
  "timestamp": "2026-11-18T08:12:41.000Z",
  "version": "1.0.0"
}
```

#### 2. Register User
- **Endpoint:** `POST /auth/register`
- **Access:** Public
- **Request Body:**
```json
{
  "name": "Diya Krishnan",
  "email": "diya.k@saiuniversity.edu.in",
  "password": "Password123!",
  "role": "student",
  "campusId": "SAI-2026-CS088",
  "phone": "+91 94567 89012"
}
```
- **Response `201 Created`:** Returns signed JWT `token` and sanitized `user` object.
- **Error `400 Bad Request`:** Missing required fields or duplicate email.

#### 3. Login User
- **Endpoint:** `POST /auth/login`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "student@saiuniversity.edu.in",
  "password": "Password123!"
}
```
- **Response `200 OK`:** Returns signed JWT `token` and `user` profile.
- **Error `401 Unauthorized`:** Invalid email or incorrect password.

#### 4. Get Current User Profile
- **Endpoint:** `GET /auth/me`
- **Access:** Protected (`Bearer <token>`)
- **Response `200 OK`:** Returns authenticated user data including current Hero points, badges, and campus ID.

#### 5. Evaluator 1-Click Demo Login
- **Endpoint:** `POST /auth/demo/:role` (where `:role` is `student` or `admin`)
- **Access:** Public
- **Response `200 OK`:** Returns active JWT session for evaluator testing.

---

### Item Management Endpoints

#### 6. Get All Items (Multi-Filter & Search)
- **Endpoint:** `GET /items`
- **Access:** Public
- **Query Parameters:**
  - `search` (string): Keyword match on title, description, location, building.
  - `category` (string): `Electronics`, `Accessories`, `Books`, `Clothing`, `ID & Cards`, `Other`.
  - `type` (string): `lost`, `found`, or `All`.
  - `building` (string): `AB-1`, `AB-2`, `AB-3`, `Central Library`, `Dining Commons`, etc.
  - `floor` (string): `Ground`, `First`, `Second`, `Third`.
  - `status` (string): `open`, `claimed`, `received`, `resolved`.
  - `sort` (string): `recent`, `oldest`, `az`.
- **Response `200 OK`:**
```json
{
  "success": true,
  "count": 27,
  "items": [...]
}
```

#### 7. Get Received & Returned Items
- **Endpoint:** `GET /items/received`
- **Access:** Public
- **Description:** Returns all items marked as `received` or `resolved` with verified handover records.
- **Response `200 OK`:** Returns array of returned items with handover dates and feedback ratings.

#### 8. Get Single Item by ID
- **Endpoint:** `GET /items/:id`
- **Access:** Public
- **Description:** Retrieves item details and evaluates real-time heuristic cross-match candidates.
- **Response `200 OK`:** Returns `item` object and `matches` array with percentage scores.

#### 9. Report Item (Lost or Found)
- **Endpoint:** `POST /items`
- **Access:** Protected / Optional Auth
- **Content-Type:** `multipart/form-data` or `application/json`
- **Fields:** `title`, `type` (`lost`/`found`), `category`, `building`, `floor`, `locationType`, `location`, `date`, `description`, `secretDetails`, `image` (file).
- **Response `201 Created`:** Returns created item record.

#### 10. Update Item
- **Endpoint:** `PUT /items/:id`
- **Access:** Protected (Owner or Admin)
- **Response `200 OK`:** Returns updated item record.

#### 11. Delete Item
- **Endpoint:** `DELETE /items/:id`
- **Access:** Protected (Owner or Admin)
- **Response `200 OK`:** Permanently removes listing.

#### 12. Get My Reported Items
- **Endpoint:** `GET /items/my-items`
- **Access:** Protected (`Bearer <token>`)
- **Response `200 OK`:** Returns items reported by the authenticated student.

---

### Claim & Handover Lifecycle Endpoints

#### 13. Submit Ownership Claim
- **Endpoint:** `POST /claims`
- **Access:** Protected (`Bearer <token>`)
- **Request Body:**
```json
{
  "itemId": "mwluiiohl6xx54k",
  "proofDescription": "Service tag begins with 8K4J; NASA sticker located near exhaust vent.",
  "contactPhone": "+91 98765 43210",
  "verificationAnswer": "Small circular NASA sticker on bottom chassis edge"
}
```
- **Response `201 Created`:** Creates claim with `pending` status.

#### 14. Get My Submitted Claims
- **Endpoint:** `GET /claims/my-claims`
- **Access:** Protected (`Bearer <token>`)
- **Response `200 OK`:** Lists all claims submitted by the logged-in student.

#### 15. Get All Claims (Admin Moderation)
- **Endpoint:** `GET /claims/admin/all`
- **Access:** Protected (Admin Only - Enforces 403 Forbidden for Students)
- **Response `200 OK`:** Complete administrative claim roster.

#### 16. Update Claim Status (Approve / Reject)
- **Endpoint:** `PATCH /claims/:id/status`
- **Access:** Protected (Admin or Item Reporter)
- **Request Body:**
```json
{
  "status": "approved",
  "reviewNotes": "Proof verified against confidential secret marks."
}
```
- **Response `200 OK`:** Cascades claim to `approved` and item to `claimed`.

#### 17. Confirm Handover (Mark Item Received)
- **Endpoint:** `PATCH /claims/:id/handover`
- **Access:** Protected (Admin or Item Reporter)
- **Request Body:**
```json
{
  "handoverNotes": "Physically returned at Campus Security Office with ID verification."
}
```
- **Response `200 OK`:** Updates item status to `received`, records timestamp and verifier, and awards +50 Hero points to finder.
- **Error `400 Bad Request`:** Prevents duplicate handovers.

#### 18. Submit Verified Return Feedback
- **Endpoint:** `POST /claims/:id/feedback`
- **Access:** Protected (Claimant Only)
- **Request Body:**
```json
{
  "rating": 5,
  "feedback": "Thank you so much! My calculator was returned in perfect condition."
}
```
- **Response `200 OK`:** Records 1–5 star rating and awards +10 bonus points to finder.
- **Error `400 Bad Request`:** Enforces exactly one rating per return.

---

### Gamification & Analytics Endpoints

#### 19. Weekly Leaderboard
- **Endpoint:** `GET /heroes/leaderboard`
- **Access:** Public
- **Response `200 OK`:** Returns ranked student list, weekly points, lifetime points, and campus honor badges.

#### 20. Admin Reward Audit Logs
- **Endpoint:** `GET /heroes/admin/logs`
- **Access:** Protected (Admin Only)
- **Response `200 OK`:** Full timestamped audit trail of all points awarded.

#### 21. Campus Analytics Dashboard
- **Endpoint:** `GET /stats/dashboard`
- **Access:** Public
- **Response `200 OK`:** Returns total items, recovery rate percentage, category distributions, and monthly trends.
