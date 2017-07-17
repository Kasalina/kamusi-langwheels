const wheel = document.getElementById("wheel-container")
const colors = ["W", "W", "W", "W", "W", "W"]
let code = ""

const colorsToHex = {
  "R": "#FF0000",
  "O": "#FFA500",
  "Y": "#FFFF00",
  "G": "#008000",
  "A": "#00FFFF",
  "B": "#0000FF",
  "P": "#800080",
  "X": "#000000",
  "W": "#FFFFFF"
}

function updateWheel() {

}

function drawLangWheel(id, size, colors) {
  cols = colors || currCols

  console.log(id, size, colors)
  var draw = SVG(id).size(size, size)
  var sw = size / 40.0
  for (let i = 0; i < 6; i += 1) {
    var angle = i * 60.0 + 90;
    var pathStr = generateWedgeString(size / 2, size / 2, angle, angle + 60.0, size / 2 - sw)
    var path = draw.path(pathStr)
    path.attr({
      fill: cols[i],
      stroke: "#000",
      "stroke-width": sw
    })
    if (!colors) {
      path.click(function() {
        currCols[i] = nextColor[this.attr('fill').toUpperCase()]
        updateWheels(id, size)
        // this.fill({ color: currCols[i]})
      })
    }
  }
}
