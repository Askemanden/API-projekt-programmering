let bredde = 400;   //højden og bredden på skærmen
let højde = 400;
let JSON;  //variabel til at gemme data fra API

function setup() {
  createCanvas(bredde, højde);
}

function preload() {    //henter data fra en API og skriver det på skærmen
  JSON = loadJSON("https://api.frankfurter.dev/v1/2025-01-12?base=EUR", data => {
    console.log(data);
    textAlign(CENTER, CENTER);
    text(data.base, bredde/2, højde/2);
  });
}

function draw() {
  background(220);

}