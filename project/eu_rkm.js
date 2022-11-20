// FIND OUT  VALUES FOR LEGEND?
// Add annotation?
// Use a different color palette?



// --------------- Basic Setup --------------- //

// Define tooltip
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");

// Chart sizes
const height = 300,
    width = 500;

// Define the svg
const svg = d3.select("#eu_rkm")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);



// --------------- Build the Chart --------------- //

Promise.all([
    d3.csv("infrastructure_europe.csv"),
    d3.json("eu_shapes2.json")
    ]).then(([data, shapes]) => {

    // Data conversion
    const dataByCountry = {};
    for (let d of data) {
        d.route_km = +d.route_km
        d.size = +d.size
        d.route_km_per_size = +d.route_km_per_size;
        dataByCountry[d.country] = d;
    }

    // Define the countries
    const countries = topojson.feature(
        shapes, shapes.objects.continent_Europe_subunits
    );
    
    // Define the color palette
    const color = d3.scaleQuantize()
        .domain([0, 100]).nice()
        .range(d3.schemeBlues[5]);
    
    // Create the projection
    const projection = d3
        .geoIdentity()
        .reflectY(true)
        .fitSize([width, height], countries);
    
    // Define the path
    const path = d3.geoPath(projection);

    // Legend
    d3.select("#map_legend")
    .node()
    .appendChild(
      Legend(
        d3.scaleOrdinal(
            ['0-20', '20-40', '40-60', '60-80', '80-100'],
            d3.schemeBlues[5]
        ),
        {title: "Rail-km" }
      ));

    // Add paths to the svg
    svg.append("g")
        .selectAll("path")
        .data(countries.features)
        .join("path")
        .attr("fill", d => {return (d.properties.geounit in dataByCountry) ? color(dataByCountry[d.properties.geounit].route_km_per_size) : '#ccc';})
        .attr("d", path)

        // Tooltip
        .on("mousemove", function (event, d) {
        let info = dataByCountry[d.properties.geounit];
        console.log(info)
        tooltip
            .style("visibility", "visible")
            .html(`<b>${d.properties.geounit}</b>
Total Rkm: ${d3.format(",.0f")(info && info.route_km)}
km<sup>2</sup>: ${d3.format(",.0f")(info && info.size)}
Rkm per 1k km<sup>2</sup>: ${d3.format(",.2f")(info && info.route_km_per_size)}`)
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        d3.select(this).attr("fill", "red");
        })
        .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("fill", d => {return (d.properties.geounit in dataByCountry) ? color(dataByCountry[d.properties.geounit].route_km_per_size) : '#ccc';})
    });    
});