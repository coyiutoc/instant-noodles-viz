import React, {Component} from "react";
import "./DonutChart.scss";
import * as d3 from 'd3'
import {scale} from 'd3-scale';
import {interpolate} from 'd3-interpolate';
import $ from "jquery";

class DonutChart extends Component {
  constructor(props){
     super(props)
     this.state = {
       percentage: props.percentage,
       color: props.color,
       nutrition: props.nutrition,
       number: props.number
     };
     this.createDonutChart = this.createDonutChart.bind(this)
  }
  componentDidMount() {
    this.createDonutChart();
  }
  componentDidUpdate() {
     this.createDonutChart()
  }
  createDonutChart() {
    const node = this.node;

    let remainder = 100-this.state.percentage;
    var dataset = {
      apples: [remainder, this.state.percentage],
    };

    let width = this.node.getBoundingClientRect().width;
    let height = this.node.getBoundingClientRect().height;

    let margin = 30;
    let innerRadius = width * 0.2;

    let radius = Math.min(width, height) / 2 - margin
    let color = ["#2B2B2B", this.state.color];
    let svg = d3.select(node)
                .append('svg')
                .attr('width', width);

    var g = svg.attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + width/2 +  ',' + height/2 +')');
            
    var pie = d3.pie()
                .sort(null);
    
    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);
    
    let numOrder = this.state.number; 

    var path = g.selectAll("path")
        .data(pie(dataset.apples))
        .enter().append("path")
        .style("stroke", "black")
        .style("stroke-width", 5)
        .attr("fill", function(d, i) { return color[i]; })
        .transition()
        .delay(function(d, i) {
          return i * 400 + numOrder*800
        })
        .attrTween('d', function(d) {
          var i = interpolate(d.startAngle+0.1, d.endAngle);
          return function(t) {
              d.endAngle = i(t);
            return arc(d);
          }
        })
    
    let pieTitle = d3.select("#" + this.state.nutrition + "Title")
                     .style("opacity", 0)
                     .transition()
                     .delay(function() {
                       return 400 + numOrder * 800;
                     })
                     .style("opacity", 1)

    let percent = this.state.percentage;

    var text = svg.append("text")
                  .attr("x", width/2 - 40)
                  .attr("y", height/2 + 10)
                  .text(function(){
                    return percent + "%";
                  })
                  .attr('opacity', 0)
                  .transition()
                  .delay(function(){
                    return 400 + numOrder*800;
                  })
                  .attr("fill", color[1])
                  .attr("font-family", "sans-serif")
                  .attr("font-size", "40px")
                  .attr('opacity', 1)

  }
  
  render() {
     return (
      <svg id="outer-svg" ref={node => this.node = node}
          height="70%">
      </svg>
     )
  }
}

export default DonutChart;