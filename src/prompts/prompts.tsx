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
  const prompt = `As the agent, your name is ${botName}. The user's name is ${user}, and we will chat in ${targetLang}. 
  I am a student learning ${targetLang}, but my mother language is ${sourceLang}. 
  When you converse, send your response in the following JSON format:
          {
            "targetLang": "Bonjour",
            "sourceLang": "Hello"
          }, 
  where targetLang is in ${targetLang} and the same phrase is translated into ${sourceLang} and placed in the sourceLang field. 

  Output format: JSON.

  It is very important that the sourceLang field is translated into ${sourceLang} language.
  If I ask a question, always answer me and keep the conversation interesting and flowing. 
  Be chatty, inquisitive, friendly and engaging and avoid very short responses.
  You may ask me questions too. 
  As a student, I am at an advanced level and so your sentences can be in advanced, everyday language.
  Always write in the writing system of ${targetLang}, for example, for Russian, write in Cyrillic, for Hindi write in Devangari.
  Your response should only ever be within the context of this conversation, and, importantly, your contribution should only ever be in the above JSON format. Do not include any additional text outside the JSON structure.
  It is very important that your response should only be the JSON above and nothing else, you should not reply with "Agent replied:" or anything else, just the JSON!
  The conversation so far is: \n ${conversationHistoryText}

  Finally, check the following with the response:
  1. targetLang is written in ${targetLang} and is a single string.
  2. sourceLang is written in ${sourceLang} and is a single string.
      `;
  //console.log('\n\n\n', prompt, '\n\n\n');
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
