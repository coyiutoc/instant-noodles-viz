import React, {Component} from "react";
import * as d3 from 'd3'
import barData from '../../../data/top_brands.csv';
import "./BarChart.scss";

import Nissin from '../../../assets/imgs/Nissin.jpg';
import Mama from '../../../assets/imgs/Mama.png';
import Maruchan from '../../../assets/imgs/Maruchan.jpg';
import Myojo from '../../../assets/imgs/Myojo.jpg';
import Nongshim from '../../../assets/imgs/Nongshim.png';
import Paldo from '../../../assets/imgs/Paldo.png';
import Samyang from '../../../assets/imgs/Samyang.png';
import Indomie from '../../../assets/imgs/Indomie.jpg';
import Koka from '../../../assets/imgs/Koka.png';
import Ottogi from '../../../assets/imgs/Ottogi.jpg';

// Data for hover component
const brandSrc = {
  "Nissin": {
    img: Nissin,
    country: "Japan"
  },
  "Mama": {
    img: Mama,
    country: "Thailand"
  },
  "Maruchan": {
    img: Maruchan,
    country: "United States"
  },
  "Myojo": {
    img: Myojo,
    country: "Japan"
  },
  "Nongshim": {
    img: Nongshim,
    country: "South Korea"
  },
  "Paldo": {
    img: Paldo,
    country: "South Korea"
  },
  "Samyang Foods": {
    img: Samyang,
    country: "South Korea"
  },
  "Indomie": {
    img: Indomie,
    country: "Indonesia"
  },
  "Koka": {
    img: Koka,
    country: "Singapore"
  },
  "Ottogi": {
    img: Ottogi,
    country: "South Korea"
  }
}

class BarChart extends Component {
  constructor(props){
     super(props)
     this.createBar = this.createBar.bind(this)
  }
  componentDidMount() {
    this.createBar();
  }
  componentDidUpdate() {
    this.createBar();
  }
  createBar() {

    var node = this.node;
    var transition_duration = 200;

    var width = node.getBoundingClientRect().width;
    var height = node.getBoundingClientRect().height * 0.95;
  
    var margin = {top: height*0.05, right: width*0.1, bottom: height*0.1, left: width*0.15 },
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    var graph = d3.select(node)
                  .append("svg")
                  .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    
    var svg   = graph.append("g")
                     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xAxisLabel = d3.select(node)
                     .append("div")
                     .attr("class", "xAxisLabel")
                     .style("position", "relative")
                     .attr("left", width/2)
                     .style("z-index", "10")
                     .style("color", "white")
                     .text("NUMBER OF VARIETIES")
                     .style("letter-spacing", "2px")
                     .style("margin-bottom", "20px");

    d3.csv(barData, function(error, data){
      if (error) throw error;

      let max = d3.max(data, function(d) {
        return parseInt(d["Count"])
      });

      // X axis scale
      var x = d3.scaleLinear()
                .domain([0, max])
                .range([ 0, width]);

      // Y axis scale
      var y = d3.scaleBand()
                .range([ 0, height ])
                .domain(data.map(function(d) { 
                  return d["Brand"]; }))
                .padding(.1);
 
      function update() {

        // Add x-axis labels
        var x_axis = svg.append("g")
                      .attr('id', 'x-axis')
                      .attr("transform", "translate(0," + height + ")")
                      .style("fill", "none")
                      .call(d3.axisBottom(x));
                      x_axis.selectAll("text")
                        .attr("transform", "translate(-10,0)rotate(-45)")
                        .attr("class", "x-axis-label")
                        .style("text-anchor", "end")
                        .style("fill", "#ffffff")
                        .attr('font-size', '1.0em');

        // Add y-axis labels
        var y_axis = svg.append("g")
                      .attr('id', 'y-axis')
                      .call(d3.axisLeft(y))
                      .selectAll(".tick")
                          .each(function(d){
                          d3.select(this)
                            .attr("opacity", 0)
                            .select("text")
                            .attr("class", "y-axis-label")
                            .attr('font-size', '1.5em')
                            .style("fill", "#ffffff")
                          });

        // Transition effect on y-axis ticks
        d3.selectAll('#y-axis .tick').each(function (d, i) {
          d3.select(this)
            .transition()
            .duration(transition_duration)
            .delay(function (d){
              return i * transition_duration;
            })
            .attr("opacity", 1)
        });

        // Color scale
        var sequentialScale = d3.scaleLinear()
                              .domain([45, 100])
                              //.domain(d3.extent(data, function(d){ return parseInt(d["Count"])}))
                              .interpolate(d3.interpolateHcl)
                              .range([d3.rgb("#ffe6cc"), d3.rgb('#ff4517')]);

        // Outer g container for bars
        var g_bars = svg.selectAll(".bar")
                        .data(data)
                        .enter()
                        .append("g");

        // Add bars to each g container
        var bars = g_bars.append("rect")
                      .attr("class", "bar")
                      .attr("width", 0)
                      .attr("y", function(d) {
                        return y(d["Brand"]) 
                      })
                      .attr("height", y.bandwidth())

        
        // Add transition on bars
        var contentDiv = d3.select("#barHoverContent");

        // Add hover
        bars.on("mouseover", function(d) {

          d3.select(this)
            .transition()
            .duration(200)
            .attr("fill", "white")

          let html = `
            <img class ="companyImage" src="${brandSrc[d["Brand"]].img}"></img>
            <br></br>
            <div class = "companyTitle">
              <h3>${d["Brand"]}</h3>
            </div>
            <div><b>Origin:</b> ${brandSrc[d["Brand"]].country}</div>
            <div><b>Produces:</b> ${d["Count"]} Varieties of Instant Noodles</div>
          `
          contentDiv.html(html);  
        })          
        .on("mouseout", function(d) { 

            d3.select(this)
              .transition()
              .duration(200)
              .attr("fill", function(d) {
                if (d["Count"] > 100) {
                  return "#ff4517"
                }
                return sequentialScale(parseInt(d["Count"]))
              })

            contentDiv.html("<h3>Hover over a bar!</h3>");
        });
        
        // Transition effect on bars
        bars.transition()
              .duration(transition_duration)
              .delay(function (d, i) {
                  return i * transition_duration;
              })
            .attr("width", function(d) {
              return x(parseInt(d["Count"])); 
            })
            .attr("fill", function(d) {
              if (d["Count"] > 100) {
                return "#ff4517"
              }
              return sequentialScale(parseInt(d["Count"]))
            })
            .attr("y", function(d) { 
              return y(d["Brand"])
            })
        }
        update();
    })
  }
  render() {
     return (
      <div id= "barContainer">
        <div id = "barChart"
          ref={node => this.node = node}>
        </div>
        <div id = "barHoverContent">
          <h3>Hover over a bar.</h3>
        </div>
      </div>
     )
  }
}

export default BarChart;