import React from "react";
import SettingSection from "../SettingSection";
import SettingField from "../SettingField";

interface GeneralSettingsProps {
  settings: {
    assistantName: string;
    welcomeMessage: string;
    enableAssistant: boolean;
    showBranding: boolean;
    maxConcurrentSessions: number;
    sessionTimeout: number;
    logLevel: string;
  };
  onChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

const GeneralSettings = ({
  settings,
  onChange,
  errors = {},
}: GeneralSettingsProps) => {
  return (
    <div className="space-y-6">
      <SettingSection
        title="Basic Configuration"
        description="Core settings for your AI assistant"
        helpText="These settings control the fundamental behavior of your AI assistant across all interactions."
      >
        <SettingField
          type="toggle"
          label="Enable AI Assistant"
          description="Turn the AI assistant on or off globally"
          value={settings.enableAssistant}
          onChange={(value) => onChange("enableAssistant", value)}
          helpText="When disabled, the assistant will not appear on any pages and all features will be inactive."
        />

        <SettingField
          type="text"
          label="Assistant Name"
          description="The display name for your AI assistant"
          value={settings.assistantName}
          onChange={(value) => onChange("assistantName", value)}
          placeholder="AI Assistant"
          required
          error={errors.assistantName}
          helpText="This name will appear in the chat interface and help users identify the assistant."
        />

        <SettingField
          type="textarea"
          label="Welcome Message"
          description="The first message users see when starting a conversation"
          value={settings.welcomeMessage}
          onChange={(value) => onChange("welcomeMessage", value)}
          placeholder="Hello! I'm your AI assistant. How can I help you today?"
          rows={3}
          error={errors.welcomeMessage}
          helpText="Keep this message friendly and informative. It sets the tone for the entire interaction."
        />
      </SettingSection>

      <SettingSection
        title="Branding & Display"
        description="Customize how the assistant appears to users"
        helpText="Control the visual presentation and branding elements of your assistant."
      >
        <SettingField
          type="toggle"
          label="Show Branding"
          description="Display your company branding in the assistant interface"
          value={settings.showBranding}
          onChange={(value) => onChange("showBranding", value)}
          helpText="When enabled, your logo and brand colors will be displayed in the assistant interface."
        />
      </SettingSection>

      <SettingSection
        title="Performance & Limits"
        description="Configure system performance and usage limits"
        helpText="These settings help manage system resources and ensure optimal performance."
        badge="Advanced"
      >
        <SettingField
          type="slider"
          label="Max Concurrent Sessions"
          description="Maximum number of simultaneous user sessions"
          value={settings.maxConcurrentSessions}
          onChange={(value) => onChange("maxConcurrentSessions", value)}
          min={1}
          max={100}
          step={1}
          helpText="Higher values allow more users but may impact performance. Recommended: 10-50 for most use cases."
        />

        <SettingField
          type="slider"
          label="Session Timeout"
          description="How long inactive sessions remain active"
          value={settings.sessionTimeout}
          onChange={(value) => onChange("sessionTimeout", value)}
          min={5}
          max={120}
          step={5}
          unit=" min"
          helpText="Sessions will automatically end after this period of inactivity to free up resources."
        />

        <SettingField
          type="select"
          label="Log Level"
          description="Amount of detail in system logs"
          value={settings.logLevel}
          onChange={(value) => onChange("logLevel", value)}
          options={[
            {
              value: "error",
              label: "Error Only",
              description: "Log only critical errors",
            },
            {
              value: "warn",
              label: "Warnings",
              description: "Log errors and warnings",
            },
            {
              value: "info",
              label: "Information",
              description: "Log general information (recommended)",
            },
            {
              value: "debug",
              label: "Debug",
              description: "Detailed logging for troubleshooting",
            },
          ]}
          helpText="Higher log levels provide more detail but may impact performance and storage."
        />
      </SettingSection>
    </div>
  );
};

export default GeneralSettings;
