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

    var tooltip = d3.select(".svg-container")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .text("a simple tooltip");
                    
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

              tooltip.transition()		
                .duration(200)		
                .style("opacity", .9);	

              let string = `<h5>${countryName}</h5>
                            <b>${data[idx]["n"]}</b> Manufacturers`;

              tooltip.html(string)	
                      .style("left", (d3.event.pageX + 10) + "px")		
                      .style("top", (d3.event.pageY - 28) + "px")
                      .style("display", "block");	

            }
          })
          .on("mousemove", function(){
            tooltip.style("top", (d3.event.pageY - 28)+"px")
                   .style("left",(d3.event.pageX + 10)+"px");
          })
          .on('mouseout', function(d, i) {
            let countryName = d.properties.name;
            let idx = noodleIndex(countryName, data);
            if (idx !== -1) {
              var currentState = this;
              d3.select(this).style('fill', interpolateOranges(parseInt(data[idx]["n"])/100));
            }

            tooltip.html("HELLO")	
            .style("display", "none");	
          });
    }

    function zoomed(){
      g.attr("transform", d3.event.transform);
    }  

    function noodleIndex(countryName, noodleData) {
      let idx = noodleData.findIndex(field => {

        if (countryName === "United States of America" && field["homecontinent"].includes("United States")){
          return true;
        }
        
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
      </div>
     )
  }
}

export default Map;