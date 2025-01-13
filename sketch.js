function setup() {
  createCanvas(400, 400);
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