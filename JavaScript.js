let data;
var width = 800,
    height = 400,
    barWidth = width / 275;

// Create an XMLHttpRequest object
const req = new XMLHttpRequest();

// Define a callback function
req.onload = function () {
    data = JSON.parse(req.responseText);
};

// Send a request
req.open("GET", 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
req.send();



const dataset = [12, 31, 22, 17, 25, 18, 29, 14, 9];


var svgContainer = d3
    .select('#chartContainer')
    .append('svg')
    .attr('width', width + 100)
    .attr('height', height + 60);


// Preparing data **********************************************************************************************************************
var years = data.map(function (item) {
    var quarter;
    var temp = item[0].substring(5, 7);

    if (temp === '01') {
        quarter = 'Q1';
    } else if (temp === '04') {
        quarter = 'Q2';
    } else if (temp === '07') {
        quarter = 'Q3';
    } else if (temp === '10') {
        quarter = 'Q4';
    }
    return item[0].substring(0, 4) + ' ' + quarter; // "1980 Q2" expression
});

var yearsDate = data.map(function (item) {
    return new Date(item[0]);
});

var GDP = data.map(function (item) {
    return item[1];
});

// ***************************************
var scaledGDP = [];

var gdpMax = d3.max(GDP);

var linearScale = d3.scaleLinear().domain([0, gdpMax]).range([0, height]);

scaledGDP = GDP.map(function (item) {
    return linearScale(item);
});

// Axis **********************************
var yAxisScale = d3.scaleLinear().domain([0, gdpMax]).range([height, 0]);
var yAxis = d3.axisLeft(yAxisScale);

var xMax = new Date(d3.max(yearsDate));
xMax.setMonth(xMax.getMonth() + 3);
var xScale = d3
    .scaleTime()
    .domain([d3.min(yearsDate), xMax])
    .range([0, width]);

var xAxis = d3.axisBottom().scale(xScale);

// ****************************************************************************************************************************************





svgContainer.select("svg")
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    //Two arguments, one for the data point itself (d) and one for the index of the data point in the array (i).
    .attr("x", (d, i) => i * 30)
    .attr("y", (d, i) => height - 3 * d)
    .attr("width", 25)
    .attr("height", (d, i) => d * 3)
    .attr("fill", "navy");








