// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "agent" | "user";
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expires_at: string;
}

// Session Types
export interface AssistantSession {
  id: number;
  user_id: number;
  page_url: string;
  page_title: string;
  language: string;
  status: "active" | "completed" | "abandoned";
  started_at: string;
  ended_at?: string;
  metadata?: Record<string, any>;
}

// Interaction Types
export interface Interaction {
  id: number;
  session_id: number;
  type: "highlight" | "form_assist" | "voice" | "chat";
  element_selector?: string;
  element_text?: string;
  user_input?: string;
  assistant_response?: string;
  confidence_score?: number;
  created_at: string;
}

// Form Assistance Types
export interface FormField {
  id: string;
  name: string;
  type: string;
  value: string;
  suggestions?: FormSuggestion[];
  confidence?: number;
  source_document?: string;
}

export interface FormSuggestion {
  id: number;
  field_name: string;
  suggested_value: string;
  confidence_score: number;
  source_type: "document" | "profile" | "history";
  source_id?: number;
}

// Document Types
export interface Document {
  id: number;
  user_id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  extracted_data?: Record<string, any>;
  processing_status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
}

// Analytics Types
export interface SessionAnalytics {
  total_sessions: number;
  active_sessions: number;
  completion_rate: number;
  average_duration: number;
  most_assisted_pages: Array<{
    url: string;
    count: number;
  }>;
  language_distribution: Record<string, number>;
}

// Error Types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}
