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
  top: 20,
  right: 40,
  bottom: 200,
  left: 100
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

//append a div classed chart to the scatter element
var chart = d3.select("#scatter")
  .append("div")
  .classed("chart", true);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//initial Parameters
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

//function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
      .duration(1000)
      .call(bottomAxis);

  return xAxis;
}

//function used for updating yAxis var upon click on axis label
function renderAxesY(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
      .duration(1000)
      .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", data => newXScale(data[chosenXAxis]))
    .attr("cy", data => newYScale(data[chosenYAxis]));

  return circlesGroup;
}

//function used for updating state labels with a transition to new 
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));

  return textGroup;
}

// function to stylize x-axis values for tooltips
function styleX(value, chosenXAxis) {

    //stylize based on variable chosen
    //poverty percentage
    if (chosenXAxis === 'poverty') {
      return `${value}%`;
  }
    //household income in dollars
    else if (chosenXAxis === 'income') {
        return `$${value}`;
    }
    //age (number)
    else {
        return `${value}`;
    }
}
  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    //select x label
    //poverty percentage
    if (chosenXAxis === 'poverty') {
        var xLabel = "Poverty:";
    }
    //household income in dollars
    else if (chosenXAxis === 'income') {
        var xLabel = "Median Income:";
    }
    //age (number)
    else {
        var xLabel = "Age:";
    }

    //select y label
    //percentage lacking healthcare
    if (chosenYAxis === 'healthcare') {
        var yLabel = "No Healthcare:"
    }
    //percentage obese
    else if (chosenYAxis === 'obesity') {
        var yLabel = "Obesity:"
    }
    //smoking percentage
    else {
        var yLabel = "Smokers:"
    }

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Read data
d3.csv("data.csv", function(data){
  d.poverty = +data.poverty;
  d.healthcare = +data.healthcare;
  return data;
}).then(function(data) {
  console.log(data);

  // // xLinearScale function above csv import
  // var xLinearScale = xScale(CensusData, chosenXAxis);

  // // Create y scale function
  // var yLinearScale = d3.scaleLinear()
  //   .domain([0, d3.max(CensusData, d => d.poverty)])
  //   .range([height, 0]);

//   // Create initial axis functions
//   var bottomAxis = d3.axisBottom(xLinearScale);
//   var leftAxis = d3.axisLeft(yLinearScale);

//   // append x axis
//   var xAxis = chartGroup.append("g")
//     .classed("x-axis", true)
//     .attr("transform", `translate(0, ${height})`)
//     .call(bottomAxis);

//   // append y axis
//   chartGroup.append("g")
//     .call(leftAxis);

//   // append initial circles
//   var circlesGroup = chartGroup.selectAll("circle")
//     .data(censusData)
//     .enter()
//     .append("circle")
//     .attr("cx", d => xLinearScale(d[chosenXAxis]))
//     .attr("cy", d => yLinearScale(d.poverty))
//     .attr("r", 5)
//     .attr("fill", "blue")

//   // Create group for two x-axis labels
//   var labelsGroup = chartGroup.append("g")
//     .attr("transform", `translate(${width / 2}, ${height + 20})`);

//   var healthcareLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 20)
//     .attr("value", "healthcare") // value to grab for event listener
//     .classed("active", true)
//     .text("% of People with Healthcare)");

//   var smokesLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 40)
//     .attr("value", "smokes") // value to grab for event listener
//     .classed("inactive", true)
//     .text("% of People Who Smoke");

//   // append y axis
//   chartGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "1em")
//     .classed("axis-text", true)
//     .text("Poverty");

//   // updateToolTip function above csv import
//   var circlesGroup = updateToolTip(chosenXAxis, circlesGroup)

//   // x axis labels event listener
//   labelsGroup.selectAll("text")
//     .on("click", function () {
//       // get value of selection
//       var value = d3.select(this).attr("value");
//       if (value !== chosenXAxis) {
//         // replaces chosenXAxis with value
//         chosenXAxis = value;

//         // functions here found above csv import
//         // updates x scale for new data
//         xLinearScale = xScale(censusData, chosenXAxis);

//         // updates x axis with transition
//         xAxis = renderAxes(xLinearScale, xAxis);

//         // updates circles with new x values
//         circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

//         // updates tooltips with new info
//         circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

//         // changes classes to change bold text
//         if (chosenXAxis === "healthcare") {
//           smokesLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           healthcareLabel
//             .classed("active", false)
//             .classed("inactive", true);
//         }
//         else {
//           smokesLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           healthcareLabel
//             .classed("active", true)
//             .classed("inactive", false);
//         }
//       };
//     }).catch(function (error) {
//       console.log(error)
//     });
// });
