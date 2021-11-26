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
import Keycloak from "keycloak-js";
import AuhtGuard from "./components/Auth demo/AuhtGuard/AuhtGuard";




class App extends React.Component<any,any> {

  render() {

      return (
         <AuhtGuard/>
      );

  }
}

export default App;

// <div className="App">
//
//
//     <BrowserRouter>
//         <div className="container">
//             <ul>
//                 <li><Link to="/">public component</Link></li>
//                 <li><Link to="/secured">secured component</Link></li>
//             </ul>
//             <Route exact path="/" component={FlagList} />
//             <Route path="/secured" component={Secured} />
//         </div>
//     </BrowserRouter>
// </div>