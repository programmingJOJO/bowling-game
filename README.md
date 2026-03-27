# BowlingGame

Das Projekt verwendet [Angular CLI](https://github.com/angular/angular-cli) version 21.2.3.

## Development server

Zum Starten des Projektes:

```bash
npm start
```

Abrufbar unter http://localhost:4200/

**Ergebnis:**

<img width="1273" height="487" alt="image" src="https://github.com/user-attachments/assets/7ce3f7cf-cee2-4f55-9059-5d49009cce96" />

## Weiteres Vorgehen

Leider blieb nicht ausreichend Zeit um die gesamte Logik aus der Aufgabe zu implementieren.
Auch auf das Schreiben der Tests musste ich verzichten. Mit mehr Zeit würde ich folgendermaßen weitermachen:

1. Fehlende Logik zu Strikes und Spares ergänzen, bei denen die Punkte des nachfolgenden Frames mitgezählt werden
2. Vollständige Implementierung des dritten Wurfs im 10. Frame
2. Erstellung von Tests zu allen public Methoden und Properties
3. Refactoring der UI hinsichtlich der Kästchen zu Strikes, Spares und der Punkte
  4. Ggf. Einfügen von Labels oder anderweitiger Anzeige zur besseren Übersichtlichkeit der zwei Würfe
  5. Einfügen der Punkte in Klammern hinter Strikes und Spares in den Dropdowns
