/*
 * Generates the tables for each year of records for the archives.html page.
 */

const tablesDiv = document.getElementById("tables-div")

sortedData.years.forEach(k => {
    // Create year results title
    let title = document.createElement("h1")
    title.classList.add("h1", "p-2")
    title.innerHTML = k + " Results"
    tablesDiv.appendChild(title)
    
    let yearData = sortedData[k]

    // Create base table with caption
    let table = document.createElement("table")
    table.classList.add("table", "table-striped")
    if (yearData.note) {
        let caption = document.createElement("caption")
        caption.innerHTML = yearData.note
        table.caption = caption
    }

    // Handle standings-only data
    if (!yearData.data) {
        let thead = document.createElement("thead")
        thead.innerHTML = `
                    <tr>
                        <th scope="col">Place</th>
                        <th scope="col">Person</th>
                    </tr>`
        table.appendChild(thead)

        let tbody = document.createElement("tbody")
        yearData.standings.forEach((rank, i) => {
            tbody.innerHTML += `
                    <tr>
                        <th scope="row">${i + 1}</th>
                        <td>${rank}</td>
                    </tr>`
        })
        table.appendChild(tbody)
    }

    // Handle cuts data
    else {
        const people = yearData.standings
        let thead = document.createElement("thead")
        thead.innerHTML = `
                    <tr>
                        <th scope="col">Place</th>
                        <th scope="col">Person</th>
                        ${yearData.data[people[0]].cuts.map((a, n) => `<th scope="col">Round ${n + 1}</th>`).join("\n")}
                    </tr>`
        table.appendChild(thead)
        
        let tbody = document.createElement("tbody")
        people.forEach((person, i) => {
            tbody.innerHTML += `
                    <tr>
                        <th scope="row">${i + 1}</th>
                        <td>${person}</td>
                        ${yearData.data[person].cuts.map((cut) => `<td>${cut == yearData.data[person].bestCut ? `<strong>${cut}</strong>` : cut}</td>`).join("\n")}
                    </tr>`
        })
        table.appendChild(tbody)
    }

    tablesDiv.appendChild(table)
})
