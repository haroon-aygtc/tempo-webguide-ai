import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Check,
  X,
  HelpCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Download,
  Eye,
  Trash2,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAssistant } from "@/hooks/useAssistant";
import { FormSuggestion, Document } from "@/types/api";

interface FormField {
  id: string;
  name: string;
  type: string;
  value: string;
  required?: boolean;
  placeholder?: string;
  suggestions?: FormSuggestion[];
  confidence?: number;
  sourceDocument?: string;
}

interface FormAssistantProps {
  formFields?: FormField[];
  onFieldUpdate?: (fieldId: string, value: string) => void;
  onDocumentUpload?: (document: Document) => void;
  onSuggestionApply?: (fieldId: string, suggestion: FormSuggestion) => void;
  isVisible?: boolean;
  onClose?: () => void;
  position?: { x: number; y: number };
  maxHeight?: number;
}

const FormAssistant = ({
  formFields = [],
  onFieldUpdate = () => {},
  onDocumentUpload = () => {},
  onSuggestionApply = () => {},
  isVisible = true,
  onClose = () => {},
  position = { x: 20, y: 100 },
  maxHeight = 600,
}: FormAssistantProps) => {
  const { uploadDocument, getFormSuggestions, loading, error } = useAssistant();
  const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMappingView, setShowMappingView] = useState(false);
  const [suggestions, setSuggestions] = useState<FormSuggestion[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );
  const [dragActive, setDragActive] = useState(false);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<number>>(
    new Set(),
  );
  const [processingError, setProcessingError] = useState<string | null>(null);

  // Handle file upload with real API integration
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type and size
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      setProcessingError(
        "Unsupported file type. Please upload PDF, DOC, DOCX, or image files.",
      );
      return;
    }

    if (file.size > maxSize) {
      setProcessingError(
        "File size too large. Please upload files smaller than 10MB.",
      );
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);
    setProcessingError(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const document = await uploadDocument(file);

      if (document) {
        clearInterval(progressInterval);
        setUploadProgress(100);

        setUploadedDocuments((prev) => [...prev, document]);
        setSelectedDocument(document);
        onDocumentUpload(document);

        // Generate form suggestions based on the document
        await generateSuggestions(document);

        setTimeout(() => {
          setShowMappingView(true);
          setIsProcessing(false);
        }, 500);
      }
    } catch (err) {
      setProcessingError(
        err instanceof Error ? err.message : "Failed to upload document",
      );
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  // Generate suggestions from uploaded document
  const generateSuggestions = async (document: Document) => {
    if (!formFields.length) return;

    try {
      const formData = formFields.reduce(
        (acc, field) => {
          acc[field.name] = field.value || "";
          return acc;
        },
        {} as Record<string, any>,
      );

      const newSuggestions = await getFormSuggestions(formData);
      setSuggestions(newSuggestions);
    } catch (err) {
      console.error("Failed to generate suggestions:", err);
    }
  };

  // Handle suggestion application
  const handleSuggestionClick = (
    fieldId: string,
    suggestion: FormSuggestion,
  ) => {
    onFieldUpdate(fieldId, suggestion.suggested_value);
    onSuggestionApply(fieldId, suggestion);
    setAppliedSuggestions((prev) => new Set([...prev, suggestion.id]));
  };

  // Apply all suggestions at once
  const handleApplyAllSuggestions = () => {
    suggestions.forEach((suggestion) => {
      const field = formFields.find((f) => f.name === suggestion.field_name);
      if (field && !appliedSuggestions.has(suggestion.id)) {
        handleSuggestionClick(field.id, suggestion);
      }
    });
  };

  // Clear all documents and reset state
  const handleClearDocuments = () => {
    setUploadedDocuments([]);
    setSelectedDocument(null);
    setShowMappingView(false);
    setUploadProgress(0);
    setSuggestions([]);
    setAppliedSuggestions(new Set());
    setProcessingError(null);
  };

  // Remove specific document
  const handleRemoveDocument = (documentId: number) => {
    setUploadedDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    if (selectedDocument?.id === documentId) {
      const remaining = uploadedDocuments.filter(
        (doc) => doc.id !== documentId,
      );
      setSelectedDocument(remaining.length > 0 ? remaining[0] : null);
      if (remaining.length === 0) {
        setShowMappingView(false);
        setSuggestions([]);
      }
    }
  };

  // Get suggestions for a specific field
  const getFieldSuggestions = (fieldName: string): FormSuggestion[] => {
    return suggestions.filter((s) => s.field_name === fieldName);
  };

  // Check if suggestion is applied
  const isSuggestionApplied = (suggestionId: number): boolean => {
    return appliedSuggestions.has(suggestionId);
  };

  // Refresh suggestions
  const handleRefreshSuggestions = async () => {
    if (selectedDocument) {
      await generateSuggestions(selectedDocument);
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed bg-background shadow-2xl rounded-xl border border-border z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "650px",
        maxHeight: `${maxHeight}px`,
      }}
    >
      <Card className="h-full border-0 shadow-none">
        <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">
                  AI Form Assistant
                </CardTitle>
                <CardDescription className="text-sm">
                  {uploadedDocuments.length > 0
                    ? `${uploadedDocuments.length} document${uploadedDocuments.length > 1 ? "s" : ""} uploaded`
                    : "Upload documents to auto-fill form fields"}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {uploadedDocuments.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {suggestions.length} suggestions
                </Badge>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs">
                    <p className="text-sm">
                      Upload documents like ID cards, bills, contracts, or
                      forms. Our AI will extract relevant information and
                      suggest values for your form fields.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[400px] overflow-y-auto">
            {/* Error Display */}
            {(error || processingError) && (
              <div className="mx-4 mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">
                  {error || processingError}
                </p>
              </div>
            )}

            {/* Upload Area */}
            {uploadedDocuments.length === 0 && !isProcessing && (
              <div className="p-4">
                <div
                  className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/20 hover:border-muted-foreground/40"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload
                    className={`h-12 w-12 mb-4 ${dragActive ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <p className="text-sm text-muted-foreground mb-2 text-center">
                    Drag and drop your document here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground/70 mb-4 text-center">
                    Supports PDF, DOC, DOCX, JPG, PNG (max 10MB)
                  </p>
                  <Label htmlFor="document-upload" className="cursor-pointer">
                    <Button variant="secondary" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Select Document
                        </>
                      )}
                    </Button>
                    <Input
                      id="document-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileInputChange}
                      disabled={loading}
                    />
                  </Label>
                </div>
              </div>
            )}

            {/* Processing State */}
            {isProcessing && (
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Processing document...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Extracting data and generating suggestions
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Upload Progress</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              </div>
            )}

            {/* Document List */}
            {uploadedDocuments.length > 0 && !isProcessing && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium">Uploaded Documents</h4>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRefreshSuggestions}
                      disabled={loading}
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                      />
                    </Button>
                    <Label
                      htmlFor="document-upload-additional"
                      className="cursor-pointer"
                    >
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-1" />
                        Add More
                      </Button>
                      <Input
                        id="document-upload-additional"
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleFileInputChange}
                        disabled={loading}
                      />
                    </Label>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {uploadedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedDocument?.id === doc.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">
                            {doc.original_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(doc.size / 1024).toFixed(1)} KB •{" "}
                            {doc.processing_status}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant={
                            doc.processing_status === "completed"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {doc.processing_status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveDocument(doc.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />
              </div>
            )}

            {/* Suggestions Mapping View */}
            {showMappingView && formFields.length > 0 && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium">Field Suggestions</h4>
                  <Badge variant="outline" className="text-xs">
                    {
                      suggestions.filter((s) => !isSuggestionApplied(s.id))
                        .length
                    }{" "}
                    pending
                  </Badge>
                </div>

                <div className="space-y-4">
                  {formFields.map((field) => {
                    const fieldSuggestions = getFieldSuggestions(field.name);
                    return (
                      <div key={field.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <Label className="text-sm font-medium flex items-center gap-2">
                              {field.name}
                              {field.required && (
                                <span className="text-destructive text-xs">
                                  *
                                </span>
                              )}
                            </Label>
                            {field.placeholder && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {field.placeholder}
                              </p>
                            )}
                          </div>
                        </div>

                        {fieldSuggestions.length > 0 ? (
                          <div className="space-y-2">
                            {fieldSuggestions.map((suggestion) => {
                              const isApplied = isSuggestionApplied(
                                suggestion.id,
                              );
                              return (
                                <div
                                  key={suggestion.id}
                                  className={`flex items-center justify-between p-3 border rounded-md transition-all ${
                                    isApplied
                                      ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                                      : "cursor-pointer hover:bg-accent border-border"
                                  }`}
                                  onClick={() =>
                                    !isApplied &&
                                    handleSuggestionClick(field.id, suggestion)
                                  }
                                >
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">
                                      {suggestion.suggested_value}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {suggestion.confidence_score}%
                                        confidence
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {suggestion.source_type}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="ml-3">
                                    {isApplied ? (
                                      <div className="flex items-center gap-1 text-green-600">
                                        <Check className="h-4 w-4" />
                                        <span className="text-xs">Applied</span>
                                      </div>
                                    ) : (
                                      <Button variant="ghost" size="sm">
                                        Apply
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-muted-foreground">
                              No suggestions available for this field
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No Form Fields Message */}
            {showMappingView && formFields.length === 0 && (
              <div className="p-4 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No form fields detected on this page.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Navigate to a form to see AI-powered suggestions.
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-3 bg-muted/20">
          <div className="flex justify-between w-full">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearDocuments}
                disabled={uploadedDocuments.length === 0 || loading}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
              {uploadedDocuments.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {uploadedDocuments.length} document
                  {uploadedDocuments.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {suggestions.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {appliedSuggestions.size}/{suggestions.length} applied
                </span>
              )}
              <Button
                size="sm"
                disabled={
                  !showMappingView || suggestions.length === 0 || loading
                }
                onClick={handleApplyAllSuggestions}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-1" />
                )}
                Apply All
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default FormAssistant;
