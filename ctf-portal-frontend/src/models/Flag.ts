import FlagStatus from "./enums/FlagStatus";
import Team from "./enums/Team";

export default interface Flag {
  id: number;
  flagNumber: number;
  team: Team;
  hash: string;
  description: string;
  story: string;
  hint: string[];
  submitted: boolean;
  status: FlagStatus;
  errorMsg: string;
  attempts: number;
  timeLimit: number;
  startTime: string;
  timeTaken: number;
}
