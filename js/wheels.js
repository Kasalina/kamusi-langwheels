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

// Display list of codes
function displayWheels(el, disp, size) {
  let html = ""

  for (let lang of disp)
    html += "<a href='viewer.html?lang=" + lang.code + "&code=" + lang.code +
    "'class='wheel-card ui-button ui-widget ui-corner-all' id='" + lang.code + "'><div>" +
    "<span class='name'>" + "</span> (" +
    "<i class='code'>" + lang.code + "</i>)" + 
    "</div><div class='wheel' id='wheel-" + lang.code + "'></div>" +
    "<div> Assigned by " + "<span class='icon " + lang.type + "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>" + "</div>" + 
    "</a>"

  el.innerHTML = html

  for (let lang of disp) {
    $.ajax("https://kamusi-cls-backend.herokuapp.com/engname/" + lang.code, {
      dataType: "text",
      success: function(name) {
        $("#" + lang.code + " .name").text(name)
        $("#" + lang.code).attr("href", "viewer.html?lang=" + name + "&code=" + lang.code)
      }
    })
    updateWheel(document.getElementById("wheel-" + lang.code), size, lang.wheel)
  }
}

function generateWedgeString(startX, startY, startAngle, endAngle, radius) {
  var x1 = startX - radius * Math.cos(Math.PI * startAngle / 180);
  var y1 = startY - radius * Math.sin(Math.PI * startAngle / 180);
  var x2 = startX - radius * Math.cos(Math.PI * endAngle / 180);
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

function getColorStr(wheel) {
  return Array.from(new Set(wheel)).sort().join("")
}
