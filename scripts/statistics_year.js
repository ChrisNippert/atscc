/*
 * Displays the statistics for a given year on the statistics.html page.
 */

const urlParams = new URLSearchParams(window.location.search)
const requestedYear = urlParams.get("year")

const pageDiv = document.getElementById("page")

// Check if year from url is valid
if (!requestedYear || !sortedData.years.includes(requestedYear)) {
    // Else go to statistics page for list
    window.location.href = "statistics.html";
}
// Display statistics for given person 
else {
    const statsTitle = document.getElementById("statsTitle")
    statsTitle.innerHTML += " for " + requestedYear

    // Show table of data for that year
    pageDiv.innerHTML += `<div class="row text-blob text" id="tables-div"></div>`
    createTable(document.getElementById("tables-div"), requestedYear)

    const yearData = sortedData.allRows.filter(o => o.year == requestedYear)
    const yearDataValid = yearData.filter(o => o.isNumeric)

    if (yearDataValid.length > 0) {
        // Plot box plot of all points
        pageDiv.innerHTML += `<div id="myDiv"></div>`
        var traceAll = {
            x: yearDataValid.map(o => o.cut),
            type: 'box',
            name: 'All',
            boxpoints: 'all'
        };
        var traceParticipants = sortedData[requestedYear].standings.reverse().map(person => ({
            x: yearDataValid.filter(o => o.person === person).map(o => o.cut),
            type: 'box',
            name: person,
            boxpoints: 'all'
        }));
        var data = [... traceParticipants, traceAll];
        var layout = {
            title: {
                text: `Cut Widths for ${requestedYear}`
            },
            xaxis: {
                title: {
                    text: 'Cut Width (mm)',
                },
                fixedrange: true
            },
            yaxis: {
                fixedrange: true
            },
        };
        Plotly.newPlot('myDiv', data, layout, {
            displayModeBar: false,
            scrollZoom: false
        });
    }
}