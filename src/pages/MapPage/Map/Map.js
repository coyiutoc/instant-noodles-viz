import React, {Component} from "react";
import "./Map.scss";
import * as d3 from 'd3'
import * as topojson from 'topojson'
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

    // Tooltip setup
    var tooltip = d3.select("#map-container")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .text("a simple tooltip");
    
    // Width and height
    const width = d3.select(".mapContent").node().getBoundingClientRect().width;
    const height = d3.select(".mapContent").node().getBoundingClientRect().height*1.2;

    // Color scale
    var color = d3.scaleLinear()
                  .domain([0, 350])
                  .interpolate(d3.interpolateHcl)
                  .range([d3.rgb("#ffcb8f"), d3.rgb('#ff4517')]);

    // Projection setup
    const projection = d3.geoMercator()
                         .translate([ width/2, height/2 + 50]); 
    const path = d3.geoPath().projection(projection);
    
    // Zoom setup
    const zoom = d3.zoom()
                  .scaleExtent([1, 3])
                  .translateExtent([[0,0], [width, height]])
                  .extent([[0, 0], [width, height]])
                  .on("zoom", zoomed);

    // Main svg
    const svg = map.append("svg")
                   .attr("viewBox", `0 0 ${width} ${height}`)

    // Grey bg
    const bg = svg.append("rect")
                  .attr("width", width)
                  .attr("height", height)
                  .style("fill", "white")
                  .style("opacity", 0.1);
    
    // G for svg paths
    const g = svg.append("g")
                 .attr("id", "country-paths")

    // Color scale for legend
    let legendColors = d3.scaleLinear()
                 .domain([0, 20])
                 .interpolate(d3.interpolateHcl)
                 .range([d3.rgb("#000000"), d3.rgb('#ff4517')]);

    let array = [...Array(20).keys()]

    // Legend boxes
    const legend = g
           .append("g")
           .attr("transform", `translate(100, ${height*0.85})`)
           .selectAll("legend")
           .data(array)
           .enter()
           .append("rect")
             .attr("x", function(d, i) {
               return 10*d;
             })
             .attr("y", 0)
             .attr("width", 10)
             .attr("height", 8)
             .style("fill", function(d, i) {
               return legendColors(d)
             })
             .attr("stroke", "none")
             .attr("opacity", 0)
             .transition()
             .style("opacity", 1)
             .duration(800);;

    // Legend title
    const legendTitle = g.append("g")
                         .attr("transform", `translate(110, ${height*0.85 - 10})`)
                         .append("text")
                         .attr("x", 0)
                         .attr("y", 0)
                         .text("# OF MANUFACTURERS")
                         .attr("fill", "#E07B60")
                         .attr("fill-opacity", 0)
                         .transition()
                         .style("fill-opacity", 1)
                         .duration(800);

    // Legend labels
    const legendLabels = g.append("g")
                          .attr("transform", `translate(100, ${height*0.85 + 20})`)
                          .selectAll("legend")
                          .data(array)
                          .enter()
                          .append("text")
                          .attr("x", function(d, i) {
                            if (i === 0) {
                              return 0
                            }
                            if (i === 19 ) {
                              return 10*(array.length-2);
                            }
                          })
                          .attr("y", 10)
                          .text(function(d, i) {
                            if (i === 0) {
                              return "0"
                            }
                            if (i === 19) {
                              return "400"
                            }
                          })
                          .attr("fill", "#E04F31")
                          .attr("font-size", "0.8rem")
                          .attr("fill-opacity", 0)
                          .transition()
                          .style("fill-opacity", 1)
                          .duration(800);

    svg.call(zoom);

    // Read all the data
    d3.queue()
      .defer(d3.json, "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")  // World shape
      .defer(d3.csv, locationData) // Position of circles
      .await(ready);

    function ready(error, world, data) {
      if (error) throw error;

      var countries = topojson.feature(world, world.objects.countries).features;
      let paths = g.selectAll(".country")
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
              return color(parseInt(data[index]["n"]));
            } else {
              return "black";
            }
          })
          
      paths.style("opacity", 0)
            .transition()
            .style("opacity", 1)
            .duration(800);

      paths.on('mouseover', function(d, i) {
            let countryName = d.properties.name;
            let idx = noodleIndex(countryName, data);
            if (idx !== -1) {
              var currentState = this;
              d3.select(this)
                .style('fill', "white");

              tooltip.transition()		
                .duration(200)		
                .style("opacity", .9);	

              let string = `<h5>${countryName}</h5>
                            <p><b>${data[idx]["n"]}</b> Manufacturers</p>`;

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
              d3.select(this).style('fill', color(parseInt(data[idx]["n"])));
            }

            tooltip.html("HELLO")	
            .style("display", "none");	
          });
    }

    function zoomed(){
      g.attr("transform", d3.event.transform);
    }  

    // Helper fxn to check if country name exists in dataset
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
      <div id="map-container" ref={node => this.node = node}>
      </div>
     )
  }
}

export default Map;