import React from "react";
import { connect } from "react-redux";
import { Collapse } from "react-bootstrap";

//components
import SubmitFlag from "../SubmitFlag/SubmitFlag";

//models
import Flag from "../../models/Flag";
import FlagStatus from "../../models/enums/FlagStatus";

class FlagCard extends React.Component<{
  flag: Flag;
  flags: Flag[];
}> {
  allowSubmit() {
    if (this.props.flag.status === FlagStatus.Valid) return false;
    else if (this.props.flag.id === 1) return true;

    let allow = false;
    this.props.flags.forEach((f) => {
      if (f.id === this.props.flag.id - 1 && f.status === FlagStatus.Valid)
        allow = true;
    });
    return allow;
  }

  render() {
    return (
      <div className="flex md:contents">
        <div
          className="
          col-start-4 col-end-12 p-4 mr-auto w-full flex flex-col items-start gap-4"
        >
          <div className="flex flex-col items-start gap-2 text-black">
            <h1 className="font-semibold text-2xl">
              Flag {this.props.flag.id}
            </h1>
            <p className="leading-tight text-justify w-full">
              {this.props.flag.description}
            </p>
          </div>
          <Collapse in={this.allowSubmit()}>
            <div>
              <SubmitFlag flag={this.props.flag} />
            </div>
          </Collapse>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: { flag: { flags: Flag[] } }) => {
  return {
    flags: state.flag.flags,
  };
};

export default connect(mapStateToProps)(FlagCard);
