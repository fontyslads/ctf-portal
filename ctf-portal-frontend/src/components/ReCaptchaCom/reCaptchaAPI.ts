import Team from "../../models/enums/Team";
import Flag from "../../models/Flag";
import AxiosRequestHandler from "../../utils/axiosRequestHandler";




export async function submitReCaptchaToken(
    secretKey: string, token: string
) {
  return AxiosRequestHandler.post("/flag/test", { token, secretKey })
    .then((res: any) => {
      return res;
    })
    .catch((err: any) => {
      throw err;
    });
}
