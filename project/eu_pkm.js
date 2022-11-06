d3.csv('trains_europe.csv').then(data => {        // RELATIVE PATH?
    
    const height = 500,
        width = 800,
        margin = ({ top: 15, right: 30, bottom: 35, left: 40 })
        innerWidth = width - margin.left - margin.right;
    
    const svg = d3.select("#eu_pkm")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    let timeParse = d3.timeParse("%Y")

    let countries = new Set()

    for (let d of data) {                         // SKIP FIRST ROW?
        countries.add(d.country)
        d.year = timeParse(d.year)
        // d.total_rail_traffic = +d.total_rail_traffic
        // d.perc_passenger_services = +d.perc_passenger_services
        // d.passenger_km = +d.passenger_km
        // d.population = +d.population
        // d.size = +d.size
        // d.total_rail_traffic_per_size = +d.total_rail_traffic_per_size
        d.passenger_km_per_capita = +d.passenger_km_per_capita
    };

    // console.log(data);      //  DELETE
    
    let x = d3.scaleTime()
        .domain(d3.extent(data, d => d.year))
        .range([margin.left, width - margin.right])

    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.passenger_km_per_capita)])   // replace extent with max for ticks???
        .range([height - margin.bottom, margin.top])

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x)
            .tickSizeOuter(0)
            .ticks(5)
            ); // Removes the tick at the end of an axis
        // .tickFormat(d3.timeFormat('%y'))       // NOT WORKING...
        // .call(d3.ticks(d3.timeDay.every(1), '%Y'))   //https://stackoverflow.com/questions/70039306/how-can-i-control-the-date-format-for-d3-scaletime-and-remove-unwanted-clock-tim

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y)
        .tickSizeOuter(0)
        .ticks(10)
        );

    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", height) 
        .text("Year");
    
    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("x", -height/2)
        .attr("y", 10)
        .attr("transform", "rotate(-90)")
        .text("Million km/10k inhabitants");
        
    let line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.passenger_km_per_capita));

    for (let country of countries) {
        let countryData = data.filter(d => d.country === country);
    
        let g = svg.append("g")
            .attr("class", "country")
            .on('mouseover', function () {
            d3.selectAll(".highlight").classed("highlight", false);
            d3.select(this).classed("highlight", true);
            });
        
        if (country === "Switzerland") {
                g.classed("highlight", true);

                let lastEntry = countryData[0];
                g.append("text")
                    .text(country)
                    .attr("x", x(lastEntry.year) + 3)
                    .attr("y", y(lastEntry.passenger_km_per_capita))
                    .attr("dominant-baseline", "middle")
                    .attr("fill", "#999");
            }
        
        g.append("path")
            .datum(countryData)
            .attr("fill", "none")
            .attr("stroke", "#ccc")
            .attr("d", line)
    }
});