import {parseOllamaResponse, extractJsonFromResponse} from './common';
import {availableModels} from '../components/settings/models';

export interface ResponseParser {
  parse(response: any): any | null;
}

class OllamaResponseParser implements ResponseParser {
  parse(response: any): any | null {
    return parseOllamaResponse(response);
  }
}

class OpenAIResponseParser implements ResponseParser {
  parse(response: any): any | null {
    return extractJsonFromResponse(response);
  }
}

export class ResponseParserFactory {
  static createParser(modelId: string): ResponseParser {
    const model = availableModels.find(m => m.id === modelId);

    if (model?.type === 'ollama') {
      return new OllamaResponseParser();
    }

    // Default to OpenAI format for ChatGPT and other models
    return new OpenAIResponseParser();
  }

  static getEndpointForModel(modelId: string): string {
    const model = availableModels.find(m => m.id === modelId);
    return model?.endpoint || process.env.AI_API_URL || '';
  }
}
