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
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
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
import { useAuth } from "@/hooks/useAuth";

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
  const { logout, user: authUser } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentUser = authUser || user;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary/5 to-secondary/10 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-r border-border/50 transition-all duration-300 lg:relative lg:translate-x-0",
          sidebarCollapsed ? "w-16" : "w-64",
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  AI Assistant
                </h1>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8 hidden lg:flex"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
            className="h-8 w-8 lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border/50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted/50 transition-colors",
                  sidebarCollapsed && "justify-center",
                )}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="font-medium text-foreground">
                      {currentUser.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Administrator
                    </div>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">
                  {currentUser.email}
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
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-800/60 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button & Title */}
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    {navigationItems.find((item) => item.id === activeSection)
                      ?.label || "Dashboard"}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {navigationItems.find((item) => item.id === activeSection)
                      ?.description || "Manage your AI assistant settings"}
                  </p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-3">
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
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
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20 hidden sm:flex">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  System Active
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6">
          {tabContent ? (
            <div className="max-w-7xl mx-auto">
              {/* Tab Content for Active Section */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-xl">
                <div className="p-8">
                  {/* Tab Navigation for Page Content */}
                  {activeSection === "general" && (
                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                        <TabsTrigger value="performance">
                          Performance
                        </TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                      </TabsList>
                      <TabsContent value="basic">
                        {tabContent[activeSection]}
                      </TabsContent>
                      <TabsContent value="performance">
                        <div className="text-center py-12">
                          <h3 className="text-lg font-medium mb-2">
                            Performance Settings
                          </h3>
                          <p className="text-muted-foreground">
                            Coming soon...
                          </p>
                        </div>
                      </TabsContent>
                      <TabsContent value="security">
                        <div className="text-center py-12">
                          <h3 className="text-lg font-medium mb-2">
                            Security Settings
                          </h3>
                          <p className="text-muted-foreground">
                            Coming soon...
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                  {activeSection === "assistant" && (
                    <Tabs defaultValue="model" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="model">AI Model</TabsTrigger>
                        <TabsTrigger value="behavior">Behavior</TabsTrigger>
                        <TabsTrigger value="learning">Learning</TabsTrigger>
                      </TabsList>
                      <TabsContent value="model">
                        {tabContent[activeSection]}
                      </TabsContent>
                      <TabsContent value="behavior">
                        <div className="text-center py-12">
                          <h3 className="text-lg font-medium mb-2">
                            Behavior Settings
                          </h3>
                          <p className="text-muted-foreground">
                            Coming soon...
                          </p>
                        </div>
                      </TabsContent>
                      <TabsContent value="learning">
                        <div className="text-center py-12">
                          <h3 className="text-lg font-medium mb-2">
                            Learning Settings
                          </h3>
                          <p className="text-muted-foreground">
                            Coming soon...
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                  {activeSection === "appearance" && (
                    <Tabs defaultValue="theme" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="theme">Theme & Colors</TabsTrigger>
                        <TabsTrigger value="layout">Layout</TabsTrigger>
                        <TabsTrigger value="branding">Branding</TabsTrigger>
                      </TabsList>
                      <TabsContent value="theme">
                        {tabContent[activeSection]}
                      </TabsContent>
                      <TabsContent value="layout">
                        <div className="text-center py-12">
                          <h3 className="text-lg font-medium mb-2">
                            Layout Settings
                          </h3>
                          <p className="text-muted-foreground">
                            Coming soon...
                          </p>
                        </div>
                      </TabsContent>
                      <TabsContent value="branding">
                        <div className="text-center py-12">
                          <h3 className="text-lg font-medium mb-2">
                            Branding Settings
                          </h3>
                          <p className="text-muted-foreground">
                            Coming soon...
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                  {![
                    "general",
                    "assistant",
                    "appearance",
                    "providers",
                    "preview",
                  ].includes(activeSection) && (
                    <div className="space-y-8">{tabContent[activeSection]}</div>
                  )}
                  {(activeSection === "providers" ||
                    activeSection === "preview") && (
                    <div className="space-y-8">{tabContent[activeSection]}</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-xl p-8">
                {children}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
