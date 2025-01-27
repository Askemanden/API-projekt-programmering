let bredde = screen.width;   //bredden på skærmen
let højde = screen.height*2;//højden
const xbuffer = 100;
const ybuffer = 50;
const ymultiple = 10;
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

  for (const valuta in data["rates"][0]){
    last_rate[valuta] = data["rates"][0][valuta];
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
  axis(xbuffer,ybuffer-højde, step);
}

function axis(x0, y0, step){
  stroke(255,255,255);
  fill(255,255,255);
  line(x0,y0,bredde,y0);
  line(x0,y0,x0,0);
  let j = 0;
  for (let i = 0; i < bredde; i+=200*step) {
    text(int(j), x0+i, y0);
    j+=200;
  }

}

function dateToDays(dateString, referenceDate) {
  const date = new Date(dateString);
  referenceDate = new Date(referenceDate);
  const timeDifference = date - referenceDate;
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  return Math.floor(daysDifference);
}

function formatJSON(data) {
  let start = data["start_date"];
  let rates = {

  }
  for (const key in data["rates"]) {
    rates[dateToDays(key, start)] = data["rates"][key];
  }

  return {
    "rates" : rates, 
    "start" : start,
    "end" : data["end_date"],
    "base" : data["base"]
  }
}

function defineColours() {
  for (let i = 0; i < valutas.length; i++) {
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


function setup() {
  createCanvas(bredde, højde);
  background(0)
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
  getData(valutas, 'EUR');
}

function getData(selectedValutas, base){
  let url = `https://api.frankfurter.dev/v1/1999-01-01..?base=${base}&symbols=`;
  selectedValutas.forEach(valuta => url += `${valuta},`);
  print(url);
  return loadJSON(url,  data => {
    graph(formatJSON(data));
  });
}