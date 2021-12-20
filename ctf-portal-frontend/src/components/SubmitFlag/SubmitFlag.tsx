import React from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import FlagStatus from "../../models/enums/FlagStatus";
import Flag from "../../models/Flag";
import { submitFlagAsync } from "./FlagSlice";

class SubmitFlag extends React.Component<
  {
    submitFlagAsync: (arg0: { id: number; value: string }) => void;
    flag: Flag;
  },
  { value: string }
> {
  constructor(props: any) {
    super(props);

    this.state = { value: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: { target: { value: string } }) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event: { preventDefault: () => void }) {
    const submittedFlag = {
      id: this.props.flag.id,
      value: this.state.value,
    };

    this.props.submitFlagAsync(submittedFlag);
    event.preventDefault();
  }

  render() {
    return (
      <div className="flex flex-col gap-2">
        {this.props.flag.status === FlagStatus.Invalid ? (
          <div className="h-12 py-2">
            <div className="flex items-center gap-2">
              <p>Flag status:</p>
              <i className="fas fa-times"></i>
            </div>
            <p>Invalid attempts: {this.props.flag.attempts}</p>
          </div>
        ) : (
          <div></div>
        )}
        {this.props.flag.status === FlagStatus.Errored ? (
          <div className="h-12 p-2 bg-red-500 rounded">
            {this.props.flag.errorMsg}
          </div>
        ) : (
          <div></div>
        )}
        {this.props.flag.status !== FlagStatus.Invalid &&
        this.props.flag.status !== FlagStatus.Errored ? (
          <div className="h-12"></div>
        ) : (
          <div></div>
        )}

        <form className="flex gap-2" onSubmit={this.handleSubmit}>
          <div className="flex">
            <span className="flex items-center px-4 py-2 text-sm text-black whitespace-no-wrap bg-yellow-300 rounded-l">
              Flag:
            </span>
            <input
              name="field_name"
              className="w-full px-4 py-2 text-black rounded-r"
              type="text"
              placeholder="Enter your flag..."
              onChange={this.handleChange}
              value={this.state.value}
            />
          </div>
          <Button type="submit">Validate</Button>
          {this.props.flag.status === FlagStatus.Pending ? (
            <div className="p-0 text-black">
              <i className="fas fa-circle-notch fa-spin fa-2x"></i>
            </div>
          ) : (
            ""
          )}
        </form>
      </div>
    );
  }
}

export default connect(null, { submitFlagAsync })(SubmitFlag);
