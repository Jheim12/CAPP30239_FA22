// Source: class material

// Define tooltip
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");

// Chart sizes
const height = 300,
    width = 500
    margin = ({ top: 40, right: 20, bottom: 20, left: 20});

// Define the svg
const svg = d3.select("#eu_rkm")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

// Load the data
Promise.all([
    d3.csv("data/infrastructure_europe.csv"),
    d3.json("data/eu_shapes.json")
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
        shapes, shapes.objects.europe
    );
    
    // Define the color palette
    const color = d3.scaleQuantize()
        .domain([0, 100]).nice()
        .range(["#e3eef9", "#cfe1f2", "#b5d4e9", "#93c3df", "#6daed5",
        "#4b97c9", "#2f7ebc", "#1864aa", "#0a4a90", "#08306b"])
    
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
            ['0-10', '10-20', '20-30', '30-40', '40-50',
            '50-60', '60-70', '70-80', '80-90', '90-100+'],
            (["#e3eef9", "#cfe1f2", "#b5d4e9", "#93c3df", "#6daed5",
            "#4b97c9", "#2f7ebc", "#1864aa", "#0a4a90", "#08306b"])
        ),
        {title: "Rail-km per 1'000km2" }
      ));

    // Add paths to the svg
    svg.append("g")
        .selectAll("path")
        .data(countries.features)
        .join("path")
        .attr("fill", d => {return (d.properties.geounit in dataByCountry) ? color(dataByCountry[d.properties.geounit].route_km_per_size) : '#979797';})
        .attr("stroke", d => {if (d.properties.geounit == "Switzerland") {
            return "#FF1212"
        } else {
            return "black"
        }})
        .attr("stroke-width", d => {if (d.properties.geounit == "Switzerland") {
            return 1
        } else {
            return 0.5
        }})
        .attr("d", path)

        // Tooltip
        .on("mousemove", function (event, d) {
        let info = dataByCountry[d.properties.geounit];

        if (typeof info == 'undefined') {
            var message = `<b>${d.properties.geounit}</b>
No data...`
        } else {
            var message = `<b>${d.properties.geounit}</b>
Total Rkm: ${d3.format(",.0f")(info && info.route_km)}
km<sup>2</sup>: ${d3.format(",.0f")(info && info.size)}
Rkm per 1k km<sup>2</sup>: ${d3.format(",.2f")(info && info.route_km_per_size)}`
        }

        tooltip
            .style("visibility", "visible")
            .html(message)
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        d3.select(this).attr("fill", "#FF1212");
        })
        .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("fill", d => {return (d.properties.geounit in dataByCountry) ? color(dataByCountry[d.properties.geounit].route_km_per_size) : '#979797';})
    });

    // Annotation
    // https://d3-graph-gallery.com/graph/custom_annotation.html
    const annotations = [
        {
            note: {
            title: "Switzerland",
            wrap: 150,
            padding: 0
            },
            color: ["#FF1212"],
            x: 163,
            y: 195,
            dy: -130,
            dx: -70
        },
        {
            note: {
            title: "Germany",
            wrap: 150,
            padding: 0
            },
            color: ["black"],
            x: 163,
            y: 144,
            dy: -105,
            dx: -56.5
        }
    ]

    const makeAnnotations = d3.annotation()
        .annotations(annotations);

    svg.append("g")
        .style("opacity", 1)
        .attr("id", "annotation")
        .call(makeAnnotations);
});