import AxiosRequestHandler from "./axiosRequestHandler";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";

const SITE_KEY = "6LdeqJkcAAAAAFcW4LbVNriRt-fMTu0DZHBrYb-0";

class ReCaptchaHandler{

    private static executeRecaptcha = useGoogleReCaptcha().executeRecaptcha;



    static async createToken() {
        try {
            if (this.executeRecaptcha) {
                const newToken = await this.executeRecaptcha("MS_Pyme_DatosEmpresa");
                return newToken
            }
        } catch (err) {
            throw new Error("Token error");
        }
    }
}

export default ReCaptchaHandler;