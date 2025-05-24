// import axios from "axios";

// import { useCallback } from "react";

// export const createApi = (baseURL: string): AxiosInstance => {
//   return axios.create({
//     baseURL,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// };

// export const useApi = (baseURL: string) => {
//   const api = createApi(baseURL);

//   const get = useCallback(
//     async <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
//       return api.get<T>(url, config);
//     },
//     [api]
//   );

//   const post = useCallback(
//     async <T, D>(url: string, data: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
//       return api.post<T>(url, data, config);
//     },
//     [api]
//   );

//   return { get, post, api };
// };