let circles = [];
let hoverSizes = [];
let noiseOffsets = [];
let velocities = [];
let song;
let amp;
let volumeSlider;
let menuVisible = false; // Flag to show/hide menu
let menuButtons = []; // Buttons for navigation

let smoothedPulse = 1;  
let draggingIndex = -1; 
let dragging = false;   
let prevMouseX, prevMouseY;  
let dragOffsetX = 0, dragOffsetY = 0;

function preload() {
  song = loadSound('Where-Are-We-chosic.com_.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  amp = new p5.Amplitude();
  
  circles = [
    [-6, 5, 1.1, 213,235,222,200],
    [-6, 5, 1, 14,52,147,255],
    [-7, 4, .72, 20,20,20,255],
    [-4.5, 8, .2, 176,155,54,225],
    [-2.7, 11.2, .35, 81,184,227,255],
    [-6.5, 10, .25, 117,183,195,150],
    [-10.9, 9.5, .15, 219,177,57,255],
    [-10.2, 10.7, .15, 207,103,60,255],
    [-10.7, 11.8, .15, 142,96,68,180],
    [-11.7, 11.7, .15, 216,39,78,180],
    [-12.5, 11.5, .15, 253,233,96,180],
    [-2.7, 8, .35, 222,165,37,140],
    [-3.5, 6, .2, 159,219,176,190],
    [-8, 9.2, .05, 214,166,218,255],
    [-9.5, 9.7, .06, 0,0,0,255],
    [-9.5, 9.7, .04, 196,86,120,255],
    [-3.5, 1, .3, 199,136,216,180],
    [-13, 1, .2, 248,157,218,255],
    [-13, 9, .23, 96,166,201,255],
    [-13, 9, .22, 0,0,0,255],
    [-13, 9, .2, 205,186,224,230],
    [-12.7, 8.6, .07, 0,0,0,230],
    [-13.5, -2, .08, 234,220,83,255],
    [.4, 3, .4, 51,106,98,200],
    [.4, 3, .15, 78,172,188,150],
    [.4, 3, .1, 0,0,0,255],
    [-5.3, 6.8, .08, 160,200,255,150],
  ];

  hoverSizes = new Array(circles.length).fill(1);
  noiseOffsets = circles.map(() => createVector(random(1000), random(1000)));
  velocities = circles.map(() => createVector(0, 0));

  song.loop();

  // Create the volume slider but hide it by default
  volumeSlider = createSlider(0, 1, 0.5, 0.01);
  volumeSlider.position(20, 20);
  volumeSlider.style('width', '150px');
  volumeSlider.hide();  // Hide the slider initially

  // Create menu buttons for navigation
  createMenuButtons();

  escButton = createButton('ESC');
  escButton.position(20, 20);
  escButton.style('opacity', '0.5');
  escButton.mousePressed(() => EscapeButton()); // Trigger menu on click 
}
function EscapeButton(){
  showMenu();
  escButton.hide();
  menuVisible = true;
  
}
function createMenuButtons() {
  let staticButton = createButton('Static Mode');
  staticButton.position(20, 60);
  staticButton.mousePressed(() => window.location.href = '../index.html');
  staticButton.hide();  // Hide button initially
  menuButtons.push(staticButton);

  let animatedButton = createButton('Animated Mode');
  animatedButton.position(20, 90);
  animatedButton.mousePressed(() => window.location.href = '../animated/animated.html');
  animatedButton.hide();  // Hide button initially
  menuButtons.push(animatedButton);

  let interactiveButton = createButton('Interactive Mode');
  interactiveButton.position(20, 120);
  interactiveButton.mousePressed(() => window.location.href = 'animated.html');
  interactiveButton.hide();  // Hide button initially
  menuButtons.push(interactiveButton);
}

function draw() {
  background(35, 35, 43);
  song.setVolume(volumeSlider.value());
  
  let centerX = width / 2;
  let centerY = height / 2;
  let mainCircleSize = min(width, height) * 0.5;
  let verticalOffset = height * -0.29;

  let volume = amp.getLevel();
  
  let targetPulse = map(volume, 0, 1, 0.9, 2.5);
  smoothedPulse = lerp(smoothedPulse, targetPulse, 0.05);
  
  circles.forEach((c, index) => {
    // Destructure the circle properties
    let [offsetX, offsetY, baseSizeFactor, r, g, b, alpha] = c;

    // Generate Perlin noise values for smooth floating
    let noiseX = noise(noiseOffsets[index].x);
    let noiseY = noise(noiseOffsets[index].y);

    // Map noise values to a small floating range
    let floatX = map(noiseX, 0, 1, -1, 1);
    let floatY = map(noiseY, 0, 1, -1, 1);

    // Increment noise offsets to make the circles float smoothly
    noiseOffsets[index].x += 0.002;
    noiseOffsets[index].y += 0.002;

    // Apply velocities if the circle is not being dragged and has a non-zero velocity
    if (draggingIndex !== index && velocities[index].mag() > 0) {
      offsetX += velocities[index].x;
      offsetY += velocities[index].y;

      // Apply friction to gradually stop the circle
      velocities[index].mult(0.98);

      // Calculate the radius of the circle
      let circleRadius = (baseSizeFactor * hoverSizes[index] * smoothedPulse * mainCircleSize) / 2;

      // Check for collision with the canvas edges and reverse velocity if necessary
      if (centerX + mainCircleSize * (offsetX / 10) + floatX * 20 - circleRadius < 0 || 
          centerX + mainCircleSize * (offsetX / 10) + floatX * 20 + circleRadius > width) {
        velocities[index].x *= -1;  
      }

      if (centerY + verticalOffset + mainCircleSize * (offsetY / 10) + floatY * 20 - circleRadius < 0 || 
          centerY + verticalOffset + mainCircleSize * (offsetY / 10) + floatY * 20 + circleRadius > height) {
        velocities[index].y *= -1;  
      }

      // Update the circle's offset values
      circles[index][0] = offsetX;
      circles[index][1] = offsetY;
    }

    // If the circle is being dragged, update its position to follow the mouse
    if (dragging && draggingIndex === index) {
      let circleRadius = (baseSizeFactor * hoverSizes[index] * smoothedPulse * mainCircleSize) / 2;
      let newOffsetX = (mouseX - centerX) / mainCircleSize * 10 - dragOffsetX;
      let newOffsetY = (mouseY - centerY) / mainCircleSize * 10 - dragOffsetY;

      let circleX = centerX + mainCircleSize * (newOffsetX / 10);
      let circleY = centerY + verticalOffset + mainCircleSize * (newOffsetY / 10);

      // Prevent the circle from going out of bounds
      if (circleX - circleRadius < 0 || circleX + circleRadius > width) {
        newOffsetX = offsetX;
      }
      if (circleY - circleRadius < 0 || circleY + circleRadius > height) {
        newOffsetY = offsetY;
      }

      // Update the circle's offset values
      circles[index][0] = newOffsetX;
      circles[index][1] = newOffsetY;
    }

    // Calculate the circle's position with floating effect
    let circleX = centerX + mainCircleSize * (offsetX / 10) + floatX * 20;
    let circleY = centerY + verticalOffset + mainCircleSize * (offsetY / 10) + floatY * 20;

    // Check if the mouse is over the circle
    let d = dist(mouseX, mouseY, circleX, circleY);
    let isHovered = d < (baseSizeFactor * mainCircleSize) / 2;

    // Determine the target size based on hover state
    let targetSizeFactor = isHovered ? 1.2 : 1;

    // Smoothly interpolate between current and target size
    hoverSizes[index] = lerp(hoverSizes[index], targetSizeFactor, 0.1);

    // Calculate the animated size of the circle
    let animatedSize = baseSizeFactor * hoverSizes[index] * smoothedPulse * mainCircleSize;

    // Set the fill color and draw the circle
    fill(r, g, b, alpha);
    ellipse(circleX, circleY, animatedSize, animatedSize);
  });

  // Show menu if visible
  if (menuVisible) {
    showMenu();
  }
}

function showMenu() {
  volumeSlider.show();
  menuButtons.forEach(button => button.show());
}

function hideMenu() {
  volumeSlider.hide();
  menuButtons.forEach(button => button.hide());
}

// Toggle the menu with Escape key
function keyPressed() {
  if (keyCode === ESCAPE) {
    menuVisible = !menuVisible;
    if (menuVisible) {
      escButton.hide();
      showMenu();
    } else {
      escButton.show();
      hideMenu();
    }
  }
}

function mousePressed() {
  let centerX = width / 2;
  let centerY = height / 2;
  let mainCircleSize = min(width, height) * 0.5;
  let verticalOffset = height * -0.29;

  circles.forEach((c, index) => {
    let [offsetX, offsetY, baseSizeFactor] = c;
    let circleX = centerX + mainCircleSize * (offsetX / 10);
    let circleY = centerY + verticalOffset + mainCircleSize * (offsetY / 10);

    let d = dist(mouseX, mouseY, circleX, circleY);
    if (d < (baseSizeFactor * mainCircleSize) / 2) {
      dragging = true;
      draggingIndex = index;
      prevMouseX = mouseX;
      prevMouseY = mouseY;

      dragOffsetX = (mouseX - circleX) / mainCircleSize * 10;
      dragOffsetY = (mouseY - (circleY - verticalOffset)) / mainCircleSize * 10;
    }
  });
}

function mouseDragged() {
  if (dragging && draggingIndex !== -1) {
    let dx = mouseX - prevMouseX;
    let dy = mouseY - prevMouseY;

    velocities[draggingIndex].x = dx * 0.1;
    velocities[draggingIndex].y = dy * 0.1;

    prevMouseX = mouseX;
    prevMouseY = mouseY;
  }
}

function mouseReleased() {
  dragging = false;
  draggingIndex = -1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
