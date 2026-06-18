export interface Consultation {
  id?: number;
  client_name: string;
  email: string;
  phone: string;
  service_type: string;
  message: string;
  status: string;
  created_at: string;
}

export interface DbStatus {
  connected: boolean;
  message: string;
  timestamp?: string;
  fallbackActive: boolean;
}
