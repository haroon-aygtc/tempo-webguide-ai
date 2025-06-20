import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Bot,
  Globe,
  Mic,
  FileText,
  Sparkles,
  Shield,
  Zap,
  Users,
  ArrowRight,
  Play,
  Moon,
  Sun,
  Monitor,
  Check,
  Star,
  MessageSquare,
  Languages,
  Volume2,
  MousePointer,
  ChevronRight,
  Award,
  TrendingUp,
  Clock,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  ExternalLink,
  Lightbulb,
  Target,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import WebAssistant from "./WebAssistant";

interface LandingPageProps {
  onGetStarted?: () => void;
}

const LandingPage = ({ onGetStarted = () => {} }: LandingPageProps) => {
  const { theme, setTheme, actualTheme } = useTheme();
  const [showAssistantDemo, setShowAssistantDemo] = useState(false);
  const [demoMessages, setDemoMessages] = useState([
    {
      id: "1",
      content:
        "Hello! I'm your AI web assistant. I can help you navigate this website, fill out forms, and answer questions in multiple languages. How can I assist you today?",
      sender: "assistant" as const,
      timestamp: new Date(),
    },
  ]);
  const [demoInput, setDemoInput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const features = [
    {
      icon: Bot,
      title: "AI-Powered Intelligence",
      description:
        "Advanced neural networks provide contextual understanding and intelligent responses across 50+ languages with 99.7% accuracy.",
      color: "from-blue-500 to-cyan-500",
      stats: "99.7% accuracy",
    },
    {
      icon: Globe,
      title: "Global Language Support",
      description:
        "Real-time translation and cultural adaptation for seamless communication across diverse user bases worldwide.",
      color: "from-green-500 to-emerald-500",
      stats: "50+ languages",
    },
    {
      icon: Zap,
      title: "Lightning Fast Response",
      description:
        "Sub-second response times with edge computing and optimized AI models for instant user assistance.",
      color: "from-yellow-500 to-orange-500",
      stats: "<200ms response",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-grade encryption, GDPR compliance, and zero-trust architecture protecting sensitive user data.",
      color: "from-purple-500 to-pink-500",
      stats: "SOC 2 certified",
    },
    {
      icon: Target,
      title: "Smart Element Detection",
      description:
        "Computer vision algorithms identify and explain UI elements with contextual guidance and accessibility support.",
      color: "from-red-500 to-rose-500",
      stats: "95% accuracy",
    },
    {
      icon: Rocket,
      title: "Seamless Integration",
      description:
        "One-line implementation with customizable themes, branding, and workflow integration for any platform.",
      color: "from-indigo-500 to-blue-500",
      stats: "5min setup",
    },
  ];

  const stats = [
    { label: "Enterprise Clients", value: "500+", icon: Users, change: "+23%" },
    { label: "Languages Supported", value: "50+", icon: Globe, change: "+12%" },
    { label: "Uptime SLA", value: "99.99%", icon: Zap, change: "Guaranteed" },
    { label: "User Satisfaction", value: "4.9/5", icon: Star, change: "+0.2" },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Head of Digital Experience",
      company: "TechCorp Global",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      content:
        "This AI assistant transformed our customer support. 40% reduction in support tickets and 95% user satisfaction. Game-changing technology.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "VP of Operations",
      company: "ServiceHub Inc",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
      content:
        "Incredible ROI. Our multilingual customers can now navigate complex forms effortlessly. Implementation took just 2 hours.",
      rating: 5,
    },
    {
      name: "Dr. Aisha Patel",
      role: "Digital Innovation Director",
      company: "MedTech Solutions",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aisha",
      content:
        "The voice interaction and real-time translation capabilities are phenomenal. Our diverse patient base loves the accessibility features.",
      rating: 5,
    },
  ];

  const handleDemoMessage = (message: string) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: message,
      sender: "user" as const,
      timestamp: new Date(),
    };

    setDemoMessages((prev) => [...prev, userMessage]);
    setDemoInput("");

    setTimeout(() => {
      const responses = [
        "I can help you with that! Let me guide you through the process step by step with visual highlights.",
        "Perfect! I'll analyze this form and can auto-fill it using your document data or information from other pages.",
        "I understand you need assistance. I can translate this content into your preferred language and provide detailed explanations.",
        "Great question! I can highlight the relevant elements on this page and explain exactly how to use them.",
        "I'm here to make your web experience seamless. Would you like me to demonstrate the voice interaction feature?",
      ];

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: "assistant" as const,
        timestamp: new Date(),
      };

      setDemoMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const languages = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Español" },
    { value: "french", label: "Français" },
    { value: "german", label: "Deutsch" },
    { value: "chinese", label: "中文" },
    { value: "arabic", label: "العربية" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Modern Header */}
      <header className="border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-2xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                AssistAI
              </span>
              <div className="text-xs text-muted-foreground font-medium">
                Web Assistant Platform
              </div>
            </div>
          </motion.div>

          <nav className="hidden lg:flex items-center space-x-8">
            {["Features", "Demo", "Pricing", "Enterprise"].map(
              (item, index) => (
                <motion.a
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium hover:text-primary transition-all duration-200 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
                </motion.a>
              ),
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  {theme === "light" && <Sun className="h-4 w-4" />}
                  {theme === "dark" && <Moon className="h-4 w-4" />}
                  {theme === "system" && <Monitor className="h-4 w-4" />}
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
            <Button variant="outline" className="hidden sm:flex">
              Sign In
            </Button>
            <Button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </header>

      {/* Revolutionary Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.1),transparent_50%)]" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Advanced AI • Trusted by 500+ Companies
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
              Transform Web
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              Experiences with AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Revolutionary AI assistant that guides users through complex web
            interfaces with
            <span className="text-primary font-semibold">
              {" "}
              real-time visual guidance
            </span>
            ,
            <span className="text-secondary font-semibold">
              {" "}
              intelligent form completion
            </span>
            , and
            <span className="text-primary font-semibold">
              {" "}
              seamless multilingual support
            </span>
            .
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Button
              size="lg"
              onClick={onGetStarted}
              className="text-lg px-10 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Start Free 14-Day Trial
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowAssistantDemo(true)}
              className="text-lg px-10 py-4 border-2 hover:bg-primary/5 transition-all duration-300"
            >
              <Play className="mr-3 h-5 w-5" />
              Watch Live Demo
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>SOC 2 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-500" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              <span>99.99% Uptime SLA</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span>500+ Enterprise Clients</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-muted/30 to-muted/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="relative mb-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <Badge className="absolute -top-2 -right-2 text-xs bg-green-500 text-white">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Lightbulb className="w-4 h-4 mr-2" />
              Advanced Capabilities
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Enterprise-Grade Features
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Cutting-edge AI technology designed for mission-critical
              applications with enterprise security and scalability.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-background to-muted/20 group-hover:scale-105">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}
                        >
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium"
                        >
                          {feature.stats}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-bold">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed text-muted-foreground">
                        {feature.description}
                      </CardDescription>
                      <Button
                        variant="ghost"
                        className="mt-4 p-0 h-auto font-medium text-primary hover:text-primary/80"
                      >
                        Learn more <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section
        id="demo"
        className="py-32 px-6 bg-gradient-to-br from-muted/20 to-background"
      >
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
              <Play className="w-4 h-4 mr-2" />
              Interactive Experience
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              See the AI Assistant in Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the live AI assistant that will transform how your
              users interact with your platform
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-background to-muted/10">
              <CardHeader className="bg-gradient-to-r from-primary via-primary/90 to-secondary text-primary-foreground p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-xl">
                        AI Web Assistant - Live Demo
                      </CardTitle>
                      <CardDescription className="text-primary-foreground/80">
                        Interactive preview with real AI responses
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white/20 text-white border-white/30">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                      Live
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative">
                  {/* Demo Browser Frame */}
                  <div className="bg-muted/30 border-b px-6 py-3 flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 bg-background rounded-lg px-4 py-2 text-sm text-muted-foreground flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      https://your-enterprise-platform.com/onboarding
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </div>
                  </div>

                  {/* Demo Content Area */}
                  <div className="h-[600px] bg-gradient-to-br from-background via-muted/10 to-background relative overflow-hidden">
                    {/* Sample Form in Background */}
                    <div className="absolute inset-6 bg-background/90 rounded-xl border shadow-lg p-8 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold">
                          Enterprise Onboarding Form
                        </h3>
                      </div>
                      <div className="space-y-6 opacity-60">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-semibold text-muted-foreground mb-2 block">
                              Company Name *
                            </label>
                            <div className="h-12 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20"></div>
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-muted-foreground mb-2 block">
                              Industry Sector *
                            </label>
                            <div className="h-12 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20"></div>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-muted-foreground mb-2 block">
                            Business Email Address *
                          </label>
                          <div className="h-12 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20"></div>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-muted-foreground mb-2 block">
                            Project Requirements
                          </label>
                          <div className="h-32 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20"></div>
                        </div>
                      </div>
                    </div>

                    {/* AI Assistant Chat Interface */}
                    <motion.div
                      initial={{ x: 400, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                      className="absolute bottom-6 right-6 w-96 bg-background border-2 rounded-2xl shadow-2xl overflow-hidden"
                    >
                      {/* Chat Header */}
                      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                            <Bot className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold">AI Assistant</div>
                            <div className="text-xs opacity-90 flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                              Online • Ready to help
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20 rounded-lg"
                          onClick={() =>
                            setShowAssistantDemo(!showAssistantDemo)
                          }
                        >
                          {showAssistantDemo ? (
                            <MessageSquare className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                      </div>

                      <AnimatePresence>
                        {showAssistantDemo && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            {/* Chat Messages */}
                            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-muted/10 to-background">
                              {demoMessages.map((message) => (
                                <motion.div
                                  key={message.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                  <div
                                    className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                                      message.sender === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted/80 backdrop-blur-sm"
                                    }`}
                                  >
                                    {message.content}
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            {/* Chat Controls */}
                            <div className="border-t bg-background/80 backdrop-blur-sm p-4 space-y-3">
                              <div className="flex gap-2">
                                <select
                                  value={selectedLanguage}
                                  onChange={(e) =>
                                    setSelectedLanguage(e.target.value)
                                  }
                                  className="text-xs border rounded-lg px-3 py-2 bg-background flex-1"
                                >
                                  {languages.map((lang) => (
                                    <option key={lang.value} value={lang.value}>
                                      {lang.label}
                                    </option>
                                  ))}
                                </select>
                                <Button
                                  variant={voiceEnabled ? "default" : "outline"}
                                  size="sm"
                                  className="h-9 px-3"
                                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                                >
                                  <Volume2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={demoInput}
                                  onChange={(e) => setDemoInput(e.target.value)}
                                  placeholder="Ask me about this form or any element..."
                                  className="flex-1 text-sm border rounded-lg px-4 py-3 bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleDemoMessage(demoInput);
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleDemoMessage(demoInput)}
                                  disabled={!demoInput.trim()}
                                  className="px-4 py-3"
                                >
                                  Send
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {!showAssistantDemo && (
                        <div className="p-6 text-center bg-gradient-to-b from-muted/10 to-background">
                          <Button
                            onClick={() => setShowAssistantDemo(true)}
                            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start Interactive Demo
                          </Button>
                        </div>
                      )}
                    </motion.div>

                    {/* Feature Callouts */}
                    <div className="absolute top-6 left-6 space-y-3">
                      {[
                        {
                          icon: MousePointer,
                          text: "Smart element detection",
                          color: "from-blue-500 to-cyan-500",
                          delay: 1,
                        },
                        {
                          icon: FileText,
                          text: "Intelligent form assistance",
                          color: "from-green-500 to-emerald-500",
                          delay: 1.2,
                        },
                        {
                          icon: Languages,
                          text: "Real-time translation",
                          color: "from-purple-500 to-pink-500",
                          delay: 1.4,
                        },
                        {
                          icon: Zap,
                          text: "Lightning-fast responses",
                          color: "from-yellow-500 to-orange-500",
                          delay: 1.6,
                        },
                      ].map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                          <motion.div
                            key={index}
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: feature.delay, duration: 0.6 }}
                            className={`bg-gradient-to-r ${feature.color} text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg backdrop-blur-sm`}
                          >
                            <Icon className="w-4 h-4" />
                            {feature.text}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-green-500/10 text-green-600 border-green-500/20">
              <Star className="w-4 h-4 mr-2" />
              Customer Success Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how leading companies are transforming their user experience
              with our AI assistant
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                      &quot;{testimonial.content}&quot;
                    </blockquote>
                    <div className="flex items-center gap-3">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full bg-muted"
                      />
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </div>
                        <div className="text-xs text-primary font-medium">
                          {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Pricing Section */}
      <section
        id="pricing"
        className="py-32 px-6 bg-gradient-to-br from-muted/20 to-background"
      >
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <TrendingUp className="w-4 h-4 mr-2" />
              Transparent Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your Success Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Flexible pricing designed to scale with your business. All plans
              include core AI features and 24/7 support.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Startup",
                price: "$49",
                period: "/month",
                description: "Perfect for growing startups",
                features: [
                  "Up to 5,000 sessions/month",
                  "Core AI assistance features",
                  "15 languages supported",
                  "Email support",
                  "Basic analytics dashboard",
                  "Standard integrations",
                ],
                cta: "Start Free Trial",
                badge: null,
              },
              {
                name: "Professional",
                price: "$149",
                period: "/month",
                description: "For scaling businesses",
                features: [
                  "Up to 25,000 sessions/month",
                  "Advanced AI with custom training",
                  "50+ languages supported",
                  "Voice interaction included",
                  "Advanced analytics & insights",
                  "Priority support (4h response)",
                  "Custom branding options",
                  "API access included",
                ],
                popular: true,
                cta: "Start Free Trial",
                badge: "Most Popular",
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                description: "For large organizations",
                features: [
                  "Unlimited sessions",
                  "Custom AI model training",
                  "All languages supported",
                  "Dedicated account manager",
                  "Custom integrations",
                  "SLA guarantee (99.99%)",
                  "On-premise deployment option",
                  "Advanced security features",
                ],
                cta: "Contact Sales",
                badge: "Enterprise",
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`relative h-full ${plan.popular ? "border-primary shadow-xl scale-105 bg-gradient-to-br from-primary/5 to-background" : "border-border hover:shadow-lg"} transition-all duration-300`}
                >
                  {plan.badge && (
                    <Badge
                      className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${
                        plan.popular
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      }`}
                    >
                      {plan.badge}
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl font-bold">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-6">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground text-lg">
                        {plan.period}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${plan.popular ? "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground mb-4">
              All plans include 14-day free trial • No setup fees • Cancel
              anytime
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-500" />
                <span>99.99% Uptime SLA</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-xl">AssistAI</span>
                  <div className="text-xs text-gray-400">
                    Web Assistant Platform
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Transforming web experiences with AI-powered assistance. Trusted
                by 500+ companies worldwide.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Twitter, href: "#" },
                  { icon: Linkedin, href: "#" },
                  { icon: Github, href: "#" },
                ].map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Product</h3>
              <ul className="space-y-4">
                {[
                  "Features",
                  "Pricing",
                  "Enterprise",
                  "API Documentation",
                  "Integrations",
                  "Security",
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href={`#${item.toLowerCase().replace(" ", "-")}`}
                      className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      {item}
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Company</h3>
              <ul className="space-y-4">
                {[
                  "About Us",
                  "Careers",
                  "Blog",
                  "Press Kit",
                  "Partners",
                  "Contact",
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href={`#${item.toLowerCase().replace(" ", "-")}`}
                      className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      {item}
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Email</div>
                    <div className="text-white">hello@assistai.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Phone</div>
                    <div className="text-white">+1 (555) 123-4567</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Address</div>
                    <div className="text-white">San Francisco, CA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 mt-16 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-gray-400 text-sm">
                © 2024 AssistAI. All rights reserved. Built with ❤️ for the
                future of web interaction.
              </div>
              <div className="flex items-center gap-6 text-sm">
                <a
                  href="#privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#cookies"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
