import React from "react";
import SettingSection from "../SettingSection";
import SettingField from "../SettingField";

interface AssistantSettingsProps {
  settings: {
    aiModel: string;
    temperature: number;
    maxTokens: number;
    responseStyle: string;
    enableContextMemory: boolean;
    contextWindowSize: number;
    enableLearning: boolean;
    confidenceThreshold: number;
    fallbackBehavior: string;
  };
  onChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

const AssistantSettings = ({
  settings,
  onChange,
  errors = {},
}: AssistantSettingsProps) => {
  return (
    <div className="space-y-6">
      <SettingSection
        title="AI Model Configuration"
        description="Configure the underlying AI model and behavior"
        helpText="These settings control how the AI processes and responds to user queries."
      >
        <SettingField
          type="select"
          label="AI Model"
          description="Choose the AI model for processing requests"
          value={settings.aiModel}
          onChange={(value) => onChange("aiModel", value)}
          options={[
            {
              value: "gpt-4",
              label: "GPT-4",
              description: "Most capable, higher cost",
            },
            {
              value: "gpt-3.5-turbo",
              label: "GPT-3.5 Turbo",
              description: "Fast and cost-effective (recommended)",
            },
            {
              value: "claude-3",
              label: "Claude 3",
              description: "Excellent for analysis and reasoning",
            },
          ]}
          helpText="Different models have varying capabilities and costs. GPT-3.5 Turbo is recommended for most use cases."
        />

        <SettingField
          type="slider"
          label="Response Creativity"
          description="Controls how creative vs. focused the AI responses are"
          value={settings.temperature}
          onChange={(value) => onChange("temperature", value)}
          min={0}
          max={1}
          step={0.1}
          helpText="Lower values (0.1-0.3) for factual responses, higher values (0.7-0.9) for creative responses."
        />

        <SettingField
          type="slider"
          label="Max Response Length"
          description="Maximum length of AI responses"
          value={settings.maxTokens}
          onChange={(value) => onChange("maxTokens", value)}
          min={50}
          max={2000}
          step={50}
          unit=" tokens"
          helpText="Longer responses provide more detail but cost more and take longer to generate."
        />
      </SettingSection>

      <SettingSection
        title="Response Behavior"
        description="Customize how the assistant communicates"
        helpText="These settings affect the tone and style of AI responses."
      >
        <SettingField
          type="radio"
          label="Response Style"
          description="Choose the communication style for the assistant"
          value={settings.responseStyle}
          onChange={(value) => onChange("responseStyle", value)}
          options={[
            {
              value: "professional",
              label: "Professional",
              description: "Formal, business-appropriate tone",
            },
            {
              value: "friendly",
              label: "Friendly",
              description: "Warm and approachable tone (recommended)",
            },
            {
              value: "casual",
              label: "Casual",
              description: "Relaxed, conversational tone",
            },
            {
              value: "technical",
              label: "Technical",
              description: "Precise, detail-oriented responses",
            },
          ]}
          helpText="Choose a style that matches your brand and user expectations."
        />

        <SettingField
          type="slider"
          label="Confidence Threshold"
          description="Minimum confidence level before providing answers"
          value={settings.confidenceThreshold}
          onChange={(value) => onChange("confidenceThreshold", value)}
          min={0.1}
          max={0.9}
          step={0.1}
          helpText="Higher values mean the AI will only respond when very confident, reducing incorrect answers."
        />

        <SettingField
          type="select"
          label="Fallback Behavior"
          description="What to do when confidence is below threshold"
          value={settings.fallbackBehavior}
          onChange={(value) => onChange("fallbackBehavior", value)}
          options={[
            {
              value: "apologize",
              label: "Apologize & Ask for Clarification",
              description: "Admit uncertainty and ask for more details",
            },
            {
              value: "transfer",
              label: "Transfer to Human",
              description: "Escalate to human support",
            },
            {
              value: "suggest",
              label: "Suggest Alternatives",
              description: "Offer related topics or resources",
            },
          ]}
          helpText="Choose how the assistant should handle uncertain situations."
        />
      </SettingSection>

      <SettingSection
        title="Memory & Learning"
        description="Configure context retention and learning capabilities"
        helpText="These features help the assistant provide more personalized and contextual responses."
        badge="Beta"
      >
        <SettingField
          type="toggle"
          label="Enable Context Memory"
          description="Remember conversation context within sessions"
          value={settings.enableContextMemory}
          onChange={(value) => onChange("enableContextMemory", value)}
          helpText="When enabled, the assistant remembers earlier parts of the conversation for better context."
        />

        <SettingField
          type="slider"
          label="Context Window Size"
          description="How many previous messages to remember"
          value={settings.contextWindowSize}
          onChange={(value) => onChange("contextWindowSize", value)}
          min={1}
          max={20}
          step={1}
          unit=" messages"
          disabled={!settings.enableContextMemory}
          helpText="Larger windows provide better context but use more resources."
        />

        <SettingField
          type="toggle"
          label="Enable Learning"
          description="Allow the assistant to learn from interactions"
          value={settings.enableLearning}
          onChange={(value) => onChange("enableLearning", value)}
          helpText="When enabled, the assistant improves responses based on user feedback and interactions."
          badge="Experimental"
        />
      </SettingSection>
    </div>
  );
};

export default AssistantSettings;
