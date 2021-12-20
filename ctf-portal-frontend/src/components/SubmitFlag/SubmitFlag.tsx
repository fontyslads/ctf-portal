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
    );
  }
}

export default connect(null, { submitFlagAsync })(SubmitFlag);
