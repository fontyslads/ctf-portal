import axios, { AxiosResponse, AxiosError, Canceler } from "axios";
const CancelToken = axios.CancelToken;

class AxiosRequestHandler {
  private static cancel: Canceler;

  private static token = localStorage.getItem("token");

  private static api = axios.create({
    baseURL: process.env.REACT_APP_API_HOST,
    headers: {
      // "Content-Type": "application/json; charset=utf-8",
      // Accept: "application/json; charset=utf-8",
      // origin: "*",
      // Accept: "*/*",
      // "Content-Type": "application/json",
      Authorization: `Bearer ` + `${AxiosRequestHandler.token}`,
      // "Access-Control-Allow-Origin": `*`,

      // header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": `POST, GET, OPTIONS, PUT, DELETE`,
      "Access-Control-Allow-Headers": `Origin, Content-Type, X-Auth-Token, X-requested-With, Accept`,
      // "Access-Control-Allow-Origin": `http://localhost:5000/`,
    },
    // baseURL: "http://172.16.1.19:5000",
  });

  public static get(url: string): any {
    if (AxiosRequestHandler.cancel) AxiosRequestHandler.cancel();
    return this.api
      .get(url, {
        cancelToken: new CancelToken(function executor(c) {
          AxiosRequestHandler.cancel = c;
        }),
      })
      .then((res: AxiosResponse<any>) => {
        return res.data;
      })
      .catch((err: AxiosError) => {
        if (axios.isCancel(err)) return;
        if (err.response) {
          return err.response;
        }
      });
  }

  public static post(url: string, object: any): any {
    if (AxiosRequestHandler.cancel) AxiosRequestHandler.cancel();
    return this.api
      .post(url, object, {
        cancelToken: new CancelToken(function executor(c) {
          AxiosRequestHandler.cancel = c;
        }),
      })
      .then((res: AxiosResponse<any>) => {
        return res.data;
      })
      .catch((err: AxiosError) => {
        if (axios.isCancel(err)) return;
        if (err.response) {
          throw err.response;
        }
      });
  }

  public static put(url: string, object: any): any {
    if (AxiosRequestHandler.cancel) AxiosRequestHandler.cancel();
    return this.api
      .put(url, object, {
        cancelToken: new CancelToken(function executor(c) {
          AxiosRequestHandler.cancel = c;
        }),
      })
      .then((res: AxiosResponse<any>) => {
        return res;
      })
      .catch((err: AxiosError) => {
        if (axios.isCancel(err)) return;
        if (err.response) {
          return err.response;
        }
      });
  }

  public static delete(url: string, object: any): any {
    if (AxiosRequestHandler.cancel) AxiosRequestHandler.cancel();
    return this.api
      .delete(url, {
        data: object,
        cancelToken: new CancelToken(function executor(c) {
          AxiosRequestHandler.cancel = c;
        }),
      })
      .then((res: AxiosResponse<any>) => {
        return res;
      })
      .catch((err: AxiosError) => {
        if (axios.isCancel(err)) return;
        if (err.response) {
          return err.response;
        }
      });
  }
}

export default AxiosRequestHandler;
