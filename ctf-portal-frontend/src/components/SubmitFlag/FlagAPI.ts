import Team from "../../models/enums/Team";
import Flag from "../../models/Flag";
import AxiosRequestHandler from "../../utils/axiosRequestHandler";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import ReCaptchaHandler from "../../utils/ReCaptchaHandler";




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
  token: string,
  team: string = "Blue",
) {

        return AxiosRequestHandler.post("/flag/submit", {id, hash, team, token})
            .then((valid: boolean) => {
                return valid;
            })
            .catch((err: any) => {
                throw err;
            });
}
