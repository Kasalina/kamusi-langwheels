const wheelsContainerEl = document.getElementById("list-of-wheels")
const backEl = document.getElementById("back")
const nextEl = document.getElementById("next")
const wheels = []
const NUM_WHEELS = 40
const WHEEL_SIZE = Math.sqrt(window.innerHeight * window.innerWidth * 0.01)

// Display list of codes
function displayWheels(start, stop) {
  // [start, stop - 1]
  const disp = wheels.slice(start, stop)
  let html = ""

  for (let lang of disp)
    html += "<a href='viewer.html?lang=" + lang.code + "&code=" + lang.code + 
    "'class='wheel-card ui-button ui-widget ui-corner-all " + lang.type + "' id='" + lang.code + "'><div>" +
    "<span class='name'>" + "</span> (" +
    "<i class='code'>" + lang.code + "</i>)" +
    "</div><div class='wheel' id='wheel-" + lang.code + "'></div>" +
    "</a>"

  wheelsContainerEl.innerHTML = html

  for (let lang of disp){
    $.ajax("https://kamusi-cls-backend.herokuapp.com/engname/" + lang.code, {
      dataType: "text",
      success: function(name){
        $("#" + lang.code + " .name").text(name)
        $("#" + lang.code).attr("href", "viewer.html?lang=" + name + "&code=" + lang.code)
      }
    })
    updateWheel(document.getElementById("wheel-" + lang.code), WHEEL_SIZE, lang.wheel)
  }
}

// Load full list of codes
$.ajax("https://kamusi-langwheels-ad6af.firebaseio.com/.json", {
  dataType: "JSON",
  success: function(data) {
    const human_selections = data["human_selections"]
    for (let id in human_selections) {
      wheels.push({
        code: id,
        type: "human",
        wheel: human_selections[id].wheel
        // TODO: get the name of the language
      })
    }

    const all_wheels = data["wheels"]

    for (let id in all_wheels) {
      if (all_wheels[id].rationale.indexOf("random") === -1)
        // TODO: have a better system
        continue

      wheels.push({
        code: id,
        type: "random",
        wheel: all_wheels[id].wheel
        // TODO: get the name of the language
      })
    }

    $(document).ready(setupPagination)
  }
})

// Set up pagination
function setupPagination() {
  //  get params for start and stop otherwise (O - 40)
  const params = getQueryParams(document.location.search)

  // display the stuff
  const start = Math.max(parseInt(params.start) || 0, 0)
  const stop = Math.min(parseInt(params.stop) || start + NUM_WHEELS, wheels.length)
  displayWheels(start, stop)

  // set up pagination controls (next page)
  if (start === 0) {
    back.classList.add("ui-state-disabled")
    back.href = "#"
  } else {
    back.href = "index.html?start=" + (start - NUM_WHEELS) + "&stop=" + start
  }

  if (stop === wheels.length) {
    next.href = "#"
    next.classList.add("ui-state-disabled")
  } else {
    next.href = "index.html?start=" + stop + "&stop=" + (stop + NUM_WHEELS)
  }
}
