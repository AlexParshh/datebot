
// GPT sometimes returns the generated text in quotation marks, so this method will remove them if they exist.
export const removeEdgeQuotes = (text: string) => text.replace(/^['"]|['"]$/g, '');


// Pick up lines prompts
export const createPromptForBio = (profile: string) => {
    return `Instructions:

    Write a short kinky one sentence pick up line that is also teasing in nature for the following tinder profile: ${profile}
    
    Requirements:
    Please reference their bio.
    Be very forward and do not seem desperate, for example do not talk about how you will "adore them".`;
}
export const createPromptWithoutBio = (profile: string) => {
    return `Instructions:

    Write a short kinky one sentence pick up line that is also teasing in nature for the following tinder profile: ${profile}
    
    Requirements:
    Please reference some part of their profile.
    Be very forward and do not seem desperate, for example do not talk about how you will "adore them".`;
}

// Conversation prompts

export const createConvoPromptWithInfo = (personalInfo: string, messages: string) => {
    return `Respond to the following tinder message history in a funny, flirty and very kinky manner.
    
    Requirements:
    Only write a SINGLE follow up response message, not an entire dialogue.
    If the last message was sent by ME, then generate a follow up message from me.
    After about 20 messages, ask for their phone number, this is the ultimate goal of the conversation.
    Respond with a single sentence.
    In case the match asks for my contact details, or anything about me, respond with the corresponding information: ${personalInfo}

    Here is the message history: ${messages}
    `
}

export const createConvoPromptWithoutInfo = (messages: string) => {
    return `Respond to the following tinder message history in a funny, flirty and very kinky manner.
    
    Requirements:
    Only write a SINGLE follow up response message, not an entire dialogue.
    If the last message was sent by ME, then generate a follow up message from me.
    After 20 messages, ask for their phone number, this is the ultimate goal of the conversation.
    Respond with a single sentence.
    
    Here is the message history: ${messages}`
}

export type ModelType = "GPT-3.5-Turbo" | "GPT-4";
