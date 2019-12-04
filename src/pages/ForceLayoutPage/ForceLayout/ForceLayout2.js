import React, {Component} from "react";
import * as d3 from 'd3'
import {scale} from 'd3-scale';
import "./ForceLayout.scss";
import brandData from '../../../data/type_by_brand2.csv';
import testData from '../../../data/gates_money.csv';

class ForceLayout2 extends Component {
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
  createForce() {
    var node = this.node;

    var tooltip = d3.select(node)
                    .append("div")
                    .attr("class", "forcetooltip")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .text("a simple tooltip");

    /* bubbleChart creation function. Returns a function that will
    * instantiate a new bubble chart given a DOM element to display
    * it in and a dataset to visualize.
    *
    * Organization and style inspired by:
    * https://bost.ocks.org/mike/chart/
    *
    */
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

      // Charge function that is called for each node.
      // As part of the ManyBody force.
      // This is what creates the repulsion between nodes.
      //
      // Charge is proportional to the diameter of the
      // circle (which is stored in the radius attribute
      // of the circle's associated data.
      //
      // This is done to allow for accurate collision
      // detection with nodes of different sizes.
      //
      // Charge is negative because we want nodes to repel.
      // @v4 Before the charge was a stand-alone attribute
      //  of the force layout. Now we can use it as a separate force!
      function charge(d) {
        return -Math.pow(d.radius, 2.0) * forceStrength;
      }

      // Here we create a force layout and
      // @v4 We create a force simulation now and
      //  add forces to it.
      var simulation = d3.forceSimulation()
        .velocityDecay(0.2)
        .force('x', d3.forceX().strength(forceStrength).x(center.x))
        .force('y', d3.forceY().strength(forceStrength).y(center.y))
        .force('charge', d3.forceManyBody().strength(charge))
        .on('tick', ticked);

      // @v4 Force starts up automatically,
      //  which we don't want as there aren't any nodes yet.
      simulation.stop();

      // Nice looking colors - no reason to buck the trend
      // @v4 scales now have a flattened naming scheme
      var fillColor = d3.scaleOrdinal()
        .domain(['low', 'medium', 'high'])
        .range(["#826A6A", "#FFBC03", "#BA5900", "#F26C6C"]);

      /*
      * This data manipulation function takes the raw data from
      * the CSV file and converts it into an array of node objects.
      * Each node will store data and visualization values to visualize
      * a bubble.
      *
      * rawData is expected to be an array of data objects, read in from
      * one of d3's loading functions like d3.csv.
      *
      * This function returns the new node array, with a node in that
      * array for each element in the rawData input.
      */
      function createNodes(rawData) {

        rawData = rawData.filter(function(el) { return !el["Brand"].includes("Total") });
        rawData = rawData.filter(function(el) { 
          let VALID = ["Cup", "Bowl", "Tray", "Pack"];
          if (VALID.includes(el["Type"])){
            return true;
          } 
          return false
       });
        // Use the max total_amount in the data as the max in the scale's domain
        // note we have to ensure the total_amount is a number.
        var maxAmount = d3.max(rawData, function (d) { return +parseInt(d["Count"]); });

        // Sizes bubbles based on area.
        // @v4: new flattened scale names.
        var radiusScale = d3.scalePow()
          .exponent(0.5)
          .range([2, 45])
          .domain([0, maxAmount]);

        // Use map() to convert raw data into node data.
        // Checkout http://learnjsdata.com/ for more on
        // working with data.
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

        // sort them to prevent occlusion of smaller nodes.
        myNodes.sort(function (a, b) { return b.value - a.value; });

        return myNodes;
      }

      /*
      * Main entry point to the bubble chart. This function is returned
      * by the parent closure. It prepares the rawData for visualization
      * and adds an svg element to the provided selector and starts the
      * visualization creation process.
      *
      * selector is expected to be a DOM element or CSS selector that
      * points to the parent element of the bubble chart. Inside this
      * element, the code will add the SVG continer for the visualization.
      *
      * rawData is expected to be an array of data objects as provided by
      * a d3 loading function like d3.csv.
      */
      var chart = function chart(selector, rawData) {
        // convert raw data into nodes data
        nodes = createNodes(rawData);

        // Create a SVG element inside the provided selector
        // with desired size.
        svg = d3.select(selector)
          .append('svg')
          .attr('width', width)
          .attr('height', height);

        // Bind nodes data to what will become DOM elements to represent them.
        bubbles = svg.selectAll('.bubble')
          .data(nodes, function (d) { return d.id; });

        // Create new circle elements each with class `bubble`.
        // There will be one circle.bubble for each object in the nodes array.
        // Initially, their radius (r attribute) will be 0.
        // @v4 Selections are immutable, so lets capture the
        //  enter selection to apply our transtition to below.
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

        // @v4 Merge the original empty selection and the enter selection
        bubbles = bubbles.merge(bubblesE);

        // Fancy transition to make bubbles appear, ending with the
        // correct radius
        bubbles.transition()
          .duration(2000)
          .attr('r', function (d) { return d.radius; });

        // Set the simulation's nodes to our newly created nodes array.
        // @v4 Once we set the nodes, the simulation will start running automatically!
        simulation.nodes(nodes);

        // Add legend: circles
        var xCircle = 40
        var xLabel = 90
        var legendData = [{"Type": "Bowl", "Color": "#F5BF42"},
                          {"Type": "Cup", "Color": "#E17470"},
                          {"Type": "Pack", "Color": "#7E6B6B"},
                          {"Type": "Tray", "Color": "#AE5F22"}];  
        var xBuffer = width*0.1;

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

        // Add legend: labels
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

      /*
      * Callback function that is called after every tick of the
      * force simulation.
      * Here we do the acutal repositioning of the SVG circles
      * based on the current x and y values of their bound node data.
      * These x and y values are modified by the force simulation.
      */
      function ticked() {
        bubbles
          .attr('cx', function (d) { return d.x; })
          .attr('cy', function (d) { return d.y; });
      }

      /*
      * Provides a x value for each node to be used with the split by year
      * x force.
      */
      function nodeYearPos(d) {
        return yearCenters[d.type].x;
      }


      /*
      * Sets visualization in "single group mode".
      * The year labels are hidden and the force layout
      * tick function is set to move all nodes to the
      * center of the visualization.
      */
      function groupBubbles() {
        hideYearTitles();

        // @v4 Reset the 'x' force to draw the bubbles to the center.
        simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));

        // @v4 We can reset the alpha value and restart the simulation
        simulation.alpha(1).restart();
      }


      /*
      * Sets visualization in "split by year mode".
      * The year labels are shown and the force layout
      * tick function is set to move nodes to the
      * yearCenter of their data's year.
      */
      function splitBubbles() {
        showYearTitles();

        // @v4 Reset the 'x' force to draw the bubbles to their year centers
        simulation.force('x', d3.forceX().strength(forceStrength).x(nodeYearPos));

        // @v4 We can reset the alpha value and restart the simulation
        simulation.alpha(1).restart();
      }

      /*
      * Hides Year title displays.
      */
      function hideYearTitles() {
        svg.selectAll('.year').remove();

        d3.selectAll(".legendCircle").attr("display", "block");
        d3.selectAll(".legendText").attr("display", "block");
      }

      /*
      * Shows Year title displays.
      */
      function showYearTitles() {
        // Another way to do this would be to create
        // the year texts once and then just hide them.
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

      /*
      * Externally accessible function (this is attached to the
      * returned chart function). Allows the visualization to toggle
      * between "single group" and "split by year" modes.
      *
      * displayName is expected to be a string and either 'year' or 'all'.
      */
      chart.toggleDisplay = function (displayName) {
        if (displayName === 'year') {
          splitBubbles();
        } else {
          groupBubbles();
        }
      };


      // return the chart function from closure.
      return chart;
    }

    /*
    * Below is the initialization code as well as some helper functions
    * to create a new bubble chart instance, load the data, and display it.
    */

    var myBubbleChart = bubbleChart();

    /*
    * Function called once data is loaded from CSV.
    * Calls bubble chart function to display inside #vis div.
    */
    function display(error, data) {
      if (error) {
        console.log(error);
      }

      myBubbleChart(node, data);
    }

    /*
    * Sets up the layout buttons to allow for toggling between view modes.
    */
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
    /*
    * Helper function to convert a number into a string
    * and add commas to it to improve presentation.
    */
    function addCommas(nStr) {
      nStr += '';
      var x = nStr.split('.');
      var x1 = x[0];
      var x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }

      return x1 + x2;
    }

    // Load the data.
    d3.csv(brandData, display);
    setupButtons();
  }
  render() {
    return (
      <div>
        <div id="toolbar">
          <button id="all" class="leftButton button active">UNSORTED</button>
          <button id="year" class="rightButton button" >SORTED</button>
        </div>
        <div id = "#ForceChart" ref={node => this.node = node}>
         </div>
     </div>
    )
 }
}

export default ForceLayout2;