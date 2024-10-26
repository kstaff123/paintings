let circles = [];
let arcs = [];
let menuVisible = false; // Flag to show/hide menu
let menuButtons = []; // Buttons for navigation

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Background color
  background(35, 35, 43);

  // Define circles: [offsetX, offsetY, sizeFactor, r, g, b, alpha]
  circles = [
    [-6, 5, 1.1, 213,235,222,200],   // White circle behind blue (center)
    [-6, 5, 1, 14,52,147,255],       // Blue circle (center)
    [-7, 4, .72, 20,20,20,255],      // Black circle (center)
    [-4.5, 8, .2, 176,155,54,225],   // Yellow circle (center)
    [-2.7, 11.2, .35, 81,184,227,255],// Light blue circle below yellow (center)
    [-6.5, 10, .25, 117,183,195,150],// Greenish/pink circle below black (center)
    [-10.9, 9.5, .15, 219,177,57,255],// Yellow circle left (center)
    [-10.2, 10.7, .15, 207,103,60,255],// Orange circle right of yellow (center)
    [-10.7, 11.8, .15, 142,96,68,180],// Orange circle under orange (center)
    [-11.7, 11.7, .15, 216,39,78,180],// Red circle left of orange (center)
    [-12.5, 11.5, .15, 253,233,96,180],// Red circle left of orange (center)
    [-2.7, 8, .35, 222,165,37,140],  // Yellow circle slightly right (center)
    [-3.5, 6, .2, 159,219,176,190],  // Light green circle (center)
    [-8, 9.2, .05, 214,166,218,255], // Tiny pink circle left (center)
    [-9.5, 9.7, .06, 0,0,0,255],     // Tiny orange circle left outline (center)
    [-9.5, 9.7, .04, 196,86,120,255],// Tiny orange circle left (center)
    [-3.5, 1, .3, 199,136,216,180],  // Pink circle top (center)
    [-13, 1, .2, 248,157,218,255],   // Pink circle top left 
    [-13, 9, .23, 96,166,201,255],   // White pink circle bottom left outline blue
    [-13, 9, .22, 0,0,0,255],        // White pink circle bottom left outline black
    [-13, 9, .2, 205,186,224,230],   // White pink circle bottom left
    [-12.7, 8.6, .07, 0,0,0,230],    // White pink circle bottom left black center
    [-13.5, -2, .08, 234,220,83,255],// Yellow circle top left 
    [.4, 3, .4, 51,106,98,200],      // Dark green circle right
    [.4, 3, .15, 78,172,188,150],    // Black circle inside green circle right
    [.4, 3, .1, 0,0,0,255],          // Black circle inside green circle right
    [-5.3, 6.8, .08, 160,200,255,150],// Yellow circle (center)
  ];

  arcs = [
    [-6.5, 10., .25, 171,180,220,255,1]
  ];

  drawCircles();

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
  staticButton.mousePressed(() => window.location.href = 'index.html');
  staticButton.hide();
  menuButtons.push(staticButton);

  let animatedButton = createButton('Animated Mode');
  animatedButton.position(20, 90);
  animatedButton.mousePressed(() => window.location.href = 'animated/animated.html');
  animatedButton.hide();
  menuButtons.push(animatedButton);

  let interactiveButton = createButton('Interactive Mode');
  interactiveButton.position(20, 120);
  interactiveButton.mousePressed(() => window.location.href = 'animated2/animated.html');
  interactiveButton.hide();
  menuButtons.push(interactiveButton);
}

function drawCircles() {
  background(35, 35, 43);
  
  let centerX = width / 2;
  let centerY = height / 2;
  let mainCircleSize = min(width, height) * 0.5;  
  let verticalOffset = height * -0.29;  

  // Loop through each circle in the array and draw it
  circles.forEach(c => {
    let [offsetX, offsetY, sizeFactor, r, g, b, alpha] = c;
    fill(r, g, b, alpha);
    ellipse(
      centerX + mainCircleSize * (offsetX / 10), 
      centerY + verticalOffset + mainCircleSize * (offsetY / 10), 
      mainCircleSize * sizeFactor, 
      mainCircleSize * sizeFactor
    );
  });

  // Loop through each arc (half-circle) in the array and draw it
  arcs.forEach(a => {
    let [offsetX, offsetY, sizeFactor, r, g, b, alpha, arcType] = a;
    fill(r, g, b, alpha);
    if (arcType === 1) {
      // Draw top half of the circle
      arc(
        centerX + mainCircleSize * (offsetX / 10), 
        centerY + verticalOffset + mainCircleSize * (offsetY / 10), 
        mainCircleSize * sizeFactor, 
        mainCircleSize * sizeFactor, 
        0, PI
      );
    } else if (arcType === -1) {
      // Draw bottom half of the circle
      arc(
        centerX + mainCircleSize * (offsetX / 10), 
        centerY + verticalOffset + mainCircleSize * (offsetY / 10), 
        mainCircleSize * sizeFactor, 
        mainCircleSize * sizeFactor, 
        PI, TWO_PI
      );
    }
  });

  if (menuVisible) {
    showMenu();
  }
}

function showMenu() {
  menuButtons.forEach(button => button.show());
}

function hideMenu() {
  menuButtons.forEach(button => button.hide());
}

// Handle key presses for menu toggle
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

// Function to resize the canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawCircles();  // Redraw the circles with the new size
}
