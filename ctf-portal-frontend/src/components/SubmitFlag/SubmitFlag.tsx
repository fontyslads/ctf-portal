import React from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import FlagStatus from "../../models/enums/FlagStatus";
import Flag from "../../models/Flag";
import { submitFlagAsync } from "./FlagSlice";
import {IWithGoogleReCaptchaProps, useGoogleReCaptcha, withGoogleReCaptcha} from "react-google-recaptcha-v3";
import {IGoogleReCaptchaConsumerProps} from "react-google-recaptcha-v3/dist/types/google-recaptcha-provider";
import {submitFlag} from "./FlagAPI";



const SITE_KEY = "6LdeqJkcAAAAAFcW4LbVNriRt-fMTu0DZHBrYb-0";

class SubmitFlag extends React.Component<
  {
      submitFlagAsync: (arg0: { id: number; value: string;  token: string }) => void;
      flag: Flag;

  },
  { value: string;
      token?: string;
  }
>
{

  constructor(props: any) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
      this.state = {value: "", token: undefined };
  }

  handleChange(event: { target: { value: string } }) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(token: string) {
    const submittedFlag = {
      id: this.props.flag.id,
      value: this.state.value,
      token: token
    };

    this.props.submitFlagAsync(submittedFlag);
  }


    handleVerifyRecaptcha = async () => {

      try {
          const { executeRecaptcha } = (this.props as IWithGoogleReCaptchaProps)
              .googleReCaptchaProps;

          if (!executeRecaptcha) {
              console.log('Recaptcha has not been loaded');

              return;
          }

          const token = await executeRecaptcha('homepage');

          this.setState({ token });
      }catch (e){
          throw e;
      }

    };

  render() {
      const { token } = this.state;
    return (
      <form className="flex gap-2" onSubmit={this.handleVerifyRecaptcha}>
        <div className="flex">
          <span className="text-sm text-black flex items-center rounded-l px-4 py-2 bg-yellow-300 whitespace-no-wrap">
            Flag:
          </span>
          <input
            name="field_name"
            className="text-black rounded-r px-4 py-2 w-full"
            type="text"
            placeholder="Enter your flag..."
            onChange={this.handleChange}
            value={this.state.value}
          />
        </div>
        <Button type="submit">Validate</Button>
          <p>Token: {token}</p>
        {this.props.flag.status === FlagStatus.Pending ? (
          <div className="p-0 text-black">
            <i className="fas fa-circle-notch fa-spin fa-2x"></i>
          </div>
        ) : (
          ""
        )}
      </form>
    );
  }
} const SubmitFlagRe = withGoogleReCaptcha(SubmitFlag);
export default connect(null, { submitFlagAsync })(SubmitFlagRe);
