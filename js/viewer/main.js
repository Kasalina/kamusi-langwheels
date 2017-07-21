const mainWheelEl = document.getElementById("wheel-container")
const kamusiWheelEl = document.getElementById("kamusi-wheel")
const EDIT_WHEEL_SIZE = Math.min(window.innerWidth * 0.3, window.innerHeight * 0.6)
const KAMUSI_WHEEL_SIZE = Math.min(window.innerWidth * 0.6, window.innerHeight * 0.7)

const KAMUSI_EMAIL = "contact+colors@kamusi.org"
const submitEl = document.getElementById("submit")
const userRationaleEl = document.getElementById("user-rationale")
const kamusiRationaleEl = document.getElementById('kamusi-rationale')
const proposalExplanationEl = document.getElementById('proposal-explanation')
const similarEl = document.getElementById("sim-show")

const MSG_RANDOM = 'You are invited to propose a better color scheme based on your knowledge of the culture and geography where the language is spoken. For example, you might propose a wheel based on the colors of a regional flag or culturally symbolic colors. Click <b>Change This Wheel</b> to create a better design for this language.'
const MSG_DEFINED = 'If you feel that the proposed colors will cause problems for the people who speak this language, or that the design is too easy to confuse with another language, please click <b>Change This Wheel</b> to create a better design.'

let colors = {}
let wheels = {}
let humanSelected

let kamusi_rationale = ""
let user_wheel = ["W", "W", "W", "W", "W", "W"]
let kamusi_wheel = []
let current_code = ""

$.ajax("https://kamusi-langwheels-ad6af.firebaseio.com/.json", {
  dataType: "JSON",
  success: function(data) {
    colors = data.colors
    wheels = data.wheels
    humanSelected = new Set(Object.keys(data["human_selections"]))
    loadLang(current_code)
  }
})

function updateKamusiRationale() {
  kamusiRationaleEl.innerHTML = "<b> Our Rationale </b>" + kamusi_rationale
}

function updateUI() {
  updateMailTo()
  updateWheel(mainWheelEl, EDIT_WHEEL_SIZE, user_wheel)
  updateKamusiRationale()
  updateWheel(kamusiWheelEl, KAMUSI_WHEEL_SIZE, kamusi_wheel)

  for (let i = 0; i < 6; i++) {
    $("[data-target='" + i + "'] [data-color]").removeClass("selected")
    $("[data-target='" + i + "'] [data-color='" + user_wheel[i] + "']").addClass("selected")
  }

  proposalExplanationEl.innerHTML = kamusi_rationale.indexOf("random") === -1 ? MSG_DEFINED : MSG_RANDOM

  if (colors && wheels) {
    let colorStr = getColorStr(user_wheel)
    if (colors[colorStr])
      displayWheels(similarEl,
        colors[colorStr].map((c) => ({
          wheel: wheels[c].wheel,
          type: humanSelected.has(c) ? "human" : "random",
          code: c
        })),
        Math.sqrt(window.innerHeight * window.innerWidth * 0.02))
    else {
      similarEl.innerHTML = "<h2>No similar wheels</h2>"
    }
  }
}

function loadLang(code) {
  current_code = code

  if (wheels && wheels[code]) {
    user_wheel = wheels[code].wheel.split("")
    kamusi_wheel = user_wheel.slice()
    kamusi_rationale = wheels[code].rationale
  }

  updateUI()
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
