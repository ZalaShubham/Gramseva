/**
 * detect-hardcoded-strings.js
 * Scans React components and page files for hard-coded user-facing strings
 * that should be localized via next-intl.
 */

const fs = require('fs');
const path = require('path');

const TARGET_DIRS = ['src/components', 'src/app/[locale]/page.tsx'];

// Known technical terms, numbers, or symbols that are permissible
const ALLOWED_PATTERNS = [
  /^[0-9\s.,:;!?\/\\()\[\]\-_+*#@|•₹{}]+$/, // pure numbers or symbols
  /^(L[0-2]|SC|ST|SC\/ST|OTP|IT|PSU|GU|HI|EN)$/, // abbreviations / codes
  /^https?:\/\//, // URLs
  /^[a-z]+(-[a-z0-9]+)*$/, // CSS class names or kebab-case ids
];

const TARGET_FILES = [
  path.resolve(__dirname, '../src/app/[locale]/page.tsx'),
  path.resolve(__dirname, '../src/components/header.tsx'),
  path.resolve(__dirname, '../src/components/footer.tsx'),
  path.resolve(__dirname, '../src/components/dev-login-switcher.tsx'),
  path.resolve(__dirname, '../src/components/mobile-bottom-nav.tsx'),
  path.resolve(__dirname, '../src/components/language-switcher.tsx'),
  path.resolve(__dirname, '../src/components/theme-toggle.tsx'),
];

let totalIssues = 0;

function checkFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');

  // Regex to match plain JSX text between tags: >Some text here<
  const textMatches = [...content.matchAll(/>([^<>{}\n]+)</g)];

  const violations = [];

  for (const match of textMatches) {
    const rawText = match[1].trim();
    if (rawText.length < 2) continue;

    // Check if it matches any allowed pattern
    const isAllowed = ALLOWED_PATTERNS.some((pattern) => pattern.test(rawText));
    if (!isAllowed) {
      violations.push({
        text: rawText,
        index: match.index,
      });
    }
  }

  if (violations.length > 0) {
    console.error(`\n❌ [i18n] Hard-coded text found in ${path.relative(process.cwd(), filePath)}:`);
    for (const v of violations) {
      console.error(`   - "${v.text}"`);
      totalIssues++;
    }
  } else {
    console.log(`✅ [i18n] No hard-coded text in ${path.relative(process.cwd(), filePath)}`);
  }
}

console.log('🔍 Scanning Phase 0 components for hard-coded strings...\n');
for (const file of TARGET_FILES) {
  checkFile(file);
}

if (totalIssues > 0) {
  console.error(`\n❌ Found ${totalIssues} hard-coded string violation(s). Move them to messages/*.json.\n`);
  process.exit(1);
} else {
  console.log(`\n✨ All Phase 0 components are free of hard-coded strings!\n`);
  process.exit(0);
}

