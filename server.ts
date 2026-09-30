import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI SDK with required telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const VERA_SYSTEM_INSTRUCTION = `
You are Vera (from "veritas" — truth/accuracy), the dedicated AI client companion for Sterling & Vance CPAs LLP, assisting clients with their tax preparation journey.

CORE RULES:
1. ALWAYS DISCLOSE YOU ARE AN AI: State or maintain that you are Vera, an AI companion built for the firm. Never pretend to be a human CPA or preparer.
2. NEVER GIVE DEFINITIVE OR FINAL TAX ADVICE:
   - You may explain general procedural rules, deadline countdowns, document requirements (what is a W-2 vs 1099, what qualifies for 1098, etc.), and published IRS standard deductions.
   - For specific tax deductions (e.g. home office write-offs, vehicle expensing, S-Corp salaries, crypto wash sales, aggressive business expense claims, audit disputes): ALWAYS frame as: "Under general IRS guidelines, [...], but let's get this to your preparer, Marcus Vance, CPA, to confirm your specific position."
   - When tax advice or strategy is requested, trigger the handoff phrase so the client knows a human preparer dossier is being prepared.
3. GROUNDED IN 2025/2026 IRS RULES: Standard deductions ($15,000 Single / $30,000 MFJ), standard business mileage ~67¢/mile, filing deadline April 15.
4. ACTION-ORIENTED: Suggest real system actions (e.g. checking live practice status, uploading missing documents, or booking a call with Marcus Vance, CPA).
5. TONE: Calm, concise, authoritative, professional, respectful. No unnecessary fluff.
`.trim();

// Chat Endpoint with Gemini 3.8 Flash
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory, clientContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build context string from client's current checklist and status
    const contextPrompt = clientContext
      ? `\nCURRENT CLIENT CONTEXT:\n- Client: ${clientContext.clientName || 'Elena Rostova'}\n- Assigned Preparer: Marcus Vance, CPA\n- Tax Year: 2025 / 2026\n- Current Status: ${clientContext.overallStatus || 'In Preparer Review'}\n- Missing Documents: ${(clientContext.missingDocs || []).join(', ') || 'None'}\n- Uploaded Documents: ${(clientContext.uploadedDocs || []).join(', ') || 'W-2, 1099-NEC'}\n`
      : '';

    const formattedHistory = Array.isArray(conversationHistory)
      ? conversationHistory.map((m: any) => `${m.role === 'user' ? 'Client' : 'Vera'}: ${m.content}`).join('\n')
      : '';

    const prompt = `${contextPrompt}\nCONVERSATION HISTORY:\n${formattedHistory}\n\nClient: ${message}\n\nVera (AI Companion):`;

    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: VERA_SYSTEM_INSTRUCTION,
          temperature: 0.3,
        },
      });

      const text = response.text || "I'm here to assist with your document checklist, filing status, or booking a call with Marcus Vance, CPA.";

      // Determine intent tags to assist frontend UI actions
      const lower = message.toLowerCase();
      let actionTag: string | null = null;
      if (lower.includes('status') || lower.includes('where is my return') || lower.includes('refund')) {
        actionTag = 'status_preview';
      } else if (lower.includes('upload') || lower.includes('checklist') || lower.includes('missing')) {
        actionTag = 'upload_prompt';
      } else if (lower.includes('book') || lower.includes('call') || lower.includes('appointment') || lower.includes('schedule')) {
        actionTag = 'booking_prompt';
      } else if (lower.includes('can i deduct') || lower.includes('write off') || lower.includes('advice') || lower.includes('s-corp')) {
        actionTag = 'escalation_card';
      }

      return res.json({
        reply: text,
        actionTag,
        aiDisclosed: true,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Graceful fallback if key is being initialized
      return res.json({
        reply: "I am Vera, your firm's AI client companion. I can help you check your return status in Karbon, review missing documents on your checklist, or schedule a call with Marcus Vance, CPA.",
        actionTag: null,
        aiDisclosed: true,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error: any) {
    console.error('Gemini API Chat Error:', error);
    return res.status(500).json({
      error: 'Failed to process AI companion response',
      details: error.message || 'Server error',
    });
  }
});

// Document OCR auto-categorization endpoint
app.post('/api/documents/ocr', (req, res) => {
  const { fileName, category } = req.body;
  const name = (fileName || '').toLowerCase();

  let detectedType = 'Tax Document';
  let issuer = 'External Issuer';
  let wagesOrAmount = undefined;
  let taxWithheld = undefined;
  let ein = 'XX-XXX' + Math.floor(1000 + Math.random() * 9000);

  if (name.includes('w2') || name.includes('w-2')) {
    detectedType = 'Form W-2 (Wage and Tax Statement)';
    issuer = 'Apex Technologies LLC';
    wagesOrAmount = '$112,500.00';
    taxWithheld = '$18,400.00';
  } else if (name.includes('1098') || name.includes('mortgage')) {
    detectedType = 'Form 1098 (Mortgage Interest)';
    issuer = 'Chase Home Finance';
    wagesOrAmount = '$14,280.00 (Interest Paid)';
  } else if (name.includes('1099-nec') || name.includes('nec')) {
    detectedType = 'Form 1099-NEC (Nonemployee Compensation)';
    issuer = 'Studio Veloce Inc.';
    wagesOrAmount = '$24,800.00';
  } else if (name.includes('1099') || name.includes('div') || name.includes('vanguard')) {
    detectedType = 'Form 1099-DIV / Consolidated';
    issuer = 'Vanguard Group';
    wagesOrAmount = '$3,420.00';
  } else if (name.includes('p&l') || name.includes('profit') || name.includes('expense')) {
    detectedType = 'Schedule C P&L Statement';
    issuer = 'DesignLab Consulting';
    wagesOrAmount = '$42,100.00 Gross / $14,900 Expenses';
  }

  const hash = 'AES256:' + Math.random().toString(16).substring(2, 10);

    return res.json({
      status: 'success',
      data: {
        documentType: detectedType,
        issuerName: issuer,
        taxYear: '2025',
        ein,
        wagesOrAmount,
        taxWithheld,
        confidenceScore: 0.98,
        storageHash: hash,
        encryptionStandard: 'AES-256-GCM',
      },
    });
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      app: 'Vera — Tax & Accounting Client Companion',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // Practice Management status bridge endpoint
  app.get('/api/practice/status', (_req, res) => {
    res.json({
      systemProvider: 'Karbon',
      clientId: 'CL-88291-ROSTOVA',
      taxYear: '2025/2026',
      returnType: 'Form 1040 Individual Income Tax Return (with Schedule C)',
      irsSubmissionId: 'MEF-2026-US-CA-9918231',
      lastSyncedAt: new Date().toISOString(),
      assignedPreparer: {
        name: 'Marcus Vance, CPA',
        title: 'Senior Tax Partner',
        licenseNumber: 'CPA-CA-098231',
      },
    });
  });

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vera Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
