const tooltip = d3.select("body")
    .append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");

const height = 610,
    width = 975;

const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

Promise.all([     // need two data files, first loaded as data, second as us
    d3.csv("data/unemployment2020.csv"),  // id matches topojson
    d3.json("libs/counties-albers-10m.json")  // on top of topojson's default, we need to provide a mesh
]).then(([data, us]) => {
    const dataById = {};

    for (let d of data) {
        d.rate = +d.rate;
        //making a lookup table from the array (unemployment data)
        dataById[d.id] = d;
    }

    const counties = topojson.feature(us, us.objects.counties); // Using our shapefile, shapefiles can be found on observable

    // Quantize evenly breakups domain into range buckets
    const color = d3.scaleQuantize()    // Creating color scales
        .domain([0, 10]).nice()     // unemployment rate range
        .range(d3.schemeBlues[9]);

    const path = d3.geoPath();  // Start building the map

    d3.select("#legend")    // Add color legend
      .node()
      .appendChild(
        Legend(
          d3.scaleOrdinal(
            ["1", "2", "3", "4", "5", "6", "7", "8", "9+"],
            d3.schemeBlues[9]
          ),
          { title: "Unemployment rate (%)" }
        ));

    svg.append("g")     // Add map
      .selectAll("path")
      .data(counties.features)
      .join("path") // Select path before putting it onto the path
      .attr("fill", d => (d.id in dataById) ? color(dataById[d.id].rate) : '#ccc')  // Put the colors on the counties
      .attr("d", path)
      .on("mousemove", function (event, d) {
        let info = dataById[d.id];
        tooltip
          .style("visibility", "visible")
          .html(`${info.county}<br>${info.rate}%`)
          .style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
        d3.select(this).attr("fill", "goldenrod");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("fill", d => (d.id in dataById) ? color(dataById[d.id].rate) : '#ccc');
      });
});