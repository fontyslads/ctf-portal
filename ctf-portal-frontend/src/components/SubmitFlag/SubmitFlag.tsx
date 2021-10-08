import React from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { submitFlagAsync } from "./FlagSlice";

class SubmitFlag extends React.Component<
  { submitFlagAsync: (arg0: string) => void },
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
    this.props.submitFlagAsync(this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form className="flex gap-2" onSubmit={this.handleSubmit}>
        <div className="flex">
          <span className="text-sm border border-2 rounded-l px-4 py-2 bg-gray-300 whitespace-no-wrap">
            Flag:
          </span>
          <input
            name="field_name"
            className="text-black border border-2 rounded-r px-4 py-2 w-full"
            type="text"
            placeholder="YoUr FlAg HeRe"
            onChange={this.handleChange}
            value={this.state.value}
          />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    );
  }
}

export default connect(null, { submitFlagAsync })(SubmitFlag);
