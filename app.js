const animalWidth = 200;
const animalHeight = 100
const startButton = document.getElementById("start-button")
const animalElement = document.getElementById('animal');
const winWidth = window.innerWidth;
const winHeight = window.innerHeight;
const horizontalMax = (winWidth -animalWidth);
const verticalMax = (winHeight - animalHeight);
const yPos = Math.floor(getRandomNumber(0, verticalMax));
const xPos = Math.floor(getRandomNumber(0, horizontalMax));
const rug = document.getElementById("rug")
let gameActive =  false;

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

startButton.addEventListener("click", () => {
  animalElement.style.top = yPos +"px";
  animalElement.style.left = xPos +"px";
  gameActive = true;
});

animalElement.addEventListener("click", () => {
  if (gameActive){
    var position = rug.getBoundingClientRect();
    var x = position.left;
    var y = position.top;
    $("#animal").animate({left: x +"px", top: y +"px"}, 2000);
  }
  
})


$(document).ready(function () {
  $(".lamp").on("animationiteration", function () {
    $(this).removeClass("swing");
    console.log("out");
  });

  $(".lamp").hover(function () {
    $(this).addClass("swing");
    console.log("over");
  });
});