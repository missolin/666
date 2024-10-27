import { create } from 'zustand';
import { Website, Action, Recording } from '../types';

interface WebsiteStore {
  websites: Website[];
  recordings: Recording[];
  isRecording: boolean;
  currentRecording: Action[];
  addWebsite: (website: Website) => void;
  removeWebsite: (id: string) => void;
  startRecording: () => void;
  stopRecording: (name: string) => void;
  addAction: (action: Action) => void;
  playRecording: (recordingId: string) => void;
}

export const useWebsiteStore = create<WebsiteStore>((set, get) => ({
  websites: [],
  recordings: [],
  isRecording: false,
  currentRecording: [],

  addWebsite: (website) => {
    set((state) => ({
      websites: [...state.websites, website]
    }));
  },

  removeWebsite: (id) => {
    set((state) => ({
      websites: state.websites.filter(w => w.id !== id)
    }));
  },

  startRecording: () => {
    set({ isRecording: true, currentRecording: [] });
  },

  stopRecording: (name) => {
    const { currentRecording } = get();
    const newRecording: Recording = {
      id: Date.now().toString(),
      name,
      actions: currentRecording
    };

    set((state) => ({
      isRecording: false,
      recordings: [...state.recordings, newRecording],
      currentRecording: []
    }));
  },

  addAction: (action) => {
    if (get().isRecording) {
      set((state) => ({
        currentRecording: [...state.currentRecording, action]
      }));
    }
  },

  playRecording: async (recordingId) => {
    const recording = get().recordings.find(r => r.id === recordingId);
    if (!recording) return;

    const websites = get().websites;
    for (const action of recording.actions) {
      websites.forEach(website => {
        const iframe = document.querySelector(`iframe[data-website-id="${website.id}"]`) as HTMLIFrameElement;
        if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'PLAYBACK_ACTION',
            action
          }, '*');
        }
      });
      
      // 等待动作执行完成
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}));