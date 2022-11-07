d3.csv("trains_switzerland.csv").then(data => {

    const height = 500,
        width = 800,
        horizon = height/2,
        margin = ({ top: 15, right: 30, bottom: 35, left: 50 }),
        innerWidth = width - margin.left - margin.right;
    
    const svg = d3.select("#energy")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    // let timeParse = d3.timeParse("%Y")

    for (let d of data) {
        // d.year = timeParse(d.year)
        d.year = +d.year
        d.passenger_km = +d.passenger_km
        d.total_passenger_energy_consumption = +d.total_passenger_energy_consumption;
    }
    console.log(data)

    let x = d3.scaleBand()
        .domain(data.map(d => d.year))
                .range([margin.left, width - margin.right])
        .padding(0.1);
    
    const y_pkm = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.passenger_km)]).nice()
        .range([horizon, 0]);

    const y_energy = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.total_passenger_energy_consumption)])
        .range([horizon, height - margin.bottom]);
    
    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom + 5})`)
        .call(d3.axisBottom(x));
    
    const yAxis_pkm = g => g
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y_pkm))
        
    const yAxis_enery = g => g
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y_energy))
        

    svg.append("g")
        .call(xAxis);
    
    svg.append("g")
        .call(yAxis_pkm);
    
    svg.append("g")
        .call(yAxis_enery);

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
        .text(d => d.passenger_km)
        .attr('x', d => x(d.year) + (x.bandwidth()/2))
        .attr('y', d => y_energy(d.total_passenger_energy_consumption) - 15)
        .attr('text-anchor', 'middle')
        .style('fill', 'white');   
});