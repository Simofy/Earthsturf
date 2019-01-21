var img;
function preload() {
  img = loadImage('public/img/infSign_1.png');
}
function setup() {
    image(img, 0, 0);
    var c = get(50, 90);
    fill(c);
    noStroke();
    rect(25, 25, 50, 50);
  }