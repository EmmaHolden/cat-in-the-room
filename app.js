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
let gameActive =  false;

const playSound = (soundLevel) => {
  let soundLevelText = "";
  if (gameActive){
  if (soundLevel < 3){
    soundLevelText = "Freezing cold"
  } else if (soundLevel < 6){
    soundLevelText = "Very cold"
  } else if (soundLevel < 9){
    soundLevelText = "A bit chilly"
  } else if (soundLevel < 12){
    soundLevelText = "Getting warmer"
  } else if (soundLevel < 15){
    soundLevelText = "Very Warm"
  } else if (soundLevel < 18){
    soundLevelText = "Hot! Hot! Hot!"
  }
  else {
    soundLevelText = "Absolutely burning hot"
  }
  $("#silent-mode-level").text(`Your last guess: ${soundLevelText}!`);
  gauge.src=`./images/gauge${soundLevel}.png`;
  let sound = new Audio(`sounds/cat-meow.wav`)
  sound.volume = (soundLevel / animalSoundNumberOfLevels);
  sound.play()

  }
}

function checkDistance(e) {
  let mouseX = e.x || e.clientX
  let mouseY = e.y || e.clientY
  let position = $("#animal").position();
  let animalX = position.left  + animalWidth / 2;
  let animalY = position.top + animalHeight / 2;
  let distance = parseInt(Math.sqrt(
  Math.pow(mouseX - animalX, 2) +
  Math.pow(mouseY - animalY, 2)
  )),
  level = Math.max(0, animalSoundNumberOfLevels - parseInt((1 - Math.exp((Math.E - distance)/1000)) * 2 * animalSoundNumberOfLevels));
  playSound(level);
}

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
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
      gameActive = true;
    });

});

window.addEventListener('click', throttle(700, (e) => checkDistance(e)));

animalElement.addEventListener("click", () => {
    var position = rug.getBoundingClientRect();
    var x = position.left;
    var y = position.top;
    console.log(x)
    console.log(y)
    gameActive = false;
    $('#animal').animate({opacity: 1});
    $("#animal").animate({left: x +"px", top: y +"px"}, 2000, function(){
      $("#silent-mode-level").text("SILENT MODE ACTIVATED");
      $(".silent-mode").hide();
      $(".modal").show();
    });
})


$(document).ready(function () {
  $(".lamp").on("animationiteration", function () {
    $(this).removeClass("swing");
  });

  $(".lamp").hover(function () {
    $(this).addClass("swing");
  });
});