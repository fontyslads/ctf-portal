import React from "react";
import "./App.scss";

//components

import Flag from "./models/Flag";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import {Button} from "react-bootstrap";
import ReCaptchaCom from "./components/ReCaptchaCom/ReCaptchaCom";
import FlagList from "./components/FlagList/FlagList";
import {WithGoogleRecaptchaExample2} from "./components/SubmitFlag/wer";
import SubmitFlag2 from "./components/SubmitFlag/SubmitFlag2";
import SubmitFlagRe from "./components/SubmitFlag/SubmitFlag";
import SubmitFlag from "./components/SubmitFlag/SubmitFlag";
import Team from "./models/enums/Team";
import FlagStatus from "./models/enums/FlagStatus";


function GoogleRecaptchaExample() {
  return null;
}

class App extends React.Component {

    componentDidMount() {
        loadReCaptcha();
    }
  render() {
    return (
      <div className="App">


        <GoogleReCaptchaProvider
            useRecaptchaNet
            reCaptchaKey="6LdeqJkcAAAAAFcW4LbVNriRt-fMTu0DZHBrYb-0"
            language="en-AU"
            // scriptProps={{ async: true, defer: true, appendTo: 'body' }}
            >
            {/*<ReCaptchaCom/>*/}
           {/*<WithGoogleRecaptchaExample2/>*/}
           {/* <ReCaptchaCom/>*/}
            <FlagList/>
        </GoogleReCaptchaProvider>


          {/*</GoogleReCaptchaProvider>,*/}
      </div>
    );
  }
}

export default App;
