import React from "react";
import "./App.scss";

//components

import Flag from "./models/Flag";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import {Button} from "react-bootstrap";
import ReCaptchaCom from "./components/ReCaptchaCom/ReCaptchaCom";


function GoogleRecaptchaExample() {
  return null;
}

class App extends React.Component {

  render() {
    return (
      <div className="App">
        {/*<FlagList />*/}

        {/*<GoogleReCaptchaProvider*/}
        {/*    reCaptchaKey="6LdeqJkcAAAAAFcW4LbVNriRt-fMTu0DZHBrYb-0"*/}
        {/*    language="en-AU"*/}
        {/* >*/}
        {/*    <ReCaptchaCom/>*/}
        {/*</GoogleReCaptchaProvider>*/}

          <GoogleReCaptchaProvider
              reCaptchaKey="6LdeqJkcAAAAAFcW4LbVNriRt-fMTu0DZHBrYb-0"
          >
              <ReCaptchaCom/>
          </GoogleReCaptchaProvider>,
      </div>
    );
  }
}

export default App;
