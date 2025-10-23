// State management using Zustand for user progress tracking
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProgress {
  visitedPrisons: string[];
  scannedQRs: string[];
  readDocuments: string[];
  listenedTestimonies: string[];
  badges: string[];
}

interface UserStore extends UserProgress {
  addVisitedPrison: (prisonId: string) => void;
  addScannedQR: (qrId: string) => void;
  addReadDocument: (docId: string) => void;
  addListenedTestimony: (testimonyId: string) => void;
  unlockBadge: (badgeId: string) => void;
  loadProgress: () => Promise<void>;
  saveProgress: () => Promise<void>;
}

const STORAGE_KEY = '@memorial_gherla_progress';

export const useUserStore = create<UserStore>((set, get) => ({
  visitedPrisons: [],
  scannedQRs: [],
  readDocuments: [],
  listenedTestimonies: [],
  badges: [],

  addVisitedPrison: (prisonId: string) => {
    set((state) => {
      if (state.visitedPrisons.includes(prisonId)) return state;
      const newState = {
        visitedPrisons: [...state.visitedPrisons, prisonId],
      };
      get().saveProgress();
      return newState;
    });
  },

  addScannedQR: (qrId: string) => {
    set((state) => {
      if (state.scannedQRs.includes(qrId)) return state;
      const newState = {
        scannedQRs: [...state.scannedQRs, qrId],
      };
      get().saveProgress();
      // Check for badge unlock
      if (newState.scannedQRs.length >= 5 && !state.badges.includes('qr_master')) {
        get().unlockBadge('qr_master');
      }
      return newState;
    });
  },

  addReadDocument: (docId: string) => {
    set((state) => {
      if (state.readDocuments.includes(docId)) return state;
      const newState = {
        readDocuments: [...state.readDocuments, docId],
      };
      get().saveProgress();
      // Check for badge unlock
      if (newState.readDocuments.length >= 10 && !state.badges.includes('scholar')) {
        get().unlockBadge('scholar');
      }
      return newState;
    });
  },

  addListenedTestimony: (testimonyId: string) => {
    set((state) => {
      if (state.listenedTestimonies.includes(testimonyId)) return state;
      const newState = {
        listenedTestimonies: [...state.listenedTestimonies, testimonyId],
      };
      get().saveProgress();
      return newState;
    });
  },

  unlockBadge: (badgeId: string) => {
    set((state) => {
      if (state.badges.includes(badgeId)) return state;
      const newState = {
        badges: [...state.badges, badgeId],
      };
      get().saveProgress();
      return newState;
    });
  },

  loadProgress: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const progress = JSON.parse(stored);
        set(progress);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  },

  saveProgress: async () => {
    try {
      const state = get();
      const progress: UserProgress = {
        visitedPrisons: state.visitedPrisons,
        scannedQRs: state.scannedQRs,
        readDocuments: state.readDocuments,
        listenedTestimonies: state.listenedTestimonies,
        badges: state.badges,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  },
}));