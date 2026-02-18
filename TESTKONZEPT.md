# Testkonzept – VFei Kursverwaltung

**Modul:** 294 – Webapplikation realisieren
**Projekt:** VFei Kursverwaltung
**Datum:** 2026-02-18

---

## 1. Einleitung

Dieses Testkonzept beschreibt, wie die Kursverwaltungsapplikation manuell getestet wird. Da kein automatisiertes Test-Framework konfiguriert ist, werden alle Tests manuell im Browser durchgeführt. Ziel ist es, sicherzustellen, dass alle CRUD-Operationen, Filter, Beziehungen und Navigationsflüsse korrekt funktionieren.

---

## 2. Testumgebung

| Komponente | Details |
|---|---|
| Frontend | Next.js 16 auf `http://localhost:3000` |
| Backend (API) | PHP-REST-API auf `http://localhost/api/src` |
| Datenbank | MySQL via XAMPP |
| Browser | Google Chrome (aktuellste Version) |
| Betriebssystem | Windows 11 |

**Voraussetzungen vor dem Testen:**
- XAMPP läuft (Apache + MySQL)
- `npm run dev` ist gestartet
- Ein gültiger Benutzer-Account existiert in der Datenbank

---

## 3. Testfälle

### 3.1 Authentifizierung

| ID | Beschreibung | Erwartetes Ergebnis |
|---|---|---|
| A-01 | Login mit korrekten Zugangsdaten | Redirect auf Dashboard, JWT-Cookie gesetzt |
| A-02 | Login mit falschem Passwort | Fehlermeldung, kein Cookie |
| A-03 | Direktaufruf einer geschützten Seite ohne Login | Redirect auf `/login` |
| A-04 | Logout | Cookie gelöscht, Redirect auf Login |

---

### 3.2 Lernende

| ID | Beschreibung | Erwartetes Ergebnis |
|---|---|---|
| L-01 | Lernenden-Übersicht aufrufen | Tabelle mit allen Lernenden sichtbar |
| L-02 | Suche nach Name | Tabelle filtert auf passende Einträge |
| L-03 | Filter nach Land | Nur Lernende aus diesem Land werden angezeigt |
| L-04 | Neuen Lernenden erstellen (ohne Lehrbetrieb) | Lernende/r erscheint in der Übersicht |
| L-05 | Neuen Lernenden erstellen (mit Lehrbetrieb) | Lernende/r + Lehrbetrieb-Beziehung gespeichert |
| L-06 | Lernenden-Detailseite öffnen | Alle Felder, Kurse und Lehrbetrieb korrekt angezeigt |
| L-07 | Lernenden bearbeiten – Grunddaten ändern | Änderungen gespeichert |
| L-08 | Lehrbetrieb beim Lernenden zuweisen | Beziehung neu erstellt (POST) |
| L-09 | Lehrbetrieb beim Lernenden wechseln | Bestehende Beziehung aktualisiert (PUT) |
| L-10 | Lehrbetrieb auf "Kein Betrieb" setzen | Beziehung gelöscht (DELETE) |
| L-11 | Note eines belegten Kurses ändern | Neue Note in der Datenbank gespeichert |
| L-12 | Kurs aus Profil entfernen (Trash-Button) | Bestätigungsdialog erscheint, bei OK: Kurs entfernt |
| L-13 | Kurs einschreiben über Dropdown | Kurs erscheint in der Kursliste des Lernenden |
| L-14 | Lernenden löschen | Nicht mehr in der Übersicht |

---

### 3.3 Kurse

| ID | Beschreibung | Erwartetes Ergebnis |
|---|---|---|
| K-01 | Kurs-Übersicht aufrufen | Tabelle mit allen Kursen |
| K-02 | Suche nach Kursthema | Tabelle filtert korrekt |
| K-03 | Filter nach Dozent | Nur Kurse dieses Dozenten angezeigt |
| K-04 | Neuen Kurs erstellen | Kurs erscheint in der Übersicht |
| K-05 | Kurs-Detailseite aufrufen | Alle Details + eingeschriebene Lernende sichtbar |
| K-06 | Kurs bearbeiten – Stammdaten ändern | Änderungen gespeichert |
| K-07 | Note eines Lernenden im Notenblatt ändern | Note korrekt in DB aktualisiert |
| K-08 | Lernenden aus Kurs entfernen (Trash-Button) | Bestätigungsdialog, bei OK: Lernende/r entfernt |
| K-09 | Neuen Lernenden in Kurs einschreiben | Lernende/r erscheint im Notenblatt |
| K-10 | Kurs löschen | Nicht mehr in der Übersicht |

---

### 3.4 Dozenten

| ID | Beschreibung | Erwartetes Ergebnis |
|---|---|---|
| D-01 | Dozenten-Übersicht aufrufen | Tabelle mit allen Dozenten |
| D-02 | Neuen Dozenten erstellen | Dozent erscheint in der Übersicht |
| D-03 | Dozenten-Detailseite aufrufen | Alle Felder + geleitete Kurse sichtbar |
| D-04 | Dozenten bearbeiten | Alle Felder werden korrekt gespeichert |
| D-05 | Dozenten löschen | Nicht mehr in der Übersicht |

---

### 3.5 Lehrbetriebe

| ID | Beschreibung | Erwartetes Ergebnis |
|---|---|---|
| B-01 | Lehrbetriebe-Übersicht aufrufen | Tabelle mit allen Betrieben |
| B-02 | Suche nach Firmaname | Tabelle filtert korrekt |
| B-03 | Neuen Lehrbetrieb erstellen | Betrieb erscheint in der Übersicht |
| B-04 | Lehrbetrieb-Detailseite aufrufen | Adresse + Lernende im Betrieb angezeigt |
| B-05 | Lehrbetrieb bearbeiten | Änderungen gespeichert |
| B-06 | Lehrbetrieb löschen | Nicht mehr in der Übersicht |

---

### 3.6 Länder

| ID | Beschreibung | Erwartetes Ergebnis |
|---|---|---|
| La-01 | Länder-Übersicht aufrufen | Alle Länder sichtbar |
| La-02 | Neues Land erstellen | Land erscheint in der Übersicht |
| La-03 | Land-Detailseite aufrufen | Statistiken (Lernende, Dozenten) korrekt |
| La-04 | Land bearbeiten | Name korrekt gespeichert |
| La-05 | Land löschen | Nicht mehr in der Übersicht |

---

### 3.7 Navigation & Permanente Links

| ID | Beschreibung | Erwartetes Ergebnis |
|---|---|---|
| N-01 | Link `/lernende/3` direkt aufrufen | Detailseite von Lernende/r Nr. 3 |
| N-02 | Link `/kurse/5` direkt aufrufen | Detailseite von Kurs Nr. 5 |
| N-03 | Gefilterter Link (z.B. `/lernende?nr_land=1`) | Filter aktiv, Daten gefiltert |
| N-04 | "Zurück"-Button auf Detailseiten | Navigiert zur Übersicht |
| N-05 | Filter zurücksetzen | Alle Filter gelöscht, alle Einträge sichtbar |

---

## 4. Testergebnis-Protokoll

| Test-ID | Status | Anmerkungen |
|---|---|---|
| A-01 | ✅ OK | |
| A-02 | ✅ OK | |
| A-03 | ✅ OK | |
| A-04 | ✅ OK | |
| L-01 | ✅ OK | |
| L-02 | ✅ OK | |
| L-03 | ✅ OK | |
| L-04 | ✅ OK | |
| L-05 | ✅ OK | |
| L-06 | ✅ OK | |
| L-07 | ✅ OK | |
| L-08 | ✅ OK | |
| L-09 | ✅ OK | |
| L-10 | ✅ OK | |
| L-11 | ✅ OK | |
| L-12 | ✅ OK | |
| L-13 | ✅ OK | |
| L-14 | ✅ OK | |
| K-01 | ✅ OK | |
| K-02 | ✅ OK | |
| K-03 | ✅ OK | |
| K-04 | ✅ OK | |
| K-05 | ✅ OK | |
| K-06 | ✅ OK | |
| K-07 | ✅ OK | |
| K-08 | ✅ OK | |
| K-09 | ✅ OK | |
| K-10 | ✅ OK | |
| D-01 | ✅ OK | |
| D-02 | ✅ OK | |
| D-03 | ✅ OK | |
| D-04 | ✅ OK | |
| D-05 | ✅ OK | |
| B-01 | ✅ OK | |
| B-02 | ✅ OK | |
| B-03 | ✅ OK | |
| B-04 | ✅ OK | |
| B-05 | ✅ OK | |
| B-06 | ✅ OK | |
| La-01 | ✅ OK | |
| La-02 | ✅ OK | |
| La-03 | ✅ OK | |
| La-04 | ✅ OK | |
| La-05 | ✅ OK | |
| N-01 | ✅ OK | |
| N-02 | ✅ OK | |
| N-03 | ✅ OK | |
| N-04 | ✅ OK | |
| N-05 | ✅ OK | |

---

## 5. Fazit

Alle definierten Testfälle wurden erfolgreich durchgeführt. Die Applikation erfüllt die Anforderungen des Moduls 294:

- Vollständiges CRUD für alle Ressourcen (Lernende, Kurse, Dozenten, Lehrbetriebe, Länder)
- Permanente, direkt aufrufbare URLs für alle Detailseiten
- Beziehungsverwaltung (Kurse ↔ Lernende, Lehrbetrieb ↔ Lernende)
- Filterung und Suche auf den Übersichtsseiten
- Authentifizierung mit JWT-Token
- Quellcode-Kommentare an den wichtigen/komplexen Stellen
