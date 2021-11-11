import React from "react";
import "./App.scss";

//components

import Flag from "./models/Flag";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import {Button} from "react-bootstrap";


function GoogleRecaptchaExample() {
  return null;
}

class App extends React.Component {

  render() {
    return (
      <div className="App">
        {/*<FlagList />*/}

        <GoogleReCaptchaProvider
            reCaptchaKey="6LdeqJkcAAAAAFcW4LbVNriRt-fMTu0DZHBrYb-0"
            language="en-AU"
         >
        <Button>testttttttfg</Button>
        </GoogleReCaptchaProvider>
      </div>
    );
  }
}

export default App;
