var rtlLangs = new Set([
  "heb",
  "fas",
  "mzn",
  "lrc",
  "uig",
  "kas",
  "urd",
  "fa_AF",
  "ara",
  "yid",
  "ckb",
  "pus",
  "ur_IN",
  "ar_EG",
  "ar_LY",
  "ar_SA",
  "uz_Arab",
  "pa_Arab"
])

const userlangAJAX = {
  url: function (params) {
    return 'https://kamusi-cls-backend.herokuapp.com/userlangs/' + (params.term || "")
  },
  dataType: 'json',
  delay: 100,
  processResults: function (data) {
    var ret = data
    if (data[0] && typeof data[0].text !== "string") {
      ret = []
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].text.length; j++) {
          ret.push({text: data[i].text[j], id: data[i].id})
        }
      }
    }
    console.log(ret)
    return {results: ret}
  },
  minimumInputLength: 3
}

function ajaxInit(val){
  $.ajax("https://kamusi-cls-backend.herokuapp.com/userlangs/" + val, {
    success: function(data){
      data = JSON.parse(data)
      var ret = data.slice()
      if (data[0] && typeof data[0].text !== "string") {
        ret = []
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].text.length; j++) {
            ret.push({text: data[i].text[j], id: data[i].id})
          }
        }
      }
      userlangSelector.select2({
        data: ret,
        ajax: userlangAJAX,
        dir: rtlLangs.has(data[0].id) ? "rtl" : "ltr",
        width: 500
      })
      userlangSelector.trigger('change')

      // userlangSelector.change(function(){
      //   userlangSelector.select2({dir: rtlLangs.has(userlangSelector.val()) ? "rtl" : "ltr"})
      // })
    },
    error: function(err){
      throw err
    }
  })
}

// avoid duplicate selectors
var userlangSelector, codeDisp

$(document).ready(function () {

  // initialize userlang selector
  userlangSelector = $("#userlang")
  codeDisp = $("#code")

  userlangSelector.select2({
    ajax: userlangAJAX,
    width: 500
  })

  userlangSelector.change(function (e) {
    codeDisp.text(userlangSelector.val())
    loadLang(userlangSelector.val())
  })

  const params = getQueryParams(document.location.search)
  if (params["lang"])
    ajaxInit(params["lang"])
  else {
    ajaxInit()
  }
})
