# Twee AI's die elkaar controleren: zo schreef ik 5.000 productteksten in 4 uur

Productteksten schrijven is het soort werk dat niemand leuk vindt en iedereen toch moet doen. Voor een webshop met duizenden artikelen is het bovendien onbetaalbaar als je het uitbesteedt: al snel €5 à €10 per product. Dus bouwde ik een pipeline die het overneemt — en het interessante zit hem niet in "AI laat teksten schrijven", maar in *hoe je AI op schaal betrouwbaar maakt*.

Dit is de build-log. *(De volledige case lees je [hier](cases/product-automation-platform.html).)*

## Het probleem met één AI

De eerste versie was simpel: stuur productdata naar één taalmodel, vraag om een titel, meta-beschrijving en omschrijving, klaar. Bij tien producten werkt dat prachtig. Bij vijfduizend kom je drie problemen tegen:

1. **Hallucinaties** — het model verzint specificaties die er niet zijn. Bij één product zie je dat; bij duizenden niet.
2. **Inconsistentie** — de toon en structuur driften langzaam weg over een grote batch.
3. **Geen vangnet** — je kunt onmogelijk vijfduizend teksten met de hand controleren.

> De vraag was niet "kan AI dit schrijven?" — dat kan het. De vraag was: "hoe weet ik dat het klopt zonder alles te lezen?"

## De oplossing: cross-validatie

In plaats van te vertrouwen op één model, liet ik er **twee** samenwerken: ChatGPT en Claude. Het ene model genereert, het andere controleert — en andersom. Concreet:

```
1. Model A genereert de producttekst op basis van bron-data
2. Model B krijgt de bron-data én de gegenereerde tekst
   en checkt: kloppen de claims? mist er iets? toon goed?
3. Verschil van mening -> markeren voor handmatige review
4. Consensus -> direct importklaar
```

Twee modellen die elkaars werk moeten goedkeuren, vangen elkaars fouten. Een hallucinatie van model A wordt door model B betrapt, omdat B de brondata erbij heeft. Dat verschil — van "leuk experiment" naar "productieklaar" — zat hem volledig in die validatielaag.

## De pipeline eromheen

De AI is eigenlijk maar één stap. Het meeste werk zit in de data ervoor en erna:

- **Scrapen** van leveranciers- en concurrentpagina's voor brondata (BeautifulSoup)
- **OCR** op technische product- en veiligheidsbladen (Tesseract) — want de beste specs zitten vaak in PDF's
- **Genereren + valideren** met de dual-AI opzet
- **Exporteren** naar een KING-compatibel formaat, direct te bulk-importeren

## Wat het opleverde

| Metric | Voor | Na |
|---|---|---|
| Tijd per product | ~handmatig | seconden |
| Kosten per product | €5–10 | €0,02 |
| Doorlooptijd 5.000 producten | weken | 4 uur |

Een kostenreductie van **99%**, en circa **80x sneller** dan handmatig.

## De les

De grootste les was niet technisch maar conceptueel: **AI op schaal inzetten draait om controle, niet om creativiteit.** De mooiste prompt ter wereld helpt je niet als je niet kunt garanderen dat de output klopt. Validatie, vaste regels en een vangnet voor de randgevallen — dáár zit de echte engineering.

En precies daarom bouw ik dit soort dingen graag: niet om een taak één keer te doen, maar om een proces te bouwen dat het voor altijd betrouwbaar doet.

---

*Vragen over de aanpak? [Mail me](mailto:bastiaanvanderhorst@hotmail.com) of bekijk de [code op GitHub](https://github.com/bastiaanvdh/product-automation-platform).*
