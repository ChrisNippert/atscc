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

    // Get all valid cuts with their years [cut, year] by thinness for this person
    const allCuts = years.filter(year => sortedData[year].data)
                            .flatMap(year => sortedData[year].data[requestedPerson].cutsNumeric.map(c => [c, year]))
                            .sort((a, b) => a[0] - b[0])

    console.log(allCuts)

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
                ${allCuts.length > 0 ? `${allCuts[0][0]} mm (${allCuts[0][1]})` : `-`}
            </p>
            <br/>
            <h3>Personal Worst:</h3>
            <p class="h4">
                ${allCuts.length > 0 ? `${allCuts.at(-1)[0]} mm (${allCuts.at(-1)[1]})` : `-`}
            </p>
        </div>
    </div>
    `
}
