// Werbeanalyse Backend Server MVP2
// Installation: npm install express cors dotenv
// Start: node server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Kategorie-spezifische Gewichtungen
const CATEGORY_WEIGHTS = {
    'Lebensmittel & Getränke': {
        werte: 0.45,
        emotional: 0.35,
        aesthetik: 0.20
    },
    'Technologie & Elektronik': {
        werte: 0.25,
        emotional: 0.25,
        aesthetik: 0.50
    },
    'Mode & Fashion': {
        werte: 0.20,
        emotional: 0.30,
        aesthetik: 0.50
    },
    'Sport & Fitness': {
        werte: 0.35,
        emotional: 0.35,
        aesthetik: 0.30
    },
    'Automotive': {
        werte: 0.30,
        emotional: 0.25,
        aesthetik: 0.45
    },
    'Reisen & Tourismus': {
        werte: 0.25,
        emotional: 0.50,
        aesthetik: 0.25
    },
    'Finanzen & Versicherungen': {
        werte: 0.60,
        emotional: 0.30,
        aesthetik: 0.10
    },
    'Beauty & Kosmetik': {
        werte: 0.25,
        emotional: 0.30,
        aesthetik: 0.45
    },
    'Haushalt & Wohnen': {
        werte: 0.35,
        emotional: 0.25,
        aesthetik: 0.40
    },
    'Entertainment & Medien': {
        werte: 0.15,
        emotional: 0.60,
        aesthetik: 0.25
    }
};

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'MVP2 Backend läuft!', version: '2.0' });
});

// Get Category Weights
app.get('/api/category-weights', (req, res) => {
    res.json({ weights: CATEGORY_WEIGHTS });
});

// Anthropic API Proxy - Werbungsanalyse (Attribut-Profiling)
app.post('/api/analyze', async (req, res) => {
    try {
        const { brand, category, ctr, description } = req.body;

        if (!description || !category) {
            return res.status(400).json({ 
                error: 'Beschreibung und Kategorie sind erforderlich' 
            });
        }

        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ 
                error: 'API Key nicht konfiguriert. Bitte .env Datei erstellen.' 
            });
        }

        const prompt = `Du bist ein DATA SCIENTIST der Werbungen für ein Machine Learning Matching-System katalogisiert.

⚠️ KRITISCH ZU VERSTEHEN:
- Dies ist KEIN Marketing-Feedback System
- Dies ist KEIN Werbungs-Optimierungs-Tool  
- Dies ist ein DATEN-ERFASSUNGS-System für ML-Training

DEINE ROLLE: Neutraler Daten-Encoder
DEINE AUFGABE: Messe Attribut-Intensitäten für Matching-Algorithmus
DEIN OUTPUT: Strukturierte Daten, KEINE Meinungen

═══════════════════════════════════════════════════════════

VERBOTENE WORTE/KONZEPTE:
❌ "sollte", "könnte", "müsste", "besser", "schlechter"
❌ "empfehlen", "optimieren", "verbessern", "verstärken"
❌ "gut", "schlecht", "effektiv", "problematisch", "fehlt"
❌ "Schwäche", "Stärke", "Chance", "Risiko"
❌ Jegliche Form von Ratschlägen oder Empfehlungen

ERLAUBTE KONZEPTE:
✅ "vorhanden", "präsent", "messbar", "beobachtbar"
✅ "Score X basierend auf Y Element"
✅ "Attribut Z zu X% sichtbar weil..."
✅ Rein deskriptive, objektive Fakten

═══════════════════════════════════════════════════════════

WERBUNG ZU ANALYSIEREN:
Brand: ${brand || 'Unbekannt'}
Kategorie: ${category}
CTR: ${ctr || 'N/A'}
Beschreibung: ${description}

═══════════════════════════════════════════════════════════

SCORING METHODIK (0-100):
- 0-20:   Attribut nicht vorhanden oder nur implizit erwähnt
- 21-40:  Attribut leicht angedeutet, nicht zentral
- 41-60:  Attribut moderat präsent, erkennbar
- 61-80:  Attribut stark präsent, wichtiger Teil der Message
- 81-100: Attribut dominiert die Werbung, ist Kern-Element

WICHTIG: Score basiert AUSSCHLIESSLICH auf WAS IST, NICHT auf was sein sollte!

═══════════════════════════════════════════════════════════

BEISPIELE FÜR KORREKTES REASONING:

FALSCH: "Nachhaltigkeit: 30 - sollte stärker betont werden"
RICHTIG: "Nachhaltigkeit: 30 - nur durch grüne Farbwahl angedeutet"

FALSCH: "Innovation: 70 - könnte noch technischer sein"
RICHTIG: "Innovation: 70 - dominiert durch 'Neue KI-Technologie' Text"

FALSCH: "Familie: 20 - fehlt, obwohl wichtig für Zielgruppe"
RICHTIG: "Familie: 20 - nur durch Kind im Hintergrund sichtbar"

═══════════════════════════════════════════════════════════

OUTPUT FORMAT (NUR JSON, KEINE anderen Texte):

{
  "summary": "Einzeiler WAS die Werbung zeigt (KEIN Urteil!)",
  "dominant_attributes": ["die 20 Attribute mit höchsten Scores"],
  "weak_attributes": ["5 Attribute mit niedrigsten Scores"],
  "intensity": "niedrig|mittel|hoch",
  "attributes": {
    "werte": {
      "nachhaltigkeit": {"score": 0, "reasoning": "WAS vorhanden ist, max 10 Wörter"},
      "familie": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "individualitaet": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "erfolg_leistung": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "sicherheit": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "freiheit": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "tradition": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "innovation": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "gemeinschaft": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "gesundheit": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "authentizitaet": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "luxus": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "pragmatismus": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "abenteuer": {"score": 0, "reasoning": "WAS vorhanden ist"}
    },
    "emotional": {
      "humor": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "nostalgie": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "inspiration": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "vertrauen": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "ueberraschung": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "freude": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "stolz": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "neugier": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "empathie": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "aufregung": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "entspannung": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "rebellion": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "dringlichkeit": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "hoffnung": {"score": 0, "reasoning": "WAS vorhanden ist"}
    },
    "aesthetik": {
      "minimalistisch": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "luxurioes": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "verspielt": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "professionell": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "natuerlich": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "technologisch": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "vintage": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "urban": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "rustikal": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "elegant": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "dynamisch": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "ruhig": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "kuenstlerisch": {"score": 0, "reasoning": "WAS vorhanden ist"},
      "dokumentarisch": {"score": 0, "reasoning": "WAS vorhanden ist"}
    }
  }
}

═══════════════════════════════════════════════════════════

FINAL REMINDER:
Du bist ein SENSOR, kein BERATER.
Du MISST, du BEWERTEST NICHT.
Du beschreibst IST-Zustand, nicht SOLL-Zustand.

Denke wie ein Barcode-Scanner: Lies was da ist, gib Daten zurück, KEINE Meinungen.`;

        console.log('📡 Sende Anfrage an Anthropic API...');

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 4000,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error:', errorText);
            return res.status(response.status).json({ 
                error: `API Error: ${response.status}`,
                details: errorText.substring(0, 200)
            });
        }

        const data = await response.json();
        console.log('✅ API Response erhalten');

        if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
            return res.status(500).json({ 
                error: 'Ungültige API Response Struktur' 
            });
        }

        let text = data.content[0].text || '';
        
        // Extrahiere JSON
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1) {
            text = text.substring(firstBrace, lastBrace + 1);
        }

        try {
            const analysis = JSON.parse(text);
            console.log('✅ JSON erfolgreich geparst');
            res.json({ success: true, analysis });
        } catch (parseError) {
            console.error('❌ JSON Parse Error:', parseError.message);
            console.error('Text:', text.substring(0, 200));
            res.status(500).json({ 
                error: 'JSON Parse Error',
                details: parseError.message,
                rawText: text.substring(0, 500)
            });
        }

    } catch (error) {
        console.error('❌ Server Error:', error);
        res.status(500).json({ 
            error: 'Server Error',
            message: error.message 
        });
    }
});

// KI-Datenanalyse Endpoint
app.post('/api/analyze-data', async (req, res) => {
    try {
        const { query, ads } = req.body;

        if (!query || !ads || ads.length === 0) {
            return res.status(400).json({ 
                error: 'Query und Ads sind erforderlich' 
            });
        }

        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ 
                error: 'API Key nicht konfiguriert' 
            });
        }

        const dataContext = JSON.stringify({
            total_ads: ads.length,
            categories: [...new Set(ads.map(a => a.category))],
            all_ads: ads.map(ad => ({
                id: ad.id,
                brand: ad.brand,
                category: ad.category,
                ctr: ad.ctr,
                summary: ad.analysis.summary,
                weak_attributes: ad.analysis.weak_attributes,
                dominant_attributes: ad.analysis.dominant_attributes,
                intensity: ad.analysis.intensity
            }))
        }, null, 2);

        const prompt = `Du bist ein Datenanalyst für Werbedaten. Analysiere die folgenden Werbedaten und beantworte die Nutzeranfrage präzise und detailliert.

Werbedaten:
${dataContext}

Nutzeranfrage: ${query}

Gib eine strukturierte, detaillierte Analyse mit konkreten Zahlen, Trends und Insights. Sei spezifisch und actionable.`;

        console.log('📡 Sende KI-Analyse-Anfrage...');

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 4000,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error:', errorText);
            return res.status(response.status).json({ 
                error: `API Error: ${response.status}` 
            });
        }

        const data = await response.json();
        
        if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
            return res.status(500).json({ 
                error: 'Ungültige API Response' 
            });
        }

        const analysisText = data.content[0].text || '';
        console.log('✅ KI-Analyse erfolgreich');

        res.json({ success: true, analysis: analysisText });

    } catch (error) {
        console.error('❌ Server Error:', error);
        res.status(500).json({ 
            error: 'Server Error',
            message: error.message 
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   🚀 Werbeanalyse Backend MVP2        ║
║                                        ║
║   Port: ${PORT}                          ║
║   Status: ✅ Läuft                     ║
║   Version: 2.0 - Attribut-Profiling   ║
║                                        ║
║   Endpoints:                           ║
║   GET  /api/health                     ║
║   GET  /api/category-weights           ║
║   POST /api/analyze                    ║
║   POST /api/analyze-data               ║
╚════════════════════════════════════════╝
    `);
});
