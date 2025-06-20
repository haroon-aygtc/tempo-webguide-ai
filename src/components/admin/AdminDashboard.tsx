import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import GeneralSettings from "./sections/GeneralSettings";
import AssistantSettings from "./sections/AssistantSettings";
import AppearanceSettings from "./sections/AppearanceSettings";
import AIProviderSettings from "./sections/AIProviderSettings";
import LivePreviewPanel from "./sections/LivePreviewPanel";
import { AIProvider, AIModel, AssistantConfig } from "@/types/api";
import { AssistantService } from "@/services/assistantService";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("providers");
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [models, setModels] = useState<AIModel[]>([]);
  const [configurations, setConfigurations] = useState<AssistantConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "AI Web Assistant",
    siteDescription: "Revolutionary AI-powered web assistance platform",
    adminEmail: "admin@example.com",
    timezone: "UTC",
    maintenanceMode: false,
    debugMode: false,
    analyticsEnabled: true,
    errorReporting: true,
    autoUpdates: true,
    backupFrequency: "daily",
  });

  // Assistant Settings State
  const [assistantSettings, setAssistantSettings] = useState({
    aiModel: "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 1000,
    responseStyle: "friendly",
    enableContextMemory: true,
    contextWindowSize: 10,
    enableLearning: false,
    confidenceThreshold: 0.7,
    fallbackBehavior: "apologize",
  });

  // Appearance Settings State
  const [appearanceSettings, setAppearanceSettings] = useState({
    primaryColor: "#8b5cf6",
    secondaryColor: "#ec4899",
    accentColor: "#06b6d4",
    borderRadius: 8,
    fontFamily: "Inter",
    fontSize: 14,
    darkMode: "system" as "light" | "dark" | "system",
    compactMode: false,
    animationsEnabled: true,
    customCSS: "",
    logoUrl: "",
    faviconUrl: "",
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // Load providers, models, and configurations in parallel
      const [providersData, modelsData, configurationsData] = await Promise.all([
        AssistantService.getProviders().catch(() => []),
        AssistantService.getModels().catch(() => []),
        AssistantService.getConfigurations().catch(() => []),
      ]);

      setProviders(providersData);
      setModels(modelsData);
      setConfigurations(configurationsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load initial data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGeneralSettingsChange = (key: string, value: any) => {
    setGeneralSettings({ ...generalSettings, [key]: value });
  };

  const handleAssistantSettingsChange = (key: string, value: any) => {
    setAssistantSettings({ ...assistantSettings, [key]: value });
  };

  const handleAppearanceSettingsChange = (key: string, value: any) => {
    setAppearanceSettings({ ...appearanceSettings, [key]: value });
  };

  const handleProviderChange = (updatedProviders: AIProvider[]) => {
    setProviders(updatedProviders);
  };

  const handleModelChange = (updatedModels: AIModel[]) => {
    setModels(updatedModels);
  };

  const handleConfigChange = (config: AssistantConfig) => {
    // Handle live preview config changes
    console.log("Config changed:", config);
  };

  const tabContent = {
    general: (
      <GeneralSettings
        settings={generalSettings}
        onChange={handleGeneralSettingsChange}
      />
    ),
    providers: (
      <AIProviderSettings
        onProviderChange={handleProviderChange}
        onModelChange={handleModelChange}
      />
    ),
    assistant: (
      <AssistantSettings
        settings={assistantSettings}
        onChange={handleAssistantSettingsChange}
      />
    ),
    preview: (
      <LivePreviewPanel
        providers={providers}
        models={models}
        onConfigChange={handleConfigChange}
      />
    ),
    appearance: (
      <AppearanceSettings
        settings={appearanceSettings}
        onChange={handleAppearanceSettingsChange}
      />
    ),
    languages: (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Language Settings</h3>
        <p className="text-muted-foreground">
          Multi-language configuration coming soon...
        </p>
      </div>
    ),
    voice: (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Voice & Audio Settings</h3>
        <p className="text-muted-foreground">
          Voice configuration coming soon...
        </p>
      </div>
    ),
    forms: (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Form Assistance Settings</h3>
        <p className="text-muted-foreground">
          Form assistance configuration coming soon...
        </p>
      </div>
    ),
    analytics: (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
        <p className="text-muted-foreground">
          Analytics and insights coming soon...
        </p>
      </div>
    ),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
