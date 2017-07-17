const wheelID = "wheel-container"
const wheel = document.getElementById(wheelID)
const wheelSize = window.innerHeight * 0.6
let colors = ["W", "W", "W", "W", "W", "W"]
let code = ""

const colorsToHex = {
  "R": "#FF0000",
  "O": "#FF8000",
  "Y": "#FFFF00",
  "G": "#008000",
  "A": "#00FFFF",
  "B": "#0000FF",
  "P": "#800080",
  "X": "#000000",
  "W": "#FFFFFF"
}

function generateWedgeString(startX, startY, startAngle, endAngle, radius) {
  var x1 = startX - radius * Math.cos(Math.PI * startAngle / 180);
  var y1 = startY - radius * Math.sin(Math.PI * startAngle / 180);
  var x2 = startX - radius * Math.cos(Math.PI * endAngle / 180);
  var y2 = startY - radius * Math.sin(Math.PI * endAngle / 180);

  var pathString = "M" + startX + " " + startY + " L" + x1 + " " + y1 + " A" + radius + " " + radius + " 0 0 1 " + x2 + " " + y2 + " z";

  return pathString;

}

function updateUI() {
  wheel.innerHTML = ""
  var draw = SVG(wheelID).size(wheelSize, wheelSize)
  var sw = wheelSize / 40.0
  for (let i = 0; i < 6; i += 1) {
    var angle = i * 60.0 + 90;
    var pathStr = generateWedgeString(wheelSize / 2, wheelSize / 2, angle, angle + 60.0, wheelSize / 2 - sw)
    var path = draw.path(pathStr)
    path.attr({
      fill: colorsToHex[colors[i]],
      stroke: "#000",
      "stroke-width": sw
    })
    $("[data-target='" + i + "'] [data-color]").removeClass("selected")
    $("[data-target='" + i + "'] [data-color='" + colors[i] + "']").addClass("selected")
  }
}

function loadLang(code) {
  $.ajax({
    url: "https://kamusi-langwheels-ad6af.firebaseio.com/" + code + ".json",
    success: function(data){
      colors = data.split("")
      updateUI()
    },
    error: function(data){
      alert("Couldn't find data for code!")
    }
  })
}

for (let el of document.getElementsByClassName("color-option")) {

  el.onclick = function() {
    for (let e of el.parentElement.children) {
      e.classList.remove("selected")
    }
    el.classList.add("selected")
    colors[el.parentElement.getAttribute("data-target")] = el.getAttribute("data-color")
    updateUI()
  }
}

updateUI()
