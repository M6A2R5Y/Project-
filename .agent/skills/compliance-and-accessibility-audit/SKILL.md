---
name: compliance-and-accessibility-audit
description: Audits and verifies legal compliance, privacy, cookie consent, form consent checkboxes, data minimization, WCAG 2.1 AA accessibility, alt text, keyboard navigation, colour contrast, dark-pattern removal, and business details across web applications.
---

# Compliance and Accessibility Audit Skill

## 1. Goal
Ensure every HTML, CSS, JavaScript, and backend file in the Bliss Autos workspace satisfies strict production standards for legal compliance, data privacy, WCAG 2.1 AA accessibility, and anti-dark-pattern integrity through deterministic script verification.

## 2. Instructions
1. Verify presence and completeness of all required legal and operational pages:
   - `README.md` (Project & 3-layer architecture documentation)
   - `privacy.html` (Privacy Policy with data minimization, age consent, data deletion, and unsubscribe protocols)
   - `terms.html` (Terms of Service with transparent fee disclosures and font/image licensing)
   - `refund.html` (Refund & Holding Deposit Cancellation Policy)
   - `cookies.html` (Cookie Policy & Third-Party SDK Audit)
   - `data-deletion.html` (Self-Service Data Deletion & Unsubscribe Request Portal)
2. Ensure every user-facing page includes:
   - Skip-to-main-content keyboard navigation link (`<a href="#main-content" class="skip-link">`)
   - Semantic `<main id="main-content">` landmark
   - Cookie consent banner (`#cookie-consent-banner`) with equal-weight non-deceptive action buttons
   - Full registered corporate business details in the footer
   - Descriptive `alt` attributes on all `<img>` elements
3. Verify all data intake forms (`contact-form`, `register-form`, `chat-leads-form`, `deletion-form`) contain explicit, un-checked-by-default consent checkboxes for 18+ age verification and Privacy/Terms acceptance.
4. Run the deterministic audit script `node .agent/skills/compliance-and-accessibility-audit/scripts/audit_workspace.js` to validate 100% pass rate across all checks.

## 3. Examples
- **Input:** Request to audit workspace compliance and accessibility.
- **Execution:** Run `node .agent/skills/compliance-and-accessibility-audit/scripts/audit_workspace.js`
- **Output:** Zero errors reported across HTML pages, CSS contrast rules, form consents, and legal policies.

## 4. Constraints
- Do not use purple gradients, pill-shaped buttons (`border-radius: 9999px` or `50%`), emoji icons, or em dashes.
- Do not pre-check any form consent checkboxes (strictly forbidden as a dark pattern).
- Do not include third-party tracking SDKs, external analytics pixels, or unlicensed external fonts.
- Do not collect unnecessary personal data (e.g., national ID numbers, birthdates, or physical home addresses on initial inquiry forms).

## 5. Tools/Scripts
- **Script Path:** `.agent/skills/compliance-and-accessibility-audit/scripts/audit_workspace.js`
- **Command:** `node ".agent/skills/compliance-and-accessibility-audit/scripts/audit_workspace.js"`
- **Expected Output:** `AUDIT PASSED: 0 errors found across all compliance and accessibility checks.`

## 6. Failure Modes
- **Missing `alt` text on images:** Script identifies exact file and `<img>` tag lacking non-empty `alt` text. Fix by adding descriptive automotive alt text.
- **Pre-checked consent input:** Script detects `checked` attribute on consent checkboxes. Fix by removing default `checked` state.
- **Missing skip link or `#main-content`:** Script flags the HTML file. Fix by inserting `.skip-link` after `<body>` and `id="main-content"` on the main container.
- **Vercel Build Failure (`sh: 1: webpack: Permission denied` or missing output directory):** Occurs if Windows `node_modules/.bin/webpack` is committed to Git with mode `100644` or if `package.json` invokes `webpack` without outputting static assets. Fix by untracking `node_modules` via `.gitignore`, setting `"build"` in `package.json` to run `node .agent/skills/compliance-and-accessibility-audit/scripts/audit_workspace.js`, and configuring `vercel.json` with `"outputDirectory": "."` and `/api/(.*)` routing to `api/index.js`.

## 7. Definition of Done
- [ ] All 11 HTML pages exist and link to `privacy.html`, `terms.html`, `refund.html`, `cookies.html`, and `data-deletion.html`.
- [ ] Cookie consent banner is present and non-deceptive on all pages.
- [ ] All forms verify 18+ age and Privacy/Terms consent without pre-ticked checkboxes.
- [ ] Deterministic script `audit_workspace.js` exits with code `0`.
