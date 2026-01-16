export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  image?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'taxe-pfa-2026',
    title: 'Ce taxe plătesc în 2026 ca PFA?',
    excerpt:
      'Află tot ce trebuie să știi despre taxele pentru PFA în 2026: cum se calculează, care sunt impozitele și contribuțiile anuale.',
    author: 'Calculator Taxe PFA',
    publishedAt: '2026-01-15',
    readTime: '5 min',
    category: 'Taxe și Contribuții',
    tags: ['PFA', 'Taxe 2026', 'CAS', 'CASS', 'Impozit'],
    content: `
# Ce taxe plătesc în 2026 ca PFA?

Dacă ai un PFA, e important să știi ce taxe plătești în 2026, mai ales după modificările fiscale din 2025. O parte din schimbări au intrat deja în vigoare la 1 august 2025, iar altele se aplică de la 1 ianuarie 2026.

## Taxe pentru PFA în sistem real

Forma standard de impozitare pentru PFA-urile din România este sistemul real. Este o formă de organizare flexibilă și potrivită pentru majoritatea meseriilor, care îți permite să deduci o parte din costurile activității prin cheltuieli deductibile.

### Impozit pe venit: 10%

Impozitul pe venit se calculează ca **10%** din suma încasărilor totale minus cheltuielile deductibile, contribuția la pensie și contribuția la sănătate.

**Excepții:** Persoanele cu handicap de grad 1 și 2 sunt scutite de plata impozitului.

### Contribuție la sănătate (CASS): 10%

CASS-ul se calculează ca **10%** din venitul net, însă cu câteva excepții:

- **PFA-urile cu venituri anuale mai mari de 72 de salarii minime brute** (291.600 lei) plătesc sănătatea plafonată la acest prag, respectiv 29.160 lei.
- **PFA-urile cu venituri mai mici de 24.300 lei** (6 salarii minime) plătesc o contribuție minimă de 2.430 lei, dar nu sunt obligate să plătească CASS dacă:
  - Au contract de muncă în paralel și contribuie cel puțin 2.430 lei la sănătate prin acesta
  - Au pierderi sau venitul egal cu 0
  - Sunt studenți și au mai puțin de 26 de ani
  - Au un handicap de grad 1 sau 2

### Contribuție la pensie (CAS): 25%

Contribuția la pensie depinde de plafoanele de 12 și 24 de salarii minime brute:

- **Sub 48.600 lei** (12 salarii minime): CAS nu este obligatoriu
- **Între 48.600 și 97.200 lei**: CAS = 12.150 lei
- **Peste 97.200 lei** (24 salarii minime): CAS = 24.300 lei

**Excepție:** Pensionarii nu sunt obligați să plătească această contribuție.

## Când se plătesc taxele?

Taxele pentru activitatea PFA-urilor se plătesc **o dată pe an**, pe baza completării și depunerii **declarației unice**.

Pentru veniturile din 2026, termenul limită pentru plata taxelor este **25 mai 2027**.

## Concluzie

Înțelegerea obligațiilor fiscale te ajută să îți organizezi mai bine veniturile și cheltuielile. Folosește calculatorul nostru pentru a estima exact cât vei plăti în taxe!
    `,
  },
  {
    id: '2',
    slug: 'cheltuieli-deductibile-pfa',
    title: 'Cheltuieli deductibile pentru PFA: Ghid complet 2026',
    excerpt:
      'Descoperă ce cheltuieli poți deduce ca PFA și cum să îți optimizezi taxele în mod legal. Lista completă cu exemple practice.',
    author: 'Calculator Taxe PFA',
    publishedAt: '2026-01-14',
    readTime: '7 min',
    category: 'Optimizare Fiscală',
    tags: ['PFA', 'Cheltuieli deductibile', 'Optimizare', 'Tips'],
    content: `
# Cheltuieli deductibile pentru PFA: Ghid complet 2026

Una dintre cele mai mari avantaje ale PFA-ului în sistem real este posibilitatea de a deduce cheltuielile legate de activitate. Acest lucru îți reduce venitul impozabil și, implicit, taxele pe care le plătești.

## Ce sunt cheltuielile deductibile?

Cheltuielile deductibile sunt costurile pe care le ai în desfășurarea activității tale ca PFA și care pot fi scăzute din veniturile tale brute pentru a calcula venitul net impozabil.

**Formula simplificată:**
\`\`\`
Venit net = Venituri brute - Cheltuieli deductibile
Impozit = Venit net × 10%
\`\`\`

## Categorii principale de cheltuieli deductibile

### 1. Utilități și chirie

- **Chirie birou/spațiu de lucru** - dacă lucrezi dintr-un spațiu închiriat
- **Utilități** (curent, apă, internet, telefon) - proporțional cu utilizarea pentru activitate
- **Întreținere** - dacă lucrezi de acasă, poți deduce o parte proporțională

### 2. Echipamente și tehnologie

- **Laptop, computer, tabletă**
- **Telefon mobil** (dacă e folosit pentru activitate)
- **Software și licențe** (Adobe, Microsoft Office, etc.)
- **Echipamente specifice** meseriei tale

### 3. Transport

- **Combustibil** - dacă folosești mașina pentru activitate
- **Leasing sau rate mașină** - proporțional cu utilizarea profesională
- **Întreținere și reparații auto**
- **Asigurare RCA și CASCO**
- **Taxe de parcare și roviniete**

### 4. Servicii profesionale

- **Contabilitate** - servicii de contabilitate și consultanță fiscală
- **Servicii juridice** - avocat, notar
- **Marketing și publicitate** - Google Ads, Facebook Ads, design grafic
- **Hosting și domenii web**

### 5. Formare profesională

- **Cursuri și training-uri** legate de activitatea ta
- **Cărți și publicații** de specialitate
- **Conferințe și evenimente** profesionale

### 6. Alte cheltuieli

- **Materiale consumabile** - hârtie, pixuri, etc.
- **Asigurări profesionale**
- **Contribuții profesionale** - taxe de membru în asociații profesionale

## Reguli importante

### ✅ Cheltuielile trebuie să fie:

1. **Justificate** - legate direct de activitatea ta
2. **Documentate** - cu factură sau bon fiscal
3. **Plătite** - trebuie să ai dovada plății
4. **Înregistrate** - în evidența contabilă

### ❌ Nu sunt deductibile:

- Cheltuieli personale (mâncare, haine, distracție)
- Amenzi și penalități
- Cheltuieli fără factură
- Cheltuieli care nu au legătură cu activitatea

## Tips & Tricks pentru optimizare

### 1. Păstrează toate documentele

Organizează-te cu un sistem de arhivare (digital sau fizic) pentru toate facturile și bonurile.

### 2. Separă cheltuielile personale de cele profesionale

Dacă folosești același telefon sau mașină și pentru uz personal, poți deduce doar partea folosită pentru activitate (de exemplu, 70% profesional, 30% personal).

### 3. Folosește un card dedicat activității

Acest lucru te ajută să ții evidența mai ușor și să separi cheltuielile.

### 4. Consultă un contabil

Un contabil bun te poate ajuta să identifici toate cheltuielile deductibile și să optimizezi legal taxele.

### 5. Planifică achizițiile mari

Dacă ai nevoie de echipamente scumpe, planifică-le strategic pentru a optimiza impactul fiscal.

## Exemplu practic

**Scenariul 1: Fără cheltuieli deductibile**
- Venit brut: 100.000 lei
- Cheltuieli deductibile: 0 lei
- Venit net: 100.000 lei
- Impozit (10%): 10.000 lei
- CASS (10%): 10.000 lei
- CAS (25%): 24.300 lei
- **Total taxe: 44.300 lei**

**Scenariul 2: Cu cheltuieli deductibile**
- Venit brut: 100.000 lei
- Cheltuieli deductibile: 30.000 lei
- Venit net: 70.000 lei
- Impozit (10%): 7.000 lei
- CASS (10%): 7.000 lei
- CAS (25%): 12.150 lei
- **Total taxe: 26.150 lei**

**Economie: 18.150 lei!**

## Concluzie

Cheltuielile deductibile sunt un instrument puternic de optimizare fiscală pentru PFA. Folosește-le în mod legal și responsabil pentru a reduce taxele și a-ți crește profitul net.

**Recomandare:** Folosește calculatorul nostru pentru a vedea exact cum te afectează cheltuielile deductibile!
    `,
  },
  {
    id: '3',
    slug: 'pfa-vs-srl-2026',
    title: 'PFA vs SRL în 2026: Care e mai avantajos?',
    excerpt:
      'Compară avantajele și dezavantajele PFA față de SRL în 2026. Află care formă de organizare e mai potrivită pentru tine.',
    author: 'Calculator Taxe PFA',
    publishedAt: '2026-01-13',
    readTime: '6 min',
    category: 'Ghiduri',
    tags: ['PFA', 'SRL', 'Comparație', 'Alegere'],
    content: `
# PFA vs SRL în 2026: Care e mai avantajos?

Una dintre cele mai importante decizii pe care le iei ca antreprenor este alegerea formei de organizare: PFA sau SRL? Fiecare are avantajele și dezavantajele sale, iar alegerea depinde de situația ta specifică.

## Diferențele principale

### Înființare și costuri inițiale

**PFA:**
- ✅ Înființare rapidă (1-2 zile)
- ✅ Costuri minime (sub 100 lei)
- ✅ Procedură simplă
- ✅ Nu necesită capital social

**SRL:**
- ❌ Înființare mai lentă (1-2 săptămâni)
- ❌ Costuri mai mari (500-1000 lei)
- ❌ Procedură mai complexă
- ❌ Necesită capital social minim (200 lei)

### Răspundere patrimonială

**PFA:**
- ❌ Răspunzi cu întreaga avere personală
- ❌ Risc patrimonial ridicat

**SRL:**
- ✅ Răspundere limitată la capitalul social
- ✅ Protecție patrimonială personală

### Regim fiscal

**PFA în 2026:**
- Impozit pe venit: 10%
- CASS: 10% (cu plafoane)
- CAS: 25% (peste praguri)
- Declarație unică anuală

**SRL microîntreprindere în 2026:**
- Impozit pe venit: 1% sau 3%
- Taxe salariale pentru administrator
- Impozit pe dividende: 16%
- Declarații lunare/trimestriale

## Când e mai avantajos PFA?

### 1. Venituri mici sau medii (sub 100.000 lei/an)

Pentru venituri mai mici, PFA este de obicei mai avantajos din punct de vedere fiscal și administrativ.

### 2. Activitate simplă, fără angajați

Dacă lucrezi singur și nu plănuiești să angajezi, PFA e mai simplu de administrat.

### 3. Cheltuieli deductibile mari

Dacă ai multe cheltuieli legate de activitate, PFA în sistem real îți permite să le deduci și să reduci taxele.

### 4. Vrei flexibilitate maximă

PFA îți oferă mai multă libertate în gestionarea veniturilor și cheltuielilor.

## Când e mai avantajos SRL?

### 1. Venituri mari (peste 100.000-150.000 lei/an)

La venituri mai mari, SRL poate fi mai avantajos fiscal, mai ales dacă optimizezi combinația salariu-dividende.

### 2. Vrei să angajezi

SRL e mai potrivit dacă plănuiești să ai angajați.

### 3. Activitate cu risc ridicat

Dacă activitatea ta implică riscuri mari (contracte mari, răspundere profesională), protecția patrimonială a SRL e importantă.

### 4. Vrei credibilitate sporită

Multe companii mari preferă să lucreze cu SRL-uri decât cu PFA-uri.

### 5. Plănuiești să vinzi afacerea

SRL e mai ușor de vândut sau de transferat decât un PFA.

## Exemplu comparativ

**Scenariul: Venit brut 120.000 lei/an**

### PFA (sistem real, 30% cheltuieli deductibile)
- Venit brut: 120.000 lei
- Cheltuieli deductibile: 36.000 lei
- Venit net: 84.000 lei
- Impozit (10%): 8.400 lei
- CASS (10%): 8.400 lei
- CAS (25%): 12.150 lei
- **Total taxe: 28.950 lei**
- **Rămâi cu: 91.050 lei**

### SRL (microîntreprindere, 1%)
- Venit brut: 120.000 lei
- Impozit microîntreprindere (1%): 1.200 lei
- Salariu administrator (60.000 lei/an):
  - Taxe salariale: ~21.000 lei
- Dividende (după impozit): ~37.800 lei
- Impozit dividende (16%): 6.048 lei
- **Total taxe: ~28.248 lei**
- **Rămâi cu: ~91.752 lei**

*Notă: Calculele sunt aproximative și depind de mulți factori.*

## Concluzie

Nu există un răspuns universal. Alegerea între PFA și SRL depinde de:
- Nivelul veniturilor
- Tipul de activitate
- Planurile de dezvoltare
- Preferințele personale
- Toleranța la risc

**Recomandare:** Consultă un contabil pentru a analiza situația ta specifică și a lua cea mai bună decizie!
    `,
  },
  {
    id: '4',
    slug: 'tips-optimizare-taxe-pfa',
    title: '10 Tips pentru optimizarea taxelor ca PFA',
    excerpt:
      'Descoperă 10 strategii legale și eficiente pentru a-ți reduce taxele ca PFA și a-ți maximiza profitul net.',
    author: 'Calculator Taxe PFA',
    publishedAt: '2026-01-12',
    readTime: '8 min',
    category: 'Tips & Tricks',
    tags: ['PFA', 'Optimizare', 'Tips', 'Strategii'],
    content: `
# 10 Tips pentru optimizarea taxelor ca PFA

Optimizarea fiscală legală este esențială pentru orice PFA care vrea să își maximizeze profitul. Iată 10 strategii practice pe care le poți aplica imediat.

## 1. Maximizează cheltuielile deductibile

Cea mai simplă metodă de optimizare este să deduci toate cheltuielile legitime legate de activitate:
- Echipamente IT
- Software și licențe
- Servicii de contabilitate
- Marketing și publicitate
- Transport și combustibil
- Formare profesională

**Impact:** Reducere cu până la 45% a taxelor pentru fiecare leu cheltuit legal.

## 2. Folosește un card dedicat activității

Separă complet cheltuielile profesionale de cele personale:
- Mai ușor de urmărit cheltuielile
- Evidență clară pentru ANAF
- Evitarea confuziilor la declarație

## 3. Păstrează toate documentele justificative

Organizează-te cu un sistem de arhivare:
- Scanează toate facturile
- Folosește aplicații de management financiar
- Păstrează documentele minim 10 ani

## 4. Planifică achizițiile mari strategic

Dacă ai nevoie de echipamente scumpe:
- Cumpără-le în anii cu venituri mari
- Distribuie achizițiile pe mai mulți ani dacă e posibil
- Profită de amortizare

## 5. Monitorizează pragurile CAS și CASS

Fii atent la pragurile de 6, 12 și 24 salarii minime:
- Sub 48.600 lei: nu plătești CAS
- Sub 24.300 lei: CASS minim sau scutire
- Peste 291.600 lei: CASS plafonat

**Strategie:** Dacă ești aproape de un prag, evaluează dacă merită să îl depășești sau să amâni venituri.

## 6. Optimizează momentul încasărilor

Ai control asupra momentului în care încasezi:
- Distribuie veniturile uniform pe parcursul anului
- Evită să depășești pragurile doar cu puțin
- Planifică încasările mari strategic

## 7. Folosește facilități fiscale

Verifică dacă te încadrezi în categorii cu facilități:
- Persoane cu handicap (scutire impozit)
- Studenți sub 26 ani (scutire CASS)
- Pensionari (scutire CAS)
- Angajați cu contract de muncă (scutire CASS)

## 8. Consultă un contabil specializat

Un contabil bun:
- Îți identifică oportunități de optimizare
- Te ajută să eviți greșelile costisitoare
- Îți economisește timp și bani

**Cost:** 100-300 lei/lună
**Beneficiu:** Economii de mii de lei/an

## 9. Folosește instrumente de calcul și planificare

Calculatoare online (ca al nostru!) te ajută să:
- Estimezi taxele în avans
- Compari scenarii diferite
- Iei decizii informate

## 10. Educă-te continuu despre fiscalitate

Legislația se schimbă frecvent:
- Urmărește modificările legislative
- Citește articole de specialitate
- Participă la webinarii și cursuri

## Greșeli de evitat

### ❌ Nu deduce cheltuieli personale
Riscă amenzi și penalități mari.

### ❌ Nu ignora pragurile
Fii strategic în planificarea veniturilor.

### ❌ Nu amâna plata taxelor
Penalitățile de întârziere se adună rapid.

### ❌ Nu lucra fără factură
Toate veniturile trebuie declarate.

## Exemplu de optimizare completă

**Situația inițială:**
- Venit brut: 100.000 lei
- Cheltuieli deductibile: 0 lei
- Total taxe: 44.300 lei
- Profit net: 55.700 lei

**După optimizare:**
- Venit brut: 100.000 lei
- Cheltuieli deductibile: 25.000 lei
  - Laptop: 5.000 lei
  - Software: 3.000 lei
  - Contabilitate: 2.400 lei
  - Marketing: 4.000 lei
  - Transport: 6.000 lei
  - Cursuri: 2.000 lei
  - Altele: 2.600 lei
- Venit net: 75.000 lei
- Total taxe: 30.900 lei
- Profit net: 69.100 lei

**Rezultat:**
- Economie la taxe: 13.400 lei
- Profit net crescut cu: 13.400 lei (24% mai mult!)

## Concluzie

Optimizarea fiscală legală nu înseamnă evaziune fiscală. Înseamnă să folosești inteligent regulile existente pentru a-ți maximiza profitul.

**Acțiune:** Începe azi să implementezi măcar 3 din aceste strategii!
    `,
  },
];
