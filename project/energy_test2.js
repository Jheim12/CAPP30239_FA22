d3.csv("trains_switzerland.csv").then(data => {

    const height = 500,
        width = 800,
        horizon = height/2,
        margin = ({top: 50, right: 30, bottom: 35, left: 100}),
        innerWidth = width - margin.left - margin.right;
    
    const svg = d3.select("#energy")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    for (let d of data) {
        d.year = +d.year
        d.passenger_km = +d.passenger_km
        d.total_passenger_energy_consumption = +d.total_passenger_energy_consumption
        d.energy_consumption_per_passenger = +d.energy_consumption_per_passenger;
    }

    let x = d3.scaleBand()
        .domain(data.map(d => d.year))
                .range([margin.left, width - margin.right])
        .padding(0.1);
    
    const y_pkm = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.passenger_km)]).nice()
        .range([horizon, 10]);

    const y_energy = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.total_passenger_energy_consumption)])
        .range([horizon, height - margin.bottom]);
    
    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .call(d3.axisBottom(x).tickSizeOuter(0));
    
    const yAxis_pkm = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y_pkm))
        .call(d3.axisLeft(y_pkm).tickSizeOuter(0));
        
    const yAxis_enery = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y_energy))
        .call(d3.axisLeft(y_energy).tickSizeOuter(0));
        
    svg.append("g")
        .call(xAxis);
    
    svg.append("g")
        .call(yAxis_pkm);
    
    svg.append("g")
        .call(yAxis_enery);
    



    
    // per capita --------------------
    const y_energy_pc = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.energy_consumption_per_passenger)])
        .range([horizon, height - margin.bottom]);

    const yAxis_enery_pc = g => g
        .attr("transform", `translate(${width-margin.right},0)`)
        .call(d3.axisRight(y_energy_pc))
        .call(d3.axisRight(y_energy_pc).tickSizeOuter(0));

    




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
    
    bar.append("rect")
        .attr("fill", "blue")
        .attr("x", d => x(d.year))
        .attr("width", x.bandwidth())
        .attr("y", d => y_energy(0))
        .attr("height", d => y_energy(d.total_passenger_energy_consumption) - y_energy(0))
    
    bar.append("text")
        .text(d => d.total_passenger_energy_consumption)
        .attr('x', d => x(d.year) + (x.bandwidth()/2))
        .attr('y', d => y_energy(d.total_passenger_energy_consumption) - 15)
        .attr('text-anchor', 'middle')
        .style('fill', 'white');   

    
    let line = d3.line()
        .x(d => x(d.year) + (x.bandwidth()/2))
        .y(d => y_energy_pc(d.energy_consumption_per_passenger));

    // Add right-side y-axis--------------------
    const bottom_right_axis =
        svg.append("g")
        .call(yAxis_enery_pc);
        
    // bottom_right_axis.select(".tick text").attr({'fill': 'red'});

    bar.append("path")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("d", line(data))
        .attr("stroke-width", 1)
        .attr("opacity", 0);

    
    d3.select("#energy_checkbox").on("change", update);
    update();

    // function update() {
    //     if (d3.select("#energy_checkbox").property("checked")) {
    //         bar.selectAll("path")
    //             .transition()
    //             .duration(400)
    //             // .attr("y", d => y_energy_pc(d.energy_consumption_per_passenger))        // MAKE LINE GO TO Y
    //             // .attr("transform", `translate(0, ${-horizon / 2})`)
    //             .style("opacity", 1)            
    //     } else {
    //         bar.selectAll("path")
    //             .transition()
    //             .duration(400)
    //             // .attr("y", horizon)      // MAKE LINE COME OUT OF THE ORIGIN
    //             // .attr("transform", `translate(${-horizon / 2}, 0)`)
    //             .style("opacity", 0)	
    //     }
    // }
    function update() {
        const switchChecked = d3.select("#energy_checkbox").property("checked");
          
        const lineData = switchChecked
            ? data
            : Array.from(data, (d) => {
                return { ...d, year: d.year, energy_consumption_per_passenger: 0};
                });
    
        bar.transition()
            .duration(1000)
            .selectAll("path")
            .attr("d", line(lineData))
            .style("opacity", switchChecked ? 1 : 0);

        bottom_right_axis
            .transition()
            .duration(1000)
            .style("opacity", switchChecked ? 1 : 0);
    }
});