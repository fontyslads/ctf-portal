import React from "react";
import { connect } from "react-redux";
import { listFlagsAsync } from "../SubmitFlag/FlagSlice";
import styles from "./FlagList.module.scss";

import isEqual from "lodash.isequal";

//models
import Flag from "../../models/Flag";
import FlagStatus from "../../models/enums/FlagStatus";

//animation stages
import Platform from "../Animation/Platform/Platform";
import CommTower from "../Animation/CommTower/CommTower";
import Crossover from "../Animation/Crossover/Crossover";

class FlagList extends React.Component<
  {
    listFlagsAsync: () => void;
    initialized: boolean;
    flags: Flag[];
  },
  { allowedStage: number; activeStage: number }
> {
  private init: boolean;

  constructor(props: any) {
    super(props);
    this.props.listFlagsAsync();
    this.state = { allowedStage: 0, activeStage: 0 };
    this.init = false;
  }

  componentDidUpdate(props: any) {
    const oldFlags = props.flags || [];
    const flags = this.props.flags || [];
    if (!isEqual(oldFlags, flags)) {
      this.setStage();
    }
  }

  setStage() {
    this.setState((state, props) => {
      const flags = props.flags || [];
      const numberSubmitted = flags.filter(
        (flag) => flag.status === FlagStatus.Valid
      ).length;

      let allowedStage = 0;
      if (numberSubmitted < 2) allowedStage = 0;
      else if (numberSubmitted < 3) allowedStage = 1;
      else if (numberSubmitted < 5) allowedStage = 2;
      else allowedStage = 3;

      if (!this.props.initialized)
        return { ...state, allowedStage, activeStage: allowedStage };
      else return { ...state, allowedStage };
    });
  }

  getBackgroundStage(flags: Flag[]) {
    switch (this.state.activeStage) {
      case 0:
        return <Platform flags={flags} />;
      case 1:
        return <CommTower />;
      case 2:
        return <Crossover />;
      // case 3: return <TrainCrash />;
      default:
        return <Platform flags={flags} />;
    }
  }

  getStageSelectors() {
    return (
      <div className={styles.stage_selectors}>
        {this.state.allowedStage > this.state.activeStage ? (
          <div
            className={styles.selector}
            onClick={() =>
              this.setState({
                ...this.state,
                activeStage: this.state.activeStage + 1,
              })
            }
          >
            next stage
          </div>
        ) : (
          <div></div>
        )}
        {this.state.activeStage > 0 ? (
          <div
            className={styles.selector}
            onClick={() =>
              this.setState({
                ...this.state,
                activeStage: this.state.activeStage - 1,
              })
            }
          >
            previous stage
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }

  render() {
    const flags = this.props.flags || [];
    if (!flags.length) return <div></div>;

    return (
      <div>
        <div className={styles.background_container}>
          {this.getBackgroundStage(flags)}
        </div>
        {this.getStageSelectors()}
      </div>
    );
  }
}

const mapStateToProps = (state: {
  flag: { initialized: boolean; flags: Flag[] };
}) => {
  return {
    flags: state.flag.flags,
    initialized: state.flag.initialized,
  };
};

export default connect(mapStateToProps, { listFlagsAsync })(FlagList);
