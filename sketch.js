let bredde = 800;   //højden og bredden på skærmen
let højde = 800;
let selectedValuta; //Valutaen der er valgt
let baseValutaDropdown;
let symbolValutaDropdown;

            //x, y, tekst, xStørrelse, yStørrelse, fontStørrelse
let knap1 = [200, 300, "Vis valg", 100, 50, 20];

let totaleknapper = [knap1]; //En liste over alle knapperne
let buttonSize = [100, 50]; //Størrelsen på knapperne
let knapper = []; //En liste til at holde på knapperne

let valutas = [
  'AUD','BGN','BRL','CAD','CHF','CNY','CZK','DKK','EUR','GBP','HKD',
  'HUF','IDR','ILS','INR','ISK','JPY','KRW','MXN','MYR','NOK',
  'NZD','PHP','PLN','RON','SEK','SGD','THB','TRY','USD','ZAR'
]

function preload() {    //henter data fra en API og skriver det på skærmen
  loadJSON("https://api.frankfurter.dev/v1/2025-01-12?base=EUR", data => {
    
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

function draw() {
  background(220);
}

function formatJSON(data) { //Formaterer JSON dataen så den er nemmere at arbejde med
  let start = data["start_date"]
  let rates = {

  }
  for (const key in data["rates"]) {
    rates[dataToDays(key)] = data["rates"][key]; 
  }
}

function dateToDays(dateString) { //Omdanner en dato til dage siden 1970-01-01
  const date = new Date(dateString);
  const referenceDate = new Date("1970-01-01");
  const timeDifference = date - referenceDate;
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  return Math.floor(daysDifference);
}


function setup() {
  createCanvas(bredde, højde);
  SkabDropdown(baseValutaDropdown, 10, 10); //Laver en dropdown menu
  
  SetupKnapper(); //Laver alle knapperne
}