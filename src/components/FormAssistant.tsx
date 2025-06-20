import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Check, X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface FormField {
  id: string;
  name: string;
  type: string;
  value: string;
  suggestions?: string[];
  confidence?: number;
  sourceDocument?: string;
}

interface FormAssistantProps {
  formFields?: FormField[];
  onFieldUpdate?: (fieldId: string, value: string) => void;
  onDocumentUpload?: (file: File) => void;
  isVisible?: boolean;
  onClose?: () => void;
}

const FormAssistant = ({
  formFields = defaultFormFields,
  onFieldUpdate = () => {},
  onDocumentUpload = () => {},
  isVisible = true,
  onClose = () => {},
}: FormAssistantProps) => {
  const [activeDocument, setActiveDocument] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMappingView, setShowMappingView] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setActiveDocument(file.name);
      setIsProcessing(true);
      setUploadProgress(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            setShowMappingView(true);
            return 100;
          }
          return prev + 10;
        });
      }, 300);

      onDocumentUpload(file);
    }
  };

  const handleSuggestionClick = (fieldId: string, value: string) => {
    onFieldUpdate(fieldId, value);
  };

  const handleClearDocument = () => {
    setActiveDocument(null);
    setShowMappingView(false);
    setUploadProgress(0);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-20 right-20 w-[600px] max-h-[400px] bg-background shadow-lg rounded-lg border border-border z-50"
    >
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Form Assistant</CardTitle>
              <CardDescription>
                Upload documents to auto-fill form fields
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Upload documents like ID cards, bills, or other forms to
                      automatically extract data and fill form fields.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!activeDocument ? (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted-foreground/20 rounded-lg">
              <Upload className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop your document or click to browse
              </p>
              <Label htmlFor="document-upload" className="cursor-pointer">
                <Button variant="secondary">Select Document</Button>
                <Input
                  id="document-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                />
              </Label>
            </div>
          ) : isProcessing ? (
            <div className="p-4">
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 mr-2 text-primary" />
                <span className="text-sm font-medium">{activeDocument}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing document...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            </div>
          ) : showMappingView ? (
            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
              <div className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-sm font-medium">{activeDocument}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearDocument}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {formFields.map((field) => (
                <div key={field.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor={field.id} className="text-sm font-medium">
                      {field.name}
                    </Label>
                    {field.confidence && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {field.confidence}% match
                      </span>
                    )}
                  </div>

                  {field.suggestions && field.suggestions.length > 0 ? (
                    <div className="space-y-2">
                      {field.suggestions.map((suggestion, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:bg-accent"
                          onClick={() =>
                            handleSuggestionClick(field.id, suggestion)
                          }
                        >
                          <span className="text-sm">{suggestion}</span>
                          <Check className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No suggestions available
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="border-t pt-3">
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearDocument}
              disabled={!activeDocument}
            >
              Clear
            </Button>
            <Button size="sm" disabled={!showMappingView}>
              Apply All Suggestions
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Default form fields for demonstration
const defaultFormFields: FormField[] = [
  {
    id: "name",
    name: "Full Name",
    type: "text",
    value: "",
    suggestions: ["John Smith"],
    confidence: 95,
    sourceDocument: "ID Card",
  },
  {
    id: "address",
    name: "Address",
    type: "text",
    value: "",
    suggestions: ["123 Main Street, Anytown, ST 12345"],
    confidence: 87,
    sourceDocument: "Utility Bill",
  },
  {
    id: "dob",
    name: "Date of Birth",
    type: "date",
    value: "",
    suggestions: ["01/15/1985"],
    confidence: 92,
    sourceDocument: "ID Card",
  },
  {
    id: "phone",
    name: "Phone Number",
    type: "tel",
    value: "",
    suggestions: ["(555) 123-4567", "555-123-4567"],
    confidence: 78,
    sourceDocument: "Application Form",
  },
];

export default FormAssistant;
