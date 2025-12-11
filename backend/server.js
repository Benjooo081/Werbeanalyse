// Werbeanalyse Backend Server
// Installation: npm install express cors dotenv node-fetch
// Start: node server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend läuft!' });
});

// Anthropic API Proxy - Werbungsanalyse
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

        const prompt = `Du musst mit einem validen JSON-Objekt antworten. KEINE zusätzlichen Texte, KEINE Erklärungen, KEINE Markdown-Formatierung.

Analysiere diese Werbung und bewerte die wichtigsten Attribute auf einer Skala von -100 bis +100.

Werbung:
Brand: ${brand || 'Unbekannt'}
Kategorie: ${category}
CTR: ${ctr || 'N/A'}
Beschreibung: ${description}

Antworte ausschließlich mit diesem JSON-Format:
{
  "summary": "Kurze Analyse-Zusammenfassung in 1-2 Sätzen",
  "top_attributes": ["attr1", "attr2", "attr3"],
  "red_flags": ["attr1", "attr2"],
  "attributes": {
    "werte": {
      "nachhaltigkeit": {"score": 0, "type": "neutral", "reason": "kurz"},
      "innovation": {"score": 70, "type": "strength", "reason": "kurz"},
      "familie": {"score": 30, "type": "neutral", "reason": "kurz"}
    },
    "emotional": {
      "vertrauen": {"score": 50, "type": "neutral", "reason": "kurz"},
      "freude": {"score": 80, "type": "strength", "reason": "kurz"}
    },
    "aesthetik": {
      "professionell": {"score": 60, "type": "strength", "reason": "kurz"},
      "modern": {"score": 70, "type": "strength", "reason": "kurz"}
    }
  }
}`;

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
                max_tokens: 3000,
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
                red_flags: ad.analysis.red_flags,
                top_attributes: ad.analysis.top_attributes
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
║   🚀 Werbeanalyse Backend Server      ║
║                                        ║
║   Port: ${PORT}                          ║
║   Status: ✅ Läuft                     ║
║                                        ║
║   Endpoints:                           ║
║   GET  /api/health                     ║
║   POST /api/analyze                    ║
║   POST /api/analyze-data               ║
╚════════════════════════════════════════╝
    `);
});
