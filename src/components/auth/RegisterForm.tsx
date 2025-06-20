import React, { useState } from "react";
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
import {
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Users,
  Globe,
  Zap,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { RegisterFormData } from "@/form-handlers/authFormHandler";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { register, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Real-time validation
  const validateField = (field: keyof RegisterFormData, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Full name is required";
        } else if (value.trim().length < 2) {
          newErrors.name = "Name must be at least 2 characters";
        } else {
          delete newErrors.name;
        }
        break;
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
        } else if (value.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          newErrors.password =
            "Password must contain uppercase, lowercase, and number";
        } else {
          delete newErrors.password;
        }

        // Also validate confirm password if it's been touched
        if (touched.confirmPassword && confirmPassword) {
          if (value !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
          } else {
            delete newErrors.confirmPassword;
          }
        }
        break;
      case "confirmPassword":
        if (!value.trim()) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (value !== password) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
    }

    if (touched[field]) {
      validateField(field as keyof RegisterFormData, value);
    }
  };

  const handleFieldBlur = (field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field as keyof RegisterFormData, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validate all fields
    validateField("name" as keyof RegisterFormData, name);
    validateField("email" as keyof RegisterFormData, email);
    validateField("password" as keyof RegisterFormData, password);
    validateField("confirmPassword" as keyof RegisterFormData, confirmPassword);

    // Check if there are any errors
    const hasErrors =
      Object.keys(errors).length > 0 ||
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim();

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
      await register(name, email, password);
      toast({
        title: "Welcome aboard!",
        description: "Your account has been created successfully.",
      });
      navigate("/dashboard");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";
      toast({
        title: "Registration failed",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-700" />
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
                Join thousands of users transforming web experiences
              </h2>

              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Create your account and start building intelligent web
                assistance solutions that break down language barriers and
                simplify complex interfaces.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-white/90">
                    Join 10,000+ active users
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-white/90">Multi-language support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-white/90">Get started in minutes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-400/20 rounded-full blur-xl" />
        </div>

        {/* Right Column - Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
              <CardHeader className="space-y-1 pb-8">
                <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Create Account
                </CardTitle>
                <CardDescription className="text-center text-base">
                  Start your journey with AI Web Assistant
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) =>
                          handleFieldChange("name", e.target.value)
                        }
                        onBlur={(e) => handleFieldBlur("name", e.target.value)}
                        disabled={loading}
                        data-error={!!errors.name}
                        className={`pl-10 h-12 transition-all duration-200 ${
                          errors.name
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                            : touched.name && !errors.name
                              ? "border-green-300 focus:border-green-500 focus:ring-green-500/20"
                              : "focus:border-purple-500 focus:ring-purple-500/20"
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-600 flex items-center gap-1 animate-in slide-in-from-left-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

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
                              : "focus:border-purple-500 focus:ring-purple-500/20"
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
                        placeholder="Create a strong password"
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
                              : "focus:border-purple-500 focus:ring-purple-500/20"
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

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) =>
                          handleFieldChange("confirmPassword", e.target.value)
                        }
                        onBlur={(e) =>
                          handleFieldBlur("confirmPassword", e.target.value)
                        }
                        disabled={loading}
                        data-error={!!errors.confirmPassword}
                        className={`pl-10 pr-10 h-12 transition-all duration-200 ${
                          errors.confirmPassword
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                            : touched.confirmPassword && !errors.confirmPassword
                              ? "border-green-300 focus:border-green-500 focus:ring-green-500/20"
                              : "focus:border-purple-500 focus:ring-purple-500/20"
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={loading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-400" />
                        )}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 flex items-center gap-1 animate-in slide-in-from-left-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>

                  <div className="text-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Already have an account?{" "}
                    </span>
                    <Link
                      to="/login"
                      className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                    >
                      Sign in instead
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

export default RegisterForm;
