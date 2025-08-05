export const availableModels = [
  {
    id: 'mistral:7b-instruct',
    name: 'Mistral 7B Instruct (Local)',
    description: 'Fast and efficient local model',
    endpoint: 'http://10.0.2.2:11434/api/generate',
    type: 'ollama',
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'ChatGPT 3.5 Turbo',
    description: 'OpenAI GPT-3.5 Turbo',
    endpoint: 'https://us-central1-cvc-34210.cloudfunctions.net/openai',
    type: 'openai',
  },
];
