let font;
let tSize = 280; // Size of text
let tposX = 20; // X position of text
let tposY = 588; // Y position of text
let pointCount = 0.9; // Between 0-1
let speed = 20;
let comebackSpeed = 100;
let dia = 50;
let randomPos = true;
let pointsDirection = "right";
let interactionDirection = -3;
let textPoints = [];
let button1, button2; // Declare buttons

function preload() {
  font = loadFont("AvenirNextLTPro-Demi.otf");
}

function setup() {
  createCanvas(1000, 1000);
  textFont(font);

  // Create the two buttons
  button1 = createButton('Buy More');
  button2 = createButton('Print Invoice');
  
  // Set styles for buttons
  button1.style('background-color', 'rgb(255, 0, 0)'); // Red color like the starting color of particles
  button2.style('background-color', 'rgb(0, 0, 255)'); // Blue color like the ending color of particles
  button1.style('color', 'white');
  button2.style('color', 'white');
  button1.style('font-size', '20px');
  button2.style('font-size', '20px');
  button1.style('padding', '10px 20px');
  button2.style('padding', '10px 20px');
  
  // Set positions for buttons
  button1.position(100, 850); // Adjust position as needed
  button2.position(300, 850); // Adjust position as needed

  // Define the actions on button clicks
  button1.mousePressed(() => alert("Redirecting to buy more..."));
  button2.mousePressed(() => alert("Generating invoice..."));

  let points = font.textToPoints("Thanks", tposX, tposY, tSize, {
    sampleFactor: pointCount,
  });
  for (let i = 0; i < points.length; i++) {
    let pt = points[i];
    let textPoint = new Interact(
      pt.x,
      pt.y,
      speed,
      dia,
      randomPos,
      comebackSpeed,
      pointsDirection,
      interactionDirection
    );
    textPoints.push(textPoint);
  }
}

function draw() {
  background(20, 132, 300, 250);
  for (let i = 0; i < textPoints.length; i++) {
    let v = textPoints[i];
    v.update();
    v.show();
    v.behaviors();
  }
}

function Interact(x, y, m, d, t, s, di, p) {
  if (t) {
    this.home = createVector(random(width), random(height));
  } else {
    this.home = createVector(x, y);
  }
  this.pos = this.home.copy();
  this.target = createVector(x, y);
  if (di == "general") {
    this.vel = createVector();
  } else if (di == "up") {
    this.vel = createVector(0, -y);
  } else if (di == "down") {
    this.vel = createVector(0, y);
  } else if (di == "left") {
    this.vel = createVector(-x, 0);
  } else if (di == "right") {
    this.vel = createVector(x, 0);
  }
  this.acc = createVector();
  this.r = 5;
  this.maxSpeed = m;
  this.maxforce = 1;
  this.dia = d;
  this.come = s;
  this.dir = p;
  this.color = color(255, 0, 0); // Initial color (red)
}

Interact.prototype.behaviors = function () {
  let arrive = this.arrive(this.target);
  let mouse = createVector(mouseX, mouseY);
  let flee = this.flee(mouse);
  this.applyForce(arrive);
  this.applyForce(flee);
};

Interact.prototype.applyForce = function (f) {
  this.acc.add(f);
};

Interact.prototype.arrive = function (target) {
  let desired = p5.Vector.sub(target, this.pos);
  let d = desired.mag();
  let speed = this.maxSpeed;
  if (d < this.come) {
    speed = map(d, 0, this.come, 0, this.maxSpeed);
  }
  desired.setMag(speed);
  let steer = p5.Vector.sub(desired, this.vel);
  return steer;
};

Interact.prototype.flee = function (target) {
  let desired = p5.Vector.sub(target, this.pos);
  let d = desired.mag();
  if (d < this.dia) {
    desired.setMag(this.maxSpeed);
    desired.mult(this.dir);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  } else {
    return createVector(0, 0);
  }
};

Interact.prototype.update = function () {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);
};

Interact.prototype.show = function () {
  // Map color based on distance to target
  let distToTarget = this.pos.dist(this.target);
  let colorValue = map(distToTarget, 0, this.come, 0, 255);
  this.color = color(colorValue, 0, 255 - colorValue); // Transition from red to blue

  stroke(this.color);
  strokeWeight(10);
  point(this.pos.x, this.pos.y);
};
