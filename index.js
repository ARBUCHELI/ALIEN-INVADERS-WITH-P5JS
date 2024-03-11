let blasts = [];
let invaders = [];
let bases = [];
let baseHealth = [];
let bombs = []; // Array to store bombs dropped by invaders
let motherships = []; // Array to store motherships
let mothershipSpeed = 2; // Adjust the speed of the mothership as needed
const baseWidth = 100;
const baseHeight = 50;
let score = 0;
let gameOver = false;
let gameStarted = false; // Variable to track if the game has started

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialize military bases
  for (let i = 0; i < 5; i++) {
    bases.push(createVector((width / 6) * (i + 1), height - 50)); // Bases evenly distributed across the width
    baseHealth.push(4); // Each base starts with full health
  }
}

function draw() {
  background(0);

  // Render frame around the game
  stroke(255); // Set the stroke color to white
  noFill(); // Don't fill the rectangle
  rect(0, 0, width, height);

  if (!gameStarted) {
    // Draw starting screen
    textFont('Impact');
    fill('#feb236');
    noStroke();
    textSize(70);
    textAlign(CENTER, CENTER);
    text('MINIMALISTIC ALIEN INVADERS WITH P5.JS', width / 2, height / 2 - 100);
    textFont('Impact');
    noStroke();
    fill('#c94c4c');
    textSize(50);
    text(
      'Press any button to start protecting the planet Earth',
      width / 2,
      height / 2 + 50
    );
    textFont('Impact');
    noStroke();
    fill('#c94c4c');
    textSize(50);
    text('and avoid its destruction', width / 2, height / 2 + 110);
    textFont('Impact');
    noStroke();
    fill('#b7d7e8');
    textSize(50);
    text('Created by: Andrés R. Bucheli', width / 2, height / 2 + 200);
  } else {
    // Check if all bases are destroyed
    if (bases.length === 0 && !gameOver) {
      gameOver = true;
      // Display game over message
      fill('#feb236');
      textSize(70);
      textAlign(CENTER, CENTER);
      text('Game Over', width / 2, height / 2);
      noLoop(); // Stop the game loop
    }

    // Game logic continues only if game over state is false

    // Create invaders
    if (random(1) < 0.01) {
      let invader = {
        x: random(width),
        y: 0,
        type: floor(random(3)), // Randomly select invader type
      };
      invaders.push(invader);
    }

    // Draw invaders and drop bombs
    for (let i = 0; i < invaders.length; i++) {
      let invader = invaders[i];
      drawInvader(invader.x, invader.y, invader.type);
      invader.y += 1;

      // Drop bombs
      if (random(1) < 0.005) {
        let bomb = createVector(invader.x, invader.y); // Create a bomb at the invader's position
        bombs.push(bomb); // Add the bomb to the bombs array
      }
    }

    // Draw bombs
    drawBombs();

    drawMotherships();

    // Detect collision with blasts
    for (let i = blasts.length - 1; i >= 0; i--) {
      let blast = blasts[i];
      for (let j = invaders.length - 1; j >= 0; j--) {
        let invader = invaders[j];
        if (dist(blast[0], blast[1], invader.x, invader.y) < 10) {
          blasts.splice(i, 1);
          invaders.splice(j, 1);
          score++;
        }
      }
    }

    // Detect collision with bases
    for (let i = invaders.length - 1; i >= 0; i--) {
      let invader = invaders[i];
      for (let j = 0; j < bases.length; j++) {
        let base = bases[j];
        if (
          invader.y + 15 >= base.y &&
          invader.y + 15 <= base.y + baseHeight &&
          invader.x >= base.x &&
          invader.x <= base.x + baseWidth
        ) {
          // Invader collided with base
          invaders.splice(i, 1); // Remove the invader
          baseHealth[j]--; // Reduce base health
          if (baseHealth[j] === 0) {
            bases.splice(j, 1); // Remove destroyed base
            baseHealth.splice(j, 1);
          } else if (baseHealth[j] === -1) {
            // Remove the base if hit by a fourth spaceship
            bases.splice(j, 1);
            baseHealth.splice(j, 1);
          }
          break; // Stop checking other bases
        }
      }
    }

    // Detect collision with bombs
    for (let i = bombs.length - 1; i >= 0; i--) {
      let bomb = bombs[i];
      for (let j = 0; j < bases.length; j++) {
        let base = bases[j];
        if (
          bomb.y >= base.y &&
          bomb.y <= base.y + baseHeight &&
          bomb.x >= base.x &&
          bomb.x <= base.x + baseWidth
        ) {
          // Bomb collided with base
          bombs.splice(i, 1); // Remove the bomb
          baseHealth[j]--; // Reduce base health
          if (baseHealth[j] === 0) {
            bases.splice(j, 1); // Remove destroyed base
            baseHealth.splice(j, 1);
          } else if (baseHealth[j] === -1) {
            // Remove the base if hit by a fourth bomb
            bases.splice(j, 1);
            baseHealth.splice(j, 1);
          }
          break; // Stop checking other bases
        }
      }
    }

    // Draw blasts
    for (let i = 0; i < blasts.length; i++) {
      let xpos = blasts[i][0];
      let ypos = blasts[i][1];
      fill('#ff7b25');
      ellipse(xpos, ypos, 12, 12);
      blasts[i][1] -= 5;
    }

    // Remove blasts that are out of screen
    for (let i = blasts.length - 1; i >= 0; i--) {
      if (blasts[i][1] < 0) {
        blasts.splice(i, 1);
      }
    }

    // Draw shooter tank
    noStroke();
    fill(100); // Dark gray color for the tank body
    push();
    translate(mouseX, mouseY);
    rect(-20, -10, 40, 20); // Tank body
    rect(-15, -20, 30, 10); // Tank top
    rect(-10, -30, 20, 10); // Tank turret
    fill(150); // Light gray color for details
    rect(-15, -10, 30, 3); // Tank barrel
    pop();

    // Draw military bases
    for (let i = 0; i < bases.length; i++) {
      let baseColor;
      if (baseHealth[i] === 4) {
        baseColor = color('#86af49'); // Blue if full health
      } else if (baseHealth[i] === 3) {
        baseColor = color(255, 255, 0); // Yellow if hit once
      } else if (baseHealth[i] === 2) {
        baseColor = color(255, 165, 0); // Orange if hit twice
      } else if (baseHealth[i] === 1) {
        baseColor = color(255, 0, 0); // Red if hit thrice
      }
      fill(baseColor);
      let baseX = bases[i].x;
      let baseY = bases[i].y;

      // Draw the castle-like structure
      rect(baseX, baseY + 20, baseWidth, baseHeight - 20); // Castle base
      rect(baseX + baseWidth / 4, baseY, baseWidth / 2, 20); // Castle top
      rect(baseX + baseWidth / 3, baseY + 20, baseWidth / 3, 20); // Castle tower

      // Draw doors
      fill(50); // Dark gray color for the doors
      rect(baseX + baseWidth / 2 - 10, baseY + baseHeight - 15, 20, 100); // Draw the doors
    }

    // Draw scoreboard
    fill('#80ced6');
    textSize(40);
    textAlign(RIGHT);
    text('Score: ' + score, width - 20, 30);
  }
  if (gameOver) {
    noLoop(); // Stop the game loop
    gameOverScreen(); // Call the function to display game over message
    return; // Exit draw function
  }
}

// Function to draw different types of invaders
function drawInvader(x, y, type) {
  fill(255);
  switch (type) {
    case 0:
      // Draw type 0 invader
      fill('#6b5b95');
      beginShape();
      vertex(x - 15, y + 15);
      vertex(x, y - 15);
      vertex(x + 15, y + 15);
      vertex(x - 10, y);
      vertex(x + 10, y);
      endShape(CLOSE);
      break;
    case 1:
      // Draw type 1 invader
      fill('#5b9aa0');
      beginShape();
      vertex(x - 15, y + 15);
      vertex(x, y - 15);
      vertex(x + 15, y + 15);
      vertex(x - 10, y);
      vertex(x + 10, y);
      endShape(CLOSE);
      break;
    case 2:
      // Draw type 2 invader
      fill('#d96459');
      beginShape();
      vertex(x - 20, y);
      vertex(x - 10, y - 15);
      vertex(x, y);
      vertex(x + 10, y - 15);
      vertex(x + 20, y);
      vertex(x + 10, y + 15);
      vertex(x - 10, y + 15);
      endShape(CLOSE);
      break;
  }
}

// Function to draw bombs and handle their movement
function drawBombs() {
  for (let i = bombs.length - 1; i >= 0; i--) {
    let bomb = bombs[i];
    fill('#588c7e'); // Red color for bombs
    rect(bomb.x, bomb.y, 20, 5); // Draw bomb
    bomb.y += 2; // Update bomb position
    // Collision detection between bombs and blasts
    for (let j = blasts.length - 1; j >= 0; j--) {
      let blast = blasts[j];
      if (
        bomb.x < blast[0] + 12 &&
        bomb.x + 20 > blast[0] &&
        bomb.y < blast[1] + 12 &&
        bomb.y + 5 > blast[1]
      ) {
        // If collision occurs, remove both bomb and blast
        bombs.splice(i, 1);
        blasts.splice(j, 1);
        break; // Exit the loop after removing the bomb
      }
    }
    if (
      mouseX - 20 < bomb.x + 20 &&
      mouseX + 20 > bomb.x &&
      mouseY - 10 < bomb.y + 5 &&
      mouseY + 10 > bomb.y
    ) {
      // If the bomb hits the tank, game over
      gameOver = true;
      noLoop(); // Stop the game loop
    }
    // Remove bombs that are out of screen
    if (bomb.y > height) {
      bombs.splice(i, 1);
    }
  }
}

// Trigger the blaster by pressing the spacebar
function keyPressed() {
  if (!gameStarted) {
    // Start the game when any key is pressed
    gameStarted = true;
    loop(); // Start the game loop
  } else if (!gameOver && key === ' ') {
    blasts.push([mouseX, mouseY]);
  } else if (gameOver) {
    // Restart the game when any key is pressed after game over
    restartGame();
  }
}

function restartGame() {
  // Reset all game variables to their initial state
  blasts = [];
  invaders = [];
  bases = [];
  baseHealth = [];
  bombs = [];
  motherships = [];
  score = 0;
  gameOver = false;
  gameStarted = false;

  // Initialize military bases
  for (let i = 0; i < 5; i++) {
    bases.push(createVector((width / 6) * (i + 1), height - 50)); // Bases evenly distributed across the width
    baseHealth.push(4); // Each base starts with full health
  }

  // Restart the game loop
  loop();
}

function drawMotherships() {
  // Draw motherships and handle movement
  for (let i = motherships.length - 1; i >= 0; i--) {
    let mothership = motherships[i];
    fill('#8ca3a3'); // Orange color for the mothership
    ellipse(mothership.x, mothership.y, 60, 30); // Draw mothership (adjust size as needed)

    // Draw little black circles as windows
    fill(0); // Black color for the windows
    let windowSpacing = 10; // Adjust the spacing between windows as needed
    let numWindows = 5; // Adjust the number of windows as needed
    let windowSize = 10; // Adjust the size of the windows as needed
    for (let j = 0; j < numWindows; j++) {
      ellipse(
        mothership.x - 20 + j * windowSpacing,
        mothership.y,
        windowSize,
        windowSize
      );
    }

    mothership.x += mothershipSpeed; // Move mothership horizontally

    // Check for collision with blasts
    for (let j = blasts.length - 1; j >= 0; j--) {
      let blast = blasts[j];
      if (dist(blast[0], blast[1], mothership.x, mothership.y) < 30) {
        // If collision occurs, remove the blast and increment the score
        blasts.splice(j, 1);
        motherships.splice(i, 1);
        score += 100;
        break; // Exit the loop after collision
      }
    }

    // Remove motherships that are out of screen
    if (mothership.x > width) {
      motherships.splice(i, 1);
    }
  }
}

function createMothership() {
  // Create a mothership and add it to the motherships array
  let mothership = {
    x: 0, // Start at the left edge of the screen
    y: 100, // Random y position within the top half of the screen
  };
  motherships.push(mothership);
}

// Call createMothership function every 15 seconds
setInterval(createMothership, 30000);

function gameOverScreen() {
  // Clear the canvas
  background(0);

  // Display game over message
  fill('#feb236');
  textSize(70);
  textAlign(CENTER, CENTER);
  text('Game Over', width / 2, height / 2);
  textFont('Impact');
  noStroke();
  fill('#deeaee');
  textSize(50);
  text('Press any key to start again', width / 2, height / 2 + 70);
}
