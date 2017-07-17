const wheelID = "wheel-container"
const wheel = document.getElementById(wheelID)
const WHEEL_SIZE = window.innerHeight * 0.6
const COLOR_VALUES = {
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
const KAMUSI_EMAIL = "contact+colors@kamusi.org"
const submit = document.getElementById("submit")
const rationale = document.getElementById("rationale")

let colors = ["W", "W", "W", "W", "W", "W"]
let current_wheel = []
let current_code = ""



function generateWedgeString(startX, startY, startAngle, endAngle, radius) {
  var x1 = startX - radius * Math.cos(Math.PI * startAngle / 180);
  var y1 = startY - radius * Math.sin(Math.PI * startAngle / 180);
  var x2 = startX - radius * Math.cos(Math.PI * endAngle / 180);
  var y2 = startY - radius * Math.sin(Math.PI * endAngle / 180);

  var pathString = "M" + startX + " " + startY + " L" + x1 + " " + y1 + " A" + radius + " " + radius + " 0 0 1 " + x2 + " " + y2 + " z";

  return pathString;

}

function updateUI() {
  updateMailTo()
  wheel.innerHTML = ""
  var draw = SVG(wheelID).size(WHEEL_SIZE, WHEEL_SIZE)
  var sw = WHEEL_SIZE / 40.0
  for (let i = 0; i < 6; i += 1) {
    var angle = i * 60.0 + 90;
    var pathStr = generateWedgeString(WHEEL_SIZE / 2, WHEEL_SIZE / 2, angle, angle + 60.0, WHEEL_SIZE / 2 - sw)
    var path = draw.path(pathStr)
    path.attr({
      fill: COLOR_VALUES[colors[i]],
      stroke: "#000",
      "stroke-width": sw
    })
    $("[data-target='" + i + "'] [data-color]").removeClass("selected")
    $("[data-target='" + i + "'] [data-color='" + colors[i] + "']").addClass("selected")
  }
}

function loadLang(code) {
  current_code = code

  $.ajax({
    url: "https://kamusi-langwheels-ad6af.firebaseio.com/" + code + ".json",
    success: function(data){
      colors = data.split("")
      current_wheel = colors
      updateUI()
    },
    error: function(data){
      alert("Couldn't find data for code!")
    }
  })
}

function updateMailTo(){
  const subject = "Color wheel proposal for " + current_code
  const body = "CURRENT WHEEL: " + current_wheel.join("") + "\n"
             + "NEW WHEEL: " + colors.join("") + "\n"
             + "RATIONALE: " + rationale.value
  submit.href = generateMailToString(subject, body)
}

function generateMailToString(subject, body){
  return "mailto:" + KAMUSI_EMAIL
                   + "?subject=" + encodeURIComponent(subject)
                   + "&body=" + encodeURIComponent(body)
}

$(document).ready(function(){
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

  $(rationale).change(updateMailTo)

  updateUI()
})
