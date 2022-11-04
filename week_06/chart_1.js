d3.json('chart_1.json').then((data) => {

    const height = 400,
        width = 600,
        innerRadius = 100,
        outerRadius = 150,
        labelRadius = 175;
  
    const arcs = d3.pie().value(d => d.count)(data);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);   // arc is a generator that creates a generator
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
  
    const svg = d3.select("#chart_1")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    svg.append("g")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", (d, i) => d3.schemeCategory10[i])
        .attr("d", arc);
  
    svg.append("g")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
        .selectAll("tspan")
        .data(d => {
            return [d.data.ethnicity, d.data.count];
        })
        .join("tspan")
        .attr("x", 0)
        .attr("y", (d, i) => `${i * 1.1}em`)
        .attr("font-weight", (d, i) => i ? null : "bold")
        .text(d => d);
  
    svg.append("text")
        .attr("font-size", 30)
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .text("2015 Victims (%)")
        .style("font-size", 20);
});



d3.json('chart_1_2.json').then((data) => {

    const height = 400,
        width = 600,
        innerRadius = 100,
        outerRadius = 150,
        labelRadius = 175;
  
    const arcs = d3.pie().value(d => d.count)(data);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);   // arc is a generator that creates a generator
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
  
    const svg = d3.select("#chart_1_2")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    svg.append("g")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", (d, i) => d3.schemeCategory10[i])
        .attr("d", arc);
  
    svg.append("g")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
        .selectAll("tspan")
        .data(d => {
            return [d.data.ethnicity, d.data.count];
        })
        .join("tspan")
        .attr("x", 0)
        .attr("y", (d, i) => `${i * 1.1}em`)
        .attr("font-weight", (d, i) => i ? null : "bold")
        .text(d => d);
  
    svg.append("text")
        .attr("font-size", 30)
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .text("2015 Population (%)")
        .style("font-size", 20);
});