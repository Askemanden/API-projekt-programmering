let bredde = screen.width;   //bredden på skærmen
let højde = screen.height*1.4;//højden på skærmen
let selectedValuta; //Valutaen der er valgt
let symbolValutaDropdown;
            //x, y, tekst, xStørrelse, yStørrelse, fontStørrelse
let knap1 = [200, 300, "Vis valg", 100, 50, 20];
let totaleknapper = [knap1]; //En liste over alle knapperne
let buttonSize = [100, 50]; //Størrelsen på knapperne
let knapper = []; //En liste til at holde på knapperne

const xbuffer = 100;
const ybuffer = 50;
const ymultiple = 20;
const valutas = [
  'AUD','BGN','BRL','CAD','CHF', 'CYP','CNY','CZK','DKK', 'EEK','EUR','GBP','HKD', 'HRK',
  'HUF','IDR','ILS','INR','ISK','JPY','KRW', 'LTL', 'LVL', 'MTL','MXN','MYR','NOK',
  'NZD','PHP','PLN', 'ROL', 'RUB','RON','SEK','SGD', 'SIT', 'SKK', 'TRL','THB','TRY','USD','ZAR'
];
let colours = {
}
let baseValutaDropdown;
let data;

function graph(data) {
  const start = data["start"];
  const end = data["end"];
  const period_length = dateToDays(end, start);
  let last_time = 0;
  let last_rate = {};

  const step = (bredde-xbuffer)/period_length;

  let i = 0;

  for (const valuta in data["rates"][0]){
    last_rate[valuta] = data["rates"][0][valuta];
    fill(colours[valuta]);
    text(valuta, 50, i*20+50);
    i++;
  }

  for (const key in data["rates"]){
    for (const valuta in data["rates"][key]){
      print(colours[valuta]+valuta);
      stroke(colours[valuta]);
      fill(colours[valuta]);
      const x = int(last_time*step+xbuffer);

      const y = højde-int(last_rate[valuta]*ymultiple+ybuffer);

      circle(x,y,1);
      last_rate[valuta] = data["rates"][key][valuta];
    }
    fill(255,0,0);
    stroke(255,0,0);
    circle(int(last_time*step+xbuffer),højde-(1*ymultiple+ybuffer),4)
    last_time = key;
  }
}

function defineColours() {
  for (let i = 0; i < valutas.length; i++) {
    print(valutas[i]);
    const hue = (i / valutas.length) * 360;
    const rgb = hslToRgb(hue, 50, 50);
    colours[valutas[i]] = color(rgb[0], rgb[1], rgb[2]);
  }
}

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function preload() {    //henter data fra en API og skriver det på skærmen
  loadJSON("https://api.frankfurter.dev/v1/2024-01-01..2025-01-12?base=EUR", data => {
    return;
  });
}

///////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

function SetupKnapper() { //Laver alle knapperne
    for (i = 0; i < totaleknapper.length; i++) {
    knapper = new SkabKnap(
    totaleknapper[i][0],
    totaleknapper[i][1],
    totaleknapper[i][2], //📎
    totaleknapper[i][3],
    totaleknapper[i][4], // Parametre til at skabe en knap.
    totaleknapper[i][5]
    );
  }
}

// En funktion, som skaber en knap, ved de givne koordinater, med den givne størrelse og label. koordinaterne som bliver inputtet er knappens midtpunkt.
function SkabKnap(x = 0, y = 0, tekst = "", xStørrelse=buttonSize[0], yStørrelse=buttonSize[1], fontStørrelse=44) {
  let knap = createButton(tekst)
    .position(x-xStørrelse/2, y-yStørrelse/2)
    .style("font-size", str(fontStørrelse)+"px")
    .size(xStørrelse, yStørrelse)
    .mousePressed( () => {
      console.log(selectedValuta+" Det Virker, YAY!");
      SkabDropdown(symbolValutaDropdown, 10, 70);
    });
}

function SkabDropdown(navn, x, y) { //Laver en dropdown menu
  navn = createSelect();
  navn.position(x, y);
  valutas.forEach(valutas => {
    if (valutas !== selectedValuta) {
      navn.option(valutas);
    }
  });
  navn.changed(() => {
    selectedValuta = navn.value();
  });
  return navn;
}

///////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

function formatJSON(data) { //Formaterer JSON dataen så den er nemmere at arbejde med
  let start = data["start_date"]
  let rates = {

  }
  for (const key in data["rates"]) {
    rates[dateToDays(key)] = data["rates"][key]; 
  }
  return {
    "rates" : rates, 
    "start" : start,
    "end" : data["end_date"],
    "base" : data["base"]
  }
}

function dateToDays(dateString, referenceDate) {   //Omdanner datoer til dage
  const date = new Date(dateString);
  referenceDate = new Date(referenceDate);
  const timeDifference = date - referenceDate;
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  return Math.floor(daysDifference);
}


function setup() {
  createCanvas(bredde, højde);
  defineColours();
  baseValutaDropdown = createSelect(); 
  baseValutaDropdown.position(0,0); //Remember to change pos coords when ui is made
  
//Makes currency options.
  valutas.forEach(valutas => {
    baseValutaDropdown.option(valutas);
  });

  baseValutaDropdown.changed(() =>  {
    let selectedValutas = baseValutaDropdown.value();
    console.log('Selected Valuta:', selectedValutas);
  });
  loadJSON("https://api.frankfurter.dev/v1/1999-01-04..2025-01-01?base=DKK", data => {
    print(data['rates']);graph(formatJSON(data));
  });
}