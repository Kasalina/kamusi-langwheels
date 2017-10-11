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
                    ret.push({
                        text: data[i].text[j],
                        id: data[i].id
                    })
                }
            }
        }
        console.log(ret)
        return {
            results: ret
        }
    },
    minimumInputLength: 3
}

function ajaxInit(val, code) {
    if (code === null)
        return

    if (code === val)
        codeDisp.text(code)
    else
        codeDisp.text(code + " (" + val + ")")

    loadLang(code)
}

// avoid duplicate selectors
var userlangSelector, codeDisp

$(document).ready(function () {

    // initialize userlang selector
    userlangSelector = $("#userlang")
    codeDisp = $("#code")

    userlangSelector.select2({
        ajax: userlangAJAX,
        width: 500,
        placeholder: "Select a language"
    })

    userlangSelector.change(function (e) {
        codeDisp.text(userlangSelector.val())
        loadLang(userlangSelector.val())
    })

    const params = getQueryParams(document.location.search)
    if (params["lang"] && params["code"])
        ajaxInit(params["lang"], params["code"])
    else {
        ajaxInit("No Language Selected", null)
    }
})
