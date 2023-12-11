import type { NextApiRequest, NextApiResponse } from "next";
import { createTinderAxios } from "../../lib/tinderaxios";
import { AxiosInstance } from "axios";
import { z } from "zod";

type ResponseData = {
  message: string;
};

const requestBodySchema = z.object({
  lat: z.string(),
  lon: z.string(),
  xAuthToken: z.string(),
  userSessionId: z.string(),
});

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    handlePostRequest(req, res);
  } else {
    res.status(400).json({ message: "Invalid request method" });
  }
}

const handlePostRequest = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  try {
    const { lat, lon, xAuthToken, userSessionId } = requestBodySchema.parse(req.body);
    await ping(lat, lon, xAuthToken, userSessionId);
    res.status(200).json({ message: "Success." });
  } catch (e) {
    console.error(e)
    res.status(200).json({ message: "Fail." });
  }

};

// updates your location on tinder 
const ping = async (
  lat: string,
  lon: string,
  xAuthToken: string,
  userSessionId: string
) => {

  const tinderAxios: AxiosInstance = createTinderAxios(
    xAuthToken,
    "",
    userSessionId
  );

  const postBody = {
    lat,lon
  };

  try {
    await tinderAxios.post(
      `user/ping`,
      postBody
    );

    console.log("PINGEDDDEDEDE")
    return
  } catch (e) {
    console.error(e);
    return
  }
};
