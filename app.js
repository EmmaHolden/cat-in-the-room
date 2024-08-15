const animalWidth = 100;
const animalHeight = 100
const easyButton = document.getElementById("easy-button")
const mediumButton = document.getElementById("medium-button")
const hardButton = document.getElementById("hard-button")
const playAgainButton = document.getElementById("play-again-button")
const animalElement = document.getElementById('animal');
const rug = document.getElementById("rug")
const gauge = document.getElementById("gauge")
const winnerLoser = document.getElementById("winner-loser")
const winWidth = window.innerWidth;
const winHeight = window.innerHeight;
const horizontalMax = (winWidth -animalWidth);
const verticalMax = (winHeight - animalHeight);
const animalSoundNumberOfLevels = 20
let totalNumberOfGuesses;
let numberOfGuessesRemaining;
let numberOfRows;
let numberOfColumns;
let gameActive =  false;

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function getDistance(e) {
  let mouseX = e.x || e.clientX
  let mouseY = e.y || e.clientY
  let position = $("#animal").position();
  let animalX = position.left  + animalWidth / 2;
  let animalY = position.top + animalHeight / 2;
  let distance = parseInt(Math.sqrt(Math.pow(mouseX - animalX, 2) + Math.pow(mouseY - animalY, 2)));
  distanceLevel = Math.max(0, animalSoundNumberOfLevels - parseInt((1 - Math.exp((Math.E - distance)/1000)) * 2 * animalSoundNumberOfLevels));
  return distanceLevel
}

function getHotterColderText(distance){
  if (distance < 3){
    return "Freezing cold"
  } else if (distance < 5){
    return "Very Cold"
  } else if (distance < 7){
    return "Cold"
  } else if (distance < 8){
    return "A bit chilly"
  } else if (distance < 10){
    return "Lukewarm"
  } else if (distance < 12){
    return "Warm"
  } else if (distance < 15){
    return "Getting hot! Hot! Hot!"
  } else if (distance < 18) {
    return "Absolutely burning hot"
  } else {
    return "You're on fire"
  }
}

function throttle(delay, fn) {
  let lastCall = 0;
  return function wrapper(...args) {
    const now = (new Date).getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  }
}

function endGame(){
  gameActive = false;
  var position = rug.getBoundingClientRect();
  var x = position.left;
  var y = position.top;
  $('.winner-loser').show();
  $('#animal').animate({opacity: 1});
  $("#animal").animate({left: x +"px", top: y +"px"}, 2000, function(){
    $("#silent-mode-level").text("SILENT MODE ACTIVATED");
    $(".silent-mode").hide();
    $("#guesses-remaining").hide();
    $("#play-again-button").show();
  });
}

function processGuess(distanceLevel){
    let hotterColderText = getHotterColderText(distanceLevel)
    $("#silent-mode-level").text(`Your last guess: ${hotterColderText}!`);
    gauge.src=`./images/gauge${distanceLevel}.png`;
    let sound = new Audio(`sounds/cat-meow.wav`)
    sound.volume = (distanceLevel / animalSoundNumberOfLevels);
    sound.play()
}

function addPawPrint(){
  let pawprint = document.createElement("img");
  document.getElementById(`${totalNumberOfGuesses - numberOfGuessesRemaining - 1}`).appendChild(pawprint);
  pawprint.setAttribute("src", "images/pawprint.png");
  pawprint.className = "pawprint-image"

}

function createGrid() {
  let Container = document.getElementById("container");
  Container.innerHTML = '';
    let i = 0;
    let x = numberOfRows * numberOfColumns;
    document.documentElement.style.setProperty("--rows", numberOfRows);
    document.documentElement.style.setProperty("--columns", numberOfColumns);
    for (i =  0; i < x ; i++) {
      var div = document.createElement("div");
      div.id = i;
      document.getElementById("container").appendChild(div);
      div.style.backgroundColor = "#a8f5f8";
      div.style.border = "solid 1px black";
      div.style.width = 300 / numberOfColumns + "px";
      div.style.height = 150 / numberOfRows + "px";
  }
}

function startGame(){
  const yPos = Math.floor(getRandomNumber(0, verticalMax));
  const xPos = Math.floor(getRandomNumber(0, horizontalMax));
  $('#animal').animate({opacity: 0}, function(){
    animalElement.style.top = yPos +"px";
    animalElement.style.left = xPos +"px";
    $(".modal").hide();
    createGrid();
    $("#guesses-remaining").show();
    gameActive = true;
  });
}

// Event Listeners
window.addEventListener('click', throttle(700, (e) => {
  if (gameActive){
    numberOfGuessesRemaining--;
    addPawPrint()
    if (numberOfGuessesRemaining > 0){
      let distanceLevel = getDistance(e)
      processGuess(distanceLevel);
    } else {
      winnerLoser.src=`./images/loser.png`;
      endGame();
    }
  }
}));

window.addEventListener("keydown", (event) => {
  let key = event.code;
  if (gameActive){
    if (key == "Space"){
      $(".silent-mode").show();
    } 
  }
})

easyButton.addEventListener("click", (e) => {
  totalNumberOfGuesses = 25;
  numberOfGuessesRemaining = 25;
  numberOfRows = 5;
  numberOfColumns = 5;
  startGame();
});

mediumButton.addEventListener("click", (e) => {
  totalNumberOfGuesses = 16;
  numberOfGuessesRemaining = 16;
  numberOfRows = 4;
  numberOfColumns = 4;
  startGame();
});

hardButton.addEventListener("click", (e) => {
  totalNumberOfGuesses = 9;
  numberOfGuessesRemaining = 9;
  numberOfRows = 3;
  numberOfColumns = 3;
  startGame();
});

playAgainButton.addEventListener("click", (e) => {
    $("#play-again-button").hide();
    $('.winner-loser').hide();
    $(".modal").show();
})

animalElement.addEventListener("click", () => {
    winnerLoser.src=`./images/winner.png`;
    endGame()
})


// Prevents elements on page being dragged by users 
$('div').on('dragstart', function(event) { event.preventDefault(); });
$('img').on('dragstart', function(event) { event.preventDefault(); });

// Ensures lampshade swing animation finishes when mouse moved away
$(document).ready(function () {
  $(".lamp").on("animationiteration", function () {
    $(this).removeClass("swing");
  });

  $(".lamp").hover(function () {
    $(this).addClass("swing");
  });
});