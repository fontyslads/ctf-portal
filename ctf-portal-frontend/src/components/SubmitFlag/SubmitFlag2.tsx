import React from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import FlagStatus from "../../models/enums/FlagStatus";
import Flag from "../../models/Flag";
import { submitFlagAsync } from "./FlagSlice";
import {IWithGoogleReCaptchaProps, useGoogleReCaptcha, withGoogleReCaptcha} from "react-google-recaptcha-v3";
import {IGoogleReCaptchaConsumerProps} from "react-google-recaptcha-v3/dist/types/google-recaptcha-provider";


const SITE_KEY = "6LdeqJkcAAAAAFcW4LbVNriRt-fMTu0DZHBrYb-0";

class SubmitFlag extends React.Component<any, any> {

  constructor(props: any) {
    super(props);

  }


   async handleSubmitRecaptcha()  {
    try {
        console.log('test');
        const { executeRecaptcha } = (this.props as unknown as  IWithGoogleReCaptchaProps).googleReCaptchaProps;

        if (!executeRecaptcha) {
            console.log('Recaptcha has not been loaded');
            return;
        }
          const token = await executeRecaptcha("MS_Pyme_DatosEmpresa");
          console.log(token)
    } catch (err) {
      throw new Error("Token error");
    }
  };

  render() {
    return (
      <form className="flex gap-2" onSubmit={this.handleSubmitRecaptcha}>
        <div className="flex">
          <span className="text-sm text-black flex items-center rounded-l px-4 py-2 bg-yellow-300 whitespace-no-wrap">
            Flag:
          </span>
          <input
            name="field_name"
            className="text-black rounded-r px-4 py-2 w-full"
            type="text"
            placeholder="Enter your flag..."
          />
        </div>
        <Button type="submit">Validate</Button>
          <div className="p-0 text-black">
            <i className="fas fa-circle-notch fa-spin fa-2x"></i>
          </div>

      </form>
    );
  }
}

export default connect(null, { submitFlagAsync })(withGoogleReCaptcha(SubmitFlag));
