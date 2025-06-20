import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Globe,
  Zap,
  Clock,
  TrendingUp,
  User,
  Bot,
  Send,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssistantService } from "@/services/assistantService";
import {
  AIProvider,
  AIModel,
  AssistantConfig,
  PreviewSession,
  PreviewMessage,
} from "@/types/api";
import { useToast } from "@/components/ui/use-toast";

interface LivePreviewPanelProps {
  providers: AIProvider[];
  models: AIModel[];
  onConfigChange?: (config: AssistantConfig) => void;
}

const LivePreviewPanel = ({
  providers,
  models,
  onConfigChange = () => {},
}: LivePreviewPanelProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<Partial<AssistantConfig>>({
    name: "Live Preview Assistant",
    provider_id: providers.find((p) => p.is_default)?.id || providers[0]?.id,
    model_id: models.find((m) => m.is_default)?.id || models[0]?.id,
    language: "english",
    temperature: 0.7,
    max_tokens: 1000,
    system_prompt: "You are a helpful AI assistant.",
    voice_enabled: false,
    translation_enabled: true,
    form_assistance_enabled: true,
    element_analysis_enabled: true,
  });
  const [previewSession, setPreviewSession] = useState<PreviewSession | null>(
    null,
  );
  const [messages, setMessages] = useState<PreviewMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [metrics, setMetrics] = useState({
    avgLatency: 0,
    totalTokens: 0,
    totalCost: 0,
    messageCount: 0,
  });
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { value: "english", label: "English", code: "en" },
    { value: "spanish", label: "Spanish", code: "es" },
    { value: "french", label: "French", code: "fr" },
    { value: "german", label: "German", code: "de" },
    { value: "chinese", label: "Chinese", code: "zh" },
    { value: "arabic", label: "Arabic", code: "ar" },
    { value: "hindi", label: "Hindi", code: "hi" },
    { value: "russian", label: "Russian", code: "ru" },
  ];

  const samplePrompts = [
    "Hello! How can you help me today?",
    "Explain quantum computing in simple terms",
    "What are the benefits of renewable energy?",
    "Help me write a professional email",
    "Translate 'Hello, how are you?' to Spanish",
  ];

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
      updateMetrics();
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const updateMetrics = () => {
    const assistantMessages = messages.filter((m) => m.role === "assistant");
    if (assistantMessages.length === 0) return;

    const totalLatency = assistantMessages.reduce(
      (sum, m) => sum + (m.metadata?.latency_ms || 0),
      0,
    );
    const totalTokens = assistantMessages.reduce(
      (sum, m) => sum + (m.metadata?.token_count || 0),
      0,
    );

    setMetrics({
      avgLatency: totalLatency / assistantMessages.length,
      totalTokens,
      totalCost: totalTokens * 0.00002, // Rough estimate
      messageCount: messages.length,
    });
  };

  const handleStartPreview = async () => {
    try {
      setIsLoading(true);

      // For development, create a mock preview session
      const mockSession: PreviewSession = {
        id: Date.now().toString(),
        config_id: "preview-config",
        status: "active",
        created_at: new Date().toISOString(),
      };

      try {
        // Try to create real config and session
        const config = await AssistantService.createConfiguration({
          ...currentConfig,
          is_active: false,
        } as any);

        const session = await AssistantService.createPreviewSession(config.id);
        setPreviewSession(session);
      } catch (error) {
        console.log("Using mock preview session for development");
        setPreviewSession(mockSession);
      }

      setMessages([]);
      setIsActive(true);

      toast({
        title: "Preview Started",
        description: "Live preview session is now active",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start preview session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopPreview = () => {
    setIsActive(false);
    setPreviewSession(null);
    setMessages([]);
    setMetrics({
      avgLatency: 0,
      totalTokens: 0,
      totalCost: 0,
      messageCount: 0,
    });

    toast({
      title: "Preview Stopped",
      description: "Live preview session ended",
    });
  };

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim();
    if (!messageToSend || !previewSession) return;

    const userMessage: PreviewMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await AssistantService.sendPreviewMessage(
        previewSession.id,
        messageToSend,
      );

      setMessages((prev) => [...prev, response]);

      // Text-to-speech if enabled
      if (currentConfig.voice_enabled && !isSpeaking) {
        handleSpeak(response.content);
      }
    } catch (error) {
      console.error("Failed to send preview message:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      const language = languages.find(
        (l) => l.value === currentConfig.language,
      );
      if (language) {
        utterance.lang = language.code;
      }
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const handleStopSpeaking = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...currentConfig, [key]: value };
    setCurrentConfig(newConfig);
    onConfigChange(newConfig as AssistantConfig);
  };

  const getSelectedProvider = () => {
    return providers.find((p) => p.id === currentConfig.provider_id);
  };

  const getSelectedModel = () => {
    return models.find((m) => m.id === currentConfig.model_id);
  };

  const getAvailableModels = () => {
    return models.filter((m) => m.provider_id === currentConfig.provider_id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Configuration Panel */}
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Assistant Configuration
              </CardTitle>
              <CardDescription>
                Configure your AI assistant settings for live preview
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {isActive ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleStopPreview}
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Stop Preview
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleStartPreview}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Start Preview
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-6">
          <Tabs defaultValue="model" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="model">Model</TabsTrigger>
              <TabsTrigger value="behavior">Behavior</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>

            <TabsContent value="model" className="space-y-4">
              <div className="space-y-2">
                <Label>AI Provider</Label>
                <Select
                  value={currentConfig.provider_id}
                  onValueChange={(value) =>
                    handleConfigChange("provider_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {providers
                      .filter((p) => p.is_enabled)
                      .map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>AI Model</Label>
                <Select
                  value={currentConfig.model_id}
                  onValueChange={(value) =>
                    handleConfigChange("model_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableModels()
                      .filter((m) => m.is_enabled)
                      .map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{model.display_name}</span>
                            {model.is_free && (
                              <Badge
                                variant="secondary"
                                className="ml-2 text-xs"
                              >
                                Free
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={currentConfig.language}
                  onValueChange={(value) =>
                    handleConfigChange("language", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          {lang.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="behavior" className="space-y-4">
              <div className="space-y-2">
                <Label>Temperature: {currentConfig.temperature}</Label>
                <Slider
                  value={[currentConfig.temperature || 0.7]}
                  onValueChange={([value]) =>
                    handleConfigChange("temperature", value)
                  }
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Lower values for focused responses, higher for creative ones
                </p>
              </div>

              <div className="space-y-2">
                <Label>Max Tokens: {currentConfig.max_tokens}</Label>
                <Slider
                  value={[currentConfig.max_tokens || 1000]}
                  onValueChange={([value]) =>
                    handleConfigChange("max_tokens", value)
                  }
                  max={4000}
                  min={100}
                  step={100}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>System Prompt</Label>
                <Textarea
                  placeholder="You are a helpful AI assistant..."
                  value={currentConfig.system_prompt}
                  onChange={(e) =>
                    handleConfigChange("system_prompt", e.target.value)
                  }
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Voice Assistant</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable text-to-speech responses
                  </p>
                </div>
                <Switch
                  checked={currentConfig.voice_enabled}
                  onCheckedChange={(checked) =>
                    handleConfigChange("voice_enabled", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Translation</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable automatic translation
                  </p>
                </div>
                <Switch
                  checked={currentConfig.translation_enabled}
                  onCheckedChange={(checked) =>
                    handleConfigChange("translation_enabled", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Form Assistance</Label>
                  <p className="text-xs text-muted-foreground">
                    Help users fill out forms
                  </p>
                </div>
                <Switch
                  checked={currentConfig.form_assistance_enabled}
                  onCheckedChange={(checked) =>
                    handleConfigChange("form_assistance_enabled", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Element Analysis</Label>
                  <p className="text-xs text-muted-foreground">
                    Analyze and explain page elements
                  </p>
                </div>
                <Switch
                  checked={currentConfig.element_analysis_enabled}
                  onCheckedChange={(checked) =>
                    handleConfigChange("element_analysis_enabled", checked)
                  }
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Live Preview Panel */}
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Live Preview
                {isActive && (
                  <Badge variant="default" className="ml-2">
                    <Zap className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Test your assistant configuration in real-time
              </CardDescription>
            </div>
            {isActive && (
              <div className="flex items-center gap-2">
                {currentConfig.voice_enabled && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={isSpeaking ? handleStopSpeaking : undefined}
                    disabled={!isSpeaking}
                  >
                    {isSpeaking ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={handleStopPreview}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {!isActive ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="font-medium">Preview Not Active</h3>
                  <p className="text-sm text-muted-foreground">
                    Start a preview session to test your configuration
                  </p>
                </div>
                <Button onClick={handleStartPreview} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Start Preview
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Metrics */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {metrics.avgLatency.toFixed(0)}ms
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Avg Latency
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {metrics.totalTokens}
                  </div>
                  <div className="text-xs text-muted-foreground">Tokens</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    ${metrics.totalCost.toFixed(4)}
                  </div>
                  <div className="text-xs text-muted-foreground">Est. Cost</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {metrics.messageCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Messages</div>
                </div>
              </div>

              <Separator className="mb-4" />

              {/* Messages */}
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground mb-4">
                        Start a conversation to test your assistant
                      </p>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          Try these:
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {samplePrompts.slice(0, 3).map((prompt, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendMessage(prompt)}
                              className="text-xs"
                            >
                              {prompt}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        {message.metadata && (
                          <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                            {message.metadata.latency_ms && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {message.metadata.latency_ms}ms
                              </span>
                            )}
                            {message.metadata.token_count && (
                              <span>{message.metadata.token_count} tokens</span>
                            )}
                          </div>
                        )}
                      </div>
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-secondary" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="mt-4 flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LivePreviewPanel;
