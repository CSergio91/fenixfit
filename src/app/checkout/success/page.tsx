import Link from "next/link";
import { Check } from "lucide-react";

export default function CheckoutSuccessPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center max-w-4xl mx-auto">
            <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center mb-10 animate-[bounce_2s_infinite] shadow-2xl">
                <Check size={48} strokeWidth={3} />
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-black mb-6 tracking-tighter uppercase italic py-2">Order Confirmed</h1>
            <p className="text-muted-light text-lg md:text-xl max-w-lg mb-12 font-light leading-relaxed">
                Your order has been placed successfully. We&apos;ve sent a confirmation email to your inbox.
                Get ready to elevate your movement.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
                <Link
                    href="/"
                    className="flex-1 bg-primary text-white py-5 text-[11px] font-black uppercase tracking-[0.25em] hover:bg-gray-900 transition-all shadow-xl text-center"
                >
                    Return Home
                </Link>
                <Link
                    href="/collections"
                    className="flex-1 border-2 border-primary text-primary py-5 text-[11px] font-black uppercase tracking-[0.25em] hover:bg-primary hover:text-white transition-all text-center"
                >
                    Continue Shopping
                </Link>
            </div>
            <div className="mt-20 pt-10 border-t border-gray-100 w-full max-w-2xl">
                <p className="text-[10px] text-muted-light mb-6 uppercase tracking-[0.4em] font-black">Join the community</p>
                <div className="flex justify-center space-x-12">
                    <a href="#" className="text-[11px] font-black text-muted-light hover:text-primary transition-colors uppercase tracking-[0.2em]">Instagram</a>
                    <a href="#" className="text-[11px] font-black text-muted-light hover:text-primary transition-colors uppercase tracking-[0.2em]">TikTok</a>
                    <a href="#" className="text-[11px] font-black text-muted-light hover:text-primary transition-colors uppercase tracking-[0.2em]">YouTube</a>
                </div>
            </div>
        </div>
    );
}
