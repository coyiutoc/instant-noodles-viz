import React from "react";
import Map from "./Map/Map.js";

import "./MapPage.scss";

const MapPage = () => {
  
  return (
    <div id = "MapPage">
      <div className="container-fluid">
        <div className="row mapHeader">
          <h1>MANUFACTURERS</h1>
          <h3>THROUGHOUT THE WORLD</h3>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row mapContent">
          <Map />
        </div>
      </div>
      <div className="container-fluid">
        <div className="row mapFooter">
          {/* <div className="downArrow bounce">
            <i className="fas fa-angle-down"></i>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MapPage;