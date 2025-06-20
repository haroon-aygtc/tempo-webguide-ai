import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Settings,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  Loader2,
  TestTube,
  Zap,
  Star,
  Globe,
  Brain,
  Mic,
  Image,
  FileText,
  RefreshCw,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AssistantService } from "@/services/assistantService";
import {
  AIProvider,
  AIModel,
  ProviderTestResult,
  ModelTestResult,
} from "@/types/api";
import { useToast } from "@/components/ui/use-toast";

interface AIProviderSettingsProps {
  onProviderChange?: (providers: AIProvider[]) => void;
  onModelChange?: (models: AIModel[]) => void;
}

const AIProviderSettings = ({
  onProviderChange = () => {},
  onModelChange = () => {},
}: AIProviderSettingsProps) => {
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState<
    Record<string, ProviderTestResult>
  >({});
  const [modelTestResults, setModelTestResults] = useState<ModelTestResult[]>(
    [],
  );
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [testingModel, setTestingModel] = useState<string | null>(null);
  const [testPrompt, setTestPrompt] = useState("Hello! How are you today?");
  const { toast } = useToast();

  const [newProvider, setNewProvider] = useState({
    name: "",
    type: "openai" as const,
    apiKey: "",
    config: {},
  });

  const providerTypes = [
    {
      value: "openai",
      label: "OpenAI",
      description: "GPT-4, GPT-3.5, DALL-E, Whisper",
      icon: Brain,
      color: "text-green-600",
    },
    {
      value: "gemini",
      label: "Google Gemini",
      description: "Gemini Pro, Gemini Vision",
      icon: Globe,
      color: "text-blue-600",
    },
    {
      value: "anthropic",
      label: "Anthropic",
      description: "Claude 3, Claude 2",
      icon: Zap,
      color: "text-purple-600",
    },
    {
      value: "huggingface",
      label: "Hugging Face",
      description: "Open source models",
      icon: Star,
      color: "text-orange-600",
    },
    {
      value: "cohere",
      label: "Cohere",
      description: "Command, Embed models",
      icon: FileText,
      color: "text-indigo-600",
    },
  ];

  const modelCapabilityIcons = {
    chat: Brain,
    completion: FileText,
    embedding: Globe,
    image: Image,
    audio: Mic,
  };

  useEffect(() => {
    loadProviders();
    loadModels();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await AssistantService.getProviders();
      setProviders(data);
      onProviderChange(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load AI providers",
        variant: "destructive",
      });
    }
  };

  const loadModels = async () => {
    try {
      const data = await AssistantService.getModels();
      setModels(data);
      onModelChange(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load AI models",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProvider = async () => {
    if (!newProvider.name || !newProvider.apiKey) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const provider = await AssistantService.createProvider(
        newProvider.name,
        newProvider.type,
        newProvider.apiKey,
        newProvider.config,
      );

      setProviders([...providers, provider]);
      setNewProvider({ name: "", type: "openai", apiKey: "", config: {} });
      setShowAddProvider(false);

      toast({
        title: "Success",
        description: "AI provider added successfully",
      });

      // Test the new provider
      await handleTestProvider(provider.id);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add provider",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestProvider = async (providerId: string) => {
    setTestingProvider(providerId);
    try {
      const result = await AssistantService.testProvider(providerId);
      setTestResults({ ...testResults, [providerId]: result });

      if (result.status === "success") {
        toast({
          title: "Provider Test Successful",
          description: `Found ${result.available_models.length} available models`,
        });
        // Refresh models after successful test
        await loadModels();
      } else {
        toast({
          title: "Provider Test Failed",
          description: result.error_message || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description:
          error instanceof Error ? error.message : "Provider test failed",
        variant: "destructive",
      });
    } finally {
      setTestingProvider(null);
    }
  };

  const handleTestModel = async (modelId: string) => {
    setTestingModel(modelId);
    try {
      const result = await AssistantService.testModel(modelId, testPrompt);
      setModelTestResults([result, ...modelTestResults.slice(0, 9)]); // Keep last 10 results

      toast({
        title: "Model Test Successful",
        description: `Response generated in ${result.latency_ms}ms`,
      });
    } catch (error) {
      toast({
        title: "Model Test Failed",
        description:
          error instanceof Error ? error.message : "Model test failed",
        variant: "destructive",
      });
    } finally {
      setTestingModel(null);
    }
  };

  const handleToggleProvider = async (providerId: string, enabled: boolean) => {
    try {
      const updatedProvider = await AssistantService.updateProvider(
        providerId,
        {
          is_enabled: enabled,
        },
      );

      setProviders(
        providers.map((p) => (p.id === providerId ? updatedProvider : p)),
      );

      toast({
        title: "Success",
        description: `Provider ${enabled ? "enabled" : "disabled"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update provider",
        variant: "destructive",
      });
    }
  };

  const handleSetDefaultProvider = async (providerId: string) => {
    try {
      // First, remove default from all providers
      await Promise.all(
        providers.map((p) =>
          AssistantService.updateProvider(p.id, { is_default: false }),
        ),
      );

      // Then set the new default
      const updatedProvider = await AssistantService.updateProvider(
        providerId,
        {
          is_default: true,
        },
      );

      setProviders(
        providers.map((p) => ({
          ...p,
          is_default: p.id === providerId,
        })),
      );

      toast({
        title: "Success",
        description: "Default provider updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set default provider",
        variant: "destructive",
      });
    }
  };

  const handleToggleModel = async (modelId: string, enabled: boolean) => {
    try {
      const updatedModel = await AssistantService.updateModel(modelId, {
        is_enabled: enabled,
      });

      setModels(models.map((m) => (m.id === modelId ? updatedModel : m)));

      toast({
        title: "Success",
        description: `Model ${enabled ? "enabled" : "disabled"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update model",
        variant: "destructive",
      });
    }
  };

  const handleSetDefaultModel = async (modelId: string) => {
    try {
      // First, remove default from all models
      await Promise.all(
        models.map((m) =>
          AssistantService.updateModel(m.id, { is_default: false }),
        ),
      );

      // Then set the new default
      const updatedModel = await AssistantService.updateModel(modelId, {
        is_default: true,
      });

      setModels(
        models.map((m) => ({
          ...m,
          is_default: m.id === modelId,
        })),
      );

      toast({
        title: "Success",
        description: "Default model updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set default model",
        variant: "destructive",
      });
    }
  };

  const getProviderTypeInfo = (type: string) => {
    return providerTypes.find((pt) => pt.value === type) || providerTypes[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="providers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="providers">AI Providers</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="testing">Testing Lab</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">AI Providers</h3>
              <p className="text-sm text-muted-foreground">
                Manage your AI service providers and API keys
              </p>
            </div>
            <Dialog open={showAddProvider} onOpenChange={setShowAddProvider}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Provider
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add AI Provider</DialogTitle>
                  <DialogDescription>
                    Connect a new AI service provider to expand your
                    capabilities
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="provider-name">Provider Name</Label>
                    <Input
                      id="provider-name"
                      placeholder="My OpenAI Provider"
                      value={newProvider.name}
                      onChange={(e) =>
                        setNewProvider({ ...newProvider, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="provider-type">Provider Type</Label>
                    <Select
                      value={newProvider.type}
                      onValueChange={(value: any) =>
                        setNewProvider({ ...newProvider, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {providerTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <Icon className={`h-4 w-4 ${type.color}`} />
                                <div>
                                  <div className="font-medium">
                                    {type.label}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {type.description}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="api-key">API Key</Label>
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="sk-..."
                      value={newProvider.apiKey}
                      onChange={(e) =>
                        setNewProvider({
                          ...newProvider,
                          apiKey: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddProvider(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddProvider} disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Add Provider
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {providers.map((provider) => {
              const typeInfo = getProviderTypeInfo(provider.type);
              const Icon = typeInfo.icon;
              const testResult = testResults[provider.id];

              return (
                <Card key={provider.id} className="relative">
                  {provider.is_default && (
                    <Badge className="absolute top-2 right-2 bg-primary">
                      <Star className="h-3 w-3 mr-1" />
                      Default
                    </Badge>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Icon className={`h-5 w-5 ${typeInfo.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {provider.name}
                          </CardTitle>
                          <CardDescription>
                            {typeInfo.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={provider.is_enabled}
                          onCheckedChange={(checked) =>
                            handleToggleProvider(provider.id, checked)
                          }
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">API Key:</span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {showApiKey[provider.id]
                            ? provider.api_key
                            : "••••••••••••••••"}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            setShowApiKey({
                              ...showApiKey,
                              [provider.id]: !showApiKey[provider.id],
                            })
                          }
                        >
                          {showApiKey[provider.id] ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {testResult && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <div className="flex items-center gap-2">
                          {testResult.status === "success" ? (
                            <Badge variant="default" className="text-xs">
                              <Check className="h-3 w-3 mr-1" />
                              Connected
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs">
                              <X className="h-3 w-3 mr-1" />
                              Failed
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {testResult.response_time_ms}ms
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestProvider(provider.id)}
                        disabled={testingProvider === provider.id}
                      >
                        {testingProvider === provider.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <TestTube className="h-4 w-4 mr-2" />
                        )}
                        Test Connection
                      </Button>
                      {!provider.is_default && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefaultProvider(provider.id)}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Set Default
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">AI Models</h3>
              <p className="text-sm text-muted-foreground">
                Configure available models and their settings
              </p>
            </div>
            <Button variant="outline" onClick={loadModels}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Models
            </Button>
          </div>

          <div className="grid gap-4">
            {models.map((model) => {
              const provider = providers.find(
                (p) => p.id === model.provider_id,
              );
              const typeInfo = provider
                ? getProviderTypeInfo(provider.type)
                : null;
              const CapabilityIcon = modelCapabilityIcons[model.type] || Brain;

              return (
                <Card key={model.id} className="relative">
                  {model.is_default && (
                    <Badge className="absolute top-2 right-2 bg-primary">
                      <Star className="h-3 w-3 mr-1" />
                      Default
                    </Badge>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <CapabilityIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {model.display_name}
                          </CardTitle>
                          <CardDescription>
                            {provider?.name} • {model.type}
                            {model.is_free && (
                              <Badge
                                variant="secondary"
                                className="ml-2 text-xs"
                              >
                                Free
                              </Badge>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={model.is_enabled}
                          onCheckedChange={(checked) =>
                            handleToggleModel(model.id, checked)
                          }
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {model.description && (
                      <p className="text-sm text-muted-foreground">
                        {model.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {model.capabilities.map((capability) => (
                        <Badge
                          key={capability}
                          variant="outline"
                          className="text-xs"
                        >
                          {capability}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {model.max_tokens && (
                        <div>
                          <span className="text-muted-foreground">
                            Max Tokens:
                          </span>
                          <div className="font-medium">
                            {model.max_tokens.toLocaleString()}
                          </div>
                        </div>
                      )}
                      {model.cost_per_token && (
                        <div>
                          <span className="text-muted-foreground">
                            Cost/Token:
                          </span>
                          <div className="font-medium">
                            ${model.cost_per_token.toFixed(6)}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestModel(model.id)}
                        disabled={testingModel === model.id}
                      >
                        {testingModel === model.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <TestTube className="h-4 w-4 mr-2" />
                        )}
                        Test Model
                      </Button>
                      {!model.is_default && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefaultModel(model.id)}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Set Default
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">AI Testing Lab</h3>
            <p className="text-sm text-muted-foreground">
              Test your AI models and compare their responses
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Test Prompt</CardTitle>
              <CardDescription>
                Enter a prompt to test across your enabled models
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your test prompt here..."
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex gap-2">
                {models
                  .filter((m) => m.is_enabled)
                  .map((model) => (
                    <Button
                      key={model.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestModel(model.id)}
                      disabled={testingModel === model.id || !testPrompt.trim()}
                    >
                      {testingModel === model.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <TestTube className="h-4 w-4 mr-2" />
                      )}
                      Test {model.display_name}
                    </Button>
                  ))}
              </div>
            </CardContent>
          </Card>

          {modelTestResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Test Results</CardTitle>
                <CardDescription>
                  Recent model test results and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modelTestResults.map((result) => {
                    const model = models.find((m) => m.id === result.model_id);
                    return (
                      <div
                        key={result.id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {model?.display_name}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {result.latency_ms}ms
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>
                              {result.token_usage.total_tokens} tokens
                            </span>
                            {result.cost_estimate && (
                              <span>${result.cost_estimate.toFixed(4)}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium mb-1">Prompt:</div>
                          <div className="text-muted-foreground bg-muted p-2 rounded text-xs">
                            {result.prompt}
                          </div>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium mb-1">Response:</div>
                          <div className="bg-muted p-2 rounded text-xs">
                            {result.response}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIProviderSettings;
