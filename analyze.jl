using JSON
using DataFrames
using Statistics

data = JSON.parse(read("data.json", String))

data

# Create a dataframe with [year, person, round, width]
df = DataFrame(Year=String[], Person=String[], Round=Int[], Width=Float64[])

for (year, year_dict) in data
    # check if data field exists
    if !haskey(year_dict, "data")
        continue
    end
    for (_, data_dict) in year_dict
        # println("Year: ", year)
        for (person, person_dict) in data_dict
            # println("   Person: ", person)
            for (cuts, cuts_list) in person_dict
                # println("       Cuts: ", cuts_list)
                for (round_index, width) in enumerate(cuts_list)
                    # if typeof is Float64
                    if typeof(width) != Float64
                        continue
                    end

                    push!(df, (string(year), string(person), Int(round_index), width))
                    println(year, person, round_index, width)
                end
            end 
        end
    end
end

using CSV
CSV.write("output.csv", df)