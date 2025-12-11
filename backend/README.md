# Werbeanalyse Backend Server

Backend-Server für das Werbeanalyse Dashboard. Ermöglicht sichere API-Calls zur Anthropic API ohne CORS-Probleme.

## 🚀 Quick Start

### 1. Installation

```bash
cd backend
npm install
```

### 2. API Key konfigurieren

Erstelle eine `.env` Datei:

```bash
cp .env.example .env
```

Füge deinen Anthropic API Key ein:

```
ANTHROPIC_API_KEY=sk-ant-api03-dein-echter-key
PORT=3001
```

### 3. Server starten

```bash
npm start
```

Der Server läuft jetzt auf `http://localhost:3001`

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### Werbung analysieren
```
POST /api/analyze
Content-Type: application/json

{
  "brand": "Nike",
  "category": "Sport & Fitness",
  "ctr": "4.2%",
  "description": "Innovative Laufschuhe..."
}
```

### Datenanalyse
```
POST /api/analyze-data
Content-Type: application/json

{
  "query": "Welche Kategorien performen am besten?",
  "ads": [...]
}
```

## 🔧 Development

Mit Auto-Reload:
```bash
npm run dev
```

## 📦 Deployment

### Option 1: Lokaler Server
- Einfach `npm start` auf deinem Computer
- Frontend auf `http://localhost:3001` konfigurieren

### Option 2: Cloud Hosting (Render, Railway, Heroku)

**Render.com (Kostenlos):**
1. Gehe zu render.com
2. "New Web Service" erstellen
3. GitHub Repository verbinden
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Environment Variable hinzufügen: `ANTHROPIC_API_KEY`
7. Deploy!

**Railway.app:**
1. Gehe zu railway.app
2. "New Project" → "Deploy from GitHub"
3. Repository auswählen
4. Environment Variable `ANTHROPIC_API_KEY` hinzufügen
5. Automatisch deployed!

### Option 3: Vercel/Netlify Serverless
Für diese Platforms kann der Code zu Serverless Functions umgebaut werden.

## 🔒 Sicherheit

- API Key wird niemals im Frontend exponiert
- CORS ist aktiviert (kann eingeschränkt werden)
- Request Size Limit: 10MB
- Rate Limiting sollte für Production hinzugefügt werden

## 🐛 Troubleshooting

**Port bereits belegt:**
```bash
# Ändere PORT in .env zu z.B. 3002
PORT=3002
```

**API Key funktioniert nicht:**
- Prüfe ob der Key mit `sk-ant-` beginnt
- Prüfe ob der Key korrekt in `.env` ist
- Prüfe ob Guthaben auf dem Anthropic Account vorhanden ist

**CORS Fehler:**
- Backend sollte auf Port 3001 laufen
- Frontend sollte auf die korrekte Backend-URL zeigen

## 📝 Logs

Der Server loggt alle Requests:
- ✅ Erfolgreiche Analysen
- ❌ Fehler mit Details
- 📡 API Calls

## 🔄 Updates

```bash
git pull
npm install
npm start
```
