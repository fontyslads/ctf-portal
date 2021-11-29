import { useAppSelector } from "../../app/hooks";
import FlagStatus from "../../models/enums/FlagStatus";
import Flag from "../../models/Flag";
import { useTimer } from "react-timer-hook";

import { selectFlags } from "../SubmitFlag/FlagSlice";
import { useEffect } from "react";

export default function Timer() {
  const flags = useAppSelector(selectFlags);

  const { seconds, minutes, isRunning, restart } = useTimer({
    expiryTimestamp: getExpiryTime(flags),
    autoStart: false,
    onExpire: () => {
      //TODO: request to API for updated flags
      console.warn("onExpire called");
    },
  });

  function getActiveFlag(flags: Flag[]) {
    let activeFlag = flags[0];
    flags.forEach((flag: Flag) => {
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
        const start = new Date(flag.startTime);
        const end = start;
        end.setSeconds(end.getSeconds() + flag.timeLimit);
        return end;
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

  return (
    <div className="absolute top-10 right-10 bg-white rounded p-4 text-8xl bg-opacity-50">
      <div style={{ fontSize: "100px" }}>
        <span>{minutes.toString().length === 1 ? `0${minutes}` : minutes}</span>
        :
        <span>{seconds.toString().length === 1 ? `0${seconds}` : seconds}</span>
      </div>
    </div>
  );
}
