# Lingo Learn

**Lingo Learn** is a sophisticated language learning app developed by **Steven Cranfield** using React Native, TypeScript, and Redux Toolkit. The app features **local AI integration with Ollama and Mistral 7B**, providing privacy-first, cost-effective language learning without relying on external APIs. This demonstrates advanced local LLM deployment and integration capabilities.

---

## ⚠️ Maintenance Status

This project is **no longer maintained**. Please consider this before using it.

![Maintenance](https://img.shields.io/badge/maintenance-archived-red)

---

## Screenshots

### Chat Interface

<img src="https://github.com/stevencr/lingolearn/blob/main/assets/screenshots/Screenshot1.jpg" width="300" />

### Settings

<img src="https://github.com/stevencr/lingolearn/blob/main/assets/screenshots/Screenshot2.jpg" width="300" />

### User Settings

<img src="https://github.com/stevencr/lingolearn/blob/main/assets/screenshots/Screenshot3.jpg" width="300" />

### Feedback and corrections

<img src="https://github.com/stevencr/lingolearn/blob/main/assets/screenshots/Screenshot4.jpg" width="300" />

---

## Features

- **Local AI Integration**: Powered by Ollama with Mistral 7B for privacy-first, offline-capable language learning
- **Flexible AI Architecture**: Supports both local and cloud-based AI models through configurable endpoints
- Interactive language learning sessions with real-time chat
- Converse in your target language with intelligent AI responses
- Read or listen to short stories followed by comprehension questions
- Clean and user-friendly interface with advanced state management
- Robust architecture with Redux Toolkit, RTK Query, and async thunks
- Custom API response parsing for multiple AI service formats
- Animations implemented using `react-native-reanimated`
- TypeScript ensures code safety and maintainability
- Speech-to-text in multiple languages using `react-native-tts`

---

## Supported Languages

| Language         |                                       |
| ---------------- | ------------------------------------- |
| Mandarin Chinese | ![CN](https://flagcdn.com/w40/cn.png) |
| Spanish          | ![ES](https://flagcdn.com/w40/es.png) |
| English          | ![GB](https://flagcdn.com/w40/gb.png) |
| Hindi            | ![IN](https://flagcdn.com/w40/in.png) |
| Arabic           | ![SA](https://flagcdn.com/w40/sa.png) |
| Bengali          | ![BD](https://flagcdn.com/w40/bd.png) |
| Portuguese       | ![PT](https://flagcdn.com/w40/pt.png) |
| Russian          | ![RU](https://flagcdn.com/w40/ru.png) |
| French           | ![FR](https://flagcdn.com/w40/fr.png) |
| German           | ![DE](https://flagcdn.com/w40/de.png) |
| Urdu             | ![PK](https://flagcdn.com/w40/pk.png) |
| Japanese         | ![JP](https://flagcdn.com/w40/jp.png) |
| Tamil            | ![IN](https://flagcdn.com/w40/in.png) |

## Roadmap / Todo List

### Performance Improvements

- Optimize message list rendering with virtualized lists
- Enhance rendering efficiency using Redux Toolkit entity adapters

### Feature Enhancements

- Transition chat API to use GPT-4 Assistant API
- **Translation-only mode:** Automatically translate user input when typed in the mother tongue
- **Text-to-speech:** Add animations, and controls for pause/stop functionality
- **Speech-to-text:** Implement voice input support
- **User Ability Rating:**
  - Display message-level ratings on a 5-star scale
  - Develop a system to assess and showcase overall language proficiency
- **AI-powered Localization:** Download and store language localizations dynamically

### Testing & Documentation

- Write unit tests with Jest
- Improve and expand documentation with TSDoc comments and contribution guidelines

### UI/UX

- Refine design and user interface
- Enhance animations and transitions for smoother experience

---

## Getting Started / Installation

### Prerequisites

- Node.js (recommended latest LTS version)
- npm or yarn package manager
- Android Studio / Xcode (for mobile emulators or real device deployment)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/stevencr/lingolearn.git
   ```

2. Change into the project directory:

   ```bash
   cd lingolearn
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the App

- For Android:

  ```bash
  npm run android
  ```

- For iOS:
  ```bash
  npm run ios
  ```

---

## Technical Points of Interest

### 1. Modern State Management with Redux Toolkit

The `conversationsSlice.tsx` file, as an example, manages all conversation-related state and logic using Redux Toolkit’s `createSlice` and `createAsyncThunk`. This slice is responsible for handling user and AI messages, message status, and AI-powered assessments.

#### Key Features

- **Message Handling**:

  - `addMessage` and `addUserMessage` reducers add bot and user messages to the conversation state.
  - `markAsPlayed` updates a message’s status when it has been played (e.g., audio listened).
  - `clearAllMessages` resets the conversation state.

- **Async AI Integration**:

  - Uses `createAsyncThunk` to define `getAIMessageAsync` and `getAIAssessmentAsync` for asynchronous calls to the AI backend (or debug mocks).
  - Handles loading, success, and error states for both message generation and assessment.
  - Integrates with the UI to provide real-time feedback on AI operations.

- **Error and Status Tracking**:

  - The slice tracks the status (`idle`, `loading`, `succeeded`, `failed`) and any errors for robust UI feedback and debugging.

- **Example: Adding a User Message**

```tsx
dispatch(addUserMessage({id: uuid(), message: userInput}));
```

- **Async Thunk Integration with `addCase`**

- **Pattern**:  
  The `addCase` method is used in `extraReducers` to respond to the pending, fulfilled, and rejected states of async thunks like `getAIMessageAsync` and `getAIAssessmentAsync`.
- **Purpose**:  
  This allows the slice to update the conversation state (e.g., loading status, error messages, message content) in response to asynchronous API calls.

- **Example:**

```ts
builder
  .addCase(getAIMessageAsync.pending, state => {
    state.status = 'loading';
  })
  .addCase(getAIMessageAsync.rejected, (state, action) => {
    state.status = 'failed';
    state.error = action.error.message;
  });
```

#### New approach - Dynamically Created Hooks

- **Slices and Async Thunks**:  
  While `conversationsSlice.tsx` exports action creators and selectors, components interact with async logic by dispatching thunks (e.g., `dispatch(getAIMessageAsync(...))`).
- **RTK Query Comparison**:  
  Using RTK Query for conversation APIs will dynamically generate React hooks (like `useGetConversationQuery` or `useSendMessageMutation`). These hooks encapsulate the async logic and state management, providing a more declarative and component-friendly API.

- **Example with RTK Query (not in this slice, but going forward the new way to do it):**

```ts
const {data, isLoading, error} = useGetConversationQuery(conversationId);
```

#### Extensibility

- New reducers or async thunks can be added for additional conversation features (e.g., message reactions, editing).
- The slice is modular and integrates cleanly with other Redux Toolkit slices and RTK Query APIs.

This approach ensures that all conversation logic is centralized, predictable, and easy to maintain, while supporting advanced features like AI-powered messaging and assessments.

This architecture, centered on Redux Toolkit, RTK Query, and modular React Native components, provides a robust foundation for building scalable, maintainable, and user-friendly mobile applications.

---

## 🛠️ Technologies Used

### Core

- **React Native**  
  Framework for building cross-platform mobile apps with native performance.

- **TypeScript**  
  Adds static typing to JavaScript for safer and more maintainable code.

### State Management

- **Redux Toolkit**  
  Simplifies global state management using slices, reducers, and async thunks (e.g., for settings and conversations).

- **RTK Query**  
  Handles API data fetching, caching, and auto-generates React hooks for seamless integration with components.

### Navigation & UI

- **React Navigation**  
  Manages navigation and screen transitions throughout the app.

- **react-native-safe-area-context**  
  Ensures UI elements respect device safe areas (notches, status bars).

- **Custom Components**  
  Modular UI elements like `AppBar`, avatar selectors, and settings screens for a consistent user experience.

### Backend & APIs

- **Local AI with Ollama Integration**  
  Features local LLM deployment using Ollama with Mistral 7B, eliminating external API dependencies and ensuring privacy-first language learning. This showcases advanced local AI integration and reduces operational costs.

- **Flexible AI Architecture**  
  Supports both local Ollama models and cloud-based APIs through configurable endpoints, demonstrating versatility in AI integration approaches.

- **Environment Variables (.env)**  
  Stores configuration for AI endpoints, supporting seamless switching between local and cloud AI services.

- **Custom Response Parsing**  
  Implements intelligent response parsing that handles different AI API formats (Ollama vs OpenAI), showcasing adaptability in API integration.

### Utilities & Tooling

- **Jest**  
  Provides unit testing for components and business logic.

- **ESLint & Prettier**  
  Enforce code style and formatting consistency across the codebase.

- **react-native-tts**  
  Enables text-to-speech functionality for language learning features.

This stack enables a robust, scalable, and maintainable mobile application focused on interactive language learning.

---

## Troubleshooting

### Fix for `react-native-tts` module errors on Android

If you encounter errors related to `react-native-tts`, add the following methods to the `TextToSpeechModule.java` file located at:

`node_modules/react-native-tts/android/src/main/java/net/no_mad/tts/TextToSpeechModule.java`

```java
@ReactMethod
public void addListener(String eventName) {
  // Required for React Native built-in Event Emitter Calls.
}

@ReactMethod
public void removeListeners(Integer count) {
  // Required for React Native built-in Event Emitter Calls.
}
```
