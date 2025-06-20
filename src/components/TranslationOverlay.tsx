import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, X, Copy, Volume2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAssistant } from "@/hooks/useAssistant";
import { useToast } from "@/components/ui/use-toast";

interface TranslationOverlayProps {
  isVisible?: boolean;
  selectedText?: string;
  sourceLanguage?: string;
  onClose?: () => void;
  position?: { x: number; y: number };
}

const TranslationOverlay = ({
  isVisible = false,
  selectedText = "",
  sourceLanguage = "auto",
  onClose = () => {},
  position = { x: 0, y: 0 },
}: TranslationOverlayProps) => {
  const [targetLanguage, setTargetLanguage] = useState("english");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { translateContent } = useAssistant();
  const { toast } = useToast();

  const languages = [
    { value: "english", label: "English", code: "en" },
    { value: "spanish", label: "Spanish", code: "es" },
    { value: "french", label: "French", code: "fr" },
    { value: "german", label: "German", code: "de" },
    { value: "chinese", label: "Chinese", code: "zh" },
    { value: "arabic", label: "Arabic", code: "ar" },
    { value: "hindi", label: "Hindi", code: "hi" },
    { value: "russian", label: "Russian", code: "ru" },
    { value: "japanese", label: "Japanese", code: "ja" },
    { value: "korean", label: "Korean", code: "ko" },
    { value: "portuguese", label: "Portuguese", code: "pt" },
    { value: "italian", label: "Italian", code: "it" },
  ];

  // Auto-translate when text or target language changes
  useEffect(() => {
    if (selectedText && targetLanguage && isVisible) {
      handleTranslate();
    }
  }, [selectedText, targetLanguage, isVisible]);

  const handleTranslate = async () => {
    if (!selectedText.trim()) return;

    setIsTranslating(true);
    try {
      const result = await translateContent(selectedText, targetLanguage);
      if (result) {
        setTranslatedText(result);
      }
    } catch (error) {
      toast({
        title: "Translation failed",
        description: "Unable to translate the selected text",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Translation copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleSpeak = () => {
    if ("speechSynthesis" in window && translatedText) {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      const targetLang = languages.find((l) => l.value === targetLanguage);
      if (targetLang) {
        utterance.lang = targetLang.code;
      }
      speechSynthesis.speak(utterance);
    }
  };

  if (!isVisible || !selectedText) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        className="fixed z-50 pointer-events-auto"
        style={{
          left: Math.min(position.x, window.innerWidth - 400),
          top: Math.min(position.y, window.innerHeight - 300),
        }}
      >
        <Card className="w-96 shadow-xl border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Translation
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Original Text */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Original Text
                </span>
                <Badge variant="outline" className="text-xs">
                  {sourceLanguage === "auto" ? "Auto-detect" : sourceLanguage}
                </Badge>
              </div>
              <div className="p-3 bg-muted rounded-md text-sm max-h-20 overflow-y-auto">
                {selectedText}
              </div>
            </div>

            {/* Language Selection */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Translate to:
              </label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger>
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

            {/* Translated Text */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Translation
                </span>
                <div className="flex items-center gap-1">
                  {translatedText && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={handleSpeak}
                        title="Listen"
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={handleCopy}
                        title="Copy"
                      >
                        {copied ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-md text-sm min-h-[60px] max-h-32 overflow-y-auto">
                {isTranslating ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    Translating...
                  </div>
                ) : translatedText ? (
                  translatedText
                ) : (
                  <span className="text-muted-foreground italic">
                    Translation will appear here
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-between pt-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button
                size="sm"
                onClick={handleTranslate}
                disabled={isTranslating || !selectedText.trim()}
              >
                {isTranslating ? "Translating..." : "Translate Again"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default TranslationOverlay;
