import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import AdminLayout from "./admin/AdminLayout";
import GeneralSettings from "./admin/sections/GeneralSettings";
import AssistantSettings from "./admin/sections/AssistantSettings";
import AppearanceSettings from "./admin/sections/AppearanceSettings";

const HomePage = () => {
  const { toast } = useToast();
  const { actualTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("general");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Settings state
  const [generalSettings, setGeneralSettings] = useState({
    assistantName: "AI Assistant",
    welcomeMessage: "Hello! I'm your AI assistant. How can I help you today?",
    enableAssistant: true,
    showBranding: true,
    maxConcurrentSessions: 25,
    sessionTimeout: 30,
    logLevel: "info",
  });

  const [assistantSettings, setAssistantSettings] = useState({
    aiModel: "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 500,
    responseStyle: "friendly",
    enableContextMemory: true,
    contextWindowSize: 10,
    enableLearning: false,
    confidenceThreshold: 0.6,
    fallbackBehavior: "apologize",
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "auto",
    primaryColor: "#3b82f6",
    position: "bottom-right",
    size: "medium",
    borderRadius: 8,
    showAvatar: true,
    avatarStyle: "robot",
    animationSpeed: "normal",
    transparency: 5,
  });

  const handleSettingChange = (section: string, key: string, value: any) => {
    setHasUnsavedChanges(true);
    setErrors((prev) => ({ ...prev, [`${section}.${key}`]: "" }));

    switch (section) {
      case "general":
        setGeneralSettings((prev) => ({ ...prev, [key]: value }));
        break;
      case "assistant":
        setAssistantSettings((prev) => ({ ...prev, [key]: value }));
        break;
      case "appearance":
        setAppearanceSettings((prev) => ({ ...prev, [key]: value }));
        break;
    }

    // Show live preview toast for certain changes
    if (key === "primaryColor" || key === "theme" || key === "position") {
      toast({
        title: "Preview Updated",
        description: "Changes will be applied when you save settings.",
      });
    }
  };

  const validateSettings = () => {
    const newErrors: Record<string, string> = {};

    // Validate general settings
    if (!generalSettings.assistantName.trim()) {
      newErrors["assistantName"] = "Assistant name is required";
    }
    if (!generalSettings.welcomeMessage.trim()) {
      newErrors["welcomeMessage"] = "Welcome message is required";
    }
    if (generalSettings.maxConcurrentSessions < 1) {
      newErrors["maxConcurrentSessions"] = "Must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateSettings()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setHasUnsavedChanges(false);
      toast({
        title: "Settings Saved",
        description: "Your configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    // Reset to default values
    setGeneralSettings({
      assistantName: "AI Assistant",
      welcomeMessage: "Hello! I'm your AI assistant. How can I help you today?",
      enableAssistant: true,
      showBranding: true,
      maxConcurrentSessions: 25,
      sessionTimeout: 30,
      logLevel: "info",
    });

    setAssistantSettings({
      aiModel: "gpt-3.5-turbo",
      temperature: 0.7,
      maxTokens: 500,
      responseStyle: "friendly",
      enableContextMemory: true,
      contextWindowSize: 10,
      enableLearning: false,
      confidenceThreshold: 0.6,
      fallbackBehavior: "apologize",
    });

    setAppearanceSettings({
      theme: "auto",
      primaryColor: "#3b82f6",
      position: "bottom-right",
      size: "medium",
      borderRadius: 8,
      showAvatar: true,
      avatarStyle: "robot",
      animationSpeed: "normal",
      transparency: 5,
    });

    setHasUnsavedChanges(false);
    setErrors({});

    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  const tabContent = {
    general: (
      <GeneralSettings
        settings={generalSettings}
        onChange={(key, value) => handleSettingChange("general", key, value)}
        errors={errors}
      />
    ),
    assistant: (
      <AssistantSettings
        settings={assistantSettings}
        onChange={(key, value) => handleSettingChange("assistant", key, value)}
        errors={errors}
      />
    ),
    appearance: (
      <AppearanceSettings
        settings={appearanceSettings}
        onChange={(key, value) => handleSettingChange("appearance", key, value)}
        errors={errors}
      />
    ),
    languages: (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Language Settings</h3>
        <p className="text-muted-foreground">Coming soon...</p>
      </div>
    ),
    voice: (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Voice & Audio Settings</h3>
        <p className="text-muted-foreground">Coming soon...</p>
      </div>
    ),
    forms: (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Form Assistant Settings</h3>
        <p className="text-muted-foreground">Coming soon...</p>
      </div>
    ),
    analytics: (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Analytics & Insights</h3>
        <p className="text-muted-foreground">Coming soon...</p>
      </div>
    ),
  };


  return (
    <AdminLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      isDarkMode={actualTheme === "dark"}
      user={{
        name: "Admin User",
        email: "admin@example.com",
      }}
      tabContent={tabContent}
    >
      {/* Action Bar */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-amber-50 dark:bg-amber-900/90 border border-amber-200 dark:border-amber-800 rounded-lg p-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Unsaved changes
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleReset}
                  className="text-sm text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 underline"
                >
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-amber-600 text-white text-sm rounded-md hover:bg-amber-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default HomePage;
