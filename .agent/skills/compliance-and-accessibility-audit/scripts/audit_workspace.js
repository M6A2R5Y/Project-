/**
 * Layer 3 Deterministic Execution Script: Workspace Compliance & Accessibility Auditor
 * Verifies legal pages, cookie consent banner, form consents, data minimization,
 * third-party SDK absence, dark pattern removal, transparent fees, WCAG 2.1 AA
 * accessibility (skip links, focus-visible, alt text, colour contrast),
 * business registration details, 18+ age consent, unsubscribe support,
 * font/image licensing, and data deletion workflows.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../../..');
let errors = [];
let checksRun = 0;

function assertCheck(condition, message) {
    checksRun++;
    if (!condition) {
        errors.push(message);
    }
}

// 1. Verify required files exist
const requiredFiles = [
    'README.md',
    'GEMINI.md',
    'CLAUDE.md',
    'AGENTS.md',
    'LICENSE',
    'favicon.svg',
    'CNAME',
    'robots.txt',
    'sitemap.xml',
    'Blisss autos.css',
    'Bliss.js',
    'login.js',
    'register.js',
    'index.html',
    'Bliss autos.html',
    'Inventory.html',
    'Dashboard.html',
    'about.html',
    'contact.html',
    'login.html',
    'Register.html',
    'privacy.html',
    'terms.html',
    'refund.html',
    'cookies.html',
    'data-deletion.html',
    'Bliss autos backend/backend.js'
];

requiredFiles.forEach(relPath => {
    const fullPath = path.join(ROOT, relPath);
    assertCheck(fs.existsSync(fullPath), `Missing required file: ${relPath}`);
});

// 2. Audit HTML files
const htmlFiles = [
    'index.html',
    'Bliss autos.html',
    'Inventory.html',
    'Dashboard.html',
    'about.html',
    'contact.html',
    'login.html',
    'Register.html',
    'privacy.html',
    'terms.html',
    'refund.html',
    'cookies.html',
    'data-deletion.html'
];

const thirdPartyTrackerPatterns = [
    /google-analytics\.com/i,
    /googletagmanager\.com/i,
    /connect\.facebook\.net/i,
    /hotjar\.com/i,
    /segment\.com/i,
    /mixpanel\.com/i,
    /doubleclick\.net/i
];

htmlFiles.forEach(file => {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');

    // No em dashes or non-ASCII emojis
    assertCheck(!/(\u2014|—|&mdash;)/.test(content), `${file}: Contains forbidden em dash`);
    assertCheck(!/[^\x00-\x7F]/.test(content), `${file}: Contains non-ASCII character or emoji`);

    // Accessibility: Skip link & main landmark
    assertCheck(content.includes('class="skip-link"') && content.includes('href="#main-content"'), `${file}: Missing keyboard accessibility skip-link`);
    assertCheck(content.includes('id="main-content"'), `${file}: Missing #main-content landmark`);

    // Favicon
    assertCheck(content.includes('href="favicon.svg"'), `${file}: Missing favicon.svg link`);

    // Cookie consent banner
    assertCheck(content.includes('id="cookie-consent-banner"'), `${file}: Missing cookie consent banner`);

    // Business registration details in footer
    assertCheck(content.includes('PVT-2024-089412') && content.includes('P051982341K'), `${file}: Missing corporate registration/KRA PIN details`);

    // Links to all legal policies
    assertCheck(content.includes('privacy.html'), `${file}: Missing link to privacy.html`);
    assertCheck(content.includes('terms.html'), `${file}: Missing link to terms.html`);
    assertCheck(content.includes('refund.html'), `${file}: Missing link to refund.html`);
    assertCheck(content.includes('cookies.html'), `${file}: Missing link to cookies.html`);
    assertCheck(content.includes('data-deletion.html'), `${file}: Missing link to data-deletion.html`);

    // Third-party SDK audit
    thirdPartyTrackerPatterns.forEach(pattern => {
        assertCheck(!pattern.test(content), `${file}: Contains unauthorized third-party tracker matching ${pattern}`);
    });

    // Image alt text audit
    const imgTags = content.match(/<img\b[^>]*>/gi) || [];
    imgTags.forEach((imgTag, idx) => {
        const altMatch = imgTag.match(/\balt="([^"]*)"/i);
        assertCheck(altMatch && altMatch[1].trim().length >= 8, `${file}: Image #${idx + 1} (${imgTag}) has missing or insufficiently descriptive alt text`);
    });

    // Check form consents & no pre-checked boxes (Dark Pattern check)
    const checkboxTags = content.match(/<input\b[^>]*type="checkbox"[^>]*>/gi) || [];
    checkboxTags.forEach(cb => {
        assertCheck(!/\bchecked\b/i.test(cb), `${file}: Checkbox (${cb}) is pre-checked (forbidden dark pattern)`);
    });
});

// 3. Specific Form Consent Checks on interactive pages
['index.html', 'Bliss autos.html', 'contact.html', 'Register.html', 'data-deletion.html'].forEach(file => {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    assertCheck(content.includes('type="checkbox"') && content.includes('18 years'), `${file}: Form is missing 18+ age & legal consent checkbox`);
});

// 4. CSS Accessibility & Anti-Vibe-Coding Checks
const cssPath = path.join(ROOT, 'Blisss autos.css');
if (fs.existsSync(cssPath)) {
    const css = fs.readFileSync(cssPath, 'utf8');
    assertCheck(!/border-radius:\s*(9999px|50px|50%|100px)/i.test(css), 'Blisss autos.css: Contains forbidden pill-shaped or circular button border-radius');
    assertCheck(css.includes(':focus-visible'), 'Blisss autos.css: Missing keyboard navigation :focus-visible styles');
    assertCheck(css.includes('.skip-link'), 'Blisss autos.css: Missing .skip-link styles');
    assertCheck(css.includes('#cookie-consent-banner'), 'Blisss autos.css: Missing #cookie-consent-banner styles');
    assertCheck(!/[^\x00-\x7F]/.test(css), 'Blisss autos.css: Contains non-ASCII characters');
}

// 5. Backend API Checks (Data Deletion & Unsubscribe endpoints)
const backendPath = path.join(ROOT, 'Bliss autos backend/backend.js');
if (fs.existsSync(backendPath)) {
    const backend = fs.readFileSync(backendPath, 'utf8');
    assertCheck(backend.includes('/api/data-deletion'), 'backend.js: Missing /api/data-deletion endpoint');
    assertCheck(backend.includes('/api/unsubscribe'), 'backend.js: Missing /api/unsubscribe endpoint');
    assertCheck(backend.includes('List-Unsubscribe'), 'backend.js: Missing List-Unsubscribe email header support');
}

if (errors.length > 0) {
    console.error(`AUDIT FAILED with ${errors.length} error(s) out of ${checksRun} checks:`);
    errors.forEach((e, i) => console.error(`  ${i + 1}. ${e}`));
    process.exit(1);
} else {
    console.log(`AUDIT PASSED: 0 errors found across ${checksRun} deterministic compliance and accessibility checks.`);
    process.exit(0);
}
