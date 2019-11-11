import React from "react";
import "./LandingPage.scss";
import noodleBowlImg from "./../../assets/imgs/bowl.png";

const LandingPage = () => {
  return (
    <div id = "LandingPage">
      <div className="container-fluid h-100">
        <div className="row fullHeight">
          <div className="col-lg-6 col-md-6 col-sm-12" id="headerBlock">
            <div className="innerBox">
              <h1>INSTANT NOODLES</h1>
              <div className="divider"></div>
              <p>
                A series of infographics and visualizations on what's in instant
                noodles, its history, who makes these products, and where these
                manufacturers are distributed throughout the world.
                <br></br>
                <br></br>
                <p className="orangeColorFont">Keep scrolling.</p>
                {/* <div className="downArrow bounce">
                  <i className="fas fa-angle-down"></i>
                </div> */}
              </p>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12" id="imgBlock">
            <img src={noodleBowlImg}></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;