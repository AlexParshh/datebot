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

  const { matchId, profileId, otherId, xAuthToken, userSessionId, message } = requestBodySchema.parse(req.body);

  // const matchId = "64644e786a37a00100445b1a64692f733a1a4c0100adfd51";
  // const userId = "64692f733a1a4c0100adfd51";
  // const otherId = "64644e786a37a00100445b1a"
  // const message = "test 2"

  await sendMessage(matchId, profileId, otherId, message, xAuthToken, userSessionId);

  res.status(200).json({ message: "Success." });
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
