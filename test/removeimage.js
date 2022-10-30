
let images = {};

function preload(){
    images.lampOil = loadImage('assets/obj/lampOil.png');
}

function setup(){
    image(images.lampOil,0,0);
}

function mousePressed(){
    images["lampOil"].hide();
}


