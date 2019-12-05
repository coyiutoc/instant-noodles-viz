import React, {Component} from "react";
import Map from "./Map/Map.js";
import MapBubble from "./Map/MapBubble.js";
import "./MapPage.scss";

class MapPage extends Component {
  
  constructor() {
    super()
    this.state = {
      chloroHidden: false,
      bubbleHidden: true
    }
  }

  // Helper fxn to toggle the buttons
  toggleButton(event, id) {
    if ((id === "chloro" && this.state.chloroHidden) ||
        (id === "bubble" && this.state.bubbleHidden)) {
      this.setState({
        chloroHidden: !this.state.chloroHidden,
        bubbleHidden: !this.state.bubbleHidden
      })
    }
  }

  render() {
    return (
        <div>
        <div id = "MapPage">
          <div className="container-fluid">
            <div className="row mapHeader" id="MapTop">
              <h1>WHO MAKES IT?</h1>
              <h3>MANUFACTURERS THROUGHOUT THE WORLD</h3>
              <div className = "buttonContainer">
                <button id="leftButton" 
                        className={!this.state.chloroHidden ? 'current': 'notCurrent'}  
                        onClick={e => this.toggleButton(e, "chloro")}>
                          CHOROPLETH
                </button>
                <button id="rightButton" 
                        className={!this.state.bubbleHidden ? 'current': 'notCurrent'} 
                        onClick={e => this.toggleButton(e, "bubble")}>
                          BUBBLE
                </button>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <div className="row mapContent">
              {!this.state.chloroHidden && <Map />} 
              {!this.state.bubbleHidden && <MapBubble />}
            </div>
          </div>
          <div className="container-fluid">
            <div className="row mapFooter">
            </div>
          </div>
        </div>

        </div>
      );
  }
};

export default MapPage;