const width = 860,
    height = 400,
    margin = {top: 40, right: 30, bottom: 20, left: 20};
    
const svg = d3.select("#chart_3")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.csv("chart_3.csv").then(data => {

    let x = d3.scaleBand(data.map(d => (d.Armed)),[margin.left, width - margin.right])
        .padding([0.2]);

    let y = d3.scaleLinear([0,100],[height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right))
    
    //protein,carbs,fiber
    const subgroups = data.columns.slice(1);    // Delete a column (filter for rows)

    const color = d3.scaleOrdinal(subgroups,['#e41a1c','#377eb8','#4daf4a', '#000']);   // Set colors

    const stackedData = d3.stack()    // Stack the data
        .keys(subgroups)(data)

    svg.append("g")
        .selectAll("g")
        .data(stackedData)    // Using the data
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")   // join the data on rectangles
        .attr("x", d => x(d.data.Armed))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width",x.bandwidth())

    // Manual legend
    svg.append("circle").attr("cx",10).attr("cy",10).attr("r", 6).style("fill", "#e41a1c")
    svg.append("circle").attr("cx",110).attr("cy",10).attr("r", 6).style("fill", "#377eb8")
    svg.append("circle").attr("cx",205).attr("cy",10).attr("r", 6).style("fill", "#4daf4a")
    svg.append("circle").attr("cx",400).attr("cy",10).attr("r", 6).style("fill", "#000")
    svg.append("text").attr("x", 20).attr("y", 10).text("Shot").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 130).attr("y", 10).text("Tasered").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 225).attr("y", 10).text("Shot and Tasered").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 420).attr("y", 10).text("Other").style("font-size", "15px").attr("alignment-baseline","middle")
});