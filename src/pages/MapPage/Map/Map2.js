import React, {Component} from "react";
import "./Map.scss";
import * as d3 from 'd3'
import * as d3ScaleChromatic from 'd3-scale-chromatic'
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

    // The svg
    var svg = d3.select(node);
    var width = svg.attr("width");
    var height = svg.attr("height");

    var zoom = d3.zoom()
                    .scaleExtent([1, 3])
                    .translateExtent([[0,0], [width, height]])
                    .extent([[0, 0], [width, height]])
                    

    // Map and projection
    var projection = d3.geoMercator()
                      .center([0,20])                   // GPS of location to zoom on
                      .scale(150)                       // This is like the zoom
                      .translate([ width/2, height/2 ])

    d3.queue()
      .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")  // World shape
      .defer(d3.csv, locationData) // Position of circles
      .await(ready);

    function ready(error, dataGeo, data) {

      // Create a color scale
      var allContinent = d3.map(data, function(d){return(d.homecontinent)}).keys()
      var color = d3.scaleOrdinal()
                    .domain(allContinent)
                    .range(["red"]);

      // Add a scale for bubble size
      var valueExtent = d3.extent(data, function(d) { return +d.n; })
      var size = d3.scaleSqrt()
                  .domain(valueExtent)  // What's in the data
                  .range([ 1, 50])  // Size in pixel

      // Draw the map
      svg.append("g")
        .attr("id", "g-map")
        .selectAll("path")
        .data(dataGeo.features)
        .enter()
        .append("path")
          .attr("fill", "#b8b8b8")
          .attr("d", d3.geoPath()
              .projection(projection)
          )
        .style("stroke", "none")
        .style("opacity", .3)

      // Add circles:
      svg
        .selectAll("myCircles")
        .data(data.sort(function(a,b) { return +b.n - +a.n }).filter(function(d,i){ return i<1000 }))
        .enter()
        .append("circle")
          .attr("class", "bubble")
          .attr("cx", function(d){ return projection([+d.homelon, +d.homelat])[0] })
          .attr("cy", function(d){ return projection([+d.homelon, +d.homelat])[1] })
          .attr("r", function(d){ return size(+d.n) })
          .style("fill", function(d){ return color(d.homecontinent) })
          .attr("stroke", function(d){ if(d.n>2000){return "black"}else{return "none"}  })
          .attr("stroke-width", 1)
          .attr("fill-opacity", .4)

      zoom.on("zoom", function() {
        d3.select("#g-map").attr("transform", d3.event.transform);
        d3.selectAll(".bubble").attr("transform", d3.event.transform);
      });

      // --------------- //
      // ADD LEGEND //
      // --------------- //

      // Add legend: circles
      var valuesToShow = [10, 50,200]
      var xCircle = 40
      var xLabel = 90
      svg
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function(d){ return height - size(d) } )
        .attr("r", function(d){ return size(d) })
        .style("fill", "none")
        .attr("stroke", "white")

      // Add legend: segments
      svg
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("line")
        .attr('x1', function(d){ return xCircle + size(d) } )
        .attr('x2', xLabel)
        .attr('y1', function(d){ return height - size(d) } )
        .attr('y2', function(d){ return height - size(d) } )
        .attr('stroke', 'white')
        .style('stroke-dasharray', ('2,2'))

      // Add legend: labels
      svg
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
        .attr('x', xLabel)
        .attr('y', function(d){ return height - size(d) } )
        .text( function(d){ return d } )
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle')
        .style('fill', 'white')

      svg.call(zoom);
    }
  }
  render() {
     return (
      <div class = "svg-container">
        <svg id="outer-svg" 
            ref={node => this.node = node}
            width={1200}
            height={490} 
            class="svg-content">
        </svg>
      </div>
     )
  }
}

export default Map;