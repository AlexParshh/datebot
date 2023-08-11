import type { NextApiRequest, NextApiResponse } from "next";
import { createTinderAxios } from "../../lib/tinderaxios";
import { AxiosInstance } from "axios";
import { z } from "zod";

type ResponseData = {
  message: string;
  profile: any;
};

const requestBodySchema = z.object({
  xAuthToken: z.string(),
  userSessionId: z.string()
});

// request must contian
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    handlePostRequest(req, res);
  } else {
    res.status(400).json({ profile: null, message: "Invalid request method" });
  }
}

const handlePostRequest = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {

  try {
    const { xAuthToken, userSessionId } = requestBodySchema.parse(req.body);
    const userProfile = await getProfile(xAuthToken, userSessionId);
    res.status(200).json({ profile:userProfile, message: "Success." });
  } catch (error) {
    console.error("Invalid request body:", error);
    res.status(400).json({ profile:null, message: "Fail." });
  }

};

const getProfile = async (xAuthToken: string, userSessionId: string) => {
  // const xAuthToken = "ad457a2a-9500-4d9f-8008-f702299086b5";
  // const appSessionId = "3d806021-1a6e-47ae-adc3-8bbfea45e7e3";
  // const userSessionId = "895248a5-e6f7-4a58-b630-ae97a8c7202c";
  // ben info
  // const xAuthToken = "dbdfbecc-3568-49d1-9b5c-9692eba37ccb";
  // const appSessionId = "bb1cdf67-0c12-474e-a98b-81d93fcc96b8";
  // const userSessionId = "a4609f6d-21d0-4ee7-8fa9-9f37e6e9a053";

  const tinderAxios: AxiosInstance = createTinderAxios(
    xAuthToken,
    "",
    userSessionId
  );

  console.log("Geting profile")

  try {
    const profile = await tinderAxios.get("/v2/profile?locale=en&include=likes%2Cofferings%2Cpaywalls%2Cplus_control%2Cpurchase%2Cuser");
    console.log(profile)
    return profile.data.data
  } catch (e) {
    console.error(e)
    return
  }
};
