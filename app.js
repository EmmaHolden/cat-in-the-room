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