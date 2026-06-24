# Zo werkt mijn aandelen-screener: score 0–100 in vier stappen

Voordat ik ook maar één euro in een aandeel steek, gaat het door mijn screener. Die draait als onderdeel van mijn [Portfolio Monitor](https://github.com/bastiaanvdh/portfolio-monitor) — een lokale Python-pipeline met 19 agents — en geeft elk kandidaat-aandeel een score van 0 tot 100. Geen gevoel, geen hype, gewoon een checklist die altijd dezelfde vragen stelt.

In deze post leg ik uit hoe die score is opgebouwd. Niet als beleggingsadvies, maar omdat ik denk dat iedereen die zelf belegt baat heeft bij een vast toetsingskader. *(Probeer ook de [live demo](monitor.html) van de monitor.)*

## Waarom een vaste methodiek?

Het grootste risico voor een particuliere belegger ben je zelf. Een mooi verhaal op social media, een koers die al maanden stijgt, FOMO — voor je het weet koop je iets omdat het *voelt* als een goed idee. Een screener dwingt je om elke kandidaat door dezelfde molen te halen. Scoort een aandeel laag, dan koop ik niet. Hoe overtuigend het verhaal ook is.

> De screener zegt niet wat ik *moet* kopen. Hij zegt wat ik *niet* mag kopen.

## De vier bouwstenen

### 1. Fundamentals (40 punten)

De basis. Hier kijk ik naar de kwaliteit van het bedrijf zelf, onafhankelijk van de koers:

- **Omzetgroei** — groeit het bedrijf structureel, of teert het op één goed jaar?
- **Marges** — brutomarge en vrije kasstroommarge, en vooral: de *richting* ervan
- **Balans** — netto schuld ten opzichte van EBITDA; schuld is prima, mits beheersbaar
- **Returns** — ROIC boven de kapitaalkosten, anders vernietigt groei juist waarde

Elk criterium levert punten op. Een bedrijf dat krimpt, marges ziet dalen én vol schuld zit, komt hier al niet doorheen.

### 2. Fair value (25 punten)

Een geweldig bedrijf tegen een verkeerde prijs is een slechte belegging. De monitor berekent een indicatieve fair value op basis van genormaliseerde kasstromen en vergelijkt die met de huidige koers:

```python
upside = (fair_value - koers) / koers
score = clamp(upside, -0.3, 0.5)  # afgekapt: extreme uitschieters zijn meestal datafouten
```

Noteert een aandeel ver boven mijn fair value-schatting, dan kost dat punten — ook als de fundamentals top zijn.

### 3. Peer-ranking (20 punten)

Een bedrijf beoordeel je niet in een vacuüm. De screener zet elke kandidaat naast zijn sectorgenoten: waardering, groei en marges ten opzichte van de directe concurrentie. Het mooiste signaal: een bedrijf dat op kwaliteit bovenaan staat, maar op waardering middenin het peloton. Dat is waar de kansen zitten.

### 4. Instap-criteria (15 punten)

De laatste check is praktisch: past dit aandeel *nu* in *mijn* portefeuille?

- Wordt mijn concentratie in één sector niet te groot?
- Hoe beweegt het aandeel ten opzichte van posities die ik al heb (correlatie)?
- Is er een concrete katalysator, of koop ik alleen "omdat het goedkoop is"?

## Wat de score betekent

| Score | Betekenis |
|-------|-----------|
| 80–100 | Serieuze kandidaat — verder onderzoek waard |
| 60–79 | Op de watchlist, wachten op beter instapmoment |
| 40–59 | Interessant verhaal, maar de cijfers ondersteunen het niet |
| 0–39 | Volgende. |

Het belangrijkste inzicht na een jaar werken met dit systeem: de meeste aandelen die ik *bijna* gekocht had op gevoel, scoorden onder de 60. De screener heeft me vaker behoed voor slechte aankopen dan dat hij winnaars heeft aangewezen — en dat is precies waar hij voor is.

---

*Dit is geen beleggingsadvies. Ik deel mijn aanpak omdat ik geloof dat een systematische methode iedereen helpt betere beslissingen te nemen — welke methode dat ook is. Vragen? Stel ze via [Instagram](https://www.instagram.com/) bij Beleggen met Bastiaan of [mail me](mailto:bastiaanvanderhorst@hotmail.com).*
