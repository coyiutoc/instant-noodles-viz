import React, {Component} from "react";
import DonutChart from "./components/DonutChart/DonutChart.js";
import "./NutritionPage.scss";

class NutritionContent extends Component {

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
  
    return (
      <div className = "row nutritionContent">
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
      </div>
    );
  }
};

export default NutritionContent;