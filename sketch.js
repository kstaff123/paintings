let circles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Background color
  background(35,35,43);


  
  // Define circles: [offsetX, offsetY, sizeFactor, r, g, b, alpha]
  circles = [
//  [X, Y, size, r, g, b,     a]
    [-6, 5, 1.1, 213,235,222,200],   // White circle behind blue (center)
    [-6, 5, 1, 14,52,147,255],   // Blue circle (center)
    [-7, 4, .72, 20,20,20,255],   // Black circle (center)
    [-4.5, 8, .2, 176,155,54,225],   // Yellow circle (center)
    [-2.7, 11.2, .35, 81,184,227,255],   // light blue circle below yellow (center)
    [-6.5, 10, .25, 117,183,195,150],   // greenish/pink circle below black (center)
    [-2.7, 8, .35, 222,165,37,140],   // Yellow circle slightly right (center)
    [-3.5, 6, .2, 159,219,176,190],   // light green circle (center)
    [-8, 9.2, .05, 214,166,218,255],   // tiny pink circle left (center)
    [-9.5, 9.7, .06, 0,0,0,255],   // tiny orange circle left outline (center)
    [-9.5, 9.7, .04, 196,86,120,255],   // tiny orange circle left (center)
    [-3.5, 1, .3, 199,136,216,180],   // pink circle top (center)
    [-13, 1, .2, 248,157,218,255],   // pink circle top left 
    [-13, 9, .23, 96,166,201,255],   // white pink circle bottom left outline blue
    [-13, 9, .22, 0,0,0,255],   // white pink circle bottom left outline black
    [-13, 9, .2, 205,186,224,230],   // white pink circle bottom left
    [-12.7, 8.6, .07, 0,0,0,230],   // white pink circle bottom left black center
    [-13.5, -2, .08, 234,220,83,255],   // yellow circle top left 
    [.4, 3, .4, 51,106,98,200],   // dark green circle right
    [.4, 3, .15, 78,172,188,150],   // black circle inside green circle right
    [.4, 3, .1, 0,0,0,255],   // black circle inside green circle right
    [-5.3, 6.8, .08, 160,200,255,150],   // Yellow circle (center)
    
  ];

  arcs = [
    [-6.5, 10., .25, 171,180,220,255,1]
  ];

  drawCircles();
}

function drawCircles() {
  background(35,35,43);
  
  let centerX = width / 2;
  let centerY = height / 2;
  let mainCircleSize = min(width, height) * 0.5; // Main circle size based on smaller screen dimension
  
  let verticalOffset = height * 0.1;

  // Loop through each circle in the array and draw it
  circles.forEach(c => {
    let [offsetX, offsetY, sizeFactor, r, g, b, alpha] = c;
    fill(r, g, b, alpha);
    ellipse(centerX + mainCircleSize * (offsetX/10), (centerY-250) + mainCircleSize * (offsetY/10), mainCircleSize * sizeFactor, mainCircleSize * sizeFactor);
  });

  // Loop through each arc (half-circle) in the array and draw it
  arcs.forEach(a => {
    let [offsetX, offsetY, sizeFactor, r, g, b, alpha, arcType] = a;
    fill(r, g, b, alpha);
    
    if (arcType === 1) {
      // Draw top half of the circle
      arc(centerX + mainCircleSize * (offsetX/10), (centerY-250) + mainCircleSize * (offsetY/10), mainCircleSize * sizeFactor, mainCircleSize * sizeFactor, 0, PI);
    } else if (arcType === -1) {
      // Draw bottom half of the circle
      arc(centerX + mainCircleSize * (offsetX/10), (centerY-250) + mainCircleSize * (offsetY/10), mainCircleSize * sizeFactor, mainCircleSize * sizeFactor, PI, TWO_PI);
    }
  });
}

// Function to resize the canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawCircles();  // Redraw the circles with the new size
}


