import { slide as Menu } from 'react-burger-menu'
import React, {Component} from "react";
import "./Navigation.scss";

class Navigation extends Component {
  showSettings (event) {
    event.preventDefault();
  }

  render () {
    return (
      <Menu disableAutoFocus >
        <a id="home" className="menu-item" href="#LandingPage">Home</a>
        <br></br>
        <br></br>
        <a id="about" className="menu-item" href="#NutritionTop">Nutrition Content</a>
        <br></br>
        <br></br>
        <a id="contact" className="menu-item" href="#MapTop">Manufacturer Map</a>
        <br></br>
        <br></br>
        <a id="contact" className="menu-item" href="#ForceTop">Package Type Distribution</a>
        <br></br>
        <br></br>
        <a id="contact" className="menu-item" href="#BarTop">Most Prolific Manufacturers</a>
        <br></br>
      </Menu>
    );
  }
}

export default Navigation;