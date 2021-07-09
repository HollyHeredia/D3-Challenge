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

// Read data
    d3.csv("./data/data.csv").then(function(censusData) {
        console.log(censusData);
        //name columns for later use
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

    // append svg and group
    var svg = d3.select("scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    

    
};

