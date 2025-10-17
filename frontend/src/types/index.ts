// Memorial Gherla - Type Definitions

export type PrisonType = 'memorial' | 'prison' | 'camp';
export type TestimonyType = 'written' | 'audio' | 'video';
export type DocumentType = 'sentence' | 'letter' | 'securitate_file' | 'photograph' | 'other';
export type EventCategory = 'political' | 'resistance' | 'repression' | 'commemoration';
export type ContentType = 'audio_story' | 'text' | 'ar_experience' | 'video';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Prison {
  _id: string;
  name: string;
  type: PrisonType;
  coordinates: Coordinates;
  description: string;
  history_timeline: TimelineEvent[];
  operational_years: number[];
  estimated_victims: number;
  visit_info?: VisitInfo;
  images: string[];
  qr_codes: string[];
  audio_tour_tracks: AudioTrack[];
  created_at: string;
  updated_at: string;
}

export interface Victim {
  _id: string;
  prison_id: string;
  name: string;
  birth_year?: number;
  death_year?: number;
  profession: string;
  biography: string;
  photo_url?: string;
  testimonies: string[];
  imprisonment_period: {
    start: string;
    end?: string;
  };
}

export interface Testimony {
  _id: string;
  prison_id?: string;
  victim_id?: string;
  text: string;
  audio_url?: string;
  source: string;
  year: number;
  type: TestimonyType;
}

export interface Document {
  _id: string;
  title: string;
  document_type: DocumentType;
  scan_url: string;
  transcription?: string;
  prison_id?: string;
  victim_id?: string;
  year: number;
  description?: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  image_url?: string;
}

export interface HistoricalEvent {
  _id: string;
  date: string;
  title: string;
  description: string;
  related_prisons: string[];
  category: EventCategory;
  images: string[];
}

export interface VisitInfo {
  address: string;
  schedule?: string;
  price?: string;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  facilities?: string[];
}

export interface AudioTrack {
  id: string;
  title: string;
  duration: number;
  audio_url: string;
  transcript?: string;
  location?: Coordinates;
}

export interface QRLocation {
  _id: string;
  prison_id: string;
  location_name: string;
  qr_code: string;
  content_type: ContentType;
  content_data: any;
  position_coordinates?: Coordinates;
}

export interface AppEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  prison_id?: string;
  type: string;
  registration_url?: string;
}

export interface UserProgress {
  visited_prisons: string[];
  scanned_qrs: string[];
  read_articles: string[];
  listened_testimonies: string[];
  badges: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  progress: number;
}