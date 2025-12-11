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

        const prompt = `Du bist ein Experte für Werbeanalyse und erstellst detaillierte Attribut-Profile für ein Matching-System.

WICHTIG: Dies ist KEINE Bewertung ob die Werbung gut oder schlecht ist! 
Du misst nur die INTENSITÄT jedes Attributs auf einer Skala von 0-100.

Werbung:
Brand: ${brand || 'Unbekannt'}
Kategorie: ${category}
CTR: ${ctr || 'N/A'}
Beschreibung: ${description}

Erstelle ein Attribut-Profil. Bewerte für JEDES Attribut:
- 0 = Attribut ist gar nicht präsent
- 50 = Attribut ist moderat präsent  
- 100 = Attribut ist sehr dominant

Antworte NUR mit diesem exakten JSON-Format (keine zusätzlichen Texte):
{
  "summary": "Kurze neutrale Beschreibung der Werbung in 1-2 Sätzen",
  "dominant_attributes": ["attr1", "attr2", "attr3", "attr4", "attr5"],
  "weak_attributes": ["attr1", "attr2"],
  "intensity": "niedrig|mittel|hoch",
  "attributes": {
    "werte": {
      "nachhaltigkeit": {"score": 0, "reasoning": "kurz"},
      "familie": {"score": 0, "reasoning": "kurz"},
      "individualitaet": {"score": 0, "reasoning": "kurz"},
      "erfolg_leistung": {"score": 0, "reasoning": "kurz"},
      "sicherheit": {"score": 0, "reasoning": "kurz"},
      "freiheit": {"score": 0, "reasoning": "kurz"},
      "tradition": {"score": 0, "reasoning": "kurz"},
      "innovation": {"score": 0, "reasoning": "kurz"},
      "gemeinschaft": {"score": 0, "reasoning": "kurz"},
      "gesundheit": {"score": 0, "reasoning": "kurz"},
      "authentizitaet": {"score": 0, "reasoning": "kurz"},
      "luxus": {"score": 0, "reasoning": "kurz"},
      "pragmatismus": {"score": 0, "reasoning": "kurz"},
      "abenteuer": {"score": 0, "reasoning": "kurz"}
    },
    "emotional": {
      "humor": {"score": 0, "reasoning": "kurz"},
      "nostalgie": {"score": 0, "reasoning": "kurz"},
      "inspiration": {"score": 0, "reasoning": "kurz"},
      "vertrauen": {"score": 0, "reasoning": "kurz"},
      "ueberraschung": {"score": 0, "reasoning": "kurz"},
      "freude": {"score": 0, "reasoning": "kurz"},
      "stolz": {"score": 0, "reasoning": "kurz"},
      "neugier": {"score": 0, "reasoning": "kurz"},
      "empathie": {"score": 0, "reasoning": "kurz"},
      "aufregung": {"score": 0, "reasoning": "kurz"},
      "entspannung": {"score": 0, "reasoning": "kurz"},
      "rebellion": {"score": 0, "reasoning": "kurz"},
      "dringlichkeit": {"score": 0, "reasoning": "kurz"},
      "hoffnung": {"score": 0, "reasoning": "kurz"}
    },
    "aesthetik": {
      "minimalistisch": {"score": 0, "reasoning": "kurz"},
      "luxurioes": {"score": 0, "reasoning": "kurz"},
      "verspielt": {"score": 0, "reasoning": "kurz"},
      "professionell": {"score": 0, "reasoning": "kurz"},
      "natuerlich": {"score": 0, "reasoning": "kurz"},
      "technologisch": {"score": 0, "reasoning": "kurz"},
      "vintage": {"score": 0, "reasoning": "kurz"},
      "urban": {"score": 0, "reasoning": "kurz"},
      "rustikal": {"score": 0, "reasoning": "kurz"},
      "elegant": {"score": 0, "reasoning": "kurz"},
      "dynamisch": {"score": 0, "reasoning": "kurz"},
      "ruhig": {"score": 0, "reasoning": "kurz"},
      "kuenstlerisch": {"score": 0, "reasoning": "kurz"},
      "dokumentarisch": {"score": 0, "reasoning": "kurz"}
    }
  }
}

WICHTIG: 
- dominant_attributes = Top 5 stärkste Attribute (höchste Scores)
- weak_attributes = 2 schwächste Attribute die normalerweise erwartet würden
- intensity = Gesamteindruck wie stark die Werbung kommuniziert (niedrig/mittel/hoch)
- Sei objektiv und neutral - keine Bewertung ob gut/schlecht!`;

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
