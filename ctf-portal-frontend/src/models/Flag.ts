import FlagStatus from "./enums/FlagStatus";
import Team from "./enums/Team";

export default interface Flag {
  id: number;
  team: Team;
  hash: string;
  description: string;
  story: string;
  submitted: boolean;
  status: FlagStatus;
}
