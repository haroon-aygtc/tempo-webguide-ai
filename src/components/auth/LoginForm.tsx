import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Shield,
  Zap,
  UserCheck,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { login, loading } = useAuth();
  const { theme, setTheme, actualTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Real-time validation
  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;
      case "password":
        if (!value.trim()) {
          newErrors.password = "Password is required";
        } else if (value.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        } else {
          delete newErrors.password;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleFieldChange = (field: string, value: string) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleFieldBlur = (field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ email: true, password: true });

    // Validate all fields
    validateField("email", email);
    validateField("password", password);

    // Check if there are any errors
    const hasErrors =
      Object.keys(errors).length > 0 || !email.trim() || !password.trim();

    if (hasErrors) {
      // Focus on first error field
      const firstErrorField = document.querySelector(
        '[data-error="true"]',
      ) as HTMLInputElement;
      if (firstErrorField) {
        firstErrorField.focus();
      }

      toast({
        title: "Validation Error",
        description: "Please fix the errors before continuing.",
        variant: "destructive",
      });
      return;
    }

    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You've been successfully signed in.",
      });
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDemoLogin = async () => {
    const demoEmail = "admin@demo.com";
    const demoPassword = "demo123";

    setEmail(demoEmail);
    setPassword(demoPassword);

    // Clear any existing errors
    setErrors({});
    setTouched({ email: true, password: true });

    try {
      await login(demoEmail, demoPassword);
      toast({
        title: "Demo Login Successful!",
        description: "You've been logged in as a demo admin.",
      });
      navigate("/dashboard");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Demo login failed";
      toast({
        title: "Demo login failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const ThemeIcon = themeIcons[theme];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary/5 to-secondary/10 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between p-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const themes: ("light" | "dark" | "system")[] = [
                "light",
                "dark",
                "system",
              ];
              const currentIndex = themes.indexOf(theme);
              const nextTheme = themes[(currentIndex + 1) % themes.length];
              setTheme(nextTheme);
            }}
            className="rounded-full"
          >
            <ThemeIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="min-h-screen flex">
        {/* Left Column - Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary/80" />
          <div className="absolute inset-0 bg-black/20" />

          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="max-w-md">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold">AI Web Assistant</h1>
              </div>

              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Welcome back to the future of web assistance
              </h2>

              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Continue your journey with our intelligent assistant that guides
                users through any web interface with real-time visual
                highlighting and multi-language support.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <span className="text-white/90">
                    Enterprise-grade security
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-white/90">
                    Lightning-fast responses
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-400/20 rounded-full blur-xl" />
        </div>

        {/* Right Column - Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
              <CardHeader className="space-y-1 pb-8">
                <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Sign In
                </CardTitle>
                <CardDescription className="text-center text-base">
                  Enter your credentials to access your dashboard
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                          handleFieldChange("email", e.target.value)
                        }
                        onBlur={(e) => handleFieldBlur("email", e.target.value)}
                        disabled={loading}
                        data-error={!!errors.email}
                        className={`pl-10 h-12 transition-all duration-200 ${
                          errors.email
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                            : touched.email && !errors.email
                              ? "border-green-300 focus:border-green-500 focus:ring-green-500/20"
                              : "focus:border-primary focus:ring-primary/20"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 flex items-center gap-1 animate-in slide-in-from-left-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) =>
                          handleFieldChange("password", e.target.value)
                        }
                        onBlur={(e) =>
                          handleFieldBlur("password", e.target.value)
                        }
                        disabled={loading}
                        data-error={!!errors.password}
                        className={`pl-10 pr-10 h-12 transition-all duration-200 ${
                          errors.password
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                            : touched.password && !errors.password
                              ? "border-green-300 focus:border-green-500 focus:ring-green-500/20"
                              : "focus:border-primary focus:ring-primary/20"
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-400" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600 flex items-center gap-1 animate-in slide-in-from-left-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200 dark:border-slate-700" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400">
                          Or try demo
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 text-base font-medium border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                      onClick={handleDemoLogin}
                      disabled={loading}
                    >
                      <UserCheck className="mr-2 h-5 w-5" />
                      Demo Admin Login
                    </Button>
                  </div>

                  <div className="text-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Don't have an account?{" "}
                    </span>
                    <Link
                      to="/register"
                      className="text-sm font-medium text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80 transition-colors"
                    >
                      Create one now
                    </Link>
                  </div>
                </CardContent>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
