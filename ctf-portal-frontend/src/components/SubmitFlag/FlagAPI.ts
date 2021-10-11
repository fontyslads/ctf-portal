import Team from "../../models/enums/Team";
import Flag from "../../models/Flag";
import AxiosRequestHandler from "../../utils/axiosRequestHandler";

export async function listFlags(team: Team) {
  return AxiosRequestHandler.get(`/flag/${team}`)
    .then((flags: Flag[]) => {
      return flags;
    })
    .catch((err: any) => {
      throw err;
    });
}

export async function submitFlag(
  id: number,
  hash: string,
  team: string = "Blue"
) {
  return AxiosRequestHandler.post("/flag/submit", { id, hash, team })
    .then((valid: boolean) => {
      return valid;
    })
    .catch((err: any) => {
      throw err;
    });
}
