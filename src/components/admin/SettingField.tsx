import React from "react";
import { HelpCircle, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BaseFieldProps {
  label: string;
  description?: string;
  helpText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  badge?: string;
}

interface ToggleFieldProps extends BaseFieldProps {
  type: "toggle";
  value: boolean;
  onChange: (value: boolean) => void;
}

interface TextFieldProps extends BaseFieldProps {
  type: "text" | "email" | "url" | "password";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface TextareaFieldProps extends BaseFieldProps {
  type: "textarea";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  type: "select";
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; description?: string }[];
  placeholder?: string;
}

interface SliderFieldProps extends BaseFieldProps {
  type: "slider";
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

interface RadioFieldProps extends BaseFieldProps {
  type: "radio";
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; description?: string }[];
}

type SettingFieldProps =
  | ToggleFieldProps
  | TextFieldProps
  | TextareaFieldProps
  | SelectFieldProps
  | SliderFieldProps
  | RadioFieldProps;

const SettingField = (props: SettingFieldProps) => {
  const {
    label,
    description,
    helpText,
    error,
    required,
    disabled,
    className,
    badge,
  } = props;

  const renderField = () => {
    switch (props.type) {
      case "toggle":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={props.value}
              onCheckedChange={props.onChange}
              disabled={disabled}
              id={`field-${label.replace(/\s+/g, "-").toLowerCase()}`}
              className="data-[state=checked]:bg-primary"
            />
            <Label
              htmlFor={`field-${label.replace(/\s+/g, "-").toLowerCase()}`}
              className="text-sm font-medium cursor-pointer"
            >
              {props.value ? "Enabled" : "Disabled"}
            </Label>
          </div>
        );

      case "text":
      case "email":
      case "url":
      case "password":
        return (
          <Input
            type={props.type}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            disabled={disabled}
            className={cn(
              "h-11 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20",
              error &&
                "border-destructive focus:border-destructive focus:ring-destructive/20",
            )}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            rows={props.rows || 3}
            disabled={disabled}
            className={cn(
              "bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 resize-none",
              error &&
                "border-destructive focus:border-destructive focus:ring-destructive/20",
            )}
          />
        );

      case "select":
        return (
          <Select
            value={props.value}
            onValueChange={props.onChange}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(
                "h-11 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20",
                error &&
                  "border-destructive focus:border-destructive focus:ring-destructive/20",
              )}
            >
              <SelectValue placeholder={props.placeholder || "Select option"} />
            </SelectTrigger>
            <SelectContent>
              {props.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                      <div className="text-xs text-muted-foreground">
                        {option.description}
                      </div>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "slider":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {props.min}
                {props.unit}
              </span>
              <span className="text-sm font-medium">
                {props.value}
                {props.unit}
              </span>
              <span className="text-sm text-muted-foreground">
                {props.max}
                {props.unit}
              </span>
            </div>
            <Slider
              value={[props.value]}
              onValueChange={([value]) => props.onChange(value)}
              min={props.min}
              max={props.max}
              step={props.step || 1}
              disabled={disabled}
              className="w-full [&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
            />
          </div>
        );

      case "radio":
        return (
          <RadioGroup
            value={props.value}
            onValueChange={props.onChange}
            disabled={disabled}
            className="space-y-2"
          >
            {props.options.map((option) => (
              <div key={option.value} className="flex items-start space-x-3">
                <RadioGroupItem
                  value={option.value}
                  id={`radio-${option.value}`}
                  className="mt-1 border-primary text-primary"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={`radio-${option.value}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  {option.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Label className="text-sm font-semibold text-foreground">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {badge && (
            <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
              {badge}
            </Badge>
          )}
        </div>
        {helpText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-5 w-5 text-muted-foreground hover:text-primary cursor-help transition-colors" />
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-sm">
                <p className="text-sm leading-relaxed">{helpText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
      <div className="pt-2">{renderField()}</div>
      {error && (
        <div className="flex items-center space-x-2 text-destructive animate-in slide-in-from-left-1">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default SettingField;
