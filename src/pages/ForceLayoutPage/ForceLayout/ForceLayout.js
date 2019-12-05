import React, {Component} from "react";
import * as d3 from 'd3'
import "./ForceLayout.scss";
import brandData from '../../../data/type_by_brand2.csv';

class ForceLayout extends Component {
  constructor(props){
     super(props)
     this.createForce = this.createForce.bind(this)
  }
  componentDidMount() {
    this.createForce();
  }
  componentDidUpdate() {
     this.createForce();
  }
  // Code was refactored from: https://github.com/vlandham/bubble_chart_v4
  createForce() {
    var node = this.node;

    var tooltip = d3.select(node)
                    .append("div")
                    .attr("class", "forcetooltip")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .text("a simple tooltip");

    // Creates a bubble chart
    function bubbleChart() {
      // Constants for sizing
      var width = 1200;
      var height = 600;

      // Locations to move bubbles towards, depending
      // on which view mode is selected.
      var center = { x: width / 2, y: height / 2 };

      var yearCenters = {
        "Bowl": { x: width * (1/8), y: height / 2 , title: "B O W L"},
        "Cup":  { x: width * (3/8), y: height / 2 , title: "C U P"},
        "Pack": { x: width * (5/8), y: height / 2 , title: "P A C K"},
        "Tray": { x: width * (7/8), y: height / 2 , title: "T R A Y"},
      };

      // X locations of the year titles.
      var yearsTitleX = {
        "Bowl": width * (1/8) - 65,
        "Cup": width * (3/8) - 40,
        "Pack": width * (5/8) + 20,
        "Tray": width * (7/8) + 70
      };

      // @v4 strength to apply to the position forces
      var forceStrength = 0.03;

      // These will be set in create_nodes and create_vis
      var svg = null;
      var bubbles = null;
      var nodes = [];

      // Computes force strength
      function charge(d) {
        return -Math.pow(d.radius, 2.0) * forceStrength;
      }

      // Instantiate force simulation
      var simulation = d3.forceSimulation()
        .velocityDecay(0.2)
        .force('x', d3.forceX().strength(forceStrength).x(center.x))
        .force('y', d3.forceY().strength(forceStrength).y(center.y))
        .force('charge', d3.forceManyBody().strength(charge))
        .on('tick', ticked);

      simulation.stop();

      // Color scale
      var fillColor = d3.scaleOrdinal()
        .domain(['low', 'medium', 'high'])
        .range(["#826A6A", "#FFBC03", "#BA5900", "#F26C6C"]);

      // Creates nodes for layout
      function createNodes(rawData) {

        // Some additional data cleanup
        rawData = rawData.filter(function(el) { return !el["Brand"].includes("Total") });
        rawData = rawData.filter(function(el) { 
          let VALID = ["Cup", "Bowl", "Tray", "Pack"];
          if (VALID.includes(el["Type"])){
            return true;
          } 
          return false
       });

        var maxAmount = d3.max(rawData, function (d) { return +parseInt(d["Count"]); });

        // Size of bubbles
        var radiusScale = d3.scalePow()
          .exponent(0.5)
          .range([2, 45])
          .domain([0, maxAmount]);

        // Creating node data from raw
        var myNodes = rawData.map(function (d) {
          return {
            id: d["Brand"],
            radius: radiusScale(+parseInt(d["Count"])),
            value: +parseInt(d["Count"]),
            name: d["Brand"],
            type: d["Type"],
            x: Math.random() * 900,
            y: Math.random() * 800
          };
        });

        // Sort to prevent occlusion of smaller nodes
        myNodes.sort(function (a, b) { return b.value - a.value; });

        return myNodes;
      }

      var chart = function chart(selector, rawData) {

        nodes = createNodes(rawData);

        // Instantiate the svg
        svg = d3.select(selector)
          .append('svg')
          .attr('width', width)
          .attr('height', height);

        // Bind nodes data to what will become DOM elements to represent them.
        bubbles = svg.selectAll('.bubble')
                     .data(nodes, function (d) { return d.id; });

        // Create the bubbles
        var bubblesE = bubbles.enter().append('circle')
          .classed('bubble', true)
          .attr('r', 0)
          .attr('fill', function (d) { return fillColor(d.type); })
          .attr('stroke', function (d) { return d3.rgb(fillColor(d.type)).darker(); })
          .attr('stroke-width', 2)
          .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
          .on('mouseover', function(d, i) {
            d3.select(this)
              .style('fill', "white");

            tooltip.transition()		
              .duration(200)		
              .style("opacity", .9);	

            let string = `<h5><b>Manufacturer:</b> ${d.name}</h5>
                          <p>Makes <font color="red">${d.value}</font> ${d.type}s</p>`;

            tooltip.html(string)	
                    .style("left", (d3.event.pageX + 10) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px")
                    .style("display", "block");	
          })
          .on("mousemove", function(){
            tooltip.style("top", (d3.event.pageY - 28)+"px")
                   .style("left",(d3.event.pageX + 10)+"px");
          })
          .on('mouseout', function(d, i) {

            d3.select(this).style('fill', fillColor(d.type));

            tooltip.html("HELLO")	
            .style("display", "none");	
          });

        // Merge the original empty selection and the enter selection
        bubbles = bubbles.merge(bubblesE);

        // Bubble transition
        bubbles.transition()
          .duration(2000)
          .attr('r', function (d) { return d.radius; });

        // Run simulation
        simulation.nodes(nodes);

        // Legend constants
        var legendData = [{"Type": "Bowl", "Color": "#F5BF42"},
                          {"Type": "Cup", "Color": "#E17470"},
                          {"Type": "Pack", "Color": "#7E6B6B"},
                          {"Type": "Tray", "Color": "#AE5F22"}];  
        var xBuffer = width*0.1;

        // Add legend circles
        svg
          .selectAll("legend")
          .data(legendData)
          .enter()
          .append("circle")
            .attr("class", "legendCircle")
            .attr("cx", function(d,i){
              return xBuffer;
            })
            .attr("cy", function(d,i){ 
              return 30 * (i+1) + 100;
            })
            .attr("r",10)
            .style("fill", function(d) {
              return d["Color"];
            })

        // Add legend labels
        svg
          .selectAll("legend")
          .data(legendData)
          .enter()
          .append("text")
            .attr("class", "legendText")
            .attr('x', xBuffer+20)
            .attr('y', function(d, i){ 
              return 30 * (i+1) + 100;
            })
            .text( function(d){ return d["Type"].toUpperCase() } )
            .style("font-size", 13)
            .attr('alignment-baseline', 'middle')
            .style('fill', 'white')

        // Set initial layout to single group.
        groupBubbles();
      };

      // Drag functions used for interactivity
      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      function ticked() {
        bubbles
          .attr('cx', function (d) { return d.x; })
          .attr('cy', function (d) { return d.y; });
      }

      // Position of the four group nodes
      function nodeYearPos(d) {
        return yearCenters[d.type].x;
      }

      // Sets viz to be unsorted version
      function groupBubbles() {
        hideYearTitles();
        simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));
        simulation.alpha(1).restart();
      }


      // Sets viz to sorted version
      function splitBubbles() {
        showYearTitles();
        simulation.force('x', d3.forceX().strength(forceStrength).x(nodeYearPos));
        simulation.alpha(1).restart();
      }

      // Hide displays on sorted version
      function hideYearTitles() {
        svg.selectAll('.year').remove();
        d3.selectAll(".legendCircle").attr("display", "block");
        d3.selectAll(".legendText").attr("display", "block");
      }

      // Show sorted headers
      function showYearTitles() {
        var yearsData = d3.keys(yearsTitleX);
        var years = svg.selectAll('.year')
          .data(yearsData);

        years.enter().append('text')
          .attr('class', 'year')
          .attr('x', function (d) { return yearsTitleX[d]; })
          .attr('y', height-40)
          .attr('text-anchor', 'middle')
          .style("fill", function(d, i) {
            return fillColor(d);
          })
          .style("font-size", 20)
          .text(function (d) { return yearCenters[d].title; });

        d3.selectAll(".legendCircle").attr("display", "none");
        d3.selectAll(".legendText").attr("display", "none");
      }

      // Toggles display based on button id
      chart.toggleDisplay = function (displayName) {
        if (displayName === 'year') {
          splitBubbles();
        } else {
          groupBubbles();
        }
      };

      return chart;
    }

    var myBubbleChart = bubbleChart();

    function display(error, data) {
      if (error) {
        console.log(error);
      }

      myBubbleChart(node, data);
    }

    // Setting up the toggle buttons
    function setupButtons() {
      d3.select('#toolbar')
        .selectAll('.button')
        .on('click', function () {
          // Remove active class from all buttons
          d3.selectAll('.button').classed('active', false);
          // Find the button just clicked
          var button = d3.select(this);

          // Set it as the active button
          button.classed('active', true);

          // Get the id of the button
          var buttonId = button.attr('id');

          // Toggle the bubble chart based on
          // the currently clicked button.
          myBubbleChart.toggleDisplay(buttonId);
        });
    }

    // Load the data.
    d3.csv(brandData, display);
    setupButtons();
  }
  render() {
    return (
      <div>
        <div id="toolbar">
          <button id="all" className="leftButton button active">UNSORTED</button>
          <button id="year" className="rightButton button" >SORTED</button>
        </div>
        <div id = "#ForceChart" ref={node => this.node = node}>
         </div>
     </div>
    )
 }
}

export default ForceLayout;