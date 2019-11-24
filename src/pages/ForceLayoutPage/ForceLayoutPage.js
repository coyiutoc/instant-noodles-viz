import React from "react";
import "./ForceLayoutPage.scss";
import ForceLayout from "./ForceLayout/ForceLayout";

const ForceLayoutPage = () => {
  
  return (
    <div id = "ForceLayoutPage">
      <div className="container-fluid">
        <div className="row forceHeader">
          <h1>I'M A TITLE</h1>
          <h3>THROUGHOUT THE WORLD</h3>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row forceContent">
          <ForceLayout />
        </div>
      </div>
      <div className="container-fluid">
        <div className="row forceFooter">
          {/* <div className="downArrow bounce">
            <i className="fas fa-angle-down"></i>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ForceLayoutPage;