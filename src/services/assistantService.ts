import { apiClient } from "@/config/api";
import {
  ApiResponse,
  AssistantSession,
  Interaction,
  FormSuggestion,
  Document,
} from "@/types/api";

export class AssistantService {
  // Session Management
  static async startSession(
    pageUrl: string,
    pageTitle: string,
    language: string,
  ): Promise<AssistantSession> {
    const response = await apiClient.post<ApiResponse<AssistantSession>>(
      "/assistant/sessions",
      {
        page_url: pageUrl,
        page_title: pageTitle,
        language,
        metadata: {
          user_agent: navigator.userAgent,
          screen_resolution: `${screen.width}x${screen.height}`,
          timestamp: new Date().toISOString(),
        },
      },
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to start session");
  }

  static async endSession(sessionId: number): Promise<void> {
    const response = await apiClient.patch<ApiResponse>(
      `/assistant/sessions/${sessionId}/end`,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to end session");
    }
  }

  static async getActiveSession(): Promise<AssistantSession | null> {
    const response = await apiClient.get<ApiResponse<AssistantSession | null>>(
      "/assistant/sessions/active",
    );

    if (response.data.success) {
      return response.data.data;
    }

    return null;
  }

  // Interaction Tracking
  static async recordInteraction(
    sessionId: number,
    type: "highlight" | "form_assist" | "voice" | "chat",
    data: {
      elementSelector?: string;
      elementText?: string;
      userInput?: string;
      assistantResponse?: string;
      confidenceScore?: number;
    },
  ): Promise<Interaction> {
    const response = await apiClient.post<ApiResponse<Interaction>>(
      "/assistant/interactions",
      {
        session_id: sessionId,
        type,
        element_selector: data.elementSelector,
        element_text: data.elementText,
        user_input: data.userInput,
        assistant_response: data.assistantResponse,
        confidence_score: data.confidenceScore,
      },
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to record interaction");
  }

  // Element Analysis
  static async analyzeElement(
    elementSelector: string,
    elementText: string,
    context: string,
  ): Promise<{
    explanation: string;
    suggestions: string[];
    confidence: number;
  }> {
    const response = await apiClient.post<
      ApiResponse<{
        explanation: string;
        suggestions: string[];
        confidence: number;
      }>
    >("/assistant/analyze-element", {
      element_selector: elementSelector,
      element_text: elementText,
      context,
    });

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to analyze element");
  }

  // Form Assistance
  static async getFormSuggestions(
    formData: Record<string, any>,
  ): Promise<FormSuggestion[]> {
    const response = await apiClient.post<ApiResponse<FormSuggestion[]>>(
      "/assistant/form-suggestions",
      {
        form_data: formData,
      },
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to get form suggestions");
  }

  static async uploadDocument(file: File): Promise<Document> {
    const formData = new FormData();
    formData.append("document", file);

    const response = await apiClient.post<ApiResponse<Document>>(
      "/assistant/documents",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to upload document");
  }

  static async getDocumentSuggestions(
    documentId: number,
    formFields: string[],
  ): Promise<FormSuggestion[]> {
    const response = await apiClient.post<ApiResponse<FormSuggestion[]>>(
      `/assistant/documents/${documentId}/suggestions`,
      {
        form_fields: formFields,
      },
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(
      response.data.message || "Failed to get document suggestions",
    );
  }

  // Chat/Voice Interaction
  static async sendMessage(
    sessionId: number,
    message: string,
    language: string,
  ): Promise<string> {
    const response = await apiClient.post<ApiResponse<{ response: string }>>(
      "/assistant/chat",
      {
        session_id: sessionId,
        message,
        language,
      },
    );

    if (response.data.success) {
      return response.data.data.response;
    }

    throw new Error(response.data.message || "Failed to get response");
  }

  static async processVoiceInput(
    sessionId: number,
    audioBlob: Blob,
    language: string,
  ): Promise<{
    transcript: string;
    response: string;
  }> {
    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("session_id", sessionId.toString());
    formData.append("language", language);

    const response = await apiClient.post<
      ApiResponse<{
        transcript: string;
        response: string;
      }>
    >("/assistant/voice", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to process voice input");
  }

  // Translation
  static async translateContent(
    content: string,
    targetLanguage: string,
  ): Promise<string> {
    const response = await apiClient.post<ApiResponse<{ translation: string }>>(
      "/assistant/translate",
      {
        content,
        target_language: targetLanguage,
      },
    );

    if (response.data.success) {
      return response.data.data.translation;
    }

    throw new Error(response.data.message || "Failed to translate content");
  }

  // AI Provider Management
  static async getProviders(): Promise<AIProvider[]> {
    const response =
      await apiClient.get<ApiResponse<AIProvider[]>>("/ai/providers");

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to get providers");
  }

  static async createProvider(
    name: string,
    type: string,
    apiKey: string,
    config: Record<string, any> = {},
  ): Promise<AIProvider> {
    const response = await apiClient.post<ApiResponse<AIProvider>>(
      "/ai/providers",
      {
        name,
        type,
        api_key: apiKey,
        config,
      },
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to create provider");
  }

  static async updateProvider(
    providerId: string,
    updates: Partial<AIProvider>,
  ): Promise<AIProvider> {
    const response = await apiClient.patch<ApiResponse<AIProvider>>(
      `/ai/providers/${providerId}`,
      updates,
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to update provider");
  }

  static async deleteProvider(providerId: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse>(
      `/ai/providers/${providerId}`,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete provider");
    }
  }

  static async testProvider(providerId: string): Promise<ProviderTestResult> {
    const response = await apiClient.post<ApiResponse<ProviderTestResult>>(
      `/ai/providers/${providerId}/test`,
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to test provider");
  }

  // AI Model Management
  static async getModels(providerId?: string): Promise<AIModel[]> {
    const url = providerId
      ? `/ai/models?provider_id=${providerId}`
      : "/ai/models";
    const response = await apiClient.get<ApiResponse<AIModel[]>>(url);

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to get models");
  }

  static async updateModel(
    modelId: string,
    updates: Partial<AIModel>,
  ): Promise<AIModel> {
    const response = await apiClient.patch<ApiResponse<AIModel>>(
      `/ai/models/${modelId}`,
      updates,
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to update model");
  }

  static async testModel(
    modelId: string,
    prompt: string,
    config?: Record<string, any>,
  ): Promise<ModelTestResult> {
    const response = await apiClient.post<ApiResponse<ModelTestResult>>(
      `/ai/models/${modelId}/test`,
      {
        prompt,
        config,
      },
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to test model");
  }

  // Assistant Configuration
  static async getConfigurations(): Promise<AssistantConfig[]> {
    const response = await apiClient.get<ApiResponse<AssistantConfig[]>>(
      "/assistant/configurations",
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to get configurations");
  }

  static async createConfiguration(
    config: Omit<AssistantConfig, "id" | "created_at" | "updated_at">,
  ): Promise<AssistantConfig> {
    const response = await apiClient.post<ApiResponse<AssistantConfig>>(
      "/assistant/configurations",
      config,
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to create configuration");
  }

  static async updateConfiguration(
    configId: string,
    updates: Partial<AssistantConfig>,
  ): Promise<AssistantConfig> {
    const response = await apiClient.patch<ApiResponse<AssistantConfig>>(
      `/assistant/configurations/${configId}`,
      updates,
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to update configuration");
  }

  // Live Preview
  static async createPreviewSession(configId: string): Promise<PreviewSession> {
    const response = await apiClient.post<ApiResponse<PreviewSession>>(
      "/assistant/preview/sessions",
      {
        config_id: configId,
      },
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(
      response.data.message || "Failed to create preview session",
    );
  }

  static async sendPreviewMessage(
    sessionId: string,
    message: string,
  ): Promise<PreviewMessage> {
    const response = await apiClient.post<ApiResponse<PreviewMessage>>(
      `/assistant/preview/sessions/${sessionId}/messages`,
      {
        content: message,
      },
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to send preview message");
  }
}
