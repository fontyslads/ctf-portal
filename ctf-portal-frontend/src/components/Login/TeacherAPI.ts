import Teacher from "../../models/Teacher";
import AxiosRequestHandler from "../../utils/axiosRequestHandler";

export async function startWorkshop() {
  return AxiosRequestHandler.get("/teacher/start")
    .then((any: any) => {
      return any;
    })
    .catch((err: any) => {
      throw err;
    });
}

export async function login(username: string, password: string) {
  return AxiosRequestHandler.post("/teacher/login", { username, password })
    .then((teacher: Teacher) => {
      return teacher;
    })
    .catch((err: any) => {
      throw err;
    });
}
