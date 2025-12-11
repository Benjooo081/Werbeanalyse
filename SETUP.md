# 🚀 Werbeanalyse Dashboard - Production Setup

## Überblick

Das System besteht aus 2 Teilen:
1. **Backend** (Node.js Server) - Macht sichere API-Calls
2. **Frontend** (HTML/JS) - Das Dashboard

## ⚡ Quick Start (5 Minuten)

### Schritt 1: Backend Setup

```bash
# 1. Gehe in den backend Ordner
cd backend

# 2. Installiere Dependencies
npm install

# 3. Erstelle .env Datei
cp .env.example .env

# 4. Füge deinen API Key in .env ein
# Öffne .env und setze:
ANTHROPIC_API_KEY=sk-ant-api03-dein-echter-key-hier

# 5. Starte den Server
npm start
```

✅ Wenn du siehst:
```
╔════════════════════════════════════════╗
║   🚀 Werbeanalyse Backend Server      ║
║   Port: 3001                           ║
║   Status: ✅ Läuft                     ║
╚════════════════════════════════════════╝
```

Dann läuft das Backend!

### Schritt 2: Frontend öffnen

```bash
# Öffne werbeanalyse_debug.html in deinem Browser
# ODER starte einen lokalen Server:

# Mit Python:
python3 -m http.server 8000

# Mit Node:
npx http-server
```

Dann öffne: `http://localhost:8000/werbeanalyse_debug.html`

### Schritt 3: API Key im Frontend setzen

1. Klicke auf "🔑 API Key"
2. Gib einen beliebigen Text ein (z.B. "backend")
3. Klicke "Speichern"

⚠️ **Wichtig**: Der Key im Frontend ist nur ein Marker. Der echte Key ist sicher im Backend!

### Schritt 4: Teste!

1. Wähle eine Kategorie
2. Schreibe eine Werbungsbeschreibung
3. Klicke "🚀 Analysieren"
4. Warte 3-5 Sekunden
5. Siehe die Analyse!

## 🔧 Troubleshooting

### "Backend nicht erreichbar"

**Lösung 1: Backend läuft nicht**
```bash
cd backend
npm start
```

**Lösung 2: Falscher Port**
- Backend muss auf Port 3001 laufen
- Check in `.env`: `PORT=3001`

**Lösung 3: CORS Problem**
- Öffne `backend/server.js`
- CORS ist bereits aktiviert

### "API Key nicht konfiguriert"

```bash
# Im backend Ordner:
ls -la .env

# Falls nicht vorhanden:
cp .env.example .env

# Dann editiere .env und füge deinen Key ein
```

### "JSON Parse Error"

Das ist ein Claude API Problem. Lösungen:
1. Warte 10 Sekunden und versuche es nochmal
2. Vereinfache die Beschreibung
3. Check ob dein API Key Guthaben hat

## 📱 Für Deployment (Optional)

### Backend auf Render.com deployen:

1. Gehe zu [render.com](https://render.com)
2. "New Web Service"
3. Connect GitHub Repository
4. Settings:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Add Environment Variable: `ANTHROPIC_API_KEY=dein-key`
5. Deploy!

6. Update Frontend:
   - Ändere `http://localhost:3001` zu deiner Render URL
   - Z.B. `https://dein-app.onrender.com`

### Frontend auf GitHub Pages:

1. Push zu GitHub
2. Settings → Pages → Source: main branch
3. Fertig!

## 🎯 Features

✅ **Werbungsanalyse**
- KI-basierte Bewertung von Attributen
- Automatische Red Flags Erkennung
- Top Attribute Identifikation

✅ **Datenmanagement**
- Export als JSON
- Import von Kollegen-Daten
- Merge-Funktion (keine Duplikate)

✅ **Insights**
- Statistiken über alle Werbungen
- Charts (Kategorien, Attribute)
- Häufigste Red Flags

✅ **KI-Datenanalyse**
- Stelle Fragen zu deinen Daten
- Erhalte detaillierte Insights
- Trend-Analysen

✅ **Matching** (In Arbeit)
- Nutzer-Profil erstellen
- Beste Werbungen finden

## 💰 Kosten

Die Anthropic API kostet ca:
- Input: ~$0.003 per 1K tokens
- Output: ~$0.015 per 1K tokens

Eine Analyse kostet ca. **$0.02 - $0.05** 

Bei 100 Analysen pro Tag: ~$3-5/Tag

## 🔒 Sicherheit

✅ API Key ist nur im Backend (nicht im Browser)
✅ CORS Protection
✅ Request Size Limits
⚠️ Für Production: Rate Limiting hinzufügen

## 📞 Support

Bei Problemen:
1. Check Debug Console (🐛 Button)
2. Check Backend Logs (Terminal)
3. Check ob API Key korrekt ist
4. Check ob Guthaben vorhanden ist

## 🎉 Erfolg!

Wenn alles funktioniert, siehst du:
- ✅ Echte KI-Analysen statt Demo
- ✅ "API ✓" Status im Dashboard
- ✅ Detaillierte Analyse-Ergebnisse
- ✅ KI-Datenanalyse funktioniert

Viel Erfolg! 🚀
