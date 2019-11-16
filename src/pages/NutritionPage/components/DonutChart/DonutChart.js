import React, {Component} from "react";
import "./DonutChart.scss";
import * as d3 from 'd3'

class DonutChart extends Component {
  constructor(props){
     super(props)
     this.state = {
       percentage: props.percentage,
       color: props.color,
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
    // set the dimensions and margins of the graph
    let width = this.node.getBoundingClientRect().width;
    let height = this.node.getBoundingClientRect().height;
    let margin = 30;
    let innerRadius = window.innerWidth * 0.035;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    let radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    let svg = d3.select(node)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + this.node.getBoundingClientRect().width / 2 + "," + this.node.getBoundingClientRect().height / 2 + ")");

    // Create dummy data
    let remainder = 100-this.state.percentage;
    let data = {a: remainder, b: this.state.percentage};

    // set the color scale
    let color = d3.scaleOrdinal()
                  .domain(data)
                  .range(["#2B2B2B", this.state.color])

    // Compute the position of each group on the pie:
    let pie = d3.pie()
                .value(function(d) {return d.value; })
    let data_ready = pie(d3.entries(data))

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll('whatever')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', d3.arc()
      .innerRadius(innerRadius)         // This is the size of the donut hole
      .outerRadius(radius)
      )
      .attr('fill', function(d){ return(color(d.data.key)) })
      .attr("stroke", "white")
      .style("stroke-width", "0px")
      .style("opacity", 0.7)
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