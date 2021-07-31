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
    // percentage obese
    else if (chosenYAxis === 'obesity') {
        var yLabel = "Obesity:"
    }
    // smoking percentage
    else {
        var yLabel = "Smokers:"
    }

    // create tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
            return (`${d.state}<br>${xLabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}%`);
        });

  circlesGroup.call(toolTip);

  // add events
  circlesGroup.on("mouseover", toolTip.show)
  // onmouseout event
  .on("mouseout", toolTip.hide(data);

  return circlesGroup;
}

// Read data
d3.csv("./assets/data/data.csv").then(function(censusData) {

  console.log(censusData);

  //parse data
  censusData.forEach(function(data) {
      data.obesity = +data.obesity;
      data.income = +data.income;
      data.smokes = +data.smokes;
      data.age = +data.age;
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
  });

  // create linear scales
  var xLinearScale = xScale(censusData, chosenXAxis);
  var yLinearScale = yScale(censusData, chosenYAxis);

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
    .attr("r", 12)
    .attr("fill", "blue")
    .attr("opacity", ".5");

  // append initial text for states
  var textGroup = chartGroup.selectAll(".stateText")
        .data(censusData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("dy", 3)
        .attr("font-size", "10px")
        .text(function(d){return d.abbr});


  // Create group for 3 x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);

  var povertyLabel = xLabelsGroup.append("text")
    .classed("aText", true)
    .classed("active", true)
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty")
    .text("In Poverty (%)");

  var ageLabel = xLabelsGroup.append("text")
    .classed("aText", true)
    .classed("inactive", true)
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age")
    .text("Age (Median)")

  var incomeLabel = xLabelsGroup.append("text")
    .classed("aText", true)
    .classed("inactive", true)
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income")
    .text("Household Income (Median)")

  // append y axis
  var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left/4}, ${(height/2)})`);

        var healthcareLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 0 - 20)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "healthcare")
        .text("Lacks Healthcare (%)");

    var smokesLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 40)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "smokes")
        .text("Smokes (%)");

    var obesityLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 60)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "obesity")
        .text("Obese (%)");  

  // updateToolTip function with data
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {
        // replaces chosenXAxis with value
        chosenXAxis = value;
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);
        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);
        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        // change classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel.classed("active", true).classed("inactive", false);
          ageLabel.classed("active", false).classed("inactive", true);
          incomeLabel.classed("active", false).classed("inactive", true);
        }
        else if (chosenXAxis === "age") {
            povertyLabel.classed("active", false).classed("inactive", true);
            ageLabel.classed("active", true).classed("inactive", false);
            incomeLabel.classed("active", false).classed("inactive", true);
        }
        else {
            povertyLabel.classed("active", false).classed("inactive", true);
            ageLabel.classed("active", false).classed("inactive", true);
            incomeLabel.classed("active", true).classed("inactive", false);
          }
      }
    });

    // y axis labels event listener
    labelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {
        // replaces chosenXAxis with value
        chosenYAxis = value;
        // updates x scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);
        // updates x axis with transition
        yAxis = renderAxes(yLinearScale, yAxis);
        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        // change classes to change bold text
        if (chosenYAxis === "obesity") {
          obesityLabel.classed("active", true).classed("inactive", false);
          smokesLabel.classed("active", false).classed("inactive", true);
          healthcareLabel.classed("active", false).classed("inactive", true);
        }
        else if (chosenYAxis === "smokes") {
          obesityLabel.classed("active", false).classed("inactive", false);
          smokesLabel.classed("active", true).classed("inactive", true);
          healthcareLabel.classed("active", false).classed("inactive", true);;
        }
        else {
          obesityLabel.classed("active", false).classed("inactive", false);
          smokesLabel.classed("active", false).classed("inactive", true);
          healthcareLabel.classed("active", true).classed("inactive", true);;
          }
      }
    });
//     }).catch(function (error) {
//       console.log(error)
//     });
// });
