import React, {Component} from "react";
import "./Map.scss";
import * as d3 from 'd3'
import * as topojson from 'topojson'
import {interpolateOranges} from 'd3-scale-chromatic'

import locationData from '../../../data/data.csv';

class MapBubble extends Component {
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

    var tooltip = d3.select("#map-container")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .text("a simple tooltip");
                    
    const width = d3.select(".mapContent").node().getBoundingClientRect().width;
    const height = d3.select(".mapContent").node().getBoundingClientRect().height*1.2;

    const projection = d3.geoMercator()
                         .translate([ width/2, height/2 + 50]); 
    const path = d3.geoPath().projection(projection);
    
    const zoom = d3.zoom()
                  .scaleExtent([1, 3])
                  .translateExtent([[0,0], [width, height]])
                  .extent([[0, 0], [width, height]])
                  .on("zoom", zoomed);

    const svg = map.append("svg")
                   .attr("viewBox", `0 0 ${width} ${height}`)

    const bg = svg.append("rect")
                  .attr("width", width)
                  .attr("height", height)
                  .style("fill", "white")
                  .style("opacity", 0.1);

    const g = svg.append("g")
                 .attr("id", "country-paths")

    svg.call(zoom);

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
          .style("stroke", "none")
          .style("fill", "#b8b8b8")
          .style("opacity", 0.3);
      
      var valueExtent = d3.extent(data, function(d) { return +d.n; })
      var size = d3.scaleSqrt()
                  .domain(valueExtent)  // What's in the data
                  .range([ 1, 50])  // Size in pixel

      g.selectAll("myCircles")
        .data(data.sort(function(a,b) { return +b.n - +a.n }).filter(function(d,i){ return i<1000 }))
        .enter()
        .append("circle")
          .attr("class", "bubble")
          .attr("cx", function(d){ return projection([+d.homelon, +d.homelat])[0] })
          .attr("cy", function(d){ return projection([+d.homelon, +d.homelat])[1] })
          .attr("r", function(d){ return size(+d.n) })
          .style("fill", "#ff7a00")
          .attr("stroke", function(d){ if(d.n>2000){return "black"}else{return "none"}  })
          .attr("stroke-width", 1)
          .attr("fill-opacity", .4)

      // Add legend: circles
      var valuesToShow = [10, 50,200]
      var xCircle = 40
      var xLabel = 90
      var verticalTranslation = 50;
      var horizontalTranslation = 100;

      g.selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("circle")
          .attr("cx", xCircle + horizontalTranslation)
          .attr("cy", function(d){ return height - size(d) - verticalTranslation } )
          .attr("r", function(d){ return size(d) })
          .style("fill", "none")
          .attr("stroke", "white")

      // Add legend: segments
      g.selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("line")
          .attr('x1', function(d){ return xCircle + size(d) + + horizontalTranslation} )
          .attr('x2', xLabel + + horizontalTranslation)
          .attr('y1', function(d){ return height - size(d) - verticalTranslation} )
          .attr('y2', function(d){ return height - size(d) - verticalTranslation} )
          .attr('stroke', 'white')
          .style('stroke-dasharray', ('2,2'))

      // Add legend: labels
      g.selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("text")
          .attr('x', xLabel + + horizontalTranslation)
          .attr('y', function(d){ return height - size(d) - verticalTranslation} )
          .text( function(d){ return d } )
          .style("font-size", 10)
          .attr('alignment-baseline', 'middle')
          .style('fill', 'white')
    }

    function zoomed(){
      g.attr("transform", d3.event.transform);
    }  
    
  }
  render() {
     return (
      <div id="map-container" ref={node => this.node = node}>
      </div>
     )
  }
}

export default MapBubble;