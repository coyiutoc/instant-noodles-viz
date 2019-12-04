import React from "react";
import "./ForceLayoutPage.scss";
import ForceLayout from "./ForceLayout/ForceLayout";
import ForceLayout2 from "./ForceLayout/ForceLayout2";
const ForceLayoutPage = () => {
  
  return (
    <div id = "ForceLayoutPage">
      <div className="container-fluid">
        <div className="row forceHeader" id="ForceTop">
          <h1>WHAT IS THE DISTRIBUTION <br></br>OF PACKAGE TYPES?</h1>
          <h3>NUMBER OF PACKAGE VARIETIES BY MANUFACTURER</h3>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row forceContent">
          {/* <ForceLayout /> */}
          <ForceLayout2 />
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