/*
 * Displays the statistics for a given person on the statistics.html page.
 */

const urlParams = new URLSearchParams(window.location.search)
const requestedPerson = urlParams.get("person")
console.log(requestedPerson) // TODO remove

const pageDiv = document.getElementById("page")

// Check if person from url is valid, display valid errors
if (!requestedPerson || !sortedData.participants.includes(requestedPerson)) {
    pageDiv.innerHTML += `
    <div class="text-blob container text-center">
        <p class="h5">Select a person to view the stats of:</p>
        ${sortedData.participants.map(person => `<a class="nav-link" href="statistics.html?person=${person}">${person}</a>`).join("\n")}
    </div>
    `
}
// Display statistics for given person 
else {
    const statsTitle = document.getElementById("statsTitle")
    statsTitle.innerHTML += " for " + requestedPerson

    const years = sortedData.years.filter(year => sortedData[year].participants.includes(requestedPerson))

    // Sorted list of [year, cut] by thinneess
    const bestCuts = years.filter(year => sortedData[year].data)
                            .map(year => [year, sortedData[year].data[requestedPerson].bestCut])
                            .filter(pair => pair[1])
                            .sort((a, b) => a[1] - b[1])
    // Sorted list of [year, cut] by thinneess
    const worstCuts = years.filter(year => sortedData[year].data)
                            .map(year => [year, Math.max(...sortedData[year].data[requestedPerson].cutsNumeric)])
                            .filter(pair => pair[1])
                            .sort((a, b) => b[1] - a[1])
    console.log(bestCuts, worstCuts)

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
                ${bestCuts[0][1]} mm (${bestCuts[0][0]})
            </p>
            <br/>
            <h3>Personal Worst:</h3>
            <p class="h4">
                ${worstCuts[0][1]} mm (${worstCuts[0][0]})
            </p>
        </div>
    </div>
    `
}
