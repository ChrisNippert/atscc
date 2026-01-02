/*
 * Displays the statistics for a given person on the statistics.html page.
 */

const urlParams = new URLSearchParams(window.location.search)
const requestedPerson = urlParams.get("person")

const pageDiv = document.getElementById("page")

// Check if person from url is valid, display valid errors
if (!requestedPerson || !sortedData.participants.includes(requestedPerson)) {
    pageDiv.innerHTML += `
    <div class="text-blob container text-center">
        <p class="h5">Select a person to view the stats of:</p>
        ${sortedData.participants.map(person => `<a class="nav-link" href="statistics.html?person=${person}">${person}</a>`).join("\n")}
    </div>`
}
// Display statistics for given person 
else {
    const statsTitle = document.getElementById("statsTitle")
    statsTitle.innerHTML += " for " + requestedPerson

    const years = sortedData.years.filter(year => sortedData[year].participants.includes(requestedPerson))

    // Get all valid cuts by thinness for this person
    const allCuts = sortedData.allRows.filter(o => o.person === requestedPerson)
    const allValidCuts = allCuts.filter(o => o.isNumeric)

    pageDiv.innerHTML += `    
    <div class="row text-blob">
        <div class="col-sm-6">
            <h3>Years Competed:</h3>
            <ul>
                ${years.map(year => `<li>${year}</li>`).join("\n")}
            </ul>
        </div>
        <div class="col-sm-6">
            <h3>Personal Best:</h3>
            <p class="h4">
                ${allValidCuts.length > 0 ? `${allValidCuts[0].cut} mm (${allValidCuts[0].year})` : `-`}
            </p>
            <br/>
            <h3>Personal Worst:</h3>
            <p class="h4">
                ${allValidCuts.length > 0 ? `${allValidCuts.at(-1).cut} mm (${allValidCuts.at(-1).year})` : `-`}
            </p>
        </div>
    </div>
    `

    if (allCuts.length > 0) {
        // Setup Desmos
        pageDiv.innerHTML += `<div class="row text-blob" id="calculator"></div>`
        var elt = document.getElementById('calculator')
        var calculator = Desmos.GraphingCalculator(elt)
        calculator.updateSettings({ 
            xAxisLabel: 'Cut Width (mm)',
            // expressions: false,
            expressionsCollapsed: true,
            settingsMenu: false,
            keypad: false,
            showResetButtonOnGraphpaper: false,
            showYAxis: false,
        })
        calculator.setMathBounds({
            left: allValidCuts[0].cut - 2,
            right: allValidCuts.at(-1).cut + 2,
            bottom: -1,
            top: 3
        })
        calculator.setDefaultState(calculator.getState());
        // Send points to Desmos for boxplot
        calculator.setExpression({ id: 'list', latex: `L=[${allValidCuts.map(o => o.cut).join()}]` })
        calculator.setExpression({ 
            id: 'boxplot', 
            latex: '\\boxplot(L)'
        })
        calculator.setExpression({
            id: 'points',
            type: 'table',
            columns: [
            {
                latex: 'x',
                values: allValidCuts.map(o => o.cut)
            },
            {
                latex: 'y',
                values: allValidCuts.map(x => 1)
            }]
        })


    }
}
