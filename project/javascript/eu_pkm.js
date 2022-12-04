// Source: class material

d3.csv('data/trains_europe.csv').then(data => {    
    // Chart sizes
    const height = 500,
        width = 800,
        margin = ({top: 10, right: 80, bottom: 35, left: 80})
        innerWidth = width - margin.left - margin.right;
    
    // Define the svg
    const svg = d3.select("#eu_pkm")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    // List for countries
    let countries = new Set()

    // Transform the data to numeric
    for (let d of data) {
        countries.add(d.country)
        d.year = +d.year
        d.passenger_km_per_capita = +d.passenger_km_per_capita
    };

    // Define x-scale
    let x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year)).nice()
        .range([margin.left, width - margin.right]);

    // Define y-scale
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.passenger_km_per_capita)])
        .range([height - margin.bottom, margin.top])

    // Define lines
    let line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.passenger_km_per_capita));

    // Iterate over countries
    for (let country of countries) {
        let countryData = data.filter(d => d.country === country);

        // Create the figure
        let g = svg.append("g")
            .attr("class", "country")
        
        // Height of last data point
        let lastEntry = countryData[0];

        // Highlight Switzerland
        if (country === "Switzerland") {
            // Add Switzerland label
            g.append("text")
                .text(country)
                .attr("x", x(lastEntry.year) + 3)
                .attr("y", y(lastEntry.passenger_km_per_capita))
                .attr("dominant-baseline", "middle")
                .attr("fill", "#FF1212")
                .attr("font-weight", 700);
            
            // Add line
            g.append("path")
                .datum(countryData)
                .attr("fill", "none")
                .attr("stroke", "#FF1212")
                .attr("d", line)
                .attr("stroke-width", 3)
        } else {
            // Add lines
            g.append("path")
                .attr("id", country)
                .datum(countryData)
                .attr("fill", "none")
                .attr("stroke", "#ccc")
                .attr("d", line);
            
            // Add invisible country labels
            g.append("text")
                .attr("id", country)
                .text(country)
                .attr("x", x(lastEntry.year) + 3)
                .attr("y", y(lastEntry.passenger_km_per_capita))
                .attr("dominant-baseline", "middle")
                .attr("fill", "orange")
                .attr("opacity", 0);

            // Highlight lines and text when hovering over text
            g.on('mouseover', function () {
                d3.selectAll(".highlight").classed("highlight", false);
                d3.select(this).classed("highlight", true);
                });
        }
    }    

    // Define points
    let dots = svg.append("g")
        .selectAll("g")
        .data(data)
        .join('g');

    // Add invisible crosses
    dots.append("path")
        .attr("d", d3.symbol().type(d3.symbolCross).size(50))
        .attr("class", "star")
        .attr("fill", "orange")
        .attr("opacity", 0)
        .attr("transform", d => `translate(${x(d.year)},${y(d.passenger_km_per_capita)}) rotate(-45)`);

    // Build voronoid
    const delaunay = d3.Delaunay.from(data, d => x(d.year), d => y(d.passenger_km_per_capita));
    const voronoi = delaunay.voronoi([x.range()[0], y.range()[1], x.range()[1], y.range()[0]]);

    // Define tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "svg-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden");
    
    // Make crosses visible when in voronoid cell
    dots.append("path")
        .attr("d", (d, i) => voronoi.renderCell(i))
        .attr("fill-opacity", 0)
        .on("mouseover", function (event, d) {
            d3.select(this.parentNode)
            .select(".star")
            .attr("fill", "black")
            .attr("opacity", 0.75);

            tooltip
            .style("visibility", "visible")
            .html(
                `<b>${d.country} in ${d.year}:</b>
Total Pkm: ${d3.format(",.0f")(d.passenger_km * 1000)} M
Population: ${d3.format(",.2f")(d.population / 1000000, 2)} M`)
        })
        .on("mousemove", function (event) {
            tooltip
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function () {
            d3.select(this.parentNode)
            .select(".star")
            .attr("fill", "orange")
            .attr("opacity", 0);
        
            tooltip.style("visibility", "hidden");
        });

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x)
            .tickSizeOuter(0)
            .ticks(5)
            .tickFormat(d3.format(''))
            );

    // Add y-axis
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y)
        .tickSizeOuter(0)
        .ticks(10)
        );

    // Add x-axis label
    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", margin.left + (width - margin.left - margin.right)/2)
        .attr("y", height) 
        .text("Year")
        .style("font-size","15px");
    
    // Add y-axis label
    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("x", -margin.top - (height -margin.bottom)/2)
        .attr("y", 25)
        .attr("transform", "rotate(-90)")
        .text("Million km per 10k Inhabitants")
        .style("font-size","15px");
});