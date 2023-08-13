import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import { getMessages, cleanMessages } from "./messages";

type ResponseData = {
  message: string;
  pickupline: any;
};

const requestBodySchema = z.object({
  userId: z.string(),
  matchId: z.string(),
  profileId: z.string(),
  xAuthToken: z.string(),
  userSessionId: z.string(),
});

// request must contian
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    handlePostRequest(req, res);
  } else {
    res.status(400).json({ pickupline: "", message: "Invalid request method" });
  }
}

const handlePostRequest = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  try {
    const { userId, xAuthToken, userSessionId, matchId, profileId } =
      requestBodySchema.parse(req.body);
    const pickupline = await generateConversation(
      xAuthToken,
      userSessionId,
      userId,
      matchId,
      profileId
    );
    res.status(200).json({ pickupline, message: "Success." });
  } catch (error) {
    console.error("Invalid request body:", error);
    res.status(400).json({ pickupline: "", message: "Fail." });
  }
};

// this method will take in a match's message history and generate a follow up message for them.
const generateConversation = async (
  xAuthToken: string,
  userSessionId: string,
  userId: string,
  matchId: string,
  profileId: string
) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  // first we need to get all of the matches specific information
  //   const matchProfile = await getMatchProfile(xAuthToken, userSessionId, userId);
  //   const cleanedMatchProfile = cleanMatchProfile(matchProfile);

  const messageHistory = await getMessages(matchId, xAuthToken, userSessionId);
  const cleanMessageHistory = cleanMessages(messageHistory, profileId);
  const messagesString = JSON.stringify(cleanMessageHistory);

  const prompt =
    "Respond to the following tinder message history in a funny and flirty manner, only output the next follow up message I would send nothing else, DO NOT ADD QUOTATION MARKS AROUND THE RESPONSE: " +
    messagesString;

  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  return chatCompletion.data.choices[0].message;
};
