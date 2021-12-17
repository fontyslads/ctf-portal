import { useAppDispatch, useAppSelector } from "../../app/hooks";
import FlagStatus from "../../models/enums/FlagStatus";
import Flag from "../../models/Flag";
import { useTimer } from "react-timer-hook";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { listFlagsAsync, selectFlags } from "../SubmitFlag/FlagSlice";
import { useEffect } from "react";

dayjs.extend(utc);

export default function Timer() {
  const dispatch = useAppDispatch();
  const flags = useAppSelector(selectFlags) || [];
  let activeFlag: Flag | undefined = undefined;

  const { seconds, minutes, isRunning, restart, pause } = useTimer({
    expiryTimestamp: getExpiryTime(flags),
    autoStart: false,
    onExpire: () => {
      dispatch(listFlagsAsync());
      if (
        flags.filter(
          (f) =>
            f.status === FlagStatus.Valid || f.status === FlagStatus.TimedOut
        ).length === flags.length
      )
        pause();
    },
  });

  function getActiveFlag(flags: Flag[]) {
    if (
      flags.filter(
        (f) => f.status === FlagStatus.Valid || f.status === FlagStatus.TimedOut
      ).length === 6
    )
      activeFlag = undefined;

    flags
      .slice(0)
      .reverse()
      .forEach((flag: Flag) => {
        if (
          flag.startTime &&
          flag.status !== FlagStatus.Valid &&
          flag.status !== FlagStatus.TimedOut
        ) {
          activeFlag = flag;
        }
      });
    return activeFlag;
  }

  function getExpiryTime(flags: Flag[]) {
    if (flags) {
      const flag = getActiveFlag(flags);

      if (flag) {
        const start = dayjs.utc(flag.startTime);
        const end = start.second(start.second() + flag.timeLimit);
        return new Date(end.toISOString());
      }
    }
    return new Date();
  }

  useEffect(() => {
    if (flags) {
      if (!isRunning) {
        const time = getExpiryTime(flags);
        restart(time);
      }
    }
  });

  return activeFlag ? (
    <div className="absolute top-10 right-10 bg-white rounded p-4 text-8xl bg-opacity-50">
      <div style={{ fontSize: "100px" }}>
        <span>{minutes.toString().length === 1 ? `0${minutes}` : minutes}</span>
        :
        <span>{seconds.toString().length === 1 ? `0${seconds}` : seconds}</span>
      </div>
    </div>
  ) : (
    <div></div>
  );
}
