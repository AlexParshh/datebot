
// GPT sometimes returns the generated text in quotation marks, so this method will remove them if they exist.
export const removeEdgeQuotes = (text: string) => text.replace(/^['"]|['"]$/g, '');

export const createPromptForBio = (profile: string) => {
    return `Instructions:

    Write a short one sentence kinky pick up line that is also teasing in nature for the following tinder profile: ${profile}
    
    Requirements:
    Please reference their bio.
    Be very forward and do not seem desperate, for example do not talk about how you will "adore them".`;
}

export const createPromptWithoutBio = (profile: string) => {
    return `Instructions:

    Write a short one sentence kinky pick up line that is also teasing in nature for the following tinder profile: ${profile}
    
    Requirements:
    Please reference some part of their profile.
    Be very forward and do not seem desperate, for example do not talk about how you will "adore them".`;
}