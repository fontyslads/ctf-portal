import Team from "../../models/enums/Team";
import Flag from "../../models/Flag";
import AxiosRequestHandler from "../../utils/axiosRequestHandler";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";

const SITE_KEY = "6LdeqJkcAAAAAFcW4LbVNriRt-fMTu0DZHBrYb-0";


export async function listFlags(team: Team) {
  return AxiosRequestHandler.get(`/flag/${team}`)
    .then((flags: Flag[]) => {
      return flags;
    })
    .catch((err: any) => {
      throw err;
    });
}

const createToken = async () => {
    try {
        const { executeRecaptcha } = useGoogleReCaptcha();
        if (executeRecaptcha) {
            const newToken = await executeRecaptcha("MS_Pyme_DatosEmpresa");
            return newToken
        }
    } catch (err) {
        throw new Error("Token error");
    }
};
  // create token =>
export async function submitFlag(
  id: number,
  hash: string,
  team: string = "Blue"
) {

    if (await createToken()) {
       const token = await createToken();
        return AxiosRequestHandler.post("/flag/submit", {id, hash, team, token, SITE_KEY})
            .then((valid: boolean) => {
                return valid;
            })
            .catch((err: any) => {
                throw err;
            });
    } else {
    }

}
