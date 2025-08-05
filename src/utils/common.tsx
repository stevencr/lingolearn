export const extractJsonFromResponse = (
  response: string | object,
): any | null => {
  if (typeof response === 'string') {
    const jsonStart = response.indexOf('{');
    const jsonEnd = response.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = response.substring(jsonStart, jsonEnd + 1);

      try {
        const jsonData = JSON.parse(jsonString);
        return jsonData;
      } catch (error) {
        console.error(`Error parsing JSON: ${error}`);
      }
    }
  } else if (typeof response === 'object') {
    return response;
  }

  return null;
};

export const getRandomElement = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];

export const parseOllamaResponse = (response: any): any | null => {
  try {
    // Try Ollama format first: response.response
    if (response?.response) {
      const parsed = JSON.parse(response.response);
      if (parsed?.targetLang) {
        return {
          targetLang: parsed.targetLang,
          sourceLang: parsed.sourceLang || '',
        };
      }
    }

    // Try OpenAI format: response.choices[0].text
    if (response?.choices?.[0]?.text) {
      const parsed = JSON.parse(response.choices[0].text);
      if (parsed?.targetLang) {
        return {
          targetLang: parsed.targetLang,
          sourceLang: parsed.sourceLang || '',
        };
      }
    }

    // Fallback to original extraction
    return extractJsonFromResponse(response);
  } catch (error) {
    console.error('Error parsing response:', error);
    return null;
  }
};
