// brightness mirror
// see notebook
// smaller capture video draw to canvas not pixel but shape or character
let myvideo;
let vScale; // global video scaling variable
//let greyscale = [0,32,64,96,128,160,192,224,255,255,255,255,255]
let greyscale = [0, 32, 64, 96, 128, 160, 192, 224, 255];
let mix = false;
let lasttouch = 0;
let bricks = [];

function preload() {
  bricks[0] = loadImage("b0.png");
  bricks[1] = loadImage("b1.png");
  bricks[2] = loadImage("b2.png");
  bricks[3] = loadImage("b3.png");
  bricks[4] = loadImage("b4.png");
  bricks[5] = loadImage("b5.jpg");
  bricks[6] = loadImage("b6.png");
  bricks[7] = loadImage("b7.jpg");
}
function setup() {
  createCanvas(windowWidth, windowHeight); // larger canvas to draw to

  if (width < height) {
    vScale = floor(width / 30); // vScale tied to window width so it can work on phone and computer
    console.log("by width");
  } else {
    vScale = floor(height / 30);
    console.log("by height");
  }
  pixelDensity(1);
  myvideo = createCapture(VIDEO);
  myvideo.size(width / vScale, height / vScale);
  myvideo.hide();
  // video dom element , the source, will be smaller by vScale which is 40 by 30 to improve performance
  frameRate(5);
  bricks[0].resize(vScale, vScale);
  bricks[1].resize(vScale, vScale);
  bricks[2].resize(vScale, vScale);
  bricks[3].resize(vScale, vScale);
  bricks[4].resize(vScale, vScale);
  bricks[5].resize(vScale, vScale);
  bricks[6].resize(vScale, vScale);
  bricks[7].resize(vScale, vScale);
  //rectMode(CENTER);
  imageMode(CENTER);
  angleMode(DEGREES);
}

function draw() {
  //translate(width / 2, height / 2);
  background(55);
  //posterize to make stark black and  white
  filter(POSTERIZE);

  // load the myvideo to pixel array
  myvideo.loadPixels(); // gets a pixes arry for video capture

  // loop through the small video capture
  for (let y = 0; y < myvideo.height; y++) {
    // for each y there are some x's
    for (let x = 0; x < myvideo.width; x++) {
      //this mirrors the index for see note book
      let index = (myvideo.width - x - 1 + y * myvideo.width) * 4;
      let r = myvideo.pixels[index + 0];
      let g = myvideo.pixels[index + 1];
      let b = myvideo.pixels[index + 2];

      let bright = floor((r + g + b) / 3); // the brightness or greyscale 0-255 is the average of the rgb

      // just two values for posterize
      let brick;
      if (!mix) {
        // not mix get values from camera
        if (bright > 128) {
          //fill(90);
          brick = bricks[0];
        } else {
          //fill(255);
          brick = bricks[floor(random(1, 7))];
        }
      } else {
        if (random() < 0.1) {
          //fill(255);
          brick = bricks[floor(random(1, 7))];
        } else {
          //fill(90);
          brick = bricks[0];
        }
      }
      noStroke();
      //rect(x * vScale, y * vScale, vScale, vScale);
      push();
      translate(x * vScale + vScale / 2, y * vScale + vScale / 2);
      rotate(random([90, 0, 180]));

      image(brick, 0, 0);
      pop();
    }
  }
  // draw bricks
  for (let y = 0; y < myvideo.height; y += 2) {
    // for each y there are some x's
    for (let x = 0; x < myvideo.width; x++) {
      noFill();
      stroke(0);
      if (x % 2 == 0) {
        rect(x * vScale, y * vScale, vScale, vScale * 2);
      } else {
        rect(x * vScale, (y + 1) * vScale, vScale, vScale * 2);
      }
    }
  }

  //console.log('bing');
  //noLoop();
}

function keyPressed() {
  // this will download the first 25 seconds of the animation!
  //if (key === 'g') {
  //  saveGif('reflection.gif', 15);
  // }
  if (key === "s") {
    saveCanvas("squareB", "jpg");
  }
}

function touchStarted() {
  const currenttime = millis();
  const timesincelasttouch = currenttime - lasttouch;

  if (timesincelasttouch > 500) {
    /// toggle mix
    if (!mix) {
      mix = true;
    } else {
      mix = false;
    }
  }

  lasttouch = currenttime;
}

function mouseClicked() {
  touchStarted();
}
