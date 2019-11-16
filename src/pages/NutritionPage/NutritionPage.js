import React from "react";
import DonutChart from "./components/DonutChart/DonutChart.js";

import "./NutritionPage.scss";
import noodleBowlImg from "./../../assets/imgs/bowl.png";

const NutritionPage = () => {

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
  
  return (
    <div id = "NutritionPage">
      <div className="container-fluid">
        <div className="row nutritionHeader">
          <h1>WHAT'S IN IT?</h1>
          <h3>% Daily Values for a 566g Package</h3>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row nutritionContent">
          <div className="col-lg-3 col-md-12 col-sm-12 donutBlock">
            <DonutChart 
              percentage = {10}
              color = {colors.Protein}/>
            <div className="donutTitle">
              <h2 style={proteinStyle}>Protein</h2>
            </div>
          </div>
          <div className="col-lg-3 col-md-12 col-sm-12 donutBlock">
            <DonutChart 
              percentage = {45}
              color = {colors.Sodium}/>
            <div className="donutTitle">
              <h2 style={sodiumStyle}>Sodium</h2>
            </div>
          </div>
          <div className="col-lg-3 col-md-12 col-sm-12 donutBlock">
            <DonutChart 
              percentage = {14}
              color = {colors.Carbs}/>
            <div className="donutTitle">
              <h2 style={carbsStyle}>Carbs</h2>
            </div>
          </div>
          <div className="col-lg-3 col-md-12 col-sm-12 donutBlock">
            <DonutChart 
              percentage = {17}
              color = {colors.Fat}/>
            <div className="donutTitle">
              <h2 style={fatStyle}>Fat</h2>
            </div>
          </div>
        </div>
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
};

export default NutritionPage;