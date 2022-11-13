// --------------- Basic Setup --------------- //

const tooltip = d3.select("body")
    .append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");


// Chart sizes
const height = 500,
    width = 80;

// Define the svg
const svg = d3.select("#eu_pkm_test")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

Promise.all([
    d3.csv("infrastructure_europe.csv"),
    d3.json("eu_shapes.json")
    ]).then(([data, shapes]) => {

    const dataByCountry = {};
    for (let d of data) {
        d.route_km_per_size = +d.route_km_per_size;
        dataByCountry[d.geounit] = d;
    }
    // console.log(data)       // DELETE

    const countries = topojson.feature(shapes, shapes.objects.continent_Europe_subunits);
    // console.log(countries)       // DELETE
    console.log(dataByCountry)


    const color = d3.scaleQuantize()
        .domain([0, 100]).nice()
        .range(d3.schemeBlues[9]);
    
    const path = d3.geoPath();

    // d3.select("#legend")
    // .node()
    // .appendChild(
    //   Legend(
    //     d3.scaleOrdinal(
    //       ["1", "2", "3", "4", "5", "6", "7", "8", "9+"],
    //       d3.schemeBlues[9]
    //     ),
    //     { title: "Rail-km" }
    //   ));

    console.log(dataByCountry['Austria'].route_km_per_size)

    svg.append("g")
        .selectAll("path")
        .data(countries.features)
        .join("path")
        .attr("fill", d => (d.geounit in dataByCountry) ? color(dataByCountry[d.geounit].route_km_per_size) : '#ccc')
        .attr("d", path)
        // .on("mousemove", function (event, d) {
        // let info = dataByCountry[d.geounit];
        // tooltip
        //     .style("visibility", "visible")
        //     .html(`${info.county}<br>${info.route_km_per_size}%`)
        //     .style("top", (event.pageY - 10) + "px")
        //     .style("left", (event.pageX + 10) + "px");
        // d3.select(this).attr("fill", "goldenrod");
        // })
        // .on("mouseout", function () {
        // tooltip.style("visibility", "hidden");
        // d3.select(this).attr("fill", d => (d.geounit in dataByCountry) ? color(dataByCountry[d.geounit].route_km_per_size) : '#ccc');
    // });    
});