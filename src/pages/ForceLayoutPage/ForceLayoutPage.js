import React from "react";
import "./ForceLayoutPage.scss";
import ForceLayout from "./ForceLayout/ForceLayout";

const ForceLayoutPage = () => {
  
  return (
    <div id = "ForceLayoutPage">
      <div className="container-fluid">
        <div className="row forceHeader" id="ForceTop">
          <h1>WHAT IS THE DISTRIBUTION <br></br>OF PACKAGE TYPES?</h1><br></br>
          <h3>NUMBER OF PACKAGE VARIETIES BY MANUFACTURER</h3>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row forceContent">
          <ForceLayout />
        </div>
      </div>
      <div className="container-fluid">
        <div className="row forceFooter">
        </div>
      </div>
    </div>
  );
};

export default ForceLayoutPage;