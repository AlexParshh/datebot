import axios, { AxiosRequestConfig, AxiosInstance } from "axios";

export const createTinderAxios = (xAuthToken: string, appSessionId: string, userSessionId: string): AxiosInstance => {

  const headers: AxiosRequestConfig["headers"] = {
    authority: "api.gotinder.com",
    accept: "application/json",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en,en-US",
    "app-session-id": appSessionId,
    "app-session-time-elapsed": "285",
    "app-version": "1042901",
    origin: "https://tinder.com",
    "persistent-device-id": "5884c261-4cd6-4d81-b47f-b8330c738736",
    platform: "web",
    referer: "https://tinder.com/",
    "sec-ch-ua":
      '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "tinder-version": "4.29.1",
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    "user-session-id": userSessionId,
    "user-session-time-elapsed": "180",
    "x-auth-token": xAuthToken,
    "x-supported-image-formats": "webp,jpeg",
  };

  const axiosInstance = axios.create({
    baseURL: 'https://api.gotinder.com',
    headers,
  });

  return axiosInstance
};
