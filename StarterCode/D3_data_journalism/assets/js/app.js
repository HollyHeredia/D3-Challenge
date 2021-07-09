function makeResponsive() {

// if the SVG area isn't empty when the browser loads, remove it
  // and replace it with a resized version of the chart
  var svgArea = d3.select("scatter").select("svg");
  if (!svgArea.empty()) {
    svgArea.remove();
  }
  // SVG wrapper dimensions are determined by the current width
  // and height of the browser window.
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

   // append svg and group
    var svg = d3.select("scatter")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);
  
    // Append an SVG group
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Initial Params
    var chosenXAxis = "healthcare";

    // function used for updating x-scale var upon click on axis label
    function xScale(censusData, chosenXAxis) {
    // create scales
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
            d3.max(censusData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

// function used for updating xAxis var upon click on axis label  
    function renderAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);
      
        xAxis.transition()
          .duration(1000)
          .call(bottomAxis);
      
        return xAxis;
      }
      
      // function used for updating circles group with a transition to
      // new circles
      function renderCircles(circlesGroup, newXScale, chosenXAxis) {
      
        circlesGroup.transition()
          .duration(1000)
          .attr("cx", d => newXScale(d[chosenXAxis]));
      
        return circlesGroup;
      }
      
      // function used for updating circles group with new tooltip
      function updateToolTip(chosenXAxis, circlesGroup) {
      
        var label;
      
        if (chosenXAxis === "smokes") {
          label = "Smokes:";
        }
        else {
          label = "Error:";
        }
      
        var toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([80, -60])
          .html(function(d) {
            return (`${d.state}<br>${income} ${d[chosenXAxis]}`);
          });
      
        circlesGroup.call(toolTip);
      
        circlesGroup.on("mouseover", function(data) {
          toolTip.show(data);
        })
          // onmouseout event
          .on("mouseout", function(data, index) {
            toolTip.hide(data);
          });
      
        return circlesGroup;
      }


    // Read data
    d3.csv("./data/data.csv").then(function(censusData,err) {
        if (err) throw err;
        
        censusData.forEach(function(data) {
        //parse data -- name columns for later use
        d.poverty = //cast decimal
        d.age = //cast decimal
        d.ageMoe = //cast decimal
        d.income = +d.income
        d.incomeMoe = +d.incomeMoe
        d.healthcare = //cast decimal
        d.healthcareLow = //cast deimal
        d.healthcareHigh = //cast decimal
        d.obesity = //cast decimal
        d.obesityLow = //cast decimal
        d.obesityHigh = //cast decimal
        d.smokes = //cast decimal
        d.smokesLow = //cast decimal
        d.smokesHigh = //cast decimal
        });

      // xLinearScale function above csv import
  var xLinearScale = xScale(CensusData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(CensusData, d => d.poverty)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", 5)
    .attr("fill", "blue")

 // Create group for two x-axis labels
 var labelsGroup = chartGroup.append("g")
 .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var healthcareLabel = labelsGroup.append("text")
 .attr("x", 0)
 .attr("y", 20)
 .attr("value", "healthcare") // value to grab for event listener
 .classed("active", true)
 .text("% of People with Healthcare)");

  var smokesLabel = labelsGroup.append("text")
 .attr("x", 0)
 .attr("y", 40)
 .attr("value", "smokes") // value to grab for event listener
 .classed("inactive", true)
 .text("% of People Who Smoke");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Poverty");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup)

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {
          // replaces chosenXAxis with value
        chosenXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
};

