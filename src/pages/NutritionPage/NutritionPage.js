import React, {Component} from "react";
import DonutChart from "./components/DonutChart/DonutChart.js";
import NutritionContent from "./NutritionContent";
import $ from 'jquery';

import "./NutritionPage.scss";
import noodleBowlImg from "./../../assets/imgs/bowl.png";

class NutritionPage extends Component {

  constructor(props){
    super(props)
    let comp = this;
    this.state = {
      isVisible: false
    }
  }

  componentDidMount() {
    var comp = this;

    window.addEventListener('scroll', function() {
      if (comp.inView()){
        console.log("IN VIEW");
        if (!comp.state.isVisible) {
          comp.setState ({
            isVisible: true
          });
        }
      } 
      else {
        console.log("NOT IN VIEW");
        // if (comp.state.isVisible !== false) {
        //   comp.setState({
        //     isVisible: false
        //   })  
        // }
      }
    });
  }

  inView() {
    // if (!this.page) return false;
    let page = $("#NutritionPage")[0];
    let offset = $("#LandingPage")[0].getBoundingClientRect().height;
    const top = page.getBoundingClientRect().top;
    return (top + offset) >= 0 && (top - offset) <= window.innerHeight;

    // if ($('#NutritionPage:hover').length != 0 && !this.state.isVisible) {
    //   return true;
    // }
    // return false;
  }

  render() {
    let colors = {
      "Protein": "#826A6A",
      "Sodium": "#FFBC03",
      "Carbs": "#BA5900",
      "Fat": "#F26C6C",
    };

    let proteinStyle = {
      color: colors.Protein,
    };

    let sodiumStyle = {
      color: colors.Sodium,
    };
    
    let carbsStyle = {
      color: colors.Carbs,
    };

    let fatStyle = {
      color: colors.Fat,
    };
    
    let body = ""
    let canView = this.state.isVisible;
    if (canView) {
       body = <NutritionContent />
    }

    return (
      <div id = "NutritionPage" ref={(el) => this.page = el} canView = {canView}>
        <div className="container-fluid">
          <div className="row nutritionHeader">
            <h1>WHAT'S IN IT?</h1>
            <h3>% DAILY VALUES FOR A 566g PACKAGE</h3>
          </div>
        </div>
        <div className="container-fluid nutritionContent">
          {body}
          {/* <div className="row nutritionContent">
            <div className="col-lg-3 col-md-12 col-sm-12 donutBlock">
              <DonutChart 
                nutrition = "protein"
                number = "0"
                percentage = {10}
                color = {colors.Protein}/>
              <div id="proteinTitle" className="donutTitle">
                <h2 style={proteinStyle}>PROTEIN</h2>
              </div>
            </div>
            <div className="col-lg-3 col-md-12 col-sm-12 donutBlock">
              <DonutChart 
                nutrition = "sodium"
                number = "1"
                percentage = {45}
                color = {colors.Sodium}/>
              <div id="sodiumTitle" className="donutTitle">
                <h2 style={sodiumStyle}>SODIUM</h2>
              </div>
            </div>
            <div className="col-lg-3 col-md-12 col-sm-12 donutBlock">
              <DonutChart 
                nutrition = "carbs"
                number = "2"
                percentage = {14}
                color = {colors.Carbs}/>
              <div id="carbsTitle" className="donutTitle">
                <h2 style={carbsStyle}>CARBS</h2>
              </div>
            </div>
            <div className="col-lg-3 col-md-12 col-sm-12 donutBlock">
              <DonutChart
                nutrition = "fat" 
                number = "3"
                percentage = {17}
                color = {colors.Fat}/>
              <div id = "fatTitle" className="donutTitle">
                <h2 style={fatStyle}>FAT</h2>
              </div>
            </div> 
          </div> */}
        </div>
        <div className="container-fluid">
          <div className="row nutritionFooter">
            {/* <div className="downArrow bounce">
              <i className="fas fa-angle-down"></i>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
};

export default NutritionPage;