# 🌐 DEPLOYMENT ANLEITUNG - Dauerhaft online!

## Warum deployen?
- ✅ Keine Terminal-Fenster mehr
- ✅ Von überall erreichbar (auch Mobile)
- ✅ Läuft 24/7
- ✅ **KOSTENLOS** auf Render.com

---

## 🚀 Schritt-für-Schritt (10 Minuten)

### 1. GitHub Account erstellen (falls nicht vorhanden)

1. Gehe zu: **github.com**
2. Klicke "Sign up"
3. Erstelle Account (kostenlos)

### 2. Repository erstellen

1. Auf GitHub klicke: **"New repository"** (grüner Button)
2. Name: `werbeanalyse-dashboard`
3. **Public** auswählen
4. Klicke "Create repository"

### 3. Code hochladen

#### Option A: Mit GitHub Desktop (EINFACHER)

1. Lade GitHub Desktop: **desktop.github.com**
2. Installiere es
3. Melde dich an
4. "Add existing repository"
5. Wähle deinen `Werbeanalyse` Ordner
6. Klicke "Publish repository"

#### Option B: Mit Terminal

```bash
cd Desktop/Werbeanalyse
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/werbeanalyse-dashboard.git
git push -u origin main
```

### 4. Backend auf Render.com deployen

1. Gehe zu: **render.com**
2. Klicke "Get Started" → "Sign up with GitHub"
3. Klicke "New +" → "Web Service"
4. Verbinde dein GitHub Repository
5. **Settings:**
   ```
   Name: werbeanalyse-backend
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```
6. **Environment Variable hinzufügen:**
   ```
   Key: ANTHROPIC_API_KEY
   Value: sk-ant-api03-dein-echter-key
   ```
7. Klicke "Create Web Service"
8. **Warte 3-5 Minuten** bis es deployed ist
9. **Kopiere die URL** (z.B. `https://werbeanalyse-backend.onrender.com`)

### 5. Frontend anpassen

1. Öffne `index.html` in einem Texteditor
2. Suche nach: `http://localhost:3001`
3. Ersetze **ALLE Vorkommen** mit deiner Render URL
4. Speichern

### 6. Frontend auf GitHub Pages deployen

1. Auf GitHub: Gehe zu deinem Repository
2. Klicke "Settings"
3. Klicke "Pages" (linkes Menü)
4. Source: **"Deploy from branch"**
5. Branch: **main** auswählen
6. Ordner: **/ (root)**
7. Klicke "Save"
8. Warte 2 Minuten
9. Deine App ist jetzt online auf: `https://DEIN-USERNAME.github.io/werbeanalyse-dashboard/index.html`

---

## ✅ FERTIG!

Jetzt hast du:
- 🌐 Backend läuft auf Render.com (24/7)
- 🌐 Frontend läuft auf GitHub Pages
- 📱 Von überall erreichbar
- 🆓 100% kostenlos
- ⚡ Keine Terminal-Fenster mehr!

---

## 💰 Kosten

- **GitHub:** Kostenlos
- **Render.com Free Tier:**
  - ✅ 750 Stunden/Monat (mehr als genug!)
  - ⚠️ Schläft nach 15 Min Inaktivität
  - 🔄 Wacht beim ersten Request auf (10-20 Sek)
  
Für $7/Monat (Starter Plan):
- ⚡ Schläft nie ein
- 🚀 Immer schnell

---

## 🔄 Updates machen

Wenn du etwas änderst:

```bash
cd Desktop/Werbeanalyse
git add .
git commit -m "Update"
git push
```

Render.com updated automatisch nach 1-2 Minuten!

---

## 🆘 Probleme?

### "Backend schläft ein"
- Normal im Free Tier
- Erste Anfrage dauert 10-20 Sek
- Upgrade zu Starter ($7/Monat) für Always-On

### "GitHub Pages zeigt 404"
- Warte 5 Minuten
- Prüfe ob `index.html` im Root liegt
- URL sollte enden mit `/index.html`

### "Backend Error"
- Prüfe Environment Variable auf Render
- Prüfe Logs auf Render.com Dashboard
