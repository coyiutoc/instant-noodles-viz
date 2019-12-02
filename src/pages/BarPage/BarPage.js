import React from "react";
import "./BarPage.scss";
import BarChart from "./BarChart/BarChart";

const BarPage = () => {
  
  return (
    <div id = "BarPage">
      <div className="container-fluid">
        <div className="row barHeader" id="BarTop">
          <h1>WHO PRODUCES THE MOST VARIETY?</h1>
          <h3>THE TOP 10 MOST PROLIFIC MANUFACTURERS</h3>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row barContent">
          <BarChart />
        </div>
      </div>
      <div className="container-fluid">
        <div className="row barFooter">
          {/* <div className="downArrow bounce">
            <i className="fas fa-angle-down"></i>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default BarPage;