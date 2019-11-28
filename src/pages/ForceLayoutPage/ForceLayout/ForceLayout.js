import React, {Component} from "react";
import * as d3 from 'd3'
import {scale} from 'd3-scale';
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
  createForce2() {
    var node = this.node;

    let width = 960,
        height = 500,
        padding = 1.5, // separation between same-color circles
        clusterPadding = 6, // separation between different-color circles
        maxRadius = height*0.1;

    let svg = d3.select(node)
        .append('svg')
        .attr('height', height)
        .attr('width', width)
        .append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    // Define the div for the tooltip
    let div = d3.select(node).append("div") 
        .attr("class", "tooltip")       
        .style("opacity", 0);

    //load college major data
    d3.csv(brandData, function(d){
      d = d.filter(function(el) { return !el["Brand"].includes("Total") });
      d = d.filter(function(el) { 
        let VALID = ["Cup", "Bowl", "Tray", "Pack"];
        if (VALID.includes(el["Type"])){
          return true;
        } 
        return false
       });

      let n = d.length, // total number of nodes
      m = 4, // number of distinct clusters
      z = d3.scaleOrdinal(d3.schemeCategory20),
      clusters = new Array(m);

      let radiusScale = d3.scaleLinear()
                          .domain(d3.extent(d, function(d) { return +d["Count"];} ))
                          .range([4, maxRadius]);

      let nodes = d.map((d) => {
        // scale radius to fit on the screen
        let scaledRadius  = radiusScale(+d["Count"]),
            forcedCluster = d["Type"];

        // add cluster id and radius to array
        d = {
          cluster     : forcedCluster,
          r           : scaledRadius,
          count       : d["Count"],
          type   : d["Type"]
        };
        // add to clusters array if it doesn't exist or the radius is larger than another radius in the cluster
        if (!clusters[forcedCluster] || (scaledRadius > clusters[forcedCluster].r)) clusters[forcedCluster] = d;

        return d;
      });
      
      // append the circles to svg then style
      // add functions for interaction
      let circles = svg.append('g')
            .datum(nodes)
          .selectAll('.circle')
            .data(d => d)
          .enter().append('circle')
            .attr('r', (d) => d.r)
            .attr('fill', (d) => z(d.cluster))
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
            // add tooltips to each circle
            .on("mouseover", function(d) {

                div.transition()    
                    .duration(200)    
                    .style("opacity", .9);    
                div .html( "The type " + d.type+ "<br/>With count " + d.count )  
                    .style("left", (d3.event.pageX) + "px")   
                    .style("top", (d3.event.pageY - 28) + "px");  
                })          
            .on("mouseout", function(d) {   
                div.transition()    
                    .duration(500)    
                    .style("opacity", 0); 
            });

      // create the clustering/collision force simulation
      let simulation = d3.forceSimulation(nodes)
          .velocityDecay(0.2)
          .force("x", d3.forceX().strength(.005))
          .force("y", d3.forceY().strength(.005))
          .force("charge", d3.forceManyBody().strength(-1))
          .force("collide", collide)
          .force("cluster", clustering)
          .on("tick", ticked);

      function ticked() {
          circles
              .attr('cx', (d) => d.x)
              .attr('cy', (d) => d.y);
      }

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

      // These are implementations of the custom forces.
      function clustering(alpha) {
          nodes.forEach(function(d) {
            var cluster = clusters[d.cluster];
            if (cluster === d) return;
            var x = d.x - cluster.x,
                y = d.y - cluster.y,
                l = Math.sqrt(x * x + y * y),
                r = d.r + cluster.r;
            if (l !== r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              cluster.x += x;
              cluster.y += y;
            }
          });
      }

      function collide(alpha) {
        var quadtree = d3.quadtree()
            .x((d) => d.x)
            .y((d) => d.y)
            .addAll(nodes);

        nodes.forEach(function(d) {
          var r = d.r + maxRadius + Math.max(padding, clusterPadding),
              nx1 = d.x - r,
              nx2 = d.x + r,
              ny1 = d.y - r,
              ny2 = d.y + r;
          quadtree.visit(function(quad, x1, y1, x2, y2) {

            if (quad.data && (quad.data !== d)) {
              var x = d.x - quad.data.x,
                  y = d.y - quad.data.y,
                  l = Math.sqrt(x * x + y * y),
                  r = d.r + quad.data.r + (d.cluster === quad.data.cluster ? padding : clusterPadding);
              if (l < r) {
                l = (l - r) / l * alpha;
                d.x -= x *= l;
                d.y -= y *= l;
                quad.data.x += x;
                quad.data.y += y;
              }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
          });
        });
      }
    });
  }
  createForce() {

    var that = this.node;
    var container = d3.select(that);

    var tooltip = d3.select(that)
                    .append("div")
                    .attr("class", "tooltip")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .text("a simple tooltip");

    var width = d3.select(".forceContent").node().getBoundingClientRect().width, 
        height = d3.select(".forceContent").node().getBoundingClientRect().height, 
        nodePadding = 2.5;

    var svg = container.append("svg")
                       .attr("width", width)
                       .attr("height", height);

    var color = {"Bowl": "#826A6A", "Cup":"#FFBC03", "Pack":"#BA5900", "Tray":"#F26C6C"};

    var simulation = d3.forceSimulation()
        .force("forceX", d3.forceX().strength(.1).x(width * .5))
        .force("forceY", d3.forceY().strength(.1).y(height * .5))
        .force("center", d3.forceCenter().x(width * .5).y(height * .5))
        .force("charge", d3.forceManyBody().strength(-10));

    d3.csv(brandData, types, function(error, graph){
      if (error) throw error;
      
      graph = graph.filter(function(el) { return !el["Brand"].includes("Total") });

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

      var node = svg.append("svg")
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
                  .style('fill', "white");
  
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
      var xBuffer = 200;

      svg
        .selectAll("legend")
        .data(legendData)
        .enter()
        .append("circle")
          .attr("cx", function(d,i){
            return xBuffer;
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
          .attr('x', xBuffer+20)
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
      d.size = +d["Count"] * 0.7;
      d.radius = d.size;
      return d;
    }
  }
  render() {
     return (
      <div id = "#ForceChart"
          ref={node => this.node = node}>
      </div>
     )
  }
}

export default ForceLayout;