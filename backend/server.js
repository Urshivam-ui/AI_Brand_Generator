import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json());

// API Key Verification
if (!process.env.GEMINI_API_KEY) {
  console.error(" ERROR: GEMINI_API_KEY is missing from .env file!");
} else {
  console.log(" GEMINI_API_KEY loaded successfully!");
}

// Gemini Client Initialization
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Root Route (Health Check)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: " AI Brand Generator Backend is running smoothly!",
    endpoints: {
      generateBrand: "POST /api/generate-brand",
      generateLogo: "POST /api/generate-logo"
    }
  });
});

// 1. Generate Complete Brand Kit API Endpoint (Accepts single AI prompt)
app.post('/api/generate-brand', async (req, res) => {
  try {
    const { prompt: userPrompt } = req.body;

    if (!userPrompt || !userPrompt.trim()) {
      return res.status(400).json({
        success: false,
        error: "A brand description prompt is required."
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY is not configured on the server."
      });
    }

    // Initialize Gemini Model
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const systemPrompt = `You are an elite branding consultant. Analyze the following user prompt describing a business idea and generate a complete brand identity package.

USER PROMPT: "${userPrompt}"

RULES:
1. Extract or intelligently infer the "businessName", "niche", and "vibe" from the prompt.
2. ALL output values MUST be in clear, professional ENGLISH language.
3. If specific details (like prices or service names) aren't explicitly mentioned, creatively generate fitting details based on the industry context.

Return JSON ONLY matching this exact structure:
{
  "businessName": "Extracted or inferred business name",
  "niche": "Industry / Niche",
  "vibe": "Brand vibe keywords (e.g. Elegant, Modern, Premium)",
  "taglines": [
    "Catchy tagline 1",
    "Catchy tagline 2",
    "Catchy tagline 3"
  ],
  "colorPalette": [
    {"name": "Primary Color", "hex": "#HEX1"},
    {"name": "Secondary Color", "hex": "#HEX2"},
    {"name": "Accent Color", "hex": "#HEX3"},
    {"name": "Dark Neutral", "hex": "#HEX4"}
  ],
  "typography": {
    "heading": "Playfair Display",
    "body": "Inter"
  },
  "socialCaptions": [
    "Exciting news! We are officially open for business. Check out our services today! #Branding #NewLaunch",
    "Elevate your experience with us. Quality and excellence guaranteed. #ModernBusiness"
  ],
  "logoPrompt": "A clean minimalist vector logo icon, high quality, professional English vector design, flat white background",
  "landingPageHTML": "<div style='padding:60px 20px; text-align:center; background:#0f172a; color:#f8fafc; font-family:sans-serif;'><h1 style='font-size:3rem; margin-bottom:1rem;'>Welcome</h1><p style='font-size:1.25rem; color:#94a3b8; max-width:600px; margin:0 auto 2rem;'>Modern craftsmanship and excellence.</p><button style='background:#6366f1; color:white; border:none; padding:12px 28px; border-radius:8px; font-weight:bold; cursor:pointer;'>Get Started</button></div>"
}`;

    const result = await model.generateContent(systemPrompt);
    let rawText = result.response.text();

    // Clean up response formatting
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const brandData = JSON.parse(rawText);

    // Dynamic Seeded Image Generation via Pollinations AI
    const randomSeed = Math.floor(Math.random() * 9999);
    const encodedPrompt = encodeURIComponent(brandData.logoPrompt || `Vector logo for ${brandData.businessName}`);
    const logoUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=400&height=400&seed=${randomSeed}&nologo=true`;

    res.json({
      success: true,
      data: { 
        ...brandData, 
        logoUrl 
      }
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Failed to generate brand assets." 
    });
  }
});

// 2. Regenerate Logo API Endpoint
app.post('/api/generate-logo', async (req, res) => {
  try {
    const { logoPrompt, businessName, niche } = req.body;

    const query = logoPrompt || `Modern vector logo design for ${businessName || 'Brand'}, ${niche || 'Business'} theme, vector, minimalist, white background`;

    const randomSeed = Math.floor(Math.random() * 10000);
    const encodedPrompt = encodeURIComponent(query);
    const logoUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=400&height=400&seed=${randomSeed}&nologo=true`;

    res.json({ success: true, logoUrl });
  } catch (error) {
    console.error("Logo generation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});