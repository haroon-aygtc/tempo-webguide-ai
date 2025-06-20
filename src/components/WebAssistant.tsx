import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Maximize2,
  Minimize2,
  Settings,
  HelpCircle,
  MousePointer,
  FileText,
  Mic,
  MessageSquare,
  X,
  Zap,
} from "lucide-react";
import AssistantControls from "./AssistantControls";
import ElementHighlighter from "./ElementHighlighter";
import FormAssistant from "./FormAssistant";
import { useAssistant } from "@/hooks/useAssistant";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WebAssistantProps {
  isActive?: boolean;
  onToggle?: () => void;
  defaultLanguage?: string;
  language?: string;
  voiceEnabled?: boolean;
}

const WebAssistant = ({
  isActive = true,
  onToggle = () => {},
  defaultLanguage = "en",
  language = "english",
  voiceEnabled = false,
}: WebAssistantProps) => {
  const { isAuthenticated, user } = useAuth();
  const {
    session,
    initializeSession,
    endSession,
    analyzeElement,
    sendMessage,
    loading,
    error,
  } = useAssistant();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeMode, setActiveMode] = useState<
    "highlight" | "form" | "chat" | null
  >(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null,
  );
  const [isListening, setIsListening] = useState(false);
  const [elementExplanation, setElementExplanation] = useState<string>("");
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(
    null,
  );
  const [showQuickActions, setShowQuickActions] = useState(true);

  // Initialize session when component becomes active
  useEffect(() => {
    if (isActive && isAuthenticated && !session) {
      initializeSession();
    }
  }, [isActive, isAuthenticated, session, initializeSession]);

  // Cleanup session when component unmounts or becomes inactive
  useEffect(() => {
    return () => {
      if (session) {
        endSession();
      }
    };
  }, []);

  // Element hover detection for smart highlighting
  const handleMouseOver = useCallback(
    (e: MouseEvent) => {
      if (activeMode === "highlight" && e.target instanceof HTMLElement) {
        // Avoid highlighting the assistant itself
        if (!e.target.closest("[data-web-assistant]")) {
          setHoveredElement(e.target);
        }
      }
    },
    [activeMode],
  );

  const handleElementClick = useCallback(
    async (e: MouseEvent) => {
      if (activeMode === "highlight" && e.target instanceof HTMLElement) {
        e.preventDefault();
        e.stopPropagation();

        if (!e.target.closest("[data-web-assistant]")) {
          setSelectedElement(e.target);

          // Analyze the clicked element
          const elementText =
            e.target.textContent || e.target.getAttribute("placeholder") || "";
          const elementSelector = generateSelector(e.target);
          const context = document.title + " - " + window.location.href;

          try {
            const analysis = await analyzeElement(
              elementSelector,
              elementText,
              context,
            );
            if (analysis) {
              setElementExplanation(analysis.explanation);
            }
          } catch (err) {
            console.error("Failed to analyze element:", err);
          }
        }
      }
    },
    [activeMode, analyzeElement],
  );

  // Add event listeners for element interaction
  useEffect(() => {
    if (activeMode === "highlight") {
      document.addEventListener("mouseover", handleMouseOver);
      document.addEventListener("click", handleElementClick);
      document.body.style.cursor = "crosshair";

      return () => {
        document.removeEventListener("mouseover", handleMouseOver);
        document.removeEventListener("click", handleElementClick);
        document.body.style.cursor = "default";
      };
    }
  }, [activeMode, handleMouseOver, handleElementClick]);

  // Generate CSS selector for element
  const generateSelector = (element: HTMLElement): string => {
    if (element.id) return `#${element.id}`;
    if (element.className) {
      const classes = element.className.split(" ").filter((c) => c.length > 0);
      if (classes.length > 0) return `.${classes.join(".")}`;
    }
    return element.tagName.toLowerCase();
  };

  // Toggle between expanded and minimized states
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Switch between different assistant modes
  const switchMode = (mode: "highlight" | "form" | "chat" | null) => {
    setActiveMode(mode);
    if (mode === null) {
      setSelectedElement(null);
      setHoveredElement(null);
      setElementExplanation("");
    }
    if (mode !== "highlight") {
      document.body.style.cursor = "default";
    }
  };

  // Handle voice toggle
  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // Voice functionality would be implemented here
  };

  if (!isActive) return null;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none bg-transparent"
      data-web-assistant
    >
      {/* Overlay for element highlighting */}
      <AnimatePresence>
        {activeMode === "highlight" && hoveredElement && (
          <ElementHighlighter
            targetElement={hoveredElement}
            isActive={true}
            highlightColor="rgba(59, 130, 246, 0.3)"
            explanation="Hover to explore - Click to get detailed explanation"
            onClose={() => setHoveredElement(null)}
          />
        )}

        {activeMode === "highlight" && selectedElement && (
          <ElementHighlighter
            targetElement={selectedElement}
            isActive={true}
            highlightColor="#3b82f6"
            explanation={elementExplanation || "Analyzing element..."}
            onClose={() => {
              setSelectedElement(null);
              setElementExplanation("");
            }}
          />
        )}
      </AnimatePresence>

      {/* Form assistant component */}
      {activeMode === "form" && (
        <FormAssistant isVisible={true} onClose={() => switchMode(null)} />
      )}

      {/* Quick Action Buttons */}
      {showQuickActions && !isExpanded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 flex flex-col gap-2 pointer-events-auto"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className={`rounded-full shadow-lg ${
                    activeMode === "highlight" ? "bg-blue-600" : "bg-primary"
                  }`}
                  onClick={() =>
                    switchMode(activeMode === "highlight" ? null : "highlight")
                  }
                >
                  <MousePointer size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Element Highlighter</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className={`rounded-full shadow-lg ${
                    activeMode === "form" ? "bg-green-600" : "bg-primary"
                  }`}
                  onClick={() =>
                    switchMode(activeMode === "form" ? null : "form")
                  }
                >
                  <FileText size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Form Assistant</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className={`rounded-full shadow-lg ${
                    isListening ? "bg-red-600" : "bg-primary"
                  }`}
                  onClick={handleVoiceToggle}
                  disabled={!voiceEnabled}
                >
                  <Mic size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{voiceEnabled ? "Voice Assistant" : "Voice Disabled"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="rounded-full shadow-lg bg-primary"
                  onClick={toggleExpanded}
                >
                  <MessageSquare size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open Chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      )}

      {/* Main Assistant Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-96 bg-background border-l shadow-2xl pointer-events-auto z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Zap size={16} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Web Assistant</h3>
                  <p className="text-xs opacity-80">
                    {session ? "Active Session" : "Connecting..."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {user && (
                  <Badge variant="secondary" className="text-xs">
                    {user.name}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={() => setIsExpanded(false)}
                >
                  <X size={16} />
                </Button>
              </div>
            </div>

            {/* Mode Selection */}
            <div className="p-4 border-b">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={activeMode === "highlight" ? "default" : "outline"}
                  size="sm"
                  className="flex flex-col gap-1 h-auto py-2"
                  onClick={() =>
                    switchMode(activeMode === "highlight" ? null : "highlight")
                  }
                >
                  <MousePointer size={16} />
                  <span className="text-xs">Highlight</span>
                </Button>
                <Button
                  variant={activeMode === "form" ? "default" : "outline"}
                  size="sm"
                  className="flex flex-col gap-1 h-auto py-2"
                  onClick={() =>
                    switchMode(activeMode === "form" ? null : "form")
                  }
                >
                  <FileText size={16} />
                  <span className="text-xs">Forms</span>
                </Button>
                <Button
                  variant={isListening ? "destructive" : "outline"}
                  size="sm"
                  className="flex flex-col gap-1 h-auto py-2"
                  onClick={handleVoiceToggle}
                  disabled={!voiceEnabled}
                >
                  <Mic size={16} />
                  <span className="text-xs">Voice</span>
                </Button>
              </div>
            </div>

            {/* Status Indicators */}
            {(loading || error || activeMode) && (
              <div className="p-4 border-b">
                {loading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    Processing...
                  </div>
                )}
                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    {error}
                  </div>
                )}
                {activeMode === "highlight" && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    Click elements to analyze
                  </div>
                )}
                {activeMode === "form" && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Form assistance active
                  </div>
                )}
              </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden">
              <AssistantControls
                onMinimize={() => setIsExpanded(false)}
                onMaximize={() => setIsExpanded(true)}
                onClose={() => {
                  setIsExpanded(false);
                  onToggle();
                }}
                onLanguageChange={(lang) =>
                  console.log("Language changed:", lang)
                }
                onVoiceToggle={handleVoiceToggle}
                isMinimized={false}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close Quick Actions Button */}
      {showQuickActions && !isExpanded && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-6 right-6 rounded-full bg-background/80 backdrop-blur-sm border pointer-events-auto"
          onClick={() => setShowQuickActions(false)}
        >
          <X size={16} />
        </Button>
      )}
    </div>
  );
};

export default WebAssistant;
