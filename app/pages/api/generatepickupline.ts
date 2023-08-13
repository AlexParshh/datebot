import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import { getMatchProfile, cleanMatchProfile } from "./matchprofile";

type ResponseData = {
  message: string;
  pickupline: any;
};

const requestBodySchema = z.object({
  userId: z.string(),
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
    const { userId, xAuthToken, userSessionId } = requestBodySchema.parse(
      req.body
    );
    const pickupline = await generatePickupLine(
      xAuthToken,
      userSessionId,
      userId
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
// 3. Match hobbies/interests @TODO: need to make an aditional endpoint to query this more specific data
// 4. Match music of interest
// ---------------------------
// If none of the above information is available, we will randomly pick from a list of 100 openers that are proven
// to work and return that line.
const generatePickupLine = async (
  xAuthToken: string,
  userSessionId: string,
  userId: string
) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  // first we need to get all of the matches specific information
  const matchProfile = await getMatchProfile(xAuthToken, userSessionId, userId);
  const cleanedMatchProfile = cleanMatchProfile(matchProfile);

  // if the user does not have a bio, use the hardcoded line
  if (!cleanedMatchProfile.bio) {
    return { content: "Hey Trouble" };
  }

  const matchProfileString = JSON.stringify(cleanedMatchProfile);
  const prompt =
    "Write a short one sentence kinky pick up line for this tinder profile, please relate it to their bio: " +
    matchProfileString;

  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  return chatCompletion.data.choices[0].message;
};
