import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Mic, Globe, Settings, Info } from "lucide-react";
import WebAssistant from "./WebAssistant";

const HomePage = () => {
  const [assistantActive, setAssistantActive] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [currentTab, setCurrentTab] = useState("demo");

  // Mock webpage content for demonstration
  const mockWebpageContent = (
    <div className="p-6 bg-white rounded-md">
      <h2 className="text-2xl font-bold mb-4">Online Banking Portal</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Account Summary</h3>
        <div className="border rounded-md p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span>Checking Account</span>
            <span className="font-medium">$2,456.78</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Savings Account</span>
            <span className="font-medium">$15,789.32</span>
          </div>
          <div className="flex justify-between">
            <span>Credit Card</span>
            <span className="font-medium text-red-500">-$349.50</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Quick Transfer</h3>
        <form className="border rounded-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                From Account
              </label>
              <select className="w-full border rounded-md p-2">
                <option>Checking Account</option>
                <option>Savings Account</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                To Account
              </label>
              <select className="w-full border rounded-md p-2">
                <option>Savings Account</option>
                <option>Credit Card</option>
                <option>External Account</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="text"
              className="w-full border rounded-md p-2"
              placeholder="$0.00"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              className="w-full border rounded-md p-2"
              placeholder="Enter description"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Transfer Now
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              AI Web Assistant
            </h1>
            <p className="text-muted-foreground">
              Real-time guidance for web navigation
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger className="w-[180px]">
                <Globe className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="arabic">Arabic</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Switch
                id="voice-mode"
                checked={voiceEnabled}
                onCheckedChange={setVoiceEnabled}
              />
              <Label htmlFor="voice-mode" className="flex items-center">
                <Mic className="mr-2 h-4 w-4" />
                Voice Mode
              </Label>
            </div>
          </div>
        </div>
      </header>

      <main>
        <Tabs
          defaultValue="demo"
          value={currentTab}
          onValueChange={setCurrentTab}
          className="mb-6"
        >
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="demo">Demo Browser</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="demo" className="mt-6">
            <Card className="border-2 border-slate-200">
              <CardHeader className="bg-slate-100 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white rounded-md px-3 py-1 text-sm text-center text-slate-600 border border-slate-300">
                      https://example-bank.com/dashboard
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAssistantActive(!assistantActive)}
                  >
                    {assistantActive ? "Disable Assistant" : "Enable Assistant"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 relative">
                <div className="min-h-[600px] bg-white">
                  {mockWebpageContent}
                  {assistantActive && (
                    <WebAssistant
                      isActive={assistantActive}
                      language={selectedLanguage}
                      voiceEnabled={voiceEnabled}
                      onToggle={() => setAssistantActive(!assistantActive)}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Assistant Settings</CardTitle>
                <CardDescription>
                  Configure how the AI Web Assistant works
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Appearance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="highlight-color">Highlight Color</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            id="highlight-color"
                            defaultValue="#3b82f6"
                            className="w-10 h-10 rounded-md"
                          />
                          <span className="text-sm text-muted-foreground">
                            #3b82f6
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assistant-position">
                          Assistant Position
                        </Label>
                        <Select defaultValue="bottom-right">
                          <SelectTrigger id="assistant-position">
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="top-left">Top Left</SelectItem>
                            <SelectItem value="top-right">Top Right</SelectItem>
                            <SelectItem value="bottom-left">
                              Bottom Left
                            </SelectItem>
                            <SelectItem value="bottom-right">
                              Bottom Right
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Behavior</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-highlight">
                          Auto-highlight Elements
                        </Label>
                        <Switch id="auto-highlight" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Automatically highlight interactive elements on the page
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="form-assist">Form Assistance</Label>
                        <Switch id="form-assist" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Help users complete forms with auto-fill suggestions
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="voice-commands">Voice Commands</Label>
                        <Switch
                          id="voice-commands"
                          defaultChecked={voiceEnabled}
                          onCheckedChange={setVoiceEnabled}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Allow users to interact with the assistant using voice
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reset to Defaults</Button>
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>AI Web Assistant © 2023 | Real-time guidance for web navigation</p>
        <div className="flex items-center justify-center mt-2 space-x-4">
          <Button variant="link" size="sm" className="flex items-center">
            <Info className="mr-1 h-4 w-4" /> About
          </Button>
          <Button variant="link" size="sm" className="flex items-center">
            <Settings className="mr-1 h-4 w-4" /> Advanced Settings
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
