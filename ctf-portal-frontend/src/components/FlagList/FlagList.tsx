import React from "react";
import { connect } from "react-redux";
import { listFlagsAsync } from "../SubmitFlag/FlagSlice";
import styles from "./FlagList.module.scss";
import Flag from "../../models/Flag";
import FlagCard from "../FlagCard/FlagCard";

class FlagList extends React.Component<{
  listFlagsAsync: () => void;
  flags: Flag[];
}> {
  constructor(props: any) {
    super(props);
    this.props.listFlagsAsync();
  }

  getFlagCards() {
    const html: JSX.Element[] = [];
    const flags = this.props.flags || [];
    flags.forEach((flag, i) => {
      html.push(<FlagCard key={i} flag={flag} />);
    });

    return html;
  }

  render() {
    return (
      <div className={styles.FlagList}>
        <div className="p-4 mt-4">
          <h1 className="text-4xl text-center font-semibold mb-6">Blue Team</h1>
          <div className="container">
            <div className="flex flex-col md:grid grid-cols-12 text-gray-50">
              {this.getFlagCards()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: { flag: { flags: any } }) => {
  return {
    flags: state.flag.flags,
  };
};

export default connect(mapStateToProps, { listFlagsAsync })(FlagList);
