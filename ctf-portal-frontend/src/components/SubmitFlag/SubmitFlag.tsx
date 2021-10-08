import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectFlagStatus, submitFlagAsync } from "./FlagSlice";

import styles from "./SubmitFlag.module.scss";

const SubmitFlag = () => {
  const flagStatus = useAppSelector(selectFlagStatus);
  const dispatch = useAppDispatch();

  return (
    <div className={styles.container}>
      <input type="text" placeholder="Submit flag..." />
      <button
        aria-label="Submit flag"
        onClick={() => dispatch(submitFlagAsync("first-flag"))}
      >
        Submit
      </button>
      {flagStatus}
    </div>
  );
};

export default SubmitFlag;
