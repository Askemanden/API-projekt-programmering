let bredde = screen.width;   //bredden på skærmen
let højde = screen.height*1.4;//højden
const xbuffer = 100;
const ybuffer = 50;
const ymultiple = 20;
let checkboxes = [];
const valutas = [
  'AUD','BGN','BRL','CAD','CHF', 'CYP','CNY','CZK','DKK', 'EEK','EUR','GBP','HKD', 'HRK',
  'HUF','IDR','ILS','INR','ISK','JPY','KRW', 'LTL', 'LVL', 'MTL','MXN','MYR','NOK',
  'NZD','PHP','PLN', 'ROL', 'RUB','RON','SEK','SGD', 'SIT', 'SKK', 'TRL','THB','TRY','USD','ZAR'
];
let colours = {
};
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
  }

  for (const key in data["rates"]){
    for (const valuta in data["rates"][key]){
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
  dropdown();
  checkboxMenu();
  let submitButton = createButton('Submit selections').position(70,2)
  submitButton.mousePressed(submit())
  loadJSON("https://api.frankfurter.dev/v1/1999-01-04..2025-01-01?base=DKK", data => {
    print(data['rates']);graph(formatJSON(data));
  });
}

function dropdown(){
  baseValutaDropdown = createSelect(); 
  baseValutaDropdown.position(4,2); //Remember to change pos coords when ui is made
  
  valutas.forEach(valuta => {
    baseValutaDropdown.option(valuta);
  });

  baseValutaDropdown.changed(() =>  {
    let selectedValuta = baseValutaDropdown.value();
    console.log('Selected Valuta:', selectedValuta);
  });
}

function checkboxMenu(){
  let i=0
  valutas.forEach(valutaCheckbox => {
    checkboxes[i]=createCheckbox(valutaCheckbox,false).position(0,30+i*20).style('color',colours[valutaCheckbox]);
    i++
  })
}

function submit(){
  let checked = [];
  for(let i=0; i<checkboxes.length; i++){
    if (checkboxes[i].checked){
    checked.push(checkboxes[i].label)
    }
  }
  getData(checked,baseValutaDropdown.selected())
}

function getData(selectedValutas, base, start, end){
  let url = `https://api.frankfurter.dev/v1/${start}..${end}?base=${base}`;
  selectedValutas.forEach(valuta => url += `&symbols=${valuta}`);
  return loadJSON(url);
}