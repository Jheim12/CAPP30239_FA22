d3.csv('trains_europe.csv').then(data => {
    
    const height = 500,
        width = 800,
        margin = ({ top: 15, right: 60, bottom: 35, left: 40 })
        innerWidth = width - margin.left - margin.right;
    
    const svg = d3.select("#eu_pkm_test")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    let timeParse = d3.timeParse("%Y")

    let countries = new Set()

    for (let d of data) {
        countries.add(d.country)
        // d.year = timeParse(d.year)
        d.year = +d.year
        d.passenger_km_per_capita = +d.passenger_km_per_capita
    };
    
    // Define x scale
    // let x = d3.scaleTime()
    //     .domain(d3.extent(data, d => d.year))
    //     .range([margin.left, width - margin.right])
    let x = d3.scaleLinear()                                // REMOVE COMMA FROM YEARS?
        .domain(d3.extent(data, d => d.year)).nice()
        .range([margin.left, width - margin.right]);

    // Define y scale
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.passenger_km_per_capita)])
        .range([height - margin.bottom, margin.top])

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x)
            .tickSizeOuter(0)
            .ticks(5)
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
        .attr("x", width/2)
        .attr("y", height) 
        .text("Year");
    
    // add y-axis label
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


    // Add invisible scatterplot with voronoid-----------------------------------------------
    let dots = svg.append("g")
        .selectAll("g")
        .data(data)
        .join('g');

    const tooltip = d3.select("body").append("div")
        .attr("class", "svg-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden");

    dots.append("path")
        .attr("d", d3.symbol().type(d3.symbolCross).size(50))
        .attr("class", "star")
        .attr("fill", "orange")
        .attr("opacity", 0)     // Don't display when not on it
        .attr("transform", d => `translate(${x(d.year)},${y(d.passenger_km_per_capita)}) rotate(-45)`);

    const delaunay = d3.Delaunay.from(data, d => x(d.year), d => y(d.passenger_km_per_capita));
    const voronoi = delaunay.voronoi([x.range()[0], y.range()[1], x.range()[1], y.range()[0]]);

    dots.append("path")
        .attr("d", (d, i) => voronoi.renderCell(i))
        .attr("fill-opacity", 0)
        // .attr("stroke", "black")         // Display the vornoid
        .on("mouseover", function (event, d) {
            d3.select(this.parentNode)      // DISPLAY NEXT TO THE CROSS RATHER THAN MOUSE
            .select(".star")
            .attr("fill", "black")          // HOW TO BRING IT OUT IN FRONT?
            .attr("opacity", 0.75);

            tooltip             // Call function that updates table, remove tooltip
            .style("visibility", "visible")                 // ADD THE 1'000 SEPARATOR FOR PKM? D3 format
            .html(
                `${d.country} in ${d.year}:
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


    // Add lines----------------------------------------------------------------------
    for (let country of countries) {
        let countryData = data.filter(d => d.country === country);
    
        // Create the figure
        let g = svg.append("g")
            .attr("class", "country")
        
        // height of last data point
        let lastEntry = countryData[0];

        if (country === "Switzerland") {
            
            // Add Switzerland label
            g.append("text")
                .text(country)
                .attr("x", x(lastEntry.year) + 3)
                .attr("y", y(lastEntry.passenger_km_per_capita))
                .attr("dominant-baseline", "middle")
                .attr("fill", "red");
            
            // Add line
            g.append("path")
                .datum(countryData)
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("d", line)
                .attr("stroke-width", 3)
        }
        
        else {

            // Add lines
            g.append("path")
                .datum(countryData)
                .attr("fill", "none")
                .attr("stroke", "#ccc")
                .attr("d", line)
            
            // Add invisible country labels
            g.append("text")
                .text(country)
                .attr("x", x(lastEntry.year) + 3)
                .attr("y", y(lastEntry.passenger_km_per_capita))
                .attr("dominant-baseline", "middle")
                .attr("fill", "orange")
                .attr("opacity", 0);

            // Highlight lines and text when hovering
            g.on('mouseover', function () {
                d3.selectAll(".highlight").classed("highlight", false);
                d3.select(this).classed("highlight", true);
                });
        }
    }

});