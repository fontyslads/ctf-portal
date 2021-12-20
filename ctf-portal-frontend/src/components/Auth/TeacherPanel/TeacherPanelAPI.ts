import AxiosRequestHandler from "../../../utils/axiosRequestHandler";

export async function startWorkshop() {
  return AxiosRequestHandler.get("/teacher/start")
    .then((status: { started: boolean }) => {
      return status;
    })
    .catch((err: any) => {
      throw err;
    });
}
