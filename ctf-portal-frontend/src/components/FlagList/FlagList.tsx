import React from "react";
import { connect } from "react-redux";
import { listFlagsAsync } from "../SubmitFlag/FlagSlice";
import styles from "./FlagList.module.scss";
import Flag from "../../models/Flag";
import FlagCard from "../FlagCard/FlagCard";

import Platform from "../Animation/Platform/Platform";
import CommTower from "../Animation/CommTower/CommTower";
import Crossover from "../Animation/Crossover/Crossover";
import FlagStatus from "../../models/enums/FlagStatus";

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

  getBackgroundStage() {
    const flags = this.props.flags || [];

    console.log(flags);
    console.log(typeof flags);

    const numberSubmitted = flags.filter(
      (flag) => flag.status === FlagStatus.Valid
    ).length;

    if (numberSubmitted < 2) return <Platform />;
    else if (numberSubmitted < 3) return <CommTower />;
    else return <Crossover />;
  }

  render() {
    return (
      <div className={styles.background_container}>
        {this.getBackgroundStage()}
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
