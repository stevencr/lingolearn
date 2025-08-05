import {IConversationState} from '../types/types';

export const getAssessmentPrompt = (
  targetLang: string,
  sourceLang: string,
  phrase: string,
  strictness: string,
  conversation: IConversationState,
) => {
  const conversationHistoryText = getHistory(conversation);
  const prompt = `
  I am a student learning ${targetLang} and my mother language is ${sourceLang}. 
  Evaluate the following phrase only in the context of a conversation:
    
    "${phrase}". 

  The context of this conversation, which you should NOT evaluate, is:\n
  ${conversationHistoryText}\n

  I want you to be ${strictness} and if there are any errors, I want you to fully explain what they are.
  Send your response in the following JSON format, this below is only example data and should be replaced by actual data:
          {
            "rating": 3,
            "mistakes": ["You have said '...' but the correct spelling is '...'",
                         "The sentence is not grammatically correct and should be "..."]
          }
    The rating is out of 5, with 5 being that the phrase is perfect ${targetLang} with no mistakes and, at the other end of the scale, 0 that the phrase does not make any sense in ${targetLang}. 
    The mistakes are an array of mistakes in the phrase as well as the correct version in proper ${targetLang}.
    You must always give the response in ${sourceLang} as that is the user's native language.
    If there are no mistakes it should be an empty array.
    If there are mistakes do the following:
    1. Make the first mistake be the string 'Oops, there were some mistakes', but it is important this phrase is translated into ${sourceLang}
    2. Add all the other mistales to this JSON array after the above one.
    3. I want feedback on the accuracy of my French, with a focus on grammar and expression.
    Finally, check that the return value is valid JSON, it must not be a string, it must be JSON.
  `;
  //console.log('\n\n\n', prompt, '\n\n\n');
  return prompt;
};

export const conversePrompt = (
  user: string,
  botName: string,
  targetLang: string,
  sourceLang: string,
  conversation: IConversationState,
) => {
  const conversationHistoryText = getHistory(conversation);
  const prompt = `You are ${botName}, a helpful language learning assistant. You are having a conversation with ${user}, who is learning ${targetLang}. Their native language is ${sourceLang}.

CRITICAL INSTRUCTIONS:
1. You MUST respond ONLY with valid JSON in this exact format:
{
  "targetLang": "your response in ${targetLang}",
  "sourceLang": "exact translation in ${sourceLang}"
}

2. Do NOT include any text before or after the JSON
3. Do NOT include explanations, comments, or additional formatting
4. The targetLang field must be written in the correct script for ${targetLang}
5. The sourceLang field must be the exact translation in ${sourceLang}

CONVERSATION GUIDELINES:
- Be friendly, engaging, and conversational
- Use advanced ${targetLang} appropriate for an advanced learner
- Ask questions to keep the conversation flowing
- Give substantial responses (2-3 sentences when appropriate)
- Stay in character as ${botName}
- Respond naturally to what ${user} says

CONVERSATION HISTORY:
${conversationHistoryText}

Remember: Your response must be ONLY the JSON object with no additional text whatsoever.`;

  return prompt;
};

const getHistory = (conversation: IConversationState) => {
  let conversationHistoryText = '';
  if (conversation.messages.length > 0) {
    for (let i = 0; i < conversation.messages.length; i++) {
      const message = conversation.messages[i];
      const from = message.isBot ? 'Agent' : 'User';
      const content = JSON.stringify(message.targetLang || message.sourceLang);
      conversationHistoryText += `${from}: ${content} }\n`;
    }
    return conversationHistoryText;
  }
  return 'The conversation has not been started yet.';
};

export const getStoryPrompt = (user: string, targetLang: string) => {
  return `Tell me a story in ${targetLang}. 
          You can use advanced ${targetLang}. 
          Give the story a title and an made up author name which sounds ${targetLang}.
          For the "by" element use the phrase for "by [author]", i.e. you must translate the "by" in to ${targetLang} to say who the story is by.
          If there is a lead character, the name of that character should be ${user}.
          The output format should be valid JSON like this:
          
          {
            "title": "Une histoire de...",
            "by": "...[author]"
            "story": "Il était une fois, dans la ville pittoresque de Paris, un écrivain passionné du nom de Jacques. ..."
          }
        
          Check the output is in the above JSON format! Do not return any non-json text or numbering.
          `;
};

export const getQuestionsPrompt = (story: string, targetLang: string) => {
  return `Given the story below in ${targetLang}, ask me 5 question about the story (also in ${targetLang}), 
    it should be multiple choice with 4 reasonable options to choose from. 

    '''''''' Story begin
    
    ${story}

    '''''''' Story end
    
    The output format should be valid JSON like this:
    {
      "questions": [
        {
          "question": "Qu'est-ce qui remplissait l'appartement de Jacques?",
          "answerOptions": [
            {"option": "Instruments de musique", "correct": false},
            {"option": "Tableaux de maîtres célèbres", "correct": false},
            {"option": "Livres, manuscrits et antiquités", "correct": true},
            {"option": "Fleurs exotiques", "correct": false}
          ]
        },
      ]
    }
   
    Check the output is in thie above JSON format! Do not return any non-json text or numbering.
    `;
};
/* 
export const getStoryPrompt = (user: string, targetLang: string) => {
  return `Tell me a story in ${targetLang}. You can use advanced ${targetLang}. 
    If there is a lead character, the name of that character should be ${user}.
    Also, ask me 1 question about the story (also in ${targetLang}), 
    it should be multiple choice with 4 reasonable options to choose from. 
    The output format should be valid JSON like this:
    
    {
      "story": "Il était une fois, dans la ville pittoresque de Paris, un écrivain passionné du nom de Jacques. ...",
      "questions": [
        {
          "question": "Qu'est-ce qui remplissait l'appartement de Jacques?",
          "answerOptions": [
            {"option": "Instruments de musique", "correct": false},
            {"option": "Tableaux de maîtres célèbres", "correct": false},
            {"option": "Livres, manuscrits et antiquités", "correct": true},
            {"option": "Fleurs exotiques", "correct": false}
          ]
        },
      ]
    }
   
    Check the output is in thie above JSON format! Do not return any non-json text or numbering.
    `; 
    */
