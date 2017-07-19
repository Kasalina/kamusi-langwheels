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
