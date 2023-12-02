import type { NextApiRequest, NextApiResponse } from "next";
import { createTinderAxios } from "../../lib/tinderaxios";
import { AxiosInstance } from "axios";
import { z } from "zod";

type ResponseData = {
  message: string;
  likeResult: any;
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
    res.status(400).json({ likeResult: null, message: "Invalid request method" });
  }
}

const handlePostRequest = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {

  try {
    const { xAuthToken, userSessionId, userId } = requestBodySchema.parse(req.body);
    const like = await sendLike(xAuthToken, userSessionId, userId);
    res.status(200).json({ likeResult:like, message: "Success." });
  } catch (error) {
    console.error("Invalid request body:", error);
    res.status(400).json({ likeResult:null, message: "Fail." });
  }

};

const sendLike = async (xAuthToken: string, userSessionId: string, userId: string) => {

  const tinderAxios: AxiosInstance = createTinderAxios(
    xAuthToken,
    "",
    userSessionId
  );

  try {
    const like = await tinderAxios.get("/like/"+userId);
    return like.data
  } catch (e) {
    console.error(e)
    return
  }
};
