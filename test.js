function preload(){
    image01 = loadImage('assets/characters/character' + 0 + '/back.png')
	image02 = loadImage('assets/map/map_400.png')
}
    function setup() {
    createCanvas(400,400);
	image(image01,0,0);
	image(image02,200,200);
}
