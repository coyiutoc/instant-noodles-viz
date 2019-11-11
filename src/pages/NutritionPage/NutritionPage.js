import React from "react";
import DonutChart from "./components/DonutChart/DonutChart.js";

import "./NutritionPage.scss";
import noodleBowlImg from "./../../assets/imgs/bowl.png";

const NutritionPage = () => {
  return (
    <div id = "NutritionPage">
      <div className="container-fluid">
        <div className="row nutritionHeader">
          <h1>WHAT'S IN IT?</h1>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row nutritionContent">
          <div className="col-lg-3 col-md-12 col-sm-12 donutBlock">
            <DonutChart />
            <div className="donutTitle">
              <h2>dsfsdg</h2>
            </div>
          </div>
          <div className="col-lg-3 col-md-12 col-sm-12 donutBlock">
            <DonutChart />
            <div className="donutTitle">
              <h2>dsfsdg</h2>
            </div>
          </div>
          <div className="col-lg-3 col-md-12 col-sm-12 donutBlock">
            <DonutChart />
            <div className="donutTitle">
              <h2>dsfsdg</h2>
            </div>
          </div>
          <div className="col-lg-3 col-md-12 col-sm-12 donutBlock">
            <DonutChart />
            <div className="donutTitle">
              <h2>dsfsdg</h2>
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