/*
CAPP302396: Data Visulaization
Jonas Heim's Week 3 Homework
Building a bar chart
*/

d3.csv("library_visits_jan22.csv").then(data => { // load the data
    for (let d of data) {
        d.zip = +d.zip; // "+" changes str to num
        d.num = +d.num;
    };

    // specify the graph size and margins
    const height = 400, // "," to avoid repeating "const"
        width = 600,
        margin = ({top: 25, right: 30, bottom: 35, left: 50});
    
    // target the "chart" svd in homework.html
    let svg = d3.select("#chart")
        .append("svg")
        .attr("viewbox", [0, 2, width, height]); // viewbox allows to resize depending on the screen size
    
    // define the x-axis
    const x = d3.scaleBand() // scaleBand is for barcharts
        .domain(data.map(d => d.branch)) // individual branches
        .range([margin.left, width - margin.right]) // coordinates from left to right
        .padding(0.1); // only in scaleBand
    
    // define the y-axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.num)]).nice() // range of "num"
        .range([height - margin.bottom, margin.top]); // coordinates are from top to bottom
    
    // build x-axis
    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom + 5})`)
        .call(d3.axisBottom(x));
        // .call(g => g.select(".domain").remove()); // removes the line of the x-axis
    
    // build y-axis
    const yAxis = g => g
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y));
        // .call(g => g.select(".domain").remove()); // removes the line of the y-axis

    // place the axis on the x-axis
    svg.append("g")
        .call(xAxis);
    
    // place the axis on the y-axis
    svg.append("g")
        .call(yAxis);
    
    // add the data
    let bar = svg.selectAll(".bar")
        .append("g") // add group
        .data(data) // add data
        .join("g") // join the data and the rectangles
        .attr("class", "bar");
    
    // build the actual bars
    bar.append("rect")
        .attr("fill", "steelblue")
        .attr("x", d => x(d.branch))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.num))
        .attr("height", d => y(0) - y(d.num));
    
    // add values to rectangles
    bar.append("text")
        .text(d => d.num)
        .attr('x', d => x(d.branch) + (x.bandwidth()/2))
        .attr('y', d => y(d.num) + 15)
        .attr('text-anchor', 'middle')
        .style('fill', 'white');   
});
