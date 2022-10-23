// Define the height, width, and margins
const height = 500,
    width = 800,
    margin = ({ top: 15, right: 30, bottom: 35, left: 40 });

// Define a viewbox to implement the chart in
// (called below the text in the html-file)
const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

// Load the data and create the visualization
d3.csv('long-term-interest-canada.csv').then(data => {
    
    let timeParse = d3.timeParse("%Y-%m");  // Function to format date variables

    // Format the data
    for (let d of data) {
        d.Num = +d.Num;                 // Format as numeric
        d.Month = timeParse(d.Month);   // Format variables using the function defined above
    }

    // Defining the x-axis with the months
    let x = d3.scaleTime()
        .domain(d3.extent(data, d => d.Month))          // Elements on axis
        .range([margin.left, width - margin.right]);    // Size of the axis
    
    // Defining the y-axis with the interest rates
    let y = d3.scaleLinear()
        .domain([0,d3.max(data, d => d.Num)]).nice()    // Elements on axis
        .range([height - margin.bottom, margin.top]);   // Size of the axis

    // Call the y-axis to put it onto the svg
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)   // Put the axis into the appropriate location
        .attr("class", "y-axis")                            // Adding a class to y-axis for scoping
        .call(d3.axisLeft(y)                                // Actually adding the predefined y-axis
            .tickSizeOuter(0)                               // Removing the last tick
            .tickFormat(d => d + "%")                       // Add "%" to the values
            .tickSize(-width + margin.right + margin.left)  // Put labels closer to the axis
        );
    
    // Call the x-axis to put it onto the svg
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)    // Put the axis into the appropriate location
        .call(d3.axisBottom(x)                                          // Actually adding the predefined x-axis
            .tickSizeOuter(0)                                           // Removing the last tick
        );


    // Add label to the x-axis
    svg.append("text")                      // It's a text attribute
        .attr("class", "x-label")           // Define a class for referencing
        .attr("text-anchor", "end")         // Coordinates defined below are for the end of the text
        .attr("x", width - margin.right)    // Define x coordinate of the text
        .attr("y", height)                  // Define y coordinate of the text
        .attr("dx", "0.5em")                // Relative coordinates to x
        .attr("dy", "-0.5em")               // Relative coordinates to y
        .text("Year");                      // Actual text to display

    // Add label to the y-axis
    svg.append("text")                      // It's a text attribute
        .attr("class", "y-label")           // Define a class for referencing
        .attr("text-anchor", "end")         // Coordinates defined below are for the end of the text
        .attr("x", -margin.top/2)           // Define x coordinate of the text
        .attr("y", 10)                      // Define y coordinate of the text
        .attr("dx", "-0.5em")               // Relative coordinates to x
        .attr("transform", "rotate(-90)")   // Rotate the text
        .text("Interest rate");             // Actual text to display

    // Define the line    
    let line = d3.line()
        .x(d => x(d.Month))         // x-value
        .y(d => y(d.Num))           // y-value
        .curve(d3.curveNatural);    // Making the line curvy

    // Add the line to the svg
    svg.append("path")
        .datum(data)
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "steelblue");

});