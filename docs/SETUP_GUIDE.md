# FINDORA — Installation & Setup Guide
## Complete Execution & Deployment Instructions
**Sai University | School of Computing and Data Science**

---

### 1. Prerequisites
- **Node.js:** v16.x or newer (v18.x / v20.x recommended)
- **Package Manager:** `npm` (bundled with Node.js)
- **Modern Web Browser:** Google Chrome, Microsoft Edge, Firefox, or Safari

---

### 2. Local Setup & Quick Execution

#### Step 1: Extract / Open Project Directory
Open your terminal or command prompt in the `FINDORA_SUBMISSION` folder:
```bash
cd FINDORA_SUBMISSION
```

#### Step 2: Configure Environment Variables
Copy the provided sample configuration:
```bash
cp .env.example .env
```
*(On Windows PowerShell: `Copy-Item .env.example .env`)*

The default `.env` is pre-configured to run out of the box with the embedded zero-crash JSON database:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=sai_university_findora_secure_secret_key_2026
# Optional: Set MONGODB_URI if using cloud MongoDB Atlas
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/findora?retryWrites=true&w=majority
```

#### Step 3: Install Production Dependencies
```bash
npm install
```

#### Step 4: Start the Server
```bash
npm start
```
*Alternatively, you can run:*
```bash
node server/server.js
```

#### Step 5: Open the Application
Navigate to your web browser:
```
http://localhost:5000
```

---

### 3. Evaluator 1-Click Demo Accounts

To facilitate rapid grading and evaluation without registering new accounts, use these pre-seeded accounts:

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Campus Admin (Security)** | `admin@saiuniversity.edu.in` | `Password123!` | Full control center, claim approvals, handover confirmations, reward audit logs. |
| **Enrolled Student (Aarav)** | `student@saiuniversity.edu.in` | `Password123!` | Report items, submit claims, rate returned items, view personal dashboard. |

*Quick Shortcut:* On the login modal, click the **"👤 Demo Student"** or **"🛡️ Demo Admin"** buttons for 1-click access.

---

### 4. Running the Automated Test Suite

To verify all 24 API, security, and algorithmic requirements:
```bash
npm test
```
*Or execute directly:*
```bash
node postman/run-tests.js
```
The test harness will automatically spin up a test instance, execute all 24 tests, record results, and exit with status 0.

---

### 5. Production Cloud Deployment (Render / Railway)

1. **Deploy to Render:**
   - Create a new **Web Service** on [Render.com](https://render.com).
   - Connect your GitHub repository.
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Set Environment Variables:
     - `NODE_ENV=production`
     - `JWT_SECRET=<your-random-jwt-secret>`
     - `PORT=10000`

2. **Deploy to Railway:**
   - Create a new project on [Railway.app](https://railway.app).
   - Select "Deploy from GitHub repo".
   - Railway will auto-detect the Node.js runtime and launch the service on the dynamically assigned `PORT`.
