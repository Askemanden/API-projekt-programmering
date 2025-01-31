let bredde = screen.width;   //bredden på skærmen
let højde = screen.height*1.3;//højden
const xbuffer = 100;
const ybuffer = 50;
let ymultipleSlider;
let ymultipleLabel;
let sliderValue;
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
  const ymultiple = ymultipleSlider.value(); // Hent værdien fra slideren
  background(0);
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
      stroke(colours[valuta]);
      fill(colours[valuta]);
      const x = int(last_time*step+xbuffer);

      const y = højde-int(last_rate[valuta]*ymultiple+ybuffer);

      circle(x,y,1);
      last_rate[valuta] = data["rates"][key][valuta];
    }
    last_time = key;
  }
  axis(period_length, start, ymultiple);
}

function axis(period_length, start, ymultiple) {
  stroke(173, 216, 230);
  fill(173, 216, 230);
  line(xbuffer, højde-ybuffer, bredde, højde-ybuffer); // Y-aksen
  line(xbuffer, højde-ybuffer, xbuffer, 50); // X-aksen

  const day_step = (bredde - xbuffer) / 10; // Divider bredden i 10 lige store trin
  let i = 0;

  for (let j = 0; j <= 9; j++) {
    const day_label = Math.floor((period_length / 10) * j); // Beregn jævnt fordelte tal
    text(day_label, xbuffer + i, højde - ybuffer + 10); // Vis tal på x-aksen
    i += day_step; // Opdater i for næste trin
  }

  // Tilføj label i enden af x-aksen
  text(`dage fra ${start}`, bredde - 125, højde - ybuffer + 25);

  const y_step = (højde - ybuffer - 50) / 20; // Divider højden i 10 lige store trin

  i = 0;

  for (let j = 0; j <= 19; j++) {
    const y_label = Math.round((i/ymultiple)*10)/10; // Beregn jævnt fordelte tal
    text(y_label, xbuffer - 30, højde - ybuffer - i); // Vis tal på y-aksen
    i += y_step; // Opdater i for næste trin
  }

  // Tilføj label i enden af y-aksen
  text("konversionsrate til base valuta", xbuffer, 50);
}




function dateToDays(dateString, referenceDate) {
  const date = new Date(dateString);
  referenceDate = new Date(referenceDate);
  const timeDifference = date - referenceDate;
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  return Math.round(daysDifference);
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


function submit(){
  let checked = [];
  for(let i=0; i<checkboxes.length; i++){
    if (checkboxes[i].checked()){
    checked.push(valutas[i]);
    }
  }
  getData(checked,baseValutaDropdown.selected())
}

function setup() {
  createCanvas(bredde, højde);
  background(0)
  defineColours();
  dropdown();
  checkboxMenu();
  let submitButton = createButton('Submit selections').position(70,2)
  submitButton.mousePressed(submit);

  ymultipleSlider = createSlider(0.01, 100, 50);
  ymultipleSlider.position((bredde-800)/2, 50); // Placer slideren
  ymultipleSlider.style('width', '800px'); 
  ymultipleSlider.style('color', 'blue');
  ymultipleSlider.input(updateValue);
  ymultipleSlider.attribute('step', '0.01');

  ymultipleLabel = createP('Y-zoom<br>Resubmit to update. Some valutas require lower zoom to appear').position((bredde-800)/2, 0);
  ymultipleLabel.style('color', 'rgb(173, 216, 230)');

  sliderValue = createP(`zoom: ${ymultipleSlider.value()}`);
  sliderValue.position((bredde-800)/2, 60);
  sliderValue.style('color', 'rgb(173, 216, 230)');
}

function updateValue() {
  let val = ymultipleSlider.value();
  sliderValue.html(`zoom: ${val}`);
}

function dropdown(){
  baseValutaDropdown = createSelect(); 
  baseValutaDropdown.position(4,2); //Remember to change pos coords when ui is made
  
  valutas.forEach(valuta => {
    baseValutaDropdown.option(valuta);
  });
  baseValutaDropdown.selected('EUR');
}

function checkboxMenu(){
  let i=0
  valutas.forEach(valuta => {
    checkboxes[i]=createCheckbox(valuta,false).position(0,30+i*20).style('color',colours[valuta]);
    i++
  })
}


function getData(selectedValutas, base){
  let url = "https://api.frankfurter.dev/v1/1999-01-01..?base=" + base + "&symbols=";
  for (const valuta of selectedValutas){
    url += valuta + ",";
  }
  return loadJSON(url,  data => {
    graph(formatJSON(data));
  });
}