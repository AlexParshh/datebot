import type { NextApiRequest, NextApiResponse } from "next";
import { createTinderAxios } from "../../lib/tinderaxios";
import { AxiosInstance } from "axios";

type ResponseData = {
  message: string;
  messages: any;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    handlePostRequest(req, res);
  } else {
    res.status(400).json({ messages: null, message: "Invalid request method" });
  }
}

const handlePostRequest = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const matchId = "64692f733a1a4c0100adfd516473e17699133e0100400760";
  const myProfileId = "64692f733a1a4c0100adfd51";
  const messages = await getMessages(matchId);
  const cleanedMessages = cleanMessages(messages, myProfileId);

  res.status(200).json({ messages: cleanedMessages, message: "Success." });
};

const getMessages = async (matchId: string) => {
  const xAuthToken = "ad457a2a-9500-4d9f-8008-f702299086b5";
  const appSessionId = "3d806021-1a6e-47ae-adc3-8bbfea45e7e3";
  const userSessionId = "895248a5-e6f7-4a58-b630-ae97a8c7202c";
  // ben info
  // const xAuthToken = "dbdfbecc-3568-49d1-9b5c-9692eba37ccb";
  // const appSessionId = "bb1cdf67-0c12-474e-a98b-81d93fcc96b8";
  // const userSessionId = "a4609f6d-21d0-4ee7-8fa9-9f37e6e9a053";

  const tinderAxios: AxiosInstance = createTinderAxios(
    xAuthToken,
    appSessionId,
    userSessionId
  );

  let messages: any = [];
  let nextPageToken = "";
  try {
    while (true) {
      let currentMessagesBatch;

      if (nextPageToken) {
        currentMessagesBatch = await tinderAxios.get(
          `/v2/matches/${matchId}/messages?locale=en&count=100&page_token=${nextPageToken}`
        );
      } else {
        currentMessagesBatch = await tinderAxios.get(
          `/v2/matches/${matchId}/messages?locale=en&count=100`
        );
      }

      messages = messages.concat(currentMessagesBatch.data.data.messages);

      if (currentMessagesBatch.data.data.next_page_token) {
        nextPageToken = currentMessagesBatch.data.data.next_page_token;
      } else {
        break;
      }
    }

    // need to reverse the array of messages to get it in chronological order
    return messages.reverse();
  } catch (e) {
    console.error(e);
    return;
  }
};

// clean messages array for easier interpretation by chatgpt
// returns an array of chronological clean messages
const cleanMessages = (messages: any[], userProfileId: string) => {
  const cleanMessages = [];

  for (let i = 0; i < messages.length; i++) {
    const currentMessage = messages[i];

    cleanMessages.push({
      message: currentMessage.message,
      from: currentMessage.from === userProfileId ? "Me" : "My Match",
      to: currentMessage.to === userProfileId ? "Me" : "My Match",
    });
  }

  return cleanMessages;
};
