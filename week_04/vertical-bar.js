/* Bar chart of COVID cases */
d3.csv("covid.csv").then(data => {
    for (let d of data) {
        d.cases = +d.cases; // "+" turns into a number
        d.vaccination = +d.vaccination;
    }
    
    const height = 400, // "," to avoid repeating "const"
        width = 600,
        margin = ({top: 25, right: 30, bottom: 35, left: 50});
    
    let svg = d3.select("#chart") // targets the "chart" div in index.html
        .append("svg")
        .attr("viewbox", [0, 2, width, height]); // viewbox allows to resize depending on the screen size
    
    const x = d3.scaleBand() // scaleBand is for barcharts
        .domain(data.map(d => d.country))
        .range([margin.left, width - margin.right]) // "width" is the width of the page
        .padding(0.1); // only in scaleBand
    
    const y = d3.scaleLinear() // define y
        .domain([0, d3.max(data, d => d.cases)]).nice()
        .range([height - margin.bottom, margin.top]);
    
    const xAxis = g => g // build x-axis
        .attr("transform", `translate(0,${height - margin.bottom + 5})`)
        .call(d3.axisBottom(x))
        //.call(g => g.select(".domain").remove()); // not too important
    
    const yAxis = g => g // build y-axis
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y))
        //.call(g => g.select(".domain").remove()); // not too important

    svg.append("g") // place axis
        .call(xAxis);
    
    svg.append("g")
        .call(yAxis);
    
    let bar = svg.selectAll(".bar")
        .append("g") // add group
        .data(data) // add data
        .join("g") // join the data and the rectangle
        .attr("class", "bar");
    
    bar.append("rect") // build the bars
        .attr("fill", "steelblue")
        .attr("x", d => x(d.country))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.cases))
        .attr("height", d => y(0) - y(d.cases))
    
    bar.append("text") // add number to rectangles
        .text(d => d.cases)
        .attr('x', d => x(d.country) + (x.bandwidth()/2))
        .attr('y', d => y(d.cases) + 15)
        .attr('text-anchor', 'middle')
        .style('fill', 'white');   
});