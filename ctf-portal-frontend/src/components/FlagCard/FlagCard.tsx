import React from "react";
import { connect } from "react-redux";
import { Collapse } from "react-bootstrap";

//components
import SubmitFlag from "../SubmitFlag/SubmitFlag";
import confetti from "canvas-confetti";

//models
import Flag from "../../models/Flag";
import FlagStatus from "../../models/enums/FlagStatus";

class FlagCard extends React.Component<{
  flag: Flag;
  flags: Flag[];
  componentDidUpdate?: (arg0: { flag: Flag }) => void;
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

  getBackgroundColor() {
    switch (this.props.flag.status) {
      case FlagStatus.Invalid:
      case FlagStatus.Errored:
        return "bg-red-500";
      case FlagStatus.Valid:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  }

  componentDidUpdate(props: { flag: Flag }) {
    if (
      props &&
      props.flag &&
      this.props.flag.status === FlagStatus.Valid &&
      props.flag.status !== FlagStatus.Valid
    ) {
      this.runConfetti();
    }
  }

  runConfetti() {
    const myCanvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!myCanvas) return;
    const myConfetti = confetti.create(myCanvas, {
      resize: true,
      useWorker: true,
    });
    myConfetti({
      particleCount: 500,
      spread: 160,
    });
  }

  render() {
    return (
      <div className="flex md:contents">
        <div className="col-start-2 col-end-4 mr-10 md:mx-auto relative">
          <div className="h-full w-6 flex items-center justify-center">
            <div
              className={`${this.getBackgroundColor()} h-full w-1 pointer-events-none`}
            ></div>
          </div>
          <div
            className={`${this.getBackgroundColor()} w-6 h-6 absolute top-1/2 -mt-3 rounded-full shadow text-center`}
          >
            <i className="fas fa-check-circle text-white"></i>
          </div>
        </div>
        <div
          className={`${this.getBackgroundColor()} 
          col-start-4 col-end-12 p-4 rounded-xl my-4 mr-auto shadow-md w-full flex flex-col items-start gap-4`}
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
        <canvas
          id="canvas"
          className="z-10 fixed top-0 left-0 w-full h-full pointer-events-none"
        />
      </div>
    );
  }
}

const mapStateToProps = (state: { flag: { flags: any } }) => {
  return {
    flags: state.flag.flags,
  };
};

export default connect(mapStateToProps)(FlagCard);
