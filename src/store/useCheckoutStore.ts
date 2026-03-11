import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CheckoutState {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    addressStreet: string;
    addressCity: string;
    addressPostal: string;
    addressCountry: string;
    acceptTerms: boolean;
    acceptMarketing: boolean;

    setField: (field: keyof CheckoutState, value: any) => void;
    clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
    persist(
        (set) => ({
            customerName: '',
            customerEmail: '',
            customerPhone: '',
            addressStreet: '',
            addressCity: '',
            addressPostal: '',
            addressCountry: '',
            acceptTerms: false,
            acceptMarketing: true,

            setField: (field, value) => set((state) => ({ ...state, [field]: value })),

            clearCheckout: () => set({
                customerName: '',
                customerEmail: '',
                customerPhone: '',
                addressStreet: '',
                addressCity: '',
                addressPostal: '',
                addressCountry: '',
                acceptTerms: false,
                acceptMarketing: true,
            })
        }),
        {
            name: 'fenix-fit-checkout-v1',
        }
    )
);
