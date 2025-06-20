import { useState, useEffect, useCallback } from "react";
import { AssistantSession, Interaction, FormSuggestion } from "@/types/api";
import { AssistantService } from "@/services/assistantService";
import { useAuth } from "./useAuth";

export const useAssistant = () => {
  const { isAuthenticated } = useAuth();
  const [session, setSession] = useState<AssistantSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize session when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      initializeSession();
    }
  }, [isAuthenticated]);

  const initializeSession = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      // Check for existing active session
      let activeSession = await AssistantService.getActiveSession();

      if (!activeSession) {
        // Create new session
        activeSession = await AssistantService.startSession(
          window.location.href,
          document.title,
          navigator.language.split("-")[0] || "en",
        );
      }

      setSession(activeSession);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to initialize session",
      );
    } finally {
      setLoading(false);
    }
  };

  const endSession = async () => {
    if (!session) return;

    try {
      await AssistantService.endSession(session.id);
      setSession(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to end session");
    }
  };

  const recordInteraction = useCallback(
    async (
      type: "highlight" | "form_assist" | "voice" | "chat",
      data: {
        elementSelector?: string;
        elementText?: string;
        userInput?: string;
        assistantResponse?: string;
        confidenceScore?: number;
      },
    ): Promise<Interaction | null> => {
      if (!session) return null;

      try {
        const interaction = await AssistantService.recordInteraction(
          session.id,
          type,
          data,
        );
        return interaction;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to record interaction",
        );
        return null;
      }
    },
    [session],
  );

  const analyzeElement = useCallback(
    async (elementSelector: string, elementText: string, context: string) => {
      if (!session) return null;

      setLoading(true);
      try {
        const analysis = await AssistantService.analyzeElement(
          elementSelector,
          elementText,
          context,
        );

        // Record the interaction
        await recordInteraction("highlight", {
          elementSelector,
          elementText,
          assistantResponse: analysis.explanation,
          confidenceScore: analysis.confidence,
        });

        return analysis;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to analyze element",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [session, recordInteraction],
  );

  const getFormSuggestions = useCallback(
    async (formData: Record<string, any>): Promise<FormSuggestion[]> => {
      if (!session) return [];

      setLoading(true);
      try {
        const suggestions = await AssistantService.getFormSuggestions(formData);

        // Record the interaction
        await recordInteraction("form_assist", {
          userInput: JSON.stringify(formData),
          assistantResponse: `Generated ${suggestions.length} suggestions`,
        });

        return suggestions;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to get form suggestions",
        );
        return [];
      } finally {
        setLoading(false);
      }
    },
    [session, recordInteraction],
  );

  const sendMessage = useCallback(
    async (
      message: string,
      language: string = "en",
    ): Promise<string | null> => {
      if (!session) return null;

      setLoading(true);
      try {
        const response = await AssistantService.sendMessage(
          session.id,
          message,
          language,
        );

        // Record the interaction
        await recordInteraction("chat", {
          userInput: message,
          assistantResponse: response,
        });

        return response;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [session, recordInteraction],
  );

  const processVoiceInput = useCallback(
    async (audioBlob: Blob, language: string = "en") => {
      if (!session) return null;

      setLoading(true);
      try {
        const result = await AssistantService.processVoiceInput(
          session.id,
          audioBlob,
          language,
        );

        // Record the interaction
        await recordInteraction("voice", {
          userInput: result.transcript,
          assistantResponse: result.response,
        });

        return result;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to process voice input",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [session, recordInteraction],
  );

  const uploadDocument = useCallback(async (file: File) => {
    setLoading(true);
    try {
      const document = await AssistantService.uploadDocument(file);
      return document;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload document",
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const translateContent = useCallback(
    async (content: string, targetLanguage: string): Promise<string | null> => {
      setLoading(true);
      try {
        const translation = await AssistantService.translateContent(
          content,
          targetLanguage,
        );
        return translation;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to translate content",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    session,
    loading,
    error,
    initializeSession,
    endSession,
    recordInteraction,
    analyzeElement,
    getFormSuggestions,
    sendMessage,
    processVoiceInput,
    uploadDocument,
    translateContent,
  };
};
