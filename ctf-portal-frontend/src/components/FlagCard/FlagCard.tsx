import React from "react";
import { connect } from "react-redux";
import { Collapse } from "react-bootstrap";

//components
import SubmitFlag from "../SubmitFlag/SubmitFlag";

//models
import Flag from "../../models/Flag";
import FlagStatus from "../../models/enums/FlagStatus";

class FlagCard extends React.Component<
  {
    flag: Flag;
    flags: Flag[];
  },
  { showHint: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { showHint: false };
  }

  allowSubmit() {
    if (
      this.props.flag.status === FlagStatus.Valid ||
      this.props.flag.status === FlagStatus.TimedOut
    )
      return false;
    else if (this.props.flag.id === 1) return true;

    let allow = false;
    this.props.flags.forEach((f) => {
      if (
        f.id === this.props.flag.id - 1 &&
        (f.status === FlagStatus.Valid || f.status === FlagStatus.TimedOut)
      )
        allow = true;
    });
    return allow;
  }

  render() {
    return (
      <div className="flex md:contents">
        <div className="flex flex-col items-start w-full col-start-4 col-end-12 gap-4 p-4 mr-auto ">
          <div className="flex flex-col items-start gap-2 text-black">
            <h1 className="text-2xl font-semibold">
              Flag {this.props.flag.id}
            </h1>
            <Collapse in={this.allowSubmit()}>
              <div className="flex flex-col gap-2">
                <p className="w-full leading-tight text-justify">
                  {this.props.flag.description}
                </p>
                <SubmitFlag flag={this.props.flag} />
                <div className="flex items-center h-8 gap-2">
                  <button
                    className="hover:underline"
                    onClick={() =>
                      this.setState({ showHint: !this.state.showHint })
                    }
                  >
                    {this.state.showHint ? (
                      <span>Hide hint:</span>
                    ) : (
                      <span>Show hint:</span>
                    )}
                  </button>
                  <Collapse in={this.state.showHint}>
                    <p>{this.props.flag.hint}</p>
                  </Collapse>
                </div>
              </div>
            </Collapse>
          </div>
          <Collapse in={!this.allowSubmit()}>
            <p className="w-full leading-tight text-justify">
              {this.props.flag.story}
            </p>
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
