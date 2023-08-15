import type { NextApiRequest, NextApiResponse } from "next";
import { createTinderAxios } from "../../lib/tinderaxios";
import { AxiosInstance } from "axios";
import { z } from "zod";

type ResponseData = {
  message: string;
};

const requestBodySchema = z.object({
  matchId: z.string(),
  profileId: z.string(),
  otherId: z.string(),
  xAuthToken: z.string(),
  userSessionId: z.string(),
  message: z.string()
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
    const { matchId, profileId, otherId, xAuthToken, userSessionId, message } = requestBodySchema.parse(req.body);
    await sendMessage(matchId, profileId, otherId, message, xAuthToken, userSessionId);
    res.status(200).json({ message: "Success." });
  } catch (e) {
    console.error(e)
    res.status(200).json({ message: "Fail." });
  }

};

// userId is the ID of the main user
// otherId is the ID of the person the user is matched with (the person you want to message)
const sendMessage = async (
  matchId: string,
  userId: string,
  otherId: string,
  message: string,
  xAuthToken: string,
  userSessionId: string
) => {

  const tinderAxios: AxiosInstance = createTinderAxios(
    xAuthToken,
    "",
    userSessionId
  );

  const postBody = {
    userId,
    otherId,
    matchId,
    sessionId: null,
    message,
  };

  try {
    await tinderAxios.post(
      `user/matches/${matchId}?locale=en`,
      postBody
    );
    return
  } catch (e) {
    console.error(e);
    return
  }
};
