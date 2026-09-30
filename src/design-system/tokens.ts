/**
 * DESIGN SYSTEM — "Amethyst Ledger"
 * Direction: Violet signals trust plus a premium, "worth the investment" authority
 * suited for a firm handling client money. Paired with warm gold as the accent
 * for a classic, grounded finance-and-prestige combination.
 * 
 * Strict Rule: --deadline-red is ONLY used for actual approaching/missed deadlines.
 * Never used decoratively or for generic error states.
 */

export const VERA_DESIGN_TOKENS = {
  palette: {
    primary: {
      token: '--vera-violet',
      hex: '#5B3E8E',
      rgb: '91, 62, 142',
      use: 'Primary buttons, nav, brand mark, key headers',
      rationale: 'Deep violet reads as premium and trustworthy — financial-advisor and consultant brands lean on this exact signal.',
    },
    secondary: {
      token: '--ledger-gold',
      hex: '#C9982F',
      rgb: '201, 152, 47',
      use: 'Secondary actions, checklist "complete" badges, key highlights',
      rationale: 'Classic finance pairing with violet; signals precision/value without feeling gaudy.',
    },
    background: {
      token: '--soft-lavender',
      hex: '#F7F5FA',
      rgb: '247, 245, 250',
      use: 'App background, subtle card backing',
      rationale: 'Warm, calm, not sterile-white; ties to the violet brand without competing with it.',
    },
    text: {
      token: '--charcoal-plum',
      hex: '#2E2438',
      rgb: '46, 36, 56',
      use: 'Body text, primary typography, icons',
      rationale: 'Warm near-black with a violet undertone — cohesive, not harsh pure black.',
    },
    statusDone: {
      token: '--status-green',
      hex: '#4E9C86',
      rgb: '78, 156, 134',
      use: '"Filed" / "Complete" / "Verified" states only',
      rationale: 'Universally read as "done" — reserved for that meaning only.',
    },
    alertCritical: {
      token: '--deadline-red',
      hex: '#D64545',
      rgb: '214, 69, 69',
      use: 'RESERVED FOR DEADLINE-CRITICAL ALERTS ONLY',
      rationale: 'Keeps its urgency; never used decoratively or for generic error states.',
    },
    darkTheme: {
      bg: '#211A2A',
      surface: '#292135',
      text: '#F0ECF7',
      border: '#3F344F',
    },
  },

  typography: {
    headings: {
      family: 'Lora, Georgia, serif',
      weights: [400, 500, 600, 700],
      rationale: 'Editorial/professional authority, common in premium finance and advisory branding.',
    },
    body: {
      family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      weights: [400, 500, 600, 700],
      baseSizePx: 16,
      rationale: 'Clean, neutral, highly legible at small sizes for dense checklist and status content.',
    },
    rule: 'Never mix more than these two typefaces.',
  },

  geometry: {
    radii: {
      sm: '8px',
      md: '12px',
      lg: '16px',
      pill: '9999px (prohibited except for small icon badges)',
      rationale: 'Rounded corners (12–16px) — slightly crisper than a wellness app, to read as professional rather than soft.',
    },
    elevation: {
      card: '0 1px 3px rgba(46, 36, 56, 0.05), 0 1px 2px rgba(46, 36, 56, 0.03)',
      elevated: '0 10px 25px -5px rgba(91, 62, 142, 0.08), 0 8px 10px -6px rgba(91, 62, 142, 0.04)',
      modal: '0 25px 50px -12px rgba(46, 36, 56, 0.25)',
    },
  },

  interactionPatterns: [
    'One clear primary action per screen (e.g. "Upload W-2", not 5 competing buttons)',
    'Checklist items always show visible progress state (empty circle -> checkmark), never just text',
    'Bottom tab bar or top rail with labeled icons — never icon-only',
    'Status tracker uses horizontal 4-step progress stepper (Documents -> Review -> Filed -> Refund), not paragraphs of text',
    'Never rely on color alone for status — always pair with a text label and icon',
    'Plain language throughout: "Upload your W-2" not "Submit Form 1"; "We are missing 2 items" not "Checklist incomplete"',
  ],
} as const;
