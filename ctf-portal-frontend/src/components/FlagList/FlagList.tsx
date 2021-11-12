import React from "react";
import { connect } from "react-redux";
import { listFlagsAsync } from "../SubmitFlag/FlagSlice";
import styles from "./FlagList.module.scss";
import Flag from "../../models/Flag";

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

  getBackgroundStage() {
    const flags = this.props.flags || [];

    const numberSubmitted = flags.filter(
      (flag) => flag.status === FlagStatus.Valid
    ).length;

    if (numberSubmitted < 2) return <Platform flags={flags} />;
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
