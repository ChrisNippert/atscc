/*
 * Holds the data for all preevious years of competition.
 * Also preprocesses data a little.
 */

const allData = {
    "2019": {
        "data": {
            "Abdul \"Pump Flex\"": {
                "cuts": [
                    2.18
                ]
            },
            "Brian": {
                "cuts": [
                    2.22
                ]
            },
            "Rachel": {
                "cuts": [
                    2.39
                ]
            },
            "Chris": {
                "cuts": [
                    2.74
                ]
            },
            "Katy": {
                "cuts": [
                    3.18
                ]
            }
        },
        "note": "Only the best numeric cut was recorded for each participant."
    },
    "2020": {
        "standings": [
            "Brian",
            "Luigi",
            "Mom",
            "Chris",
            "Bobby Z",
            "Rachel",
            "Katy"
        ],
        "note": "No numeric cut data was recorded."
    },
    "2021": {
        "standings": [
            "Rachel"
        ],
        "note": "No other participants or numeric cut data was recorded."
    },
    "2022": {
        "data": {
            "Brian": {
                "cuts": [
                    2.70,
                    3.18,
                    3.40
                ]
            },
            "Rachel": {
                "cuts": [
                    5.06,
                    3.34,
                    3.30
                ]
            },
            "Katy": {
                "cuts": [
                    4.37,
                    3.40,
                    "DQ"
                ]
            },
            "Chris": {
                "cuts": [
                    3.89,
                    3.45,
                    3.92
                ]
            },
            "Bobby Z": {
                "cuts": [
                    4.82,
                    "DQ",
                    "DQ"
                ]
            },
            "Mom": {
                "cuts": [
                    "DQ",
                    "DQ",
                    "DQ"
                ]
            }
        }
    },
    "2023": {
        "data": {
            "Brian": {
                "cuts": [
                    "DQ",
                    2.24,
                    "?"
                ]
            },
            "Rachel": {
                "cuts": [
                    2.61,
                    "DQ",
                    "DQ"
                ]
            },
            "Chris": {
                "cuts": [
                    3.14,
                    4.72,
                    4.11
                ]
            },
            "Mom": {
                "cuts": [
                    "DQ",
                    4.52,
                    3.23
                ]
            },
            "Pat": {
                "cuts": [
                    4.1,
                    "DQ",
                    6.41
                ]
            },
            "Katy": {
                "cuts": [
                    4.96,
                    5.1,
                    5.38
                ]
            },
            "Bobby Z": {
                "cuts": [
                    "DQ",
                    9.1,
                    "DQ"
                ]
            }
        }
    },
    "2024": {
        "standings": [
            "Chris",
            "Brian",
            "Rachel",
            "Mom",
            "Bobby Z"
        ],
        "data": {
            "Brian": {
                "cuts": [
                    2.35,
                    "DQ",
                    "DQ",
                    3.3
                ]
            },
            "Mom": {
                "cuts": [
                    3.49,
                    2.93,
                    3.09,
                    "-"
                ]
            },
            "Bobby Z": {
                "cuts": [
                    5.42,
                    5.01,
                    4.58,
                    "-"
                ]
            },
            "Rachel": {
                "cuts": [
                    2.87,
                    3.63,
                    3.78,
                    "-"
                ]
            },
            "Chris": {
                "cuts": [
                    "DQ",
                    2.52,
                    2.97,
                    3.2
                ]
            }
        },
        "note": "Round 4 was a 'sudden death' round due to disputed scores between Chris and Brian, where only their scores for round 4 determined the winner."
    },
    "2025": {
        "data": {
            "Bobby Z": {
                "cuts": [
                    "DQ",
                    "DQ",
                    7.87
                ]
            },
            "Mom": {
                "cuts": [
                    2.49,
                    "DQ",
                    "DQ"
                ]
            },
            "Brian": {
                "cuts": [
                    2.11,
                    "DQ",
                    2.01
                ]
            },
            "Rachel": {
                "cuts": [
                    "DQ",
                    2.64,
                    "DQ"
                ]
            },
            "Katy": {
                "cuts": [
                    2.41,
                    "DQ",
                    2.18
                ]
            },
            "Pat": {
                "cuts": [
                    5.8,
                    3.14,
                    3.72
                ]
            },
            "Chris": {
                "cuts": [
                    2.16,
                    2.71,
                    "DQ"
                ]
            },
            "Kate": {
                "cuts": [
                    4.12,
                    3.61,
                    2.81
                ]
            }
        }
    }
}



/*
 * Do some data preprocessing.
 */

const sortedData = structuredClone(allData)

// Save off years
sortedData.years = Object.keys(allData)

// Save off participants for each year (alphabetically sorted)
sortedData.years.forEach(year => {
    sortedData[year].participants = (sortedData[year].standings ?? Object.keys(sortedData[year].data)).toSorted()
})

// Do preprocessing for each year with cuts data
sortedData.years.forEach(year => {
    if (sortedData[year].data) {
        // For each person...
        sortedData[year].participants.forEach(person => {
            // Filter cuts to just numeric values
            sortedData[year].data[person].cutsNumeric = sortedData[year].data[person].cuts.filter(x => typeof x === "number") // js moment :)
            // Save off best numeric cut value
            sortedData[year].data[person].bestCut = sortedData[year].data[person].cutsNumeric.toSorted()[0] ?? NaN // Handle if someone never gets on the board? not worrying about this for now
        })
        // Get standings for each year, unless there is an override (see 2024)
        if (!sortedData[year].standings)
            sortedData[year].standings = sortedData[year].participants.toSorted((a, b) => sortedData[year].data[a].bestCut - sortedData[year].data[b].bestCut)
    }
})