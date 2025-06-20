import React, { useState } from "react";
import {
  Mic,
  MicOff,
  Minimize2,
  Maximize2,
  Languages,
  History,
  X,
  Settings,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface AssistantControlsProps {
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  onSendMessage?: (message: string) => void;
  onLanguageChange?: (language: string) => void;
  onVoiceToggle?: (isActive: boolean) => void;
  isMinimized?: boolean;
  position?: { x: number; y: number };
}

const AssistantControls: React.FC<AssistantControlsProps> = ({
  onMinimize = () => {},
  onMaximize = () => {},
  onClose = () => {},
  onSendMessage = () => {},
  onLanguageChange = () => {},
  onVoiceToggle = () => {},
  isMinimized = false,
  position = { x: 20, y: 20 },
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your web assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [dragPosition, setDragPosition] = useState(position);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: inputMessage,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages([...messages, newMessage]);
      onSendMessage(inputMessage);
      setInputMessage("");

      // Simulate assistant response
      setTimeout(() => {
        const assistantResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: "I understand your question. Let me help you with that.",
          sender: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantResponse]);
      }, 1000);
    }
  };

  const handleVoiceToggle = () => {
    const newState = !isVoiceActive;
    setIsVoiceActive(newState);
    onVoiceToggle(newState);
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    onLanguageChange(value);
  };

  const languages = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "chinese", label: "Chinese" },
    { value: "arabic", label: "Arabic" },
    { value: "hindi", label: "Hindi" },
    { value: "russian", label: "Russian" },
  ];

  if (isMinimized) {
    return (
      <motion.div
        drag
        dragMomentum={false}
        initial={dragPosition}
        className="fixed z-50 bg-background border rounded-full shadow-lg p-3 cursor-move"
        onDragEnd={(_, info) => {
          setDragPosition({ x: info.point.x, y: info.point.y });
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-primary text-primary-foreground"
          onClick={onMaximize}
        >
          <MessageSquare size={20} />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={dragPosition}
      className="fixed z-50 w-80 bg-background border rounded-lg shadow-lg overflow-hidden"
      onDragEnd={(_, info) => {
        setDragPosition({ x: info.point.x, y: info.point.y });
      }}
    >
      <Card className="border-none shadow-none">
        <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between bg-primary text-primary-foreground">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8 bg-primary-foreground">
              <AvatarImage
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=assistant"
                alt="AI Assistant"
              />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm">Web Assistant</CardTitle>
              <CardDescription className="text-xs text-primary-foreground/80">
                {isVoiceActive ? "Voice mode active" : "Text mode active"}
              </CardDescription>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-primary-foreground"
              onClick={onMinimize}
            >
              <Minimize2 size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-primary-foreground"
              onClick={onClose}
            >
              <X size={16} />
            </Button>
          </div>
        </CardHeader>

        <Tabs
          defaultValue="chat"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mx-3 mt-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="p-0">
            <CardContent className="p-3">
              <ScrollArea className="h-64 pr-2">
                <div className="flex flex-col space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-2 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>

            <CardFooter className="flex flex-col space-y-2 p-3 pt-0">
              <div className="flex w-full space-x-2">
                <Select
                  value={selectedLanguage}
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger className="w-[120px] h-9">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant={isVoiceActive ? "destructive" : "outline"}
                  size="icon"
                  onClick={handleVoiceToggle}
                >
                  {isVoiceActive ? <MicOff size={16} /> : <Mic size={16} />}
                </Button>
              </div>

              <div className="flex w-full space-x-2">
                <Textarea
                  placeholder="Type your message here..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="resize-none min-h-[60px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </CardFooter>
          </TabsContent>

          <TabsContent value="history" className="p-0">
            <CardContent className="p-3">
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-3 border rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium">Session {i + 1}</h4>
                        <Badge variant="outline">
                          {new Date().toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        How do I fill out this tax form?
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </TabsContent>

          <TabsContent value="settings" className="p-0">
            <CardContent className="p-3">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Language Preferences
                  </h4>
                  <Select
                    value={selectedLanguage}
                    onValueChange={handleLanguageChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Voice Settings</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Voice Assistant</span>
                    <Button
                      variant={isVoiceActive ? "default" : "outline"}
                      size="sm"
                      onClick={handleVoiceToggle}
                    >
                      {isVoiceActive ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Display Settings</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="w-full">
                      Reset Position
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      Default Size
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
};

export default AssistantControls;
