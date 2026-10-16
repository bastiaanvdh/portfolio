/* Demo's 03-05: klantreis, gewicht naar verzendprijs, productteksten met controle (fictieve data) */
(function(){
  var DL=document.documentElement.lang==="en"?"en":"nl";
  function t(nl,en){return DL==="en"?en:nl}
  var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function num(v,d){return v.toFixed(d).replace(".",DL==="en"?".":",")}
  function pct(v){return num(v,1)+"%"}
  function eur(v){return DL==="en"?"€"+v.toFixed(2):"€ "+v.toFixed(2).replace(".",",")}
  function $(id){return document.getElementById(id)}

  /* ===== 03 · Klantreis ===== */
  var STEPS=[t("Productpagina","Product page"),t("In mandje","Add to cart"),t("Afrekenen","Checkout"),t("Bestelling","Purchase")];
  /* per stap: % van de vorige stap (fictief) */
  var SEG={
    all:{a:{n:t("Alle bezoekers","All visitors"),r:[48,9.1,71,81]}},
    nr:{a:{n:t("Nieuw","New"),r:[46,5.2,68,79]},b:{n:t("Terugkerend","Returning"),r:[58,29.6,77,86]}},
    dev:{a:{n:"Mobiel",r:[50,8.8,66,78]},b:{n:"Desktop",r:[44,25.4,75,84]}}
  };
  if(DL==="en")SEG.dev.a.n="Mobile";
  var fun={seg:"nr",btn:false},funEl=$("dmFun");
  function funnel(){
    var s=SEG[fun.seg],h='<div class="dx-fun"><div class="dx-side"><span class="dm-lab ac">'+t("Snijd de funnel","Slice the funnel")+'</span><div class="dm-scn">'+
      [["all",t("Alles bij elkaar","Everything together")],["nr",t("Nieuw of terugkerend","New or returning")],["dev",t("Mobiel of desktop","Mobile or desktop")]].map(function(x){return '<button type="button" class="dm-btn" data-seg="'+x[0]+'" aria-pressed="'+(fun.seg===x[0])+'">'+x[1]+"</button>"}).join("")+
      '</div><p class="dm-code">'+t("Elke balk is het deel dat doorgaat naar de volgende stap. Gemiddeld ziet alles er redelijk uit. Pas als je snijdt, zie je waar het breekt.","Each bar is the share that moves on to the next step. On average everything looks fine. Only when you slice it do you see where it breaks.")+"</p></div><div class=\"dx-main\">";
    var worst=-1,wr=0;
    if(s.b)s.a.r.forEach(function(v,i){var q=s.b.r[i]/v;if(q>wr){wr=q;worst=i}});
    STEPS.forEach(function(st,i){
      var on=i===worst&&wr>2;
      h+='<div class="dx-step'+(on?" on":"")+'"><div class="dx-sh"><b>'+(i+1)+" · "+st+"</b>"+(s.b?'<span class="dm-pill'+(on?" kies":"")+'">'+(on?"▲ "+t("omslagpunt","tipping point")+" ":"")+"×"+num(s.b.r[i]/s.a.r[i],1)+"</span>":"")+"</div>";
      [s.a,s.b].forEach(function(g,j){if(!g)return;var v=g.r[i];
        h+='<div class="dx-bar"><span class="dx-bn">'+esc(g.n)+'</span><span class="dx-track"><i class="'+(j?"b":"a")+'" style="width:'+v+'%"></i></span><span class="dx-bv">'+pct(v)+"</span></div>"});
      h+="</div>";
    });
    if(s.b&&wr>2)h+='<p class="dx-say">'+t("Bij ","At ")+"<b>"+STEPS[worst]+"</b>"+t(" ligt het verschil ×"," the gap is ×")+num(wr,1)+t(". Bij alle andere stappen is het kleiner dan ×1,3. Daar zit dus de vraag, niet in het verkeer.",". At every other step it is below ×1.3. So that is where the question is, not in the traffic.")+"</p>";
    if(fun.seg==="dev")h+=phone();
    return h+"</div></div>";
  }
  function phone(){
    var y=fun.btn?250:330;
    return '<div class="dx-ph"><div class="dx-frame" aria-label="'+t("Productpagina op een telefoon van 390 pixels breed","Product page on a 390 pixel wide phone")+'"><div class="dx-img">'+t("foto","photo")+'</div><i class="dx-l" style="top:186px"></i><i class="dx-l s" style="top:204px"></i><i class="dx-l" style="top:222px"></i>'+
      '<span class="dx-buy" style="top:'+y+'px">'+t("In winkelwagen","Add to cart")+'</span><span class="dx-fold"><b>'+t("vouw · hier stopt het scherm","fold · the screen ends here")+"</b></span></div>"+
      '<div class="dx-pt"><span class="dm-lab ac">'+t("Waarom mobiel achterblijft","Why mobile lags behind")+"</span><p>"+(fun.btn?t("De knop staat nu boven de vouw. Dit is een hypothese: of het werkt, meet je met één maatstaf, in mandje gedeeld door productpagina op mobiel. Niet met de omzet, want die beweegt mee met seizoen en kanalen.","The button is now above the fold. This is a hypothesis: you test it with one measure, add to cart divided by product views on mobile. Not with revenue, because that moves with season and channels."):t("Op een telefoon van 390 pixels breed staat de koopknop onder de vouw. Wie niet scrolt, ziet hem nooit. Op desktop staat hij wel in beeld.","On a 390 pixel wide phone the buy button sits below the fold. Anyone who does not scroll never sees it. On desktop it is in view."))+
      '</p><button type="button" class="dm-btn'+(fun.btn?"":" solid")+'" data-act="btn">'+(fun.btn?t("↺ Terug naar nu","↺ Back to current"):t("Zet de knop boven de vouw","Move the button above the fold"))+"</button></div></div>";
  }
  function renderFun(){funEl.innerHTML=funnel()}
  if(funEl){
    funEl.addEventListener("click",function(e){var b=e.target.closest("[data-seg]");if(b){fun.seg=b.dataset.seg;renderFun();return}
      var a=e.target.closest("[data-act]");if(a&&a.dataset.act==="btn"){fun.btn=!fun.btn;renderFun()}});
    renderFun();
  }

  /* ===== 04 · Gewicht naar verzendprijs ===== */
  var A=[
    {id:"bl",d:t("Bootlak hoogglans, 750 ml","Boat varnish high gloss, 750 ml"),rho:1.25,v:.75,pk:.12,q:2},
    {id:"vd",d:t("Verdunning, 1 liter","Thinner, 1 litre"),rho:.87,v:1,pk:.10,q:1},
    {id:"gv",d:t("Grondverf, 2,5 liter","Primer, 2.5 litre"),rho:1.45,v:2.5,pk:.30,q:0},
    {id:"af",d:t("Antifouling, 20 liter","Antifouling, 20 litre"),rho:1.6,v:20,pk:1.4,q:0},
    {id:"set",d:t("Starterset: bootlak + verdunning + kwast","Starter set: varnish + thinner + brush"),set:["bl","vd"],extra:.2,q:0}
  ];
  var TIER=[[2,6.95],[5,8.95],[10,11.95],[20,15.95],[31.5,19.95],[Infinity,49]];
  var wg={dbl:false},wgEl=$("dmWgt");
  function by(id){for(var i=0;i<A.length;i++)if(A[i].id===id)return A[i]}
  function w(a){if(a.set)return a.set.reduce(function(s,id){return s+w(by(id))},a.extra);return a.rho*a.v+a.pk}
  function weights(){
    var tot=0,h='<div class="dm-tw"><table class="dm-t"><thead><tr><th>'+t("Aantal","Qty")+"</th><th>"+t("Artikel en berekening","Product and calculation")+'</th><th class="n">'+t("Gewicht","Weight")+"</th></tr></thead><tbody>";
    A.forEach(function(a,i){var one=w(a),line=one*a.q;
      if(a.set&&wg.dbl)line+=a.q*a.set.reduce(function(s,id){return s+w(by(id))},0);
      tot+=line;
      var calc=a.set?t("Som van de onderdelen + kwast ","Sum of the parts + brush ")+num(a.extra,2)+" kg"+(wg.dbl?' <span class="dm-pill kies">✗ '+t("onderdelen dubbel geteld","parts counted twice")+"</span>":""):num(a.rho,2)+" kg/l × "+num(a.v,2)+" l + "+num(a.pk,2)+" kg "+t("verpakking","packaging");
      h+='<tr><td><input class="dm-in dm-qty" type="number" min="0" value="'+a.q+'" data-wq="'+i+'" aria-label="'+t("Aantal","Quantity")+'"></td><td>'+esc(a.d)+'<span class="dm-lnote">'+calc+(a.set?"":' · <span class="dm-code" style="display:inline">'+t("dichtheid uit veiligheidsblad, rubriek 9","density from safety data sheet, section 9")+"</span>")+'</span></td><td class="n">'+num(line,2)+" kg</td></tr>";
    });
    h+="</tbody></table></div>";
    var ti=0;while(tot>TIER[ti][0])ti++;
    h+='<div class="dm-sum"><span>'+t("Totaalgewicht","Total weight")+"</span><b>"+num(tot,2)+" kg</b></div>";
    return {h:h,tot:tot,ti:ti};
  }
  function renderWgt(){
    var r=weights(),prev=0;
    var tiers='<div class="dm-box"><span class="dm-lab ac">'+t("Staffel op gewicht","Weight bands")+"</span>"+TIER.map(function(x,i){var lab=x[0]===Infinity?t("boven 31,5 kg · pallet","over 31.5 kg · pallet"):num(prev,prev%1?1:0)+" – "+num(x[0],x[0]%1?1:0)+" kg";prev=x[0];
      return '<div class="dm-row'+(i===r.ti&&r.tot>0?" dx-cur":"")+'"><span>'+lab+(i===r.ti&&r.tot>0?' <span class="dm-pill kies">◀ '+t("deze order","this order")+"</span>":"")+"</span><span>"+eur(x[1])+"</span></div>"}).join("")+"</div>";
    wgEl.innerHTML='<div class="dx-wgt"><div class="dx-wl">'+r.h+'<label class="dx-chk"><input type="checkbox" id="dxDbl"'+(wg.dbl?" checked":"")+"> "+t("Fout van vroeger nadoen: set-onderdelen ook los meetellen","Recreate an old mistake: also count set parts separately")+"</label>"+
      (wg.dbl?'<p class="dx-say">'+t("Zo werd een order met sets bijna twee keer te zwaar. De set staat al als som van zijn onderdelen in het systeem. Daarom slaat de optelling setonderdelen over.","This is how an order with sets became almost twice as heavy. The set is already the sum of its parts. That is why the sum skips set parts.")+"</p>":"")+
      '</div><div class="dx-wr">'+tiers+'<div class="dm-box"><span class="dm-lab ac">'+t("Verzendkosten","Shipping cost")+'</span><div class="dm-kv"><span><b>'+(r.tot>0?eur(TIER[r.ti][1]):"—")+'</b><span class="dm-lab">'+t("op gewicht","by weight")+'</span></span><span><b>'+eur(12.5)+'</b><span class="dm-lab">'+t("vast tarief, oud","flat rate, old")+"</span></span></div><p class=\"dm-code\" style=\"margin-top:10px\">"+t("Webshop en binnendienst rekenen nu met dezelfde staffel. Dezelfde doos kost overal hetzelfde.","Web shop and customer service now use the same bands. The same box costs the same everywhere.")+"</p></div></div></div>";
  }
  if(wgEl){
    wgEl.addEventListener("change",function(e){var el=e.target;
      if(el.dataset.wq!==undefined){A[+el.dataset.wq].q=Math.max(0,Math.min(99,+el.value||0));renderWgt()}
      else if(el.id==="dxDbl"){wg.dbl=el.checked;renderWgt()}});
    renderWgt();
  }

  /* ===== 05 · Productteksten met controle ===== */
  var TX={
    bl:{nm:t("Bootlak hoogglans wit, 750 ml","Boat varnish high gloss white, 750 ml"),f:[t("Merk: Zeemeeuw (fictief)","Brand: Zeemeeuw (fictional)"),t("Inhoud: 750 ml","Contents: 750 ml"),t("Glans: hoogglans","Finish: high gloss"),t("Verbruik: 12 m² per liter","Coverage: 12 m² per litre"),t("Ondergrond: hout en polyester","Surface: wood and polyester")],
      nl:{ti:"Bootlak hoogglans wit 750 ml | Zeemeeuw",me:"Bootlak hoogglans wit voor hout en polyester boven de waterlijn. 750 ml, 12 m² per liter en UV-bestendig. Op voorraad en snel geleverd.",
        bl:[["Intro","Een witte bootlak met een diepe glans voor boven de waterlijn. Je zet hem op hout en polyester."],["Kernvoordelen","Hoogglans die lang mooi blijft\nUV-bestendig, vergeelt niet\n12 m² per liter\nVoor hout en polyester\nKwast of roller"],["Gebruik","Schuur licht op, maak stofvrij en zet twee lagen. Laat elke laag 24 uur drogen. Inhoud: 750 ml."]]},
      de:{ti:"Bootslack hochglänzend weiß 750 ml | Zeemeeuw",me:"Bootslack hochglänzend weiß für Holz und Polyester über der Wasserlinie. 750 ml, 12 m² pro Liter, UV-beständig. Schnell geliefert.",
        bl:[["Intro","Ein weißer Bootslack mit tiefem Glanz für den Bereich über der Wasserlinie. Für Holz und Polyester."],["Vorteile","Hochglanz, der lange schön bleibt\nUV-beständig, vergilbt nicht\n12 m² pro Liter\nFür Holz und Polyester\nPinsel oder Rolle"],["Anwendung","Leicht anschleifen, staubfrei machen und zwei Schichten auftragen. Jede Schicht 24 Stunden trocknen lassen. Inhalt: 750 ml."]]}},
    tp:{nm:t("Afplaktape blauw 38 mm × 50 m","Masking tape blue 38 mm × 50 m"),f:[t("Merk: Strak (fictief)","Brand: Strak (fictional)"),t("Breedte: 38 mm, lengte 50 m","Width: 38 mm, length 50 m"),t("Buiten: tot 14 dagen","Outdoors: up to 14 days"),t("UV-bestendig","UV resistant")],
      nl:{ti:"Afplaktape blauw 38 mm × 50 m | Strak",me:"Blauwe afplaktape van 38 mm × 50 m voor strakke verflijnen. Tot 14 dagen buiten te gebruiken en zonder lijmresten te verwijderen.",
        bl:[["Intro","Blauwe tape voor strakke verflijnen, binnen en buiten."],["Kernvoordelen","Tot 14 dagen buiten\nGeen lijmresten\nUV-bestendig\nScheurt recht af"],["Gebruik","Plak op een schone, droge ondergrond. Trek de tape weg terwijl de verf nog nat is. Rol: 38 mm × 50 m."]]},
      de:{ti:"Abdeckband blau 38 mm × 50 m | Strak",me:"Blaues Abdeckband, 38 mm × 50 m, für saubere Farbkanten. Bis zu 14 Tage im Außenbereich nutzbar und rückstandsfrei entfernbar.",
        bl:[["Intro","Blaues Band für saubere Farbkanten, innen und außen."],["Vorteile","Bis zu 14 Tage im Außenbereich\nKeine Kleberückstände\nUV-beständig\nReißt gerade ab"],["Anwendung","Auf einen sauberen, trockenen Untergrund kleben. Abziehen, solange die Farbe noch nass ist. Rolle: 38 mm × 50 m."]]}}
  };
  var ERR=[
    {k:"dup",l:t("Blok staat er twee keer in","Block appears twice")},
    {k:"long",l:t("Titel te lang","Title too long")},
    {k:"dash",l:t("Gedachtestreepje dat het webshopplatform weigert","Dash the web shop platform rejects")}
  ];
  var tx={p:"bl",lang:"nl",gen:false,err:-1,busy:false},txEl=$("dmTxt");
  function draft(){
    var s=TX[tx.p][tx.lang],o={ti:s.ti,me:s.me,bl:s.bl.map(function(b){return b.slice()})},e=tx.err>-1?ERR[tx.err].k:null;
    if(e==="dup")o.bl.splice(2,0,o.bl[0].slice());
    if(e==="long")o.ti=o.ti+(tx.lang==="de"?" für Profis und Heimwerker in Premiumqualität":" voor de professionele schilder en de doe-het-zelver");
    if(e==="dash"){o.ti=o.ti.replace(/ \| /," – ");}
    return o;
  }
  function checks(o){
    var kv=o.bl.filter(function(b){return b[0]==="Kernvoordelen"||b[0]==="Vorteile"})[0],n=kv?kv[1].split("\n").length:0,seen={},dup=false;
    o.bl.forEach(function(b){if(seen[b[1]])dup=true;seen[b[1]]=1});
    var all=o.ti+o.me+o.bl.map(function(b){return b[1]}).join(" "),inh=/\d+\s?(ml|m\b|liter|l\b)/i.test(o.bl[o.bl.length-1][1]);
    return [
      [o.ti.length<=60,t("Titel ","Title ")+o.ti.length+t(" tekens, maximaal 60"," characters, max 60")],
      [o.me.length>=120&&o.me.length<=155,t("Metabeschrijving ","Meta description ")+o.me.length+t(" tekens, tussen 120 en 155"," characters, between 120 and 155")],
      [n>=4&&n<=6,n+t(" kernvoordelen, verwacht 4 tot 6"," key benefits, expected 4 to 6")],
      [!dup,dup?t("Een blok staat er twee keer in","A block appears twice"):t("Geen dubbele blokken","No duplicate blocks")],
      [all.indexOf("–")<0,all.indexOf("–")<0?t("Geen tekens die het platform weigert","No characters the platform rejects"):t("Gedachtestreepje gevonden: het platform laat dan het hele artikel stil hangen","Dash found: the platform then silently drops the whole product")],
      [inh,t("Inhoud of maat staat in het laatste blok","Contents or size is in the last block")]
    ];
  }
  function renderTxt(){
    var p=TX[tx.p],h='<div class="dx-txt"><div class="dx-side"><span class="dm-lab ac">'+t("Kies een product","Pick a product")+'</span><div class="dm-scn">'+
      Object.keys(TX).map(function(k){return '<button type="button" class="dm-btn" data-p="'+k+'" aria-pressed="'+(tx.p===k)+'">'+esc(TX[k].nm)+"</button>"}).join("")+
      '</div><span class="dm-lab">'+t("Kenmerken uit het ERP","Attributes from the ERP")+'</span><div class="dm-body" style="margin-top:0">'+p.f.map(esc).join("\n")+'</div><div class="dm-scn" style="grid-template-columns:1fr 1fr">'+
      [["nl","NL"],["de","DE"]].map(function(x){return '<button type="button" class="dm-btn" data-lang="'+x[0]+'" aria-pressed="'+(tx.lang===x[0])+'">'+x[1]+"</button>"}).join("")+
      '</div><button type="button" class="dm-btn solid" data-act="gen">'+(tx.gen?"↻ "+t("Opnieuw schrijven","Write again"):t("Schrijf de tekst","Write the text"))+"</button></div><div class=\"dx-out\">";
    if(tx.busy)h+='<span class="dm-reading">'+t("Kenmerken lezen · tekst schrijven · controleren…","Reading attributes · writing text · checking…")+"</span>";
    else if(!tx.gen)h+='<div class="dm-empty">'+t("Kies een product en een taal, en laat de tekst schrijven. Daarna controleert de pijplijn de tekst, voordat hij naar het ERP mag.","Pick a product and a language, and let it write the text. Then the pipeline checks it before it may go to the ERP.")+"</div>";
    else{
      var o=draft(),c=checks(o),bad=c.filter(function(x){return !x[0]}).length;
      h+='<div class="dm-fade"><div class="dx-f"><span class="dm-lab">'+t("Titel","Title")+"</span><b>"+esc(o.ti)+'</b></div><div class="dx-f"><span class="dm-lab">'+t("Metabeschrijving","Meta description")+"</span><span>"+esc(o.me)+"</span></div>"+
        o.bl.map(function(b){return '<div class="dx-f"><span class="dm-lab">'+esc(b[0])+'</span><span style="white-space:pre-line">'+esc(b[1])+"</span></div>"}).join("")+"</div>";
      h+='<div class="dm-box dm-fade"><span class="dm-lab ac">'+t("Controle vóór import","Check before import")+"</span>"+c.map(function(x){return '<div class="dm-row"><span>'+(x[0]?"✓ ":"✗ ")+esc(x[1])+'</span><span class="dm-pill'+(x[0]?" ok":" kies")+'">'+(x[0]?t("goed","pass"):t("fout","fail"))+"</span></div>"}).join("")+"</div>";
      h+='<div class="dm-actions">'+(bad?'<span class="dm-pill kies">'+t("Tegengehouden: ","Held back: ")+bad+(bad>1?t(" fouten"," issues"):t(" fout"," issue"))+"</span>":'<span class="dm-pill ok">✓ '+t("Klaar voor import","Ready for import")+"</span>")+
        '<button type="button" class="dm-btn" data-act="err">'+(tx.err<ERR.length-1?t("Maak een fout: ","Make a mistake: ")+esc(ERR[tx.err+1].l):t("↺ Fouten weghalen","↺ Remove mistakes"))+"</button></div>"+
        '<p class="dm-code">'+t("Na de import meet een tweede stap of de tekst echt op de pagina staat. Opgeslagen is iets anders dan zichtbaar.","After import a second step measures whether the text is really on the page. Saved is not the same as visible.")+"</p>";
    }
    txEl.innerHTML=h+"</div></div>";
  }
  if(txEl){
    txEl.addEventListener("click",function(e){
      var b=e.target.closest("[data-p]");if(b){tx.p=b.dataset.p;tx.gen=false;tx.err=-1;renderTxt();return}
      var l=e.target.closest("[data-lang]");if(l){tx.lang=l.dataset.lang;renderTxt();return}
      var a=e.target.closest("[data-act]");if(!a)return;
      if(a.dataset.act==="gen"){tx.err=-1;if(reduce){tx.gen=true;renderTxt();return}tx.busy=true;renderTxt();setTimeout(function(){tx.busy=false;tx.gen=true;renderTxt()},800)}
      else if(a.dataset.act==="err"){tx.err=tx.err<ERR.length-1?tx.err+1:-1;renderTxt()}
    });
    renderTxt();
  }
})();
