# Zo controleer ik AI-productteksten voordat ze live gaan

Productteksten schrijven is werk dat niemand leuk vindt, maar dat wel moet gebeuren. Bij FOV gaat het om duizenden artikelen, meerdere webshops en twee talen. Dus laat ik AI het schrijfwerk doen. Het interessante zit niet in "AI schrijft teksten". Het zit in de vraag: *hoe weet je dat het klopt, zonder alles te lezen?*

Dit is de build-log. *(De volledige case lees je [hier](cases/product-automation-platform.html).)*

## Waarom AI alleen niet genoeg is

Een taalmodel vragen om een titel, een metabeschrijving en een producttekst gaat snel. Bij tien artikelen lees je alles na. Bij duizenden niet. Dan krijg je drie problemen:

1. **Verzonnen details.** Het model vult gaten in de brondata op met specificaties die niemand heeft gecontroleerd.
2. **Kleine fouten die groot uitpakken.** Eén verkeerd teken kan een heel artikel tegenhouden.
3. **Geen zicht op het eindresultaat.** Een tekst in het importbestand staat nog niet op de site.

Mijn antwoord is geen tweede AI die de eerste controleert. Het is een vaste regelcontrole vóór de import, en een meting erna.

## Stap 1: AI schrijft, met een rem

Een Python-tool leest de artikeldata uit het ERP. Per webshop en per taal schrijft AI de velden: titel, metabeschrijving, URL en de producttekst in HTML. Elke webshop heeft zijn eigen toon en opmaak.

Is de brondata mager, dan krijgt het model de opdracht om niets te verzinnen. Liever een korte tekst die klopt dan een lange tekst vol details die nergens vandaan komen.

## Stap 2: vaste regels keuren vóór de import

De controle is bewust geen AI. Regels zijn saai, en dat is precies de bedoeling: ze doen elke keer hetzelfde, en je kunt zien waarom iets is afgekeurd. De regels zoeken onder meer naar:

- Nederlandse woorden in een Duitse tekst
- dubbele tekstblokken in de HTML
- dubbele URL's
- tekens die het webshopplatform niet accepteert

Wat niet door de controle komt, gaat niet mee in de import.

> De vraag was niet "kan AI dit schrijven?" Dat kan het. De vraag was: "hoe weet ik dat het klopt zonder alles te lezen?"

## Het gedachtestreepje

De lastigste fout gaf geen foutmelding. Het webshopplatform weigerde een gedachtestreepje (–) in de metabeschrijving. AI gebruikt dat teken graag. Het gevolg: het hele artikel bleef stil hangen. Dat zag je alleen in een aparte foutenlijst, niet bij de import zelf.

Nu vervangt de regelcontrole dat teken vóór de import. En ik scan elke import er nog een keer op.

## Dubbele blokken

Een tweede val: bij het herschrijven kwam een stuk tekst soms twee keer in de HTML terecht. In de tool zag je dat niet. Op de productpagina wel. Ook daarvoor is nu een regel.

## Stap 3: meten of het echt op de pagina staat

"Geïmporteerd" bewijst niets. Dus kijk ik na de import op de site zelf of de tekst er staat.

| Wat | Uitkomst |
|---|---|
| Teksten in één batch | ~2.300 |
| Tijd per artikel | ~20 seconden |
| Teksten in het ERP | 2.698 van 2.704 |
| Aantoonbaar zichtbaar op de site | 92,6% |
| API-kosten | een fractie van een cent per tekst |

Later draaide dezelfde aanpak voor de Duitse webshop: 30.576 tekstvelden op 6.237 artikelen.

Let op het gat tussen de twee middelste regels. Bijna alles stond in het ERP, maar niet alles stond op de site. Dat gat zie je alleen als je verder kijkt dan de import.

## De les

AI op schaal inzetten draait om controle, niet om de mooiste prompt. Vóór de import: regels die elke keer hetzelfde doen. Na de import: meten op de pagina zelf. Daar zit het echte werk.

---

*Vragen over de aanpak? [Mail me](mailto:bastiaanvanderhorst@hotmail.com).*
