import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";


type ResponseData = {
  message: string;
  pickupline: string;
};

const requestBodySchema = z.object({
  matchinfo: z.any(),
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
    const { matchinfo } = requestBodySchema.parse(req.body);
    const pickupline = await generatePickupLine(matchinfo);
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
const generatePickupLine = async (matchinfo: any) => {

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  return "placeholder";
};
