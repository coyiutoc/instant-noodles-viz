import React, {Component} from "react";
import * as d3 from 'd3'
import {scale} from 'd3-scale';
import brandData from '../../../data/type_by_brand.csv';

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
  createForce() {

    var node = this.node;
    var container = d3.select(node);

    var tooltip = d3.select(".force-container")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .text("a simple tooltip");

    var width = d3.select(node).node().parentNode.parentNode.getBoundingClientRect().width, 
        height = d3.select(node).node().parentNode.parentNode.getBoundingClientRect().height, 
        nodePadding = 2.5;

    var svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var color = {"Bowl": "#826A6A", "Cup":"#FFBC03", "Pack":"#BA5900", "Tray":"#F26C6C"};

    var simulation = d3.forceSimulation()
        .force("forceX", d3.forceX().strength(.1).x(width * .5))
        .force("forceY", d3.forceY().strength(.1).y(height * .5))
        .force("center", d3.forceCenter().x(width * .5).y(height * .5))
        .force("charge", d3.forceManyBody().strength(-15));

    d3.csv(brandData, types, function(error, graph){
      if (error) throw error;

      // sort the nodes so that the bigger ones are at the back
      graph = graph.sort(function(a,b){ return b["Count"] - a["Count"]; });

      //update the simulation based on the data
      simulation
          .nodes(graph)
          .force("collide", d3.forceCollide().strength(.9).radius(function(d){ return d.radius + nodePadding; }).iterations(1))
          .on("tick", function(d){
            node
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; })
          });

      var node = svg.append("g")
          .attr("class", "node")
          .selectAll("circle")
          .data(graph)
          .enter().append("circle")
            .attr("r", function(d) { return d.radius; })
            .attr("fill", function(d) { return color[d["Type"]]; })
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .on('mouseover', function(d, i) {
                d3.select(this)
                  .style('fill', "red");
  
                tooltip.transition()		
                  .duration(200)		
                  .style("opacity", .9);	
  
                let string = `<h5>${d["Brand"]}</h5>
                              <b>${d["Count"]} ${d["Type"]}</b> varieties`;
  
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
                
              d3.select(this).style('fill', function(d) {
                return color[d["Type"]]
              });
              tooltip.html("")	
                     .style("display", "none");	
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

      // --------------- //
      // ADD LEGEND //
      // --------------- //

      // Add legend: circles
      var xCircle = 40
      var xLabel = 90
      var legendData = [{"Type": "Bowl", "Color": "#826A6A"},
                        {"Type": "Cup", "Color": "#FFBC03"},
                        {"Type": "Pack", "Color": "#BA5900"},
                        {"Type": "Tray", "Color": "#F26C6C"}];
      svg
        .selectAll("legend")
        .data(legendData)
        .enter()
        .append("circle")
          .attr("cx", function(d,i){
            return 100;
          })
          .attr("cy", function(d,i){ 
            return 30 * (i+1);
          })
          .attr("r",10)
          .style("fill", function(d) {
            return d["Color"];
          })
          .attr("stroke", "white")

      // Add legend: labels
      svg
        .selectAll("legend")
        .data(legendData)
        .enter()
        .append("text")
          .attr('x', 120)
          .attr('y', function(d, i){ 
            return 30 * (i+1);
          })
          .text( function(d){ return d["Type"].toUpperCase() } )
          .style("font-size", 13)
          .attr('alignment-baseline', 'middle')
          .style('fill', 'white')

    });

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(.03);
      d.fx = null;
      d.fy = null;
    }

    function types(d){
      d["Count"] = +d["Count"];
      d.size = +d["Count"] * 0.8;
      d.radius = d.size;
      return d;
    }
  }
  render() {
     return (
      <div className = "force-container">
        <div id = "#ForceChart"
            ref={node => this.node = node}>
        </div>
      </div>
     )
  }
}

export default ForceLayout;