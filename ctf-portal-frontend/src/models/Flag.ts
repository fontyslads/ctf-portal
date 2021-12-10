import FlagStatus from "./enums/FlagStatus";
import Team from "./enums/Team";

export default interface Flag {
  id: number;
  flagNumber: number;
  team: Team;
  hash: string;
  description: string;
  story: string;
  submitted: boolean;
  status: FlagStatus;
  attempts: number;
  timeLimit: number;
  startTime: string;
  timeTaken: number;
}
