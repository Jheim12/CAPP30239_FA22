d3.csv("trains_switzerland.csv").then((data) => {      
    const height = 500,
        width = 800,
        horizon = height/2,
        margin = ({ top: 15, right: 30, bottom: 35, left: 50 }),
        innerWidth = width - margin.left - margin.right;

    const svg = d3.select("#sustainability")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    for (let d of data) {
        d.year = +d.year
        d.passenger_km = +d.passenger_km
        d.total_passenger_energy_consumption = +d.total_passenger_energy_consumption
        d.greenhouse_gas_per_passenger = +d.greenhouse_gas_per_passenger;
    }

    let x = d3.scaleBand()
        .domain(data.map(d => d.year))
                .range([margin.left, width - margin.right])
        .padding(0.1);
    
    const y_pkm = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.passenger_km)]).nice()
        .range([horizon, 0]);

    const y_energy = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.total_passenger_energy_consumption)])
        .range([horizon, height - margin.bottom]);
    
    const y_gas = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.greenhouse_gas_per_passenger)])
        .range([horizon, height - margin.bottom]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`)
        .call(d3.axisBottom(x));

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom + 5})`)
        .call(d3.axisBottom(x));
    
    const yAxis_pkm = g => g
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y_pkm))
        
    const yAxis_energy = g => g
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y_energy))
    
    const yAxis_gas = g => g
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y_gas))
      
    svg.append("g")
        .call(xAxis);
    
    svg.append("g")
        .call(yAxis_pkm);

    let bar = svg.selectAll(".bar")
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");
    
    bar.append("rect")
        .attr("fill", "steelblue")
        .attr("x", d => x(d.year))
        .attr("width", x.bandwidth())
        .attr("y", d => y_pkm(d.passenger_km))
        .attr("height", d => y_pkm(0) - y_pkm(d.passenger_km))
    
    bar.append("text")
        .text(d => d.passenger_km)
        .attr('x', d => x(d.year) + (x.bandwidth()/2))
        .attr('y', d => y_pkm(d.passenger_km) + 15)
        .attr('text-anchor', 'middle')
        .style('fill', 'white'); 

    function updateChart(i) {
        bar.selectAll("g")
            .join(
                enter => {
                let g = enter.append("g")

                if (i === "total_passenger_energy_consumption") {
                    svg.append("g")
                        .call(yAxis_energy);
                } else if (i === "greenhouse_gas_per_passenger") {
                    svg.append("g")
                        .call(yAxis_gas);
                }

                
                bar.append("rect")
                    .attr("fill", "blue")
                    .attr("x", d => x(d.year))
                    .attr("width", x.bandwidth())
                    .attr("y", d => y_energy(0))
                    .attr("height", d => y_energy(d.total_passenger_energy_consumption) - y_energy(0))
                    // .transition()
                    // .duration(750)
                    // .attr("y", d => y(d.length))
                    // .attr("height", d => height - margin.bottom - y(d.length));
                
                bar.append("text")
                    .text(d => d.passenger_km)
                    .attr('x', d => x(d.year) + (x.bandwidth()/2))
                    .attr('y', d => y_energy(d.total_passenger_energy_consumption) - 15)
                    .attr('text-anchor', 'middle')
                    .style('fill', 'white'); 

                g.append("text")
                    .text(d => d.length)
                    .attr("x", d => x(d.x0) + (x(d.x1) - x(d.x0)) / 2)
                    .attr("y", height - margin.bottom - 5)
                    .attr("text-anchor", "middle")
                    .attr("fill", "#333")
                    .transition()
                    .duration(750)
                    .attr("y", d => y(d.length) - 5);
                },
                update => {
                update.select("rect")
                    .transition()
                    .duration(750)
                    .attr("y", d => y(d.length))
                    .attr("height", d => height - margin.bottom - y(d.length));

                update.select("text")
                    .text(d => d.length)
                    .transition()
                    .duration(750)
                    .attr("y", d => y(d.length) - 5);
                },
                exit => {
                exit.select("rect")
                    .transition()
                    .duration(750)
                    .attr("height", 0)
                    .attr("y", height - margin.bottom);

                exit.select("text")
                    .text("");

                exit.transition()
                    .duration(750)
                    .remove();
            }
        );

            

            // g.append("text")
            //     .text(d => d.length)
            //     .attr("x", d => x(d.x0) + (x(d.x1) - x(d.x0)) / 2)
            //     .attr("y", height - margin.bottom - 5)
            //     .attr("text-anchor", "middle")
            //     .attr("fill", "#333")
            //     .transition()
            //     .duration(750)
            //     .attr("y", d => y(d.length) - 5);
            // },
            // update => {
            // update.select("rect")
            //     .transition()
            //     .duration(750)
            //     .attr("y", d => y(d.length))
            //     .attr("height", d => height - margin.bottom - y(d.length));

            // update.select("text")
            //     .text(d => d.length)
            //     .transition()
            //     .duration(750)
            //     .attr("y", d => y(d.length) - 5);
            // },
            // exit => {
            // exit.select("rect")
            //     .transition()
            //     .duration(750)
            //     .attr("height", 0)
            //     .attr("y", height - margin.bottom);

            // exit.select("text")
            //     .text("");

            // exit.transition()
            //     .duration(750)
            //     .remove();
        //     }
        // );
    }

    updateChart("total_passenger_energy_consumption");

    d3.selectAll("select")
        .on("change", function (event) {
            console.log(event.target.value)     // Delete
            updateChart(event.target.value);
        });
});