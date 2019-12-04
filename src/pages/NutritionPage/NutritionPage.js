import React, {Component} from "react";
import NutritionContent from "./NutritionContent";
import $ from 'jquery';

import "./NutritionPage.scss";

class NutritionPage extends Component {

  constructor(props){
    super(props)
    this.state = {
      isVisible: false
    }
  }

  componentDidMount() {
    var comp = this;

    window.addEventListener('scroll', function() {
      if (comp.inView()){
        console.log("NUTRITION PG IN VIEW");
        if (!comp.state.isVisible) {
          comp.setState ({
            isVisible: true
          });
        }
      } 
      else {
        console.log("NUTRITION PG NOT IN VIEW");
      }
    });
  }

  inView() {
    let page = $("#NutritionPage")[0];
    let offset = $("#LandingPage")[0].getBoundingClientRect().height;
    const top = page.getBoundingClientRect().top;
    return (top + offset) >= 0 && (top - offset) <= window.innerHeight;
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
          <div className="row nutritionHeader" id="NutritionTop">
            <h1>WHAT'S IN IT?</h1>
            <h3>% DAILY VALUES FOR A 566g PACKAGE</h3>
          </div>
        </div>
        <div className="container-fluid nutritionContent">
          {body}
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