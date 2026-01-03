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
}