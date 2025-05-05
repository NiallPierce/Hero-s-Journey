import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, StepUpdateResponse, InventoryItem } from '../types/api';

const API_URL = 'http://localhost:5000/api';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Helper function to handle API calls
const apiCall = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<ApiResponse<T>> => {
  try {
    const token = await AsyncStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: data.message || 'Something went wrong' };
    }

    return { data, error: null };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { data: null, error: error.message };
    }
    return { data: null, error: 'An unknown error occurred' };
  }
};

// Auth Services
export const authService = {
  register: async (username: string, email: string, password: string) => {
    return apiCall<UserProfile>('/auth/register', 'POST', { username, email, password });
  },

  login: async (email: string, password: string) => {
    return apiCall<UserProfile>('/auth/login', 'POST', { email, password });
  },

  getProfile: async () => {
    return apiCall<UserProfile>('/auth/profile');
  },
};

// Game Services
export const gameService = {
  getProfile: async () => {
    return apiCall<UserProfile>('/game/profile');
  },

  updateSteps: async (steps: number) => {
    return apiCall<StepUpdateResponse>('/game/steps', 'POST', { steps });
  },

  getInventory: async () => {
    return apiCall<InventoryItem[]>('/game/inventory');
  },

  useItem: async (itemId: string) => {
    return apiCall<StepUpdateResponse>(`/game/inventory/use/${itemId}`, 'POST');
  },
};

// Socket.IO connection
export const socketService = {
  connect: () => {
    // We'll implement this when we set up Socket.IO in the frontend
  },
}; 