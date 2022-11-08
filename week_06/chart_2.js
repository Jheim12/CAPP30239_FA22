/* Horizontal bar chart for COVID country cases */

d3.csv("cleaned_data.csv").then(data => { //promise controls the flow, get the data and do everthing else

    // for (let d of data) {
    //     d.Percentage = +d.Percentage; //force a number, converts string to integer. D is each row of the data (cases is name of column)
    // };

    data.sort((a, b) => b.Percentage - a.Percentage); //from bigger to smaller, we could also order by country

    const height = 600,
          width = 800,
          margin = ({ top: 25, right: 100, bottom: 50, left: 150 });

    let svg = d3.select("#chart_2")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); // for resizing element in browser

    let x = d3.scaleLinear()
        .domain([0, 100]).nice() //we've flipped the axes to horizontal
        .range([margin.left, width - margin.right]);
    
    let y = d3.scaleBand()
        .domain(data.map(d => d.NameState)) 
        .range([margin.top, height - margin.bottom]) 
        .padding(0.1);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`) // move location of axis
        .call(d3.axisBottom(x)); 
    
    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y));

    let bar = svg.selectAll(".bar") // create bar groups
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");

    bar.append("rect") // add rect to bar group
        .attr("fill", "steelblue")
        .attr("x", margin.left)
        .attr("width", d => x(d.Percentage) - x(0))
        .attr("y", d => y(d.NameState))
        .attr("height", y.bandwidth());
    
    bar.append('text') // add labels
        .text(d => d.Total)
        .attr('x', d => margin.left + x(d.Percentage) - x(0) + 20)
        .attr('y', d => y(d.NameState) + (y.bandwidth()/2))
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('style', "font-size: 10px") 
        .style('fill', 'black');

    svg.append("text") //text outside the bar
    .attr("class", "x-label")
    .attr("text-anchor", "end")
    .attr('x', width - margin.right)
    .attr("y", height)
    .text("Percentage Total %")

});