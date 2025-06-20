import React, { useState } from "react";
import {
  Settings,
  Bot,
  Palette,
  Globe,
  Mic,
  FileText,
  BarChart3,
  Moon,
  Sun,
  User,
  LogOut,
  Monitor,
  Sparkles,
  Shield,
  Bell,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface AdminLayoutProps {
  children?: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  tabContent?: Record<string, React.ReactNode>;
}

const AdminLayout = ({
  children,
  activeSection,
  onSectionChange,
  isDarkMode = false,
  onThemeToggle = () => {},
  user = { name: "Admin User", email: "admin@example.com" },
  tabContent,
}: AdminLayoutProps) => {
  const { theme, setTheme, actualTheme } = useTheme();

  const navigationItems = [
    {
      id: "general",
      label: "General",
      icon: Settings,
      description: "Basic configuration and preferences",
    },
    {
      id: "assistant",
      label: "AI Assistant",
      icon: Bot,
      description: "Configure AI behavior and responses",
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: Palette,
      description: "Customize visual elements and branding",
    },
    {
      id: "languages",
      label: "Languages",
      icon: Globe,
      description: "Multi-language support settings",
    },
    {
      id: "voice",
      label: "Voice & Audio",
      icon: Mic,
      description: "Voice recognition and speech settings",
    },
    {
      id: "forms",
      label: "Forms",
      icon: FileText,
      description: "Auto-fill and form assistance features",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      description: "Usage statistics and insights",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary/5 to-secondary/10 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-800/60 sticky top-0 z-50">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  AI Assistant Admin
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                  Enterprise Configuration Panel
                </p>
              </div>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search settings..."
                  className="pl-10 w-64 bg-background/50 border-border/50 focus:bg-background focus:border-primary/50"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-secondary border-2 border-background">
                  3
                </Badge>
              </Button>

              {/* Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    {theme === "light" && <Sun className="h-5 w-5" />}
                    {theme === "dark" && <Moon className="h-5 w-5" />}
                    {theme === "system" && <Monitor className="h-5 w-5" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Status Badge */}
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                System Active
              </Badge>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 px-3 rounded-full">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left hidden sm:block">
                        <div className="text-sm font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Administrator
                        </div>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <Badge className="mt-2 text-xs bg-primary/10 text-primary border-primary/20">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin Access
                    </Badge>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {tabContent ? (
            <Tabs
              value={activeSection}
              onValueChange={onSectionChange}
              className="w-full"
            >
              {/* Tab Navigation */}
              <div className="mb-8">
                <TabsList className="grid w-full grid-cols-7 h-auto p-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-border/50">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <TabsTrigger
                        key={item.id}
                        value={item.id}
                        className={cn(
                          "flex flex-col items-center gap-2 py-4 px-3 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-secondary/10 data-[state=active]:text-primary data-[state=active]:border-primary/20",
                          isActive && "shadow-sm",
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="hidden sm:inline leading-tight text-center">
                          {item.label}
                        </span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              {/* Tab Content */}
              {Object.entries(tabContent).map(([key, content]) => (
                <TabsContent key={key} value={key} className="mt-0">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-xl">
                    <div className="p-8">
                      {/* Section Header */}
                      <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                          {React.createElement(
                            navigationItems.find((item) => item.id === key)
                              ?.icon || Settings,
                            { className: "w-6 h-6 text-primary" },
                          )}
                          <h2 className="text-2xl font-bold">
                            {navigationItems.find((item) => item.id === key)
                              ?.label || "Settings"}
                          </h2>
                        </div>
                        <p className="text-muted-foreground text-base">
                          {navigationItems.find((item) => item.id === key)
                            ?.description ||
                            "Configure your AI assistant settings"}
                        </p>
                      </div>

                      {/* Content */}
                      <div className="space-y-8">{content}</div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-xl p-8">
              {children}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
