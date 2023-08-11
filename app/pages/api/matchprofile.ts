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
  userSessionId: z.string(),
  userId: z.string()
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
    const { xAuthToken, userSessionId, userId } = requestBodySchema.parse(req.body);
    const userProfile = await getMatchProfile(xAuthToken, userSessionId, userId);
    res.status(200).json({ profile:userProfile, message: "Success." });
  } catch (error) {
    console.error("Invalid request body:", error);
    res.status(400).json({ profile:null, message: "Fail." });
  }

};

// userId is the ID of the user whose information you want to get
const getMatchProfile = async (xAuthToken: string, userSessionId: string, userId: string) => {

  const tinderAxios: AxiosInstance = createTinderAxios(
    xAuthToken,
    "",
    userSessionId
  );

  try {
    const profile = await tinderAxios.get(`/user/${userId}?locale=en`);
    return profile.data.results
  } catch (e) {
    console.error(e)
    return
  }
};
