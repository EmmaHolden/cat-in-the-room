const animalWidth = 100;
const animalHeight = 100
const startButton = document.getElementById("start-button")
const animalElement = document.getElementById('animal');
const winWidth = window.innerWidth;
const winHeight = window.innerHeight;
const horizontalMax = (winWidth -animalWidth);
const verticalMax = (winHeight - animalHeight);
const rug = document.getElementById("rug")
const gauge = document.getElementById("gauge")
const animalSoundNumberOfLevels = 20
let numberOfGuessesRemaining = 20
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
  } else if (distance < 6){
    return "Very cold"
  } else if (distance < 9){
    return "A bit chilly"
  } else if (distance < 12){
    return "Getting warmer"
  } else if (distance < 15){
    return "Very Warm"
  } else if (distance < 18){
    return "Hot! Hot! Hot!"
  }
  else {
    return "Absolutely burning hot"
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
  numberOfGuessesRemaining = 20;
  $('#animal').animate({opacity: 1});
  $("#animal").animate({left: x +"px", top: y +"px"}, 2000, function(){
    $("#silent-mode-level").text("SILENT MODE ACTIVATED");
    $("#guesses-remaining").text(`GUESSES REMAINING: ${numberOfGuessesRemaining}`);
    $(".silent-mode").hide();
    $("#guesses-remaining").hide();
    $(".modal").show();
  });
}

function processGuess(distanceLevel){
    let hotterColderText = getHotterColderText(distanceLevel)
    $("#silent-mode-level").text(`Your last guess: ${hotterColderText}!`);
    $("#guesses-remaining").text(`GUESSES REMAINING: ${numberOfGuessesRemaining}`);
    gauge.src=`./images/gauge${distanceLevel}.png`;
    let sound = new Audio(`sounds/cat-meow.wav`)
    sound.volume = (distanceLevel / animalSoundNumberOfLevels);
    sound.play()
}

// Event Listeners
window.addEventListener('click', throttle(700, (e) => {
  if (gameActive){
    numberOfGuessesRemaining--;
    if (numberOfGuessesRemaining >= 0){
      let distanceLevel = getDistance(e)
      processGuess(distanceLevel);
    } else {
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

startButton.addEventListener("click", (e) => {
    const yPos = Math.floor(getRandomNumber(0, verticalMax));
    const xPos = Math.floor(getRandomNumber(0, horizontalMax));
    $('#animal').animate({opacity: 0}, function(){
      animalElement.style.top = yPos +"px";
      animalElement.style.left = xPos +"px";
      $(".modal").hide();
      $("#guesses-remaining").show();
      gameActive = true;
    });

});

animalElement.addEventListener("click", () => {
    endGame()
})

// Ensures lampshade swing animation finishes when mouse moved away
$(document).ready(function () {
  $(".lamp").on("animationiteration", function () {
    $(this).removeClass("swing");
  });

  $(".lamp").hover(function () {
    $(this).addClass("swing");
  });
});