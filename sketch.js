let bredde = 400;   //højden og bredden på skærmen
let højde = 400;


function setup() {
  createCanvas(bredde, højde);
  let baseValutaDropdown;
  let valutas = [
    'AUD','BGN','BRL','CAD','CHF','CNY','CZK','DKK','EUR','GBP','HKD',
    'HUF','IDR','ILS','INR','ISK','JPY','KRW','MXN','MYR','NOK',
    'NZD','PHP','PLN','RON','SEK','SGD','THB','TRY','USD','ZAR'
  ]

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