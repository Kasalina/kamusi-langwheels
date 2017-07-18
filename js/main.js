const mainWheelEl = document.getElementById("wheel-container")
const kamusiWheelEl = document.getElementById("kamusi-wheel")
const MAIN_WHEEL_SIZE = window.innerHeight * 0.6
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
const submitEl = document.getElementById("submit")
const userRationaleEl = document.getElementById("user-rationale")
const kamusiRationaleEl = document.getElementById('kamusi-rationale')
const proposalExplanationEl = document.getElementById('proposal-explanation')

const MSG_RANDOM = 'You are invited to propose a better color scheme based on your knowledge of the culture and geography where the language is spoken. For example, you might propose a wheel based on the colors of a regional flag or culturally symbolic colors. Click <b>Change This Wheel</b> to create a better design for this language.'
const MSG_DEFINED = 'If you feel that the proposed colors will cause problems for the people who speak this language, or that the design is too easy to confuse with another language, please click <b>Change This Wheel</b> to create a better design.'

let kamusi_rationale = ""
let user_wheel = ["W", "W", "W", "W", "W", "W"]
let kamusi_wheel = []
let current_code = ""



function generateWedgeString(startX, startY, startAngle, endAngle, radius) {
  var x1 = startX - radius * Math.cos(Math.PI * startAngle / 180);
  var y1 = startY - radius * Math.sin(Math.PI * startAngle / 180);
  var x2 = startX - radius * Math.cos(Math.PI * endAngle / 180);
  ``
  var y2 = startY - radius * Math.sin(Math.PI * endAngle / 180);

  var pathString = "M" + startX + " " + startY + " L" + x1 + " " + y1 + " A" + radius + " " + radius + " 0 0 1 " + x2 + " " + y2 + " z";

  return pathString;
}

function updateWheel(el, size, colors) {
  el.innerHTML = ""
  var draw = SVG(el.id).size(size, size)
  var sw = size / 40.0
  for (let i = 0; i < 6; i += 1) {
    var angle = i * 60.0 + 90;
    var pathStr = generateWedgeString(size / 2, size / 2, angle, angle + 60.0, size / 2 - sw)
    var path = draw.path(pathStr)
    path.attr({
      fill: COLOR_VALUES[colors[i]],
      stroke: "#000",
      "stroke-width": sw
    })
  }
}

function updateKamusiRationale() {
  kamusiRationaleEl.innerHTML = "<b> Our Rationale </b>" + kamusi_rationale
}

function updateUI() {
  updateMailTo()
  updateWheel(mainWheelEl, MAIN_WHEEL_SIZE, user_wheel)
  updateKamusiRationale()
  updateWheel(kamusiWheelEl, MAIN_WHEEL_SIZE, kamusi_wheel)

  for (let i = 0; i < 6; i++) {
    $("[data-target='" + i + "'] [data-color]").removeClass("selected")
    $("[data-target='" + i + "'] [data-color='" + user_wheel[i] + "']").addClass("selected")
  }

  proposalExplanationEl.innerHTML = kamusi_rationale.indexOf("random") === -1 ? MSG_DEFINED : MSG_RANDOM

}

function loadLang(code) {
  current_code = code

  $.ajax({
    url: "https://kamusi-langwheels-ad6af.firebaseio.com/wheels/" + code + ".json",
    success: function(data) {
      user_wheel = data["wheel"].split("")
      kamusi_wheel = user_wheel.slice()
      kamusi_rationale = data["rationale"]
      updateUI()
    },
    error: function(data) {
      alert("Couldn't find data for code!")
    }
  })
}

function updateMailTo() {
  const subject = "Color wheel proposal for " + current_code
  const body = "CURRENT WHEEL: \t\t" + kamusi_wheel.join("") + " \n \n " +
    "NEW WHEEL: \t\t" + user_wheel.join("") + " \n \n " +
    "RATIONALE: \t\t" + userRationaleEl.value
  submitEl.href = generateMailToString(subject, body)
}

function generateMailToString(subject, body) {
  return "mailto:" + KAMUSI_EMAIL +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(body)
}

$(document).ready(function() {
  $("#tabs").tabs()
  for (let el of document.getElementsByClassName("color-option")) {
    el.onclick = function() {
      for (let e of el.parentElement.children) {
        e.classList.remove("selected")
      }
      el.classList.add("selected")
      user_wheel[el.parentElement.getAttribute("data-target")] = el.getAttribute("data-color")
      updateUI()
    }
  }

  $(userRationaleEl).change(updateMailTo)

  updateUI()
})
