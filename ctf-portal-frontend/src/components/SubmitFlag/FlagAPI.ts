import AxiosRequestHandler from "../../utils/axiosRequestHandler";

export async function submitFlag(hash: string, team: string = "Blue") {
  return AxiosRequestHandler.post("/flag/submit", { hash, team }).then(
    (valid: boolean) => {
      return valid;
    }
  );
}
