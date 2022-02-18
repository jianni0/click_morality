/*
 * @name Oscillator Frequency
 * @arialabel The wavelength travels across the screen and as the user’s mouse moves left, the wavelength is longer and the frequency is slower and both increase as the mouse moves right
 * @description <p>Control an Oscillator and view the waveform using FFT.
 * MouseX is mapped to frequency, mouseY is mapped to amplitude.</p>
 * <p><em><span class="small"> To run this example locally, you will need the
 * <a href="http://p5js.org/reference/#/libraries/p5.sound">p5.sound library</a> and a
 * sound file.</span></em></p>
 */
let osc, fft;
let img;
let noise, env, analyzer;
let playMode = 'PRESS';
let sample;


function setup() {
  createCanvas(windowWidth, windowHeight);
  img = loadImage('data/not_i.jfif');
  
  soundFormats('mp3');
  sample = loadSound('data/Toccata.mp3');
  
  noise = new p5.Noise(); // other types include 'brown' and 'pink'
  noise.start();
  noise.amp(0);

  env = new p5.Env(); // set attackTime, decayTime, sustainRatio, releaseTime
  env.setADSR(0.001, 0.1, 0.2, 0.1); // set attackLevel, releaseLevel
  env.setRange(1, 0);

  // p5.Amplitude will analyze all sound in the sketch
  // unless the setInput() method is used to specify an input.
  analyzer = new p5.Amplitude();

  osc = new p5.TriOsc(); // set frequency and type
  osc.amp(1);

  fft = new p5.FFT();
  osc.start();
}

function draw() {
  background(0);
  image(img, 0, 0);
  image(img, 0, height , img.width / 2, img.height / 2);
  textSize(20);
  text("find_the_moral_spot_and_click_it", width/2,height-height/4);
  
  
  let str = 'MORALITY';
  str += ' PRESS_MORALITY ' + playMode + '.';
  text(str, 50, height / 4);
  
  let level = analyzer.getLevel();
  let levelHeight = map(level, 0, 0.4, 0, height);
  //fill(0, 250, 100);
  rect(0, height/6, width, -levelHeight);
  
  
  

  let waveform = fft.waveform(); // analyze the waveform
  beginShape();
  strokeWeight(1);
  fill(255,0,0);
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height, 0);
    vertex(x, y);
  }
  endShape();

  // change oscillator frequency based on mouseX
  let freq = map(mouseX, 0, width, 40, 200);
  osc.freq(freq);

  let amp = map(mouseY, 0, height, 1, 0.01);
  osc.amp(amp);
}

function mouseClicked() {
  sample.play();
}

function mousePressed() {
  env.play(noise);
}



function togglePlayMode() {
  if (playMode === 'sustain') {
    playMode = 'restart';
  } else {
    playMode = 'sustain';
  }
  sample.playMode(playMode);
}
