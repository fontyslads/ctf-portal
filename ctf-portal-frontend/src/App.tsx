import React, {ReactNode} from "react";
import "./App.scss";

//components
import FlagList from "./components/FlagList/FlagList";
import {BrowserRouter, Link, Switch} from "react-router-dom";

import {
    BrowserRouter as Router,
    Route
} from "react-router-dom";
import Welcome from "./components/Auth demo/Welcome/Welcome";
import Secured from "./components/Auth demo/Secured/Secured";




class App extends React.Component {
  render() {
    return (

      <div className="App">
          <BrowserRouter>
              <div className="container">
                  <ul>
                      <li><Link to="/">public component</Link></li>
                      <li><Link to="/secured">secured component</Link></li>
                  </ul>
                  <Route exact path="/" component={Welcome} />
                  <Route path="/secured" component={Secured} />
              </div>
          </BrowserRouter>
      </div>
    );
  }
}

export default App;
