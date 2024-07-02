let word = "adieu"
let columns = 4
let guesses = true
let sizes = false
let percents = false
let sort = false

document.getElementById("sizes").addEventListener("click", function () {
    if (document.getElementById("sizes").checked) {
        document.getElementById("sub").style.display = "block"
    } else {
        document.getElementById("sub").style.display = "none"
    }
})

function format_size(num) {
    if (num < 10) {
        return num + "&nbsp;&nbsp;&nbsp;&nbsp;"
    } else if (num < 100) {
        return num + "&nbsp;&nbsp;&nbsp;"
    } else if (num < 1000) {
        return num + "&nbsp;&nbsp;"
    } else if (num < 10000) {
        return num + "&nbsp;"
    } else {
        return num
    }
}

function format_percent(num) {
    let percent = (num * 100) / 2321
    if (percent < 10) {
        return percent.toFixed(2) + "%"
    } else if (percent < 100) {
        return percent.toFixed(1) + "%"
    } else if (percent === 100) {
        return "100%&nbsp;"
    }
}

function initialize_chart() {
    word = document.getElementById("word").value.toLowerCase()
    columns = document.getElementById("columns").value
    guesses = document.getElementById("guesses").checked
    sizes = document.getElementById("sizes").checked
    if (sizes) percents = document.getElementById("percents").checked
    if (sizes) sort = document.getElementById("sort").checked

    if (word.length === 5) {
        if (/^[a-zA-Z]+$/.test(word)) {
            if (columns >= 1) {
                document.getElementById("output").innerHTML = "Working..."
                window.setTimeout(submit_chart, 0)
            } else {
                document.getElementById("output").innerHTML =
                    "Your chart must have at least 1 column"
            }
        } else {
            document.getElementById("output").innerHTML =
                "Starting guess must only have letters"
        }
    } else {
        document.getElementById("output").innerHTML =
            "Starting guess must be 5 letters"
    }
}

function submit_chart() {
    const symbol = ["⬛", "🟨", "🟩"]
    let output = "Your template second guess chart:<br><br>"
    if (sizes) {
        output = "Your second guess group size chart:<br><br>"
        if (sort)
            output =
                "Your second guess group size chart, sorted by size:<br><br>"
    }
    let results = []
    for (let i = 0; i < 242; i++) {
        let tiles = [
            symbol[Math.floor(i / 81)],
            symbol[Math.floor(i / 27) % 3],
            symbol[Math.floor(i / 9) % 3],
            symbol[Math.floor(i / 3) % 3],
            symbol[i % 3],
        ]
        let list = []
        const alphabet = "abcdefghijklmnopqrstuvwxyz"
        let quota = new Array(26).fill(0)
        let count = new Array(26).fill(0)
        let out = new Array(26).fill(0)
        for (const w of dictionary) {
            if (w !== word) {
                let pass = true

                for (let j = 0; j < 26; j++) {
                    quota[j] = 0
                    count[j] = 0
                    out[j] = 0
                }
                for (let j = 0; j < 5; j++) {
                    if (tiles[j] === "⬛") {
                        out[alphabet.indexOf(word[j])]++
                    }
                    if (tiles[j] === "🟨" || tiles[j] === "🟩") {
                        if (
                            out[alphabet.indexOf(word[j])] > 0 &&
                            tiles[j] === "🟨"
                        ) {
                            pass = false
                            break
                        }
                        quota[alphabet.indexOf(word[j])]++
                    }
                    count[alphabet.indexOf(w[j])]++
                }
                for (let j = 0; j < 26; j++) {
                    if (quota[j] > 0) {
                        if (count[j] < quota[j]) {
                            pass = false
                            break
                        }
                        if (count[j] > quota[j] && out[j] > 0) {
                            pass = false
                            break
                        }
                    }
                }

                if (pass) {
                    for (let j = 0; j < 5; j++) {
                        if (tiles[j] === "⬛") {
                            if (w[j] === word[j]) {
                                pass = false
                                break
                            }
                            for (let k = 0; k < w.length; k++) {
                                if (
                                    w[k] === word[j] &&
                                    quota[alphabet.indexOf(w[k])] === 0
                                ) {
                                    pass = false
                                    break
                                }
                            }

                            if (!pass) {
                                break
                            }
                        }

                        if (tiles[j] === "🟨") {
                            let present = false
                            if (w[j] === word[j]) {
                                pass = false
                                break
                            }
                            for (let k = 0; k < w.length; k++) {
                                if (w[k] === word[j]) {
                                    if (k !== j) {
                                        present = true
                                        break
                                    }
                                }
                            }

                            if (!present) {
                                pass = false
                                break
                            }
                        }

                        if (tiles[j] === "🟩") {
                            if (w[j] !== word[j]) {
                                pass = false
                                break
                            }
                        }
                    }
                }

                if (pass) {
                    list.push(w)
                }
            }
        }

        if (list.length === 1) {
            if (guesses) {
                results.push(
                    tiles[0] +
                        tiles[1] +
                        tiles[2] +
                        tiles[3] +
                        tiles[4] +
                        " " +
                        list[0].toUpperCase()
                )
            } else if (sizes) {
                if (percents)
                    results.push(
                        tiles[0] +
                            tiles[1] +
                            tiles[2] +
                            tiles[3] +
                            tiles[4] +
                            " " +
                            format_percent(list.length)
                    )
                else
                    results.push(
                        tiles[0] +
                            tiles[1] +
                            tiles[2] +
                            tiles[3] +
                            tiles[4] +
                            " " +
                            format_size(list.length)
                    )
            } else {
                results.push(
                    tiles[0] +
                        tiles[1] +
                        tiles[2] +
                        tiles[3] +
                        tiles[4] +
                        " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                )
            }
        } else if (list.length > 1) {
            if (sizes) {
                if (percents)
                    results.push(
                        tiles[0] +
                            tiles[1] +
                            tiles[2] +
                            tiles[3] +
                            tiles[4] +
                            " " +
                            format_percent(list.length)
                    )
                else
                    results.push(
                        tiles[0] +
                            tiles[1] +
                            tiles[2] +
                            tiles[3] +
                            tiles[4] +
                            " " +
                            format_size(list.length)
                    )
            } else {
                results.push(
                    tiles[0] +
                        tiles[1] +
                        tiles[2] +
                        tiles[3] +
                        tiles[4] +
                        " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                )
            }
        }
    }
    for (const w of dictionary) {
        if (w === word) {
            if (sizes && !guesses) {
                if (percents) results.push("🟩🟩🟩🟩🟩 " + format_percent(1))
                else results.push("🟩🟩🟩🟩🟩 1&nbsp;&nbsp;&nbsp;&nbsp;")
            } else {
                if (guesses) results.push("🟩🟩🟩🟩🟩 (N/A)")
                else results.push("🟩🟩🟩🟩🟩 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
            }
        }
    }

    if (sort) {
        results.sort(function (a, b) {
            return (
                Number(b.replace(/[^0-9]/g, "")) -
                Number(a.replace(/[^0-9]/g, ""))
            )
        })
    }

    for (let i = 0; i < results.length; i++) {
        output += results[i]
        if (i % columns === columns - 1 && i < results.length - 1)
            output += "<br>"
        else output += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
    }

    if (!sizes) {
        output += "<br><br>WordleBot is required to use this chart."
        output +=
            "<br>To use this chart, you should record second guesses WordleBot would've chosen for each scenario in this chart. You can then use them if you see that scenario again!"
    } else {
        if (percents)
            output +=
                "<br><br>Shown here is the percentage of all valid answers that belong to each group!"
        else
            output +=
                "<br><br>Shown here is the number of valid answers in each group!"
    }
    if (guesses)
        output +=
            "<br>Scenarios that have only one possible answer have the answer written in for you, as guessing it would be the only 99 skill choice."
    output +=
        "<br><br>NOTE: This chart may not be entirely accurate, as the full Wordle answer list is not publicly available anymore."

    document.getElementById("output").innerHTML = output
}
