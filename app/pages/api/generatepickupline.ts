import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import { getMatchProfile, cleanMatchProfile } from "./matchprofile";
import {
  removeEdgeQuotes,
  createPromptForBio,
  createPromptWithoutBio,
  ModelType,
} from "../../lib/gpt";

type ResponseData = {
  message: string;
  pickupline: any;
};

export const ZodModelType = z.enum(['GPT-3.5-Turbo', 'GPT-4']);

const requestBodySchema = z.object({
  userId: z.string(),
  xAuthToken: z.string(),
  userSessionId: z.string(),
  model: ZodModelType,
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
    const { userId, xAuthToken, userSessionId, model } =
      requestBodySchema.parse(req.body);
    const pickupline = await generatePickupLine(
      xAuthToken,
      userSessionId,
      userId,
      model
    );
    res.status(200).json({ pickupline, message: "Success." });
  } catch (error) {
    console.error("Invalid request body:", error);
    res.status(400).json({ pickupline: "", message: "Fail." });
  }
};

// this method will take in a match's profile and generate an opening line to message to them
// the available information that is provided to chatgpt, in terms of importance is:
// 1. Match bio
// 2. Match name
// 3. Match hobbies/interests
const generatePickupLine = async (
  xAuthToken: string,
  userSessionId: string,
  userId: string,
  model: ModelType
) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  // first we need to get all of the matches specific information
  const matchProfile = await getMatchProfile(xAuthToken, userSessionId, userId);
  const cleanedMatchProfile = cleanMatchProfile(matchProfile);

  // if the user does not have a bio, use the remaining parts of their profile.
  let prompt;
  if (!cleanedMatchProfile.bio) {
    // Boring matches get boring pickup lines
    if (!cleanedMatchProfile.prompts && !cleanedMatchProfile.interests) {
      return "Hey Trouble";
    }

    prompt = createPromptWithoutBio(JSON.stringify(cleanedMatchProfile));
  } else {
    // otherwise we emphasize the pickup line specifically on their bio
    prompt = createPromptForBio(
      JSON.stringify({
        bio: cleanedMatchProfile.bio,
        name: cleanedMatchProfile.name,
      })
    );
  }

  const chatCompletion = await openai.createChatCompletion({
    model: model.toLowerCase(),
    messages: [{ role: "user", content: prompt }],
  });

  return removeEdgeQuotes(
    chatCompletion.data.choices[0].message?.content || ""
  );
};
