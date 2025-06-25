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
