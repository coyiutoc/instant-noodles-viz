import React, {Component} from "react";
import "./Map.scss";
import * as d3 from 'd3'
import * as topojson from 'topojson'
import {interpolateOranges} from 'd3-scale-chromatic'

import locationData from '../../../data/data.csv';

class Map extends Component {
  constructor(props){
     super(props)
     this.createMap = this.createMap.bind(this)
  }
  componentDidMount() {
    this.createMap();
  }
  componentDidUpdate() {
     this.createMap()
  }
  createMap() {
    const node = this.node;
    
    const map = d3.select(node);

    const width = map.node().getBoundingClientRect().width;
    const height = width / 2;

    const projection = d3.geoMercator()
                         .translate([ width/2, height/2 ]); 
    const path = d3.geoPath().projection(projection);
    
    const zoom = d3.zoom()
                  .scaleExtent([1, 3])
                  .translateExtent([[0,0], [width, height]])
                  .extent([[0, 0], [width, height]])
                  .on("zoom", zoomed);
    
    map.call(zoom);

    const bg = map.append("rect")
                  .attr("width", width)
                  .attr("height", height)
                  .style("fill", "white")
                  .style("opacity", 0.1);

    const svg = map.append("svg")
                  .attr("width", width)
                  .attr("height", height)

    const g = svg.append("g")
                 .attr("id", "country-paths")

    // Read all the data
    d3.queue()
      .defer(d3.json, "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")  // World shape
      .defer(d3.csv, locationData) // Position of circles
      .await(ready);

    function ready(error, world, data) {
      if (error) throw error;

      let geometries = world.objects.countries.geometries;

      var countries = topojson.feature(world, world.objects.countries).features;
      g.selectAll(".country")
          .data(countries)
          .enter().insert("path", ".graticule")
          .attr("class", "country")
          .attr("d", path)
          .style("stroke", "white")
          .style("stroke-width", "0.5")
          .style("fill", function(d) {
            let countryName = d.properties.name;
            let index = noodleIndex(countryName, data);

            if (index !== -1) {
              return interpolateOranges(parseInt(data[index]["n"])/100);
            } else {
              return "black";
            }
          })
          .on('mouseover', function(d, i) {
            let countryName = d.properties.name;
            let idx = noodleIndex(countryName, data);
            if (idx !== -1) {
              var currentState = this;
              d3.select(this)
                .style('fill', "red");

              d3.select("#tool-tip-country")
                .html(countryName)

              d3.select("#num-manufacturers-value")
                .html(data[idx]["n"])
              
              d3.select("#num-manufacturers-header")
                .style("display", "inline")
            }
          })
          .on('mouseout', function(d, i) {
            let countryName = d.properties.name;
            let idx = noodleIndex(countryName, data);
            if (idx !== -1) {
              var currentState = this;
              d3.select(this).style('fill', interpolateOranges(parseInt(data[idx]["n"])/100));
              
              d3.select("#tool-tip-country")
                .html("")

              d3.select("#num-manufacturers-value")
                .html("")

              d3.select("#num-manufacturers-header")
                .style("display", "none")
            }
          });
    
   
     // Add a scale for bubble size
    //  var valueExtent = d3.extent(data, function(d) { return +d["n"]; })
    //  var size = d3.scaleSqrt()
    //              .domain(valueExtent)  // What's in the data
    //              .range([ 1, 50])  // Size in pixel
 
     // Add legend: circles
    //  var valuesToShow = [10, 50, 200]
    //  var xCircle = 40
    //  var xLabel = 90
    //  svg
    //     .selectAll("legend")
    //     .data(valuesToShow)
    //     .enter()
    //     .append("circle")
    //       .attr("cx", 100)
    //       .attr("cy", function(d){ return height/2 } )
    //       .attr("r", function(d){ return size(d) })
    //       .style("fill", "none")
    //       .attr("stroke", "white")
 
    //  // Add legend: segments
    //  svg
    //  .selectAll("legend")
    //  .data(valuesToShow)
    //  .enter()
    //  .append("line")
    //    .attr('x1', function(d){ return xCircle + size(d) } )
    //    .attr('x2', xLabel)
    //    .attr('y1', function(d){ return height - size(d) } )
    //    .attr('y2', function(d){ return height - size(d) } )
    //    .attr('stroke', 'white')
    //    .style('stroke-dasharray', ('2,2'))
 
    //  // Add legend: labels
    //  svg
    //  .selectAll("legend")
    //  .data(valuesToShow)
    //  .enter()
    //  .append("text")
    //    .attr('x', xLabel)
    //    .attr('y', function(d){ return height - size(d) } )
    //    .text( function(d){ return d } )
    //    .style("font-size", 10)
    //    .attr('alignment-baseline', 'middle')
    //    .style('fill', 'white')
    }

    function zoomed(){
      g.attr("transform", d3.event.transform);
    }  

    function noodleIndex(countryName, noodleData) {
      let idx = noodleData.findIndex(field => {
        return field["homecontinent"] === countryName;
      });

      return idx;
    }
    
  }
  render() {
     return (
      <div className = "svg-container">
        <svg id="outer-svg" 
            ref={node => this.node = node}
            width={1200}
            height={490} 
            class="svg-content">
        </svg>
        <div className = "tool-tip-area">
          <h3 id="tool-tip-country"></h3>
          <div className = "tool-tip-text">
            <div id="num-manufacturers-header">Number of Manufacturers: </div>
            <div id="num-manufacturers-value">30</div>
          </div>
        </div>
      </div>
     )
  }
}

export default Map;