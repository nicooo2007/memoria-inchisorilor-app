// API Service for Memorial Gherla App
import axios from 'axios';
import Constants from 'expo-constants';
import { Prison, Victim, Testimony, Document, HistoricalEvent, AppEvent } from '../types';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Prisons
export const fetchPrisons = async (): Promise<Prison[]> => {
  const response = await api.get('/prisons');
  return response.data;
};

export const fetchPrisonById = async (id: string): Promise<Prison> => {
  const response = await api.get(`/prisons/${id}`);
  return response.data;
};

// Victims
export const fetchVictims = async (prisonId?: string): Promise<Victim[]> => {
  const url = prisonId ? `/victims?prison_id=${prisonId}` : '/victims';
  const response = await api.get(url);
  return response.data;
};

export const fetchVictimById = async (id: string): Promise<Victim> => {
  const response = await api.get(`/victims/${id}`);
  return response.data;
};

// Testimonies
export const fetchTestimonies = async (prisonId?: string): Promise<Testimony[]> => {
  const url = prisonId ? `/testimonies?prison_id=${prisonId}` : '/testimonies';
  const response = await api.get(url);
  return response.data;
};

// Documents
export const fetchDocuments = async (filters?: {
  type?: string;
  prisonId?: string;
  victimId?: string;
}): Promise<Document[]> => {
  const params = new URLSearchParams();
  if (filters?.type) params.append('type', filters.type);
  if (filters?.prisonId) params.append('prison_id', filters.prisonId);
  if (filters?.victimId) params.append('victim_id', filters.victimId);
  
  const response = await api.get(`/documents?${params.toString()}`);
  return response.data;
};

// Historical Events
export const fetchHistoricalTimeline = async (): Promise<HistoricalEvent[]> => {
  const response = await api.get('/historical-timeline');
  return response.data;
};

// App Events
export const fetchEvents = async (): Promise<AppEvent[]> => {
  const response = await api.get('/events');
  return response.data;
};

// QR Code
export const validateQRCode = async (code: string): Promise<any> => {
  const response = await api.post('/qr/scan', { qr_code: code });
  return response.data;
};

export default api;