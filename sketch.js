let bredde = 400;   //højden og bredden på skærmen
let højde = 400;
let valutas = [
  'AUD','BGN','BRL','CAD','CHF','CNY','CZK','DKK','EUR','GBP','HKD',
  'HUF','IDR','ILS','INR','ISK','JPY','KRW','MXN','MYR','NOK',
  'NZD','PHP','PLN','RON','SEK','SGD','THB','TRY','USD','ZAR'
]
let baseValutaDropdown;

function setup() {
  createCanvas(bredde, højde);
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
}

function preload() {    //henter data fra en API og skriver det på skærmen
  loadJSON("https://api.frankfurter.dev/v1/2025-01-12?base=EUR", data => {
    console.log(data);
  });
}

function draw() {
  background(220);

}

function formatJSON(data) {
  let start = data["start_date"]
  let rates = {

  }
  for (const key in data["rates"]) {
    rates[dataToDays(key)] = 
  }
}

function dateToDays(dateString) {
  const date = new Date(dateString);
  const referenceDate = new Date("1970-01-01");
  const timeDifference = date - referenceDate;
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  return Math.floor(daysDifference);
}