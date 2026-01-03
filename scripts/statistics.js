/*
 * Displays the statistics for a given person on the statistics.html page.
 */

const urlParams = new URLSearchParams(window.location.search)
const requestedPerson = urlParams.get("person")

const pageDiv = document.getElementById("page")

// Check if person from url is valid, display valid errors
if (!requestedPerson || !sortedData.participants.includes(requestedPerson)) {
    pageDiv.innerHTML += `
    <div class="row text-blob">
        <div class="col-sm-6 container text-center">
            <p class="h5">Select a person to view the stats of:</p>
            ${sortedData.participants.map(person => `<a class="nav-link" href="statistics.html?person=${person}">${person}</a>`).join("\n")}
        </div>
        <div class="col-sm-6 container text-center">
            <p class="h5">Select a year to view the stats of:</p>
            ${sortedData.years.map(year => `<a class="nav-link" href="statistics_year.html?year=${year}">${year}</a>`).join("\n")}
        </div>
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
        ///////////////////////
        // PlotlyJS Box PLot //
        ///////////////////////
        person_rows = sortedData.allRows.filter(row => row.person === requestedPerson).filter(row => row.isNumeric);
        year_data = years.map(year => {
            cuts = person_rows.filter(row => row.year === year).map(row => row.cut);
            return {
                year: year,
                cuts: cuts,
            };
        });

        // for each year make a trace
        traces = year_data.map(yd => {
            return {
                x: yd.cuts,
                type: 'box',
                name: yd.year,
            };
        });

        CONTAINER = document.createElement('div')
        CONTAINER.className = 'container'
        pageDiv.appendChild(CONTAINER)

        PLOTS = document.createElement('div')
        PLOTS.className = 'row'
        CONTAINER.appendChild(PLOTS);

        PLOTLY_BAR = document.createElement('div');
        PLOTLY_BAR.classList.add('col', 'plotBox')
        PLOTS.appendChild(PLOTLY_BAR);

        PLOTLY_CUTS = document.createElement('div');
        PLOTLY_CUTS.classList.add('col', 'plotBox')
        PLOTS.appendChild(PLOTLY_CUTS);

        Plotly.newPlot(PLOTLY_BAR, [... traces], {
            title: {
                text: `Cut Widths per Year for ${requestedPerson}`,
            },
            yaxis: {
                title: {
                    text: 'Year',
                },
                dtick: 1,
                fixedrange: true
            },
            xaxis: {
                title: {
                    text: 'Cut Width (mm)',
                },
                fixedrange: true
            },
            showlegend: false,
            autosize: true,
        },
        {
            responsive: true,
            displayModeBar: false,
            scrollZoom: false
        });

        ///////////////////////////
        // PlotlyJS Min/Max/Mean //
        ///////////////////////////
        // make a trace for min, max, mean
        min_trace = {
            x: year_data.map(yd => yd.year),
            y: year_data.map(yd => Math.min(... yd.cuts)),
            mode: 'lines',
            connectgaps: true,
            name: 'Best Cut per Year',
            line: {
                width: 0,
                color: 'green',
            }
        }

        max_trace = {
            x: year_data.map(yd => yd.year),
            y: year_data.map(yd => Math.max(... yd.cuts)),
            mode: 'lines',
            connectgaps: true,
            fill: 'tonexty', // Fills the area between upper and lower
            fillcolor: 'rgba(103, 197, 90, 0.3)',
            name: 'Worst Cut per Year',
            line: {
                // shape: 'spline', // This would make lines curved but it doesn't really work with this level of data
                width: 0,
                color: 'green',
            }
        }

        mean_trace = {
            x: year_data.map(yd => yd.year),
            y: year_data.map(yd => {
                const sum = yd.cuts.reduce((a, b) => a + b, 0);
                return sum / yd.cuts.length;
            }),
            mode: 'lines',
            name: 'Average Cut per Year',
            connectgaps: true,
            line: {
                width: 2,
                color: 'green',
            }
        }


        Plotly.newPlot(PLOTLY_CUTS, [min_trace, max_trace, mean_trace], {
            title: {
                text: `Cut Widths per Year for ${requestedPerson}`,
            },
            yaxis: {
                title: {
                    text: 'Cut Width (mm)',
                },
                fixedrange: true
            },
            xaxis: {
                title: {
                    text: 'Year',
                },
                dtick: 1,
                fixedrange: true
            },
            showlegend: false,
            autosize: true,
        },
        {
            responsive: true,
            displayModeBar: false,
            scrollZoom: false
        });

        
        ///////////////////////////////////
        // PlotlyJS Bar Chart of Failure //
        ///////////////////////////////////
        PLOTS2 = document.createElement('div')
        PLOTS2.className = 'row'
        CONTAINER.appendChild(PLOTS2);

        successes = allCuts.filter(o => o.isNumeric).length
        failures = allCuts.length - successes

        var data = [
            {
                x: ['Successes', 'Disqualifications'],
                y: [successes, failures],
                type: 'bar',
                marker: {
                    color: ['rgba(38, 138, 38, 0.7)', 'rgba(255, 0, 0, 0.7)']
                }
            }
        ]

        BAR_GRAPH = document.createElement('div');
        BAR_GRAPH.classList.add('col', 'plotBox')
        PLOTS2.appendChild(BAR_GRAPH);

        Plotly.newPlot(BAR_GRAPH, data,
        {
            title: {
                text: `Bar Chart of Failure`,
            },
            yaxis: {
                title: {
                    text: 'Number of Rounds',
                },
                dtick: 1,
                fixedrange: true
            },
            xaxis: {
                title: {
                    text: 'Outcome',
                },
                fixedrange: true
            },
            autosize: true,
        },
        {
            responsive: true,
            displayModeBar: false,
            scrollZoom: false
        });

        
    }
}
