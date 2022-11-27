d3.csv("trains_switzerland.csv").then(data => {
    // Basic Setup
    const height = 500,
        width = 800,
        horizon = height/2,
        margin = ({top: 50, right: 45, bottom: 35, left: 100});
    
    // Define SVG
    const svg = d3.select("#energy")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    // Transform the Data
    for (let d of data) {
        d.year = +d.year
        d.passenger_km = +d.passenger_km            // Change to train_km?!
        d.train_km = +d.train_km
        d.total_passenger_energy_consumption = +d.total_passenger_energy_consumption
        d.energy_consumption_per_passenger = +d.energy_consumption_per_passenger;
    }

    // Define Scales
    const x = d3.scaleBand()
        .domain(data.map(d => d.year))
                .range([margin.left, width - margin.right])
        .padding(0.1);
    
    const y_pkm = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.passenger_km)]).nice()
        .range([horizon - 5, margin.top]);

    const y_tkm = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.train_km)]).nice()
        .range([horizon - 5, margin.top]);

    const y_energy = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.total_passenger_energy_consumption)])
        .range([horizon + 5, height - margin.bottom - 5]);
    
    const y_energy_pc = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.energy_consumption_per_passenger)])
        .range([horizon + 5, height - margin.bottom - 5]);

    // Define Axes
    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .call(d3.axisBottom(x).tickSize(0))
    
    const yAxis_pkm = g => g
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y_pkm))
        .call(d3.axisLeft(y_pkm).tickSizeOuter(0));
     
    const yAxis_tkm = g => g
        .attr("transform", `translate(${width-margin.right},0)`)
        .call(d3.axisRight(y_tkm))
        .call(d3.axisRight(y_tkm).tickSizeOuter(0));

    const yAxis_energy = g => g
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y_energy))
        .call(d3.axisLeft(y_energy).tickSizeOuter(0));
    
    const yAxis_energy_pc = g => g
        .attr("transform", `translate(${width-margin.right},0)`)
        .call(d3.axisRight(y_energy_pc))
        .call(d3.axisRight(y_energy_pc).tickSizeOuter(0))
        .style("opacity", 0);
    
    // Add Axes
    svg.append("g")
        .call(xAxis);
    
    svg.append("g")
        .call(yAxis_pkm);
    
    const top_right_axis = svg.append("g")
        .attr('class', 'axisRed')
        .call(yAxis_tkm)   
        .style("opacity", 0);
    
    svg.append("g")
        .call(yAxis_energy);
    
    const bottom_right_axis =
        svg.append("g")
        .attr('class', 'axisRed')
        .call(yAxis_energy_pc)
        .style("opacity", 0);
       
    // Add Labels
    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", (margin.left + width - margin.right)/2)
        .attr("y", height)
        .text("Year")
        .style("font-size","15px");
    
    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("x", -horizon/2)
        .attr("y", margin.left - 50)
        .attr("transform", "rotate(-90)")
        .text("Million Pkm")
        .style("font-size","15px");
    
    const yRightTopLabel = svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("x", (horizon + margin.top)/2)
        .attr("y", -width + margin.right - 30)
        .attr("transform", "rotate(90)")
        .text("Million Tkm")
        .style("font-size","15px")
        .style("fill", "red")
        .style("opacity", 0);
    
    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("x", -(horizon + height - margin.bottom)/2)
        .attr("y", margin.left - 50)
        .attr("transform", "rotate(-90)")
        .text("Total GWh")
        .style("font-size","15px");
    
    const yRightBottomLabel = svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("x", (horizon + height - margin.bottom)/2)
        .attr("y", -width + margin.right - 30)
        .attr("transform", "rotate(90)")
        .text("kWh/100 Pkm")
        .style("font-size","15px")
        .style("fill", "red")
        .style("opacity", 0);

    // Build Rectangles
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
    
    bar.append("rect")
        .attr("fill", "blue")
        .attr("x", d => x(d.year))
        .attr("width", x.bandwidth())
        .attr("y", d => y_energy(0))
        .attr("height", d => y_energy(d.total_passenger_energy_consumption) - y_energy(0))
    
    // Add Numbers to the Rectangles
    bar.append("text")
        .text(d => d.passenger_km)
        .attr('x', d => x(d.year) + (x.bandwidth()/2))
        .attr('y', d => y_pkm(d.passenger_km) + 15)
        .attr('text-anchor', 'middle')
        .style('fill', 'white');   

    bar.append("text")
        .text(d => d.total_passenger_energy_consumption)
        .attr('x', d => x(d.year) + (x.bandwidth()/2))
        .attr('y', d => y_energy(d.total_passenger_energy_consumption) - 15)
        .attr('text-anchor', 'middle')
        .style('fill', 'white');   
    
    // Build Lines
    let tkm_line = d3.line()
        .x(d => x(d.year) + (x.bandwidth()/2))
        .y(d => y_tkm(d.train_km));

    let energy_pc_line = d3.line()
        .x(d => x(d.year) + (x.bandwidth()/2))
        .y(d => y_energy_pc(d.energy_consumption_per_passenger));

    // Add Lines
    bar.append("path")
        .attr("fill", "none")
        .attr("id", "tkm")
        .attr("stroke", "red")
        .attr("d", tkm_line(data))
        .attr("stroke-width", 1)
        .style("opacity", 0);

    bar.append("path")
        .attr("id", "energy_pc")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("d", energy_pc_line(data))
        .attr("stroke-width", 1)
        .style("opacity", 0);

    // Toggle
    d3.select("#energy_checkbox").on("change", update);
    update();

    function update() {
        const switchChecked = d3.select("#energy_checkbox").property("checked");
          
        const lineData_energy_pc = switchChecked
            ? data
            : Array.from(data, (d) => {
                return { ...d, year: d.year, energy_consumption_per_passenger: 0};
                });
        
        const lineData_tkm = switchChecked
            ? data
            : Array.from(data, (d) => {
                return { ...d, year: d.year, train_km: 0};
                });
    
        bar.transition()
            .duration(1000)
            .select("#tkm")
            .attr("d", tkm_line(lineData_tkm))
            .style("opacity", switchChecked ? 1 : 0);

        bar.transition()
            .duration(1000)
            .select("#energy_pc")
            .attr("d", energy_pc_line(lineData_energy_pc))
            .style("opacity", switchChecked ? 1 : 0);

        top_right_axis
            .transition()
            .duration(1000)
            .style("opacity", switchChecked ? 1 : 0);

        bottom_right_axis
            .transition()
            .duration(1000)
            .style("opacity", switchChecked ? 1 : 0);
        
        yRightTopLabel
            .transition()
            .duration(1000)
            .style("opacity", switchChecked ? 1 : 0);
        
        yRightBottomLabel
            .transition()
            .duration(1000)
            .style("opacity", switchChecked ? 1 : 0);
    }

    // Add title
    svg.append("text")
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", margin.top - 20)
        .text("Unproportional Energy Consumption 2")
        .style("font-size","26px");
});