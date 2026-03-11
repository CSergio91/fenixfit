import { create } from 'zustand';
import { getPublicSettings } from '@/app/actions/admin-actions';

interface SettingsState {
    settings: any | null;
    loading: boolean;
    fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    settings: null,
    loading: true,
    fetchSettings: async () => {
        set({ loading: true });
        try {
            const s = await getPublicSettings();
            set({ settings: s, loading: false });
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            set({ loading: false });
        }
    }
}));
