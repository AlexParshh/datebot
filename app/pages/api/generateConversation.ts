import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import { getMessages, cleanMessages } from "./messages";
import {
  ModelType,
  createConvoPromptWithInfo,
  createConvoPromptWithoutInfo,
  removeEdgeQuotes,
} from "../../lib/gpt";

type ResponseData = {
  message: string;
  latestMessageId: string;
  response: any;
};

export const ZodModelType = z.enum(["GPT-3.5-Turbo", "GPT-4"]);

const requestBodySchema = z.object({
  userId: z.string(),
  matchId: z.string(),
  profileId: z.string(),
  xAuthToken: z.string(),
  userSessionId: z.string(),
  model: ZodModelType,
  personalInfo: z.string().optional(),
});

// request must contian
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    handlePostRequest(req, res);
  } else {
    res
      .status(400)
      .json({
        response: "",
        latestMessageId: "",
        message: "Invalid request method",
      });
  }
}

const handlePostRequest = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  try {
    const {
      userId,
      xAuthToken,
      userSessionId,
      matchId,
      profileId,
      model,
      personalInfo,
    } = requestBodySchema.parse(req.body);
    const { response, latestMessageId } = await generateConversation(
      xAuthToken,
      userSessionId,
      userId,
      matchId,
      profileId,
      model,
      personalInfo
    );
    res.status(200).json({ response, latestMessageId, message: "Success." });
  } catch (error) {
    console.error("Invalid request body:", error);
    res
      .status(400)
      .json({ response: "", latestMessageId: "", message: "Fail." });
  }
};

// this method will take in a match's message history and generate a follow up message for them.
const generateConversation = async (
  xAuthToken: string,
  userSessionId: string,
  userId: string,
  matchId: string,
  profileId: string,
  model: ModelType,
  personalInfo: string | undefined
) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const messageHistory = await getMessages(matchId, xAuthToken, userSessionId);
  const latestMessageId = messageHistory.slice(-1)[0]._id;

  console.log(latestMessageId)
  const cleanMessageHistory = cleanMessages(messageHistory, profileId);
  const messagesString = JSON.stringify(cleanMessageHistory);

  // if we have additional personal information, we will use that in the prompt.
  let prompt;
  if (personalInfo) {
    prompt = createConvoPromptWithInfo(personalInfo, messagesString);
  } else {
    prompt = createConvoPromptWithoutInfo(messagesString);
  }

  const chatCompletion = await openai.createChatCompletion({
    model: model.toLowerCase(),
    messages: [{ role: "system", content: prompt }],
  });

  return {
    response: removeEdgeQuotes(
      chatCompletion.data.choices[0].message?.content || ""
    ),
    latestMessageId,
  };
};
