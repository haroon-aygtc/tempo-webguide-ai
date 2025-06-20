import React from "react";
import { ChevronDown, ChevronRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SettingSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  helpText?: string;
  badge?: string;
  className?: string;
}

const SettingSection = ({
  title,
  description,
  children,
  defaultOpen = true,
  helpText,
  badge,
  className,
}: SettingSectionProps) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div
      className={cn(
        "border border-border/50 rounded-xl bg-gradient-to-br from-white/50 to-slate-50/50 dark:from-slate-800/50 dark:to-slate-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200",
        className,
      )}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-6 hover:bg-primary/5 transition-colors cursor-pointer rounded-xl">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10"
              >
                {isOpen ? (
                  <ChevronDown className="h-5 w-5 text-primary" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-primary" />
                )}
              </Button>
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-lg text-foreground">
                    {title}
                  </h3>
                  {badge && (
                    <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                      {badge}
                    </Badge>
                  )}
                </div>
                {description && (
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>
            {helpText && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-sm">
                    <p className="text-sm leading-relaxed">{helpText}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-6 pb-6 pt-0 space-y-6">{children}</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default SettingSection;
