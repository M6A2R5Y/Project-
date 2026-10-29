# Bliss Autos Kenya Ltd - Certified Motor Dealership Platform

**Official Production Domain:** https://www.blissautos.co.ke  
**Legal Entity:** Bliss Autos Kenya Ltd (Reg. No.: `PVT-2024-089412` | KRA Tax PIN: `P051982341K`)  
**Showroom Location:** Mombasa Road Commercial Hub, Ground Floor, Plot LR No. 209/11452, P.O. Box 48210 - 00100, Nairobi, Kenya

---

## 1. System Architecture (3-Layer Deterministic Architecture)

This repository follows the **3-Layer Architecture** defined across [`GEMINI.md`](GEMINI.md), [`CLAUDE.md`](CLAUDE.md), and [`AGENTS.md`](AGENTS.md) to separate probabilistic orchestration from deterministic business logic and compliance verification:

- **Layer 1: Skills (`.agent/skills/`)**  
  Self-contained SOP capability packages with YAML frontmatter and structured instructions.  
  - Active Workspace Skill: [`.agent/skills/compliance-and-accessibility-audit/SKILL.md`](.agent/skills/compliance-and-accessibility-audit/SKILL.md)
- **Layer 2: Orchestration**  
  Intelligent routing that loads workspace skills, coordinates updates across frontend/backend modules, and validates outputs against deterministic checks.
- **Layer 3: Deterministic Execution (`.agent/skills/.../scripts/` & `Bliss autos backend/`)**  
  Node.js scripts and backend services that enforce deterministic validation:
  - Compliance & Accessibility Auditor: `node ".agent/skills/compliance-and-accessibility-audit/scripts/audit_workspace.js"`
  - Dealership API & Resilient Data Store: `node "Bliss autos backend/backend.js"`

---

## 2. Legal, Privacy, Anti-Dark-Pattern & Accessibility Compliance Matrix

Every regulatory, ethical design, and accessibility requirement is implemented and deterministically verified:

| Requirement | Implementation & File Reference |
| :--- | :--- |
| **Privacy Policy** | [`privacy.html`](privacy.html) - Full compliance with the Data Protection Act of Kenya (2019) and GDPR. |
| **Terms of Service** | [`terms.html`](terms.html) - Binding vehicle reservation, inspection, NTSA transfer, and governing law terms. |
| **Refund Policy** | [`refund.html`](refund.html) - 100% refundable holding deposits, 14-day/500 km mechanical defect protection, and 3-business-day EFT processing with zero restocking fees. |
| **Cookie Policy** | [`cookies.html`](cookies.html) - Exhaustive table of first-party `localStorage` keys (`bliss_cookie_consent`, `authToken`, `userEmail`) plus a one-click storage purge button. |
| **Cookie Consent Banner** | Present on all pages (`#cookie-consent-banner`) with equal-prominence rectangular buttons (`Accept Essential Only` and `Acknowledge & Close`). |
| **Check Form Consents** | Explicit, **un-checked by default** consent checkboxes on all forms (`index.html`, `contact.html`, `Register.html`, `data-deletion.html`) validated in [`Bliss.js`](Bliss.js) and [`register.js`](register.js). |
| **No Unnecessary Data (Data Minimization)** | Online forms collect only Name, Email, and Message/Password. Zero National ID numbers, dates of birth, home addresses, or phone numbers are required online. |
| **Audit Third-Party SDKs** | **0 third-party SDKs.** Zero Google Analytics, Tag Manager, Meta Pixels, Hotjar, or external font trackers. Audited automatically by `audit_workspace.js`. |
| **Remove Dark Patterns** | No pre-checked boxes, no fake urgency timers, no fake live counters, equal button visual weight on cookie banners, and simple online cancellation. |
| **Remove Hidden Fees** | Upfront `.fee-breakdown-banner` on [`Inventory.html`](Inventory.html), [`Dashboard.html`](Dashboard.html), [`index.html`](index.html), and [`terms.html`](terms.html) disclosing all-inclusive duty/VAT pricing and the flat statutory `Ksh 3,500` NTSA TIMS transfer fee. |
| **Remove Fake Reviews & Unsupported Claims** | Zero fabricated customer testimonials or star ratings. All 18 vehicles display factual manufacturer and inspection specifications. |
| **Accessibility (WCAG 2.1 AA/AAA)** | Semantic HTML5 landmarks (`role="banner"`, `role="navigation"`, `<main id="main-content">`, `role="contentinfo"`), `aria-live="polite"` status regions, and `aria-expanded` dialog states. |
| **Descriptive Alt Text** | Every `<img>` tag across all pages features detailed, specific `alt` text describing the vehicle make, model, year, body style, and setting. |
| **Fix Colour Contrast** | High-contrast palette in [`Blisss autos.css`](Blisss%20autos.css): primary text `#0f172a` on `#ffffff` (17.4:1), secondary text `#334155` (10.3:1), caption text `#475569` (7.5:1), and dark-background text `#e2e8f0` on `#0f172a` (13.2:1). |
| **Keyboard Navigation** | Visible `.skip-link` (`Skip to main content`) at the top of every page, high-contrast `3px solid #2563eb` `:focus-visible` outlines on all interactive elements, and `Escape` key handler to close the Support Desk dialog. |
| **Add Business Details** | Full corporate details in every page footer and legal page: **Bliss Autos Kenya Ltd**, Reg. No. `PVT-2024-089412`, KRA PIN `P051982341K`, Plot LR No. 209/11452, Mombasa Road, Nairobi. |
| **Age Consent for Kids (18+)** | Mandatory 18+ age confirmation on every form and dedicated Children's Privacy clauses in [`privacy.html`](privacy.html) and [`terms.html`](terms.html) prohibiting data collection from minors under 18. |
| **Unsubscribe Link in Emails** | Optional marketing checkbox is strictly opt-in (un-checked). Every email includes an RFC 8058 `List-Unsubscribe` header and a direct one-click unsubscribe link routed to [`data-deletion.html`](data-deletion.html) and `POST /api/unsubscribe`. |
| **Licence Fonts or Images** | Code licensed under MIT ([`LICENSE`](LICENSE)). Uses 100% royalty-free native OS system fonts (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`) and first-party dealership vehicle photography in `images/`. |
| **Data Deletion Requests** | Self-service portal at [`data-deletion.html`](data-deletion.html) backed by `POST /api/data-deletion` in [`Bliss autos backend/backend.js`](Bliss%20autos%20backend/backend.js) to permanently erase accounts, inquiries, and chat logs. |

---

## 3. Quick Start & Running the Platform

### Prerequisites
- **Node.js** (v18+ recommended)
- **MySQL** (Optional - the backend automatically falls back to its built-in resilient in-memory data store if MySQL is offline)

### Step 1: Install Dependencies
```bash
npm install
cd "Bliss autos backend"
npm install
cd ..
```

### Step 2: (Optional) Initialize MySQL Database
If running a local MySQL instance (`localhost:3306`), execute [`Bliss autos backend/setup_database.sql`](Bliss%20autos%20backend/setup_database.sql):
```bash
mysql -u root < "Bliss autos backend/setup_database.sql"
```

### Step 3: Start the Production Server
```bash
node "Bliss autos backend/backend.js"
```
The server starts on `http://localhost:3000` (with custom domain canonicals configured for `https://www.blissautos.co.ke`).

### Step 4: Run the Deterministic Compliance & Accessibility Audit
```bash
node ".agent/skills/compliance-and-accessibility-audit/scripts/audit_workspace.js"
```

---

## 4. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/car` | Returns all 18 certified showroom vehicles. |
| `GET` | `/api/dashboard-data` | Returns inventory counts, make diversity, and active order summaries. |
| `GET` | `/api/order` | Returns vehicle reservation and order records. |
| `GET` | `/api/financing` | Returns available commercial bank and corporate fleet financing plans. |
| `GET` | `/api/customer` | Returns sanitized customer records (passwords never exposed). |
| `POST` | `/api/register` | Creates a client account (verifies 18+ age consent and hashes password with `bcrypt`). |
| `POST` | `/api/login` | Authenticates client credentials and returns an 8-hour signed JWT. |
| `POST` | `/api/contact` | Records a customer inquiry and attaches RFC 8058 `List-Unsubscribe` headers. |
| `POST` | `/api/chat` | Processes Showroom Support Desk inquiries. |
| `POST` | `/api/data-deletion` | Permanently purges customer account, inquiries, and chat logs from memory and MySQL. |
| `POST` | `/api/unsubscribe` | Immediately unsubscribes an email address from all marketing communications. |
