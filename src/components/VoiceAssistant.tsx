import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAssistant } from "@/hooks/useAssistant";

interface VoiceAssistantProps {
  isActive?: boolean;
  language?: string;
  onTranscript?: (transcript: string) => void;
  onResponse?: (response: string) => void;
}

const VoiceAssistant = ({
  isActive = false,
  language = "en",
  onTranscript = () => {},
  onResponse = () => {},
}: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { processVoiceInput, sendMessage } = useAssistant();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initialize Speech Recognition
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang =
          language === "spanish"
            ? "es-ES"
            : language === "french"
              ? "fr-FR"
              : language === "german"
                ? "de-DE"
                : language === "chinese"
                  ? "zh-CN"
                  : language === "arabic"
                    ? "ar-SA"
                    : language === "hindi"
                      ? "hi-IN"
                      : language === "russian"
                        ? "ru-RU"
                        : "en-US";

        recognition.onresult = (event) => {
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          const fullTranscript = finalTranscript || interimTranscript;
          setTranscript(fullTranscript);
          onTranscript(fullTranscript);

          if (finalTranscript) {
            handleVoiceCommand(finalTranscript);
          }
        };

        recognition.onerror = (event) => {
          setError(`Speech recognition error: ${event.error}`);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }

      // Initialize Speech Synthesis
      if (window.speechSynthesis) {
        synthRef.current = window.speechSynthesis;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [language]);

  // Audio level monitoring
  const startAudioMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 256;
      microphone.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const updateAudioLevel = () => {
        if (analyserRef.current && isListening) {
          const dataArray = new Uint8Array(
            analyserRef.current.frequencyBinCount,
          );
          analyserRef.current.getByteFrequencyData(dataArray);

          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average / 255);

          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };

      updateAudioLevel();
    } catch (err) {
      setError("Microphone access denied");
    }
  };

  // Handle voice command processing
  const handleVoiceCommand = async (command: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await sendMessage(command, language);
      if (response) {
        onResponse(response);
        await speakResponse(response);
      }
    } catch (err) {
      setError("Failed to process voice command");
    } finally {
      setIsProcessing(false);
    }
  };

  // Text-to-speech functionality
  const speakResponse = async (text: string) => {
    if (!synthRef.current) return;

    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang =
      language === "spanish"
        ? "es-ES"
        : language === "french"
          ? "fr-FR"
          : language === "german"
            ? "de-DE"
            : language === "chinese"
              ? "zh-CN"
              : language === "arabic"
                ? "ar-SA"
                : language === "hindi"
                  ? "hi-IN"
                  : language === "russian"
                    ? "ru-RU"
                    : "en-US";

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setError("Speech synthesis failed");
    };

    synthRef.current.speak(utterance);
  };

  // Toggle listening state
  const toggleListening = async () => {
    if (!recognitionRef.current) {
      setError("Speech recognition not supported");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    } else {
      setTranscript("");
      setError(null);
      recognitionRef.current.start();
      setIsListening(true);
      await startAudioMonitoring();
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed bottom-24 right-6 w-80 bg-background"
    >
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Voice Assistant
            </CardTitle>
            <Badge variant={isListening ? "default" : "secondary"}>
              {isListening ? "Listening" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Audio Visualization */}
          {isListening && (
            <div className="flex items-center justify-center h-16">
              <div className="flex items-end gap-1">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-primary rounded-full"
                    animate={{
                      height: isListening
                        ? Math.max(4, audioLevel * 40 + Math.random() * 20)
                        : 4,
                    }}
                    transition={{ duration: 0.1 }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Transcript Display */}
          {transcript && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm">
                <span className="font-medium">You said:</span> {transcript}
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing your request...
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              variant={isListening ? "destructive" : "default"}
              className="rounded-full w-16 h-16"
              onClick={toggleListening}
              disabled={isProcessing}
            >
              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </Button>

            {isSpeaking && (
              <Button
                size="lg"
                variant="outline"
                className="rounded-full w-16 h-16"
                onClick={stopSpeaking}
              >
                <VolumeX size={24} />
              </Button>
            )}
          </div>

          <div className="text-center text-xs text-muted-foreground">
            {isListening
              ? "Speak now - I'm listening"
              : "Click the microphone to start"}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VoiceAssistant;
