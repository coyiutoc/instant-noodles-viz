import React, {Component} from "react";
import "./LandingPage.scss";
import noodleBowlImg from "./../../assets/imgs/landing/bowl.png";
import maruchan from "./../../assets/imgs/landing/maruchan.png";
import cupnoodle from "./../../assets/imgs/landing/cupnoodle.png";
import indomie from "./../../assets/imgs/landing/indomie.png";
import samyang from "./../../assets/imgs/landing/samyang.png";
import ottogi from "./../../assets/imgs/landing/ottogi.png";
import koka from "./../../assets/imgs/landing/koka.png";

class LandingPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      img: noodleBowlImg,
      seconds: 1,
    }
    this.imgArray = [noodleBowlImg, maruchan, cupnoodle, indomie, samyang, ottogi, koka];
 }

 tick() {
  let img = this.imgArray[this.state.seconds%this.imgArray.length];
    this.setState(prevState => ({
      seconds: prevState.seconds + 1,
      img: img
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
                            
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    return (
      <div id = "LandingPage">
        <div className="container-fluid h-100">
          <div className="row fullHeight">
            <div className="col-lg-6 col-md-6 col-sm-12" id="headerBlock">
              <div className="innerBox">
                <h1>INSTANT NOODLES</h1>
                <div className="divider"></div>
                <p>
                  A series of infographics and visualizations on <font color="#D56600">what's</font> in instant
                  noodles, <font color="#D56600">who</font> makes these products, and <font color="#D56600">where</font> these
                  manufacturers are distributed throughout the world.
                  <br></br>
                  <br></br>
                  All visualizations are made in D3, with data coming from <a href="https://www.kaggle.com/residentmario/ramen-ratings">this dataset.</a>
                  {/* <p className="orangeColorFont">Keep scrolling.</p> */}
                  {/* <div className="downArrow bounce">
                    <i className="fas fa-angle-down"></i>
                  </div> */}
                </p>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12" id="imgBlock">
              <img src={this.state.img}></img>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default LandingPage;