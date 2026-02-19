# VFei Kursverwaltung

Modul 294 – Frontend einer interaktiven Webapplikation
Schule: VFei Bildungszentrum

---

## Technologie-Stack

| Technologie | Version |
|---|---|
| Next.js (App Router) | 16 |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | 4 |

---

## Installation & Start

**Voraussetzungen:**
- XAMPP läuft (Apache + MySQL)
- Die REST-API ist erreichbar unter `http://localhost/api/src/`

```bash
npm install
npm run dev      # Entwicklungsserver auf http://localhost:3000
npm run build    # Produktions-Build
npm run start    # Produktionsserver starten
```

---

## Authentifizierung

Alle Seiten ausser `/login` und `/register` sind durch Middleware geschützt. Der Login speichert einen JWT-Token als httpOnly-Cookie (`session_token`). Jede API-Anfrage sendet diesen Token als Bearer-Token im Authorization-Header.

**Ablauf:**
1. Benutzer ruft eine geschützte Seite auf
2. Middleware prüft das Cookie → kein Cookie: Redirect auf `/login`
3. Nach erfolgreichem Login: Redirect auf `/dashboard`
4. Logout löscht das Cookie und leitet auf `/login` weiter

---

## Permanente Links

Alle CRUD-Elemente sind über permanente URLs direkt aufrufbar:

### Lernende
| Aktion | URL |
|---|---|
| Übersicht | `/lernende` |
| Detail | `/lernende/[id]` |
| Neu erfassen | `/lernende/manage` |
| Bearbeiten | `/lernende/manage/[id]` |

### Kurse
| Aktion | URL |
|---|---|
| Übersicht | `/kurse` |
| Detail | `/kurse/[id]` |
| Neu erfassen | `/kurse/manage` |
| Bearbeiten | `/kurse/manage/[id]` |

### Dozenten
| Aktion | URL |
|---|---|
| Übersicht | `/dozenten` |
| Detail | `/dozenten/[id]` |
| Neu erfassen | `/dozenten/manage` |
| Bearbeiten | `/dozenten/manage/[id]` |

### Lehrbetriebe
| Aktion | URL |
|---|---|
| Übersicht | `/lehrbetriebe` |
| Detail | `/lehrbetriebe/[id]` |
| Neu erfassen | `/lehrbetriebe/manage` |
| Bearbeiten | `/lehrbetriebe/manage/[id]` |

### Länder
| Aktion | URL |
|---|---|
| Übersicht | `/laender` |
| Detail | `/laender/[id]` |
| Neu erfassen | `/laender/manage` |
| Bearbeiten | `/laender/manage/[id]` |

---

## Typischer Ablauf (Benutzer-Flow)

### Neuen Kurs mit Lernenden einrichten

```
1. /dozenten/manage          → Dozent erfassen (falls noch nicht vorhanden)
2. /lernende/manage          → Lernende erfassen
3. /lehrbetriebe/manage      → Lehrbetrieb erfassen (optional)
4. /lernende/manage/[id]     → Lehrbetrieb dem Lernenden zuweisen
5. /kurse/manage             → Kurs erstellen, Dozent auswählen
6. /kurse/manage/[id]        → Lernende in den Kurs einschreiben
7. /kurse/manage/[id]        → Noten eintragen nach Kursabschluss
```

### Lernende verwalten

```
Lernende/r anlegen  →  /lernende/manage
  ├── Grunddaten: Vorname, Nachname, Adresse, Land, E-Mail
  ├── Optional: Lehrbetrieb + Beruf + Lehrdaten direkt beim Erstellen
  └── Nach dem Erstellen: Kurse einschreiben via /lernende/manage/[id]

Lernende/r bearbeiten  →  /lernende/manage/[id]
  ├── Stammdaten anpassen
  ├── Lehrbetrieb zuweisen / wechseln / entfernen
  ├── Noten bearbeiten
  ├── Kurse hinzufügen oder entfernen
  └── Person löschen
```

### Lehrbetrieb mit Lernenden verwalten

```
Lehrbetrieb bearbeiten  →  /lehrbetriebe/manage/[id]
  ├── Firmendaten anpassen
  ├── Lernende dem Betrieb zuweisen (Dropdown + Beruf + Daten)
  └── Lernende aus dem Betrieb entfernen
```

---

## Beziehungen zwischen Entitäten

```
Dozent ──────────────── Kurs (1:n)
                          │
                          │  kurse_lernende (Note)
                          │
Lernende/r ───────────────┘
    │
    │  lehrbetrieb_lernende (Beruf, Start, Ende)
    │
Lehrbetrieb

Lernende/r  ──── Land (n:1)
Dozent      ──── Land (n:1)
```

---

## Datenfluss

Alle Seiten sind **Server Components** — Daten werden serverseitig via `fetchWithAuth()` geladen. Mutationen laufen über **Next.js Server Actions** (`actions.ts` pro Route):

```
Server Component (page.tsx)
  └── lädt Daten via fetchWithAuth()
  └── rendert Client Component (edit-form.tsx / create-form.tsx)
        └── ruft Server Action bei Submit auf
              └── PUT/POST/DELETE via fetchWithAuth()
              └── revalidatePath() → Cache invalidieren
              └── redirect() → zurück zur Detail- oder Listenansicht
```

Filterung auf den Übersichtsseiten ist **client-seitig** mit ~400ms Debounce. Die URL wird dabei aktualisiert, sodass gefilterte Ansichten als permanenter Link teilbar sind (z.B. `/lernende?nr_lehrbetrieb=2`).
