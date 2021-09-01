// eslint-disable-next-line no-unused-vars
const projectName = 'bar-chart';


var width = 800,
    height = 400,
    barWidth = width/275;
const padding = 60;

var svgContainer = d3
    .select('#chartContainer')
    .append('svg')
    .attr('width', width + 100)
    .attr('height', height + 60);

var tooltip = d3
    .select('#chartContainer')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0);

var overlay = d3
    .select('#chartContainer')
    .append('div')
    .attr('class', 'overlay')
    .style('opacity', 0);

    

//const dataset = [12, 31, 22, 17, 25, 18, 29, 14, 9];


/*svgContainer.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    //Two arguments, one for the data point itself (d) and one for the index of the data point in the array (i).
    .attr("x", (d, i) => i * 30)
    .attr("y", (d, i) => height - 3 * d)
    .attr("width", 25)
    .attr("height", (d, i) => d * 3)
    .attr("fill", "navy");
*/







d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function (e, data) {


    svgContainer
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -200)
    .attr('y', 80)
    .text('Gross Domestic Product');

    svgContainer
      .append('text')
      .attr('x', width / 2 + 120)
      .attr('y', height + 50)
      .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
      .attr('class', 'info');

    var years = data.data.map(function (item) {
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
        return item[0].substring(0, 4) + ' ' + quarter;
    });

    var yearsDate = data.data.map(function (item) {
        return new Date(item[0]);
    });

    var xScale = d3.scaleTime()
        .domain([d3.min(yearsDate), d3.max(yearsDate)])
        .range([0, width]);

    var xAxis = d3.axisBottom().scale(xScale);

    svgContainer
        .append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(60, 400)');


    // GDP *******************************************************************************
    var GDP = data.data.map(function (item) {
        return item[1];
    });

    gdpMax = d3.max(GDP)
    var linearScale = d3.scaleLinear()
        .domain([0, gdpMax])        //input values go from X1 to Xn
        .range([0, height]);            //range where the values are displayed

    var scaledGDP = GDP.map(function (item) {
        return linearScale(item);
    });
    //*********************************************************************************** */


    var yAxisScale = d3.scaleLinear()
        .domain([0, gdpMax])
        .range([height, 0]);
    var yAxis = d3.axisLeft(yAxisScale);

    svgContainer
        .append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(60, 0)');


    d3.select('svg')
        .selectAll('rect')
        .data(scaledGDP)
        .enter()
        .append('rect')
        .attr('data-date', function (d, i) {
            return data.data[i][0];
        })
        .attr('data-gdp', function (d, i) {
            return data.data[i][1];
        })
        .attr('class', 'bar')
        .attr('x', function (d, i) {
            return xScale(yearsDate[i]);
        })
        .attr('y', function (d) {
            return height - d;
        })
        .attr('width', barWidth)
        .attr('height', function (d) {
            return d;
        })
        .style('fill', '#33adff')
        .attr('transform', 'translate(60, 0)')
        .on('mouseover', function (d, i) {
            overlay
                .transition()
                .duration(0)
                .style('height', d + 'px')
                .style('width', barWidth + 'px')
                .style('opacity', 0.9)
                .style('left', i * barWidth + 0 + 'px')
                .style('top', height - d + 'px')
                .style('transform', 'translateX(60px)');
            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip
                .html(
                    years[i] +
                    '<br>' +
                    '$' +
                    GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') +
                    ' Billion'
                )
                .attr('data-date', data.data[i][0])
                .style('left', i * barWidth + 30 + 'px')
                .style('top', height - 100 + 'px')
                .style('transform', 'translateX(60px)');
        })
        .on('mouseout', function () {
            tooltip.transition().duration(200).style('opacity', 0);
            overlay.transition().duration(200).style('opacity', 0);
        });


})