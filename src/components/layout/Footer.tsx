import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    <div className="lg:col-span-1">
                        <Link href="/" className="block mb-8 transition-opacity hover:opacity-80">
                            <div className="relative w-32 h-12 md:w-40 md:h-14">
                                <Image
                                    src="/fenix-logo-black.png"
                                    alt="Fenix Fit Logo"
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>
                        </Link>
                        <p className="text-sm text-muted-light font-light mb-6 pr-4 leading-relaxed">
                            Ultra-modern activewear designed for the aesthetic athlete. Elevate your everyday movement with Fenix Fit.
                        </p>
                        <div className="flex space-x-6">
                            <a href="#" className="text-muted-light hover:text-primary transition-colors">
                                <span className="sr-only">Instagram</span>
                                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-muted-light hover:text-primary transition-colors">
                                <span className="sr-only">TikTok</span>
                                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-.9 4.45-2.33 6.16-1.43 1.71-3.5 2.8-5.71 3.11-2.22.31-4.52.08-6.52-1.01-2-1.1-3.58-2.91-4.32-5.02-.74-2.11-.68-4.48.17-6.55 1.12-2.72 3.65-4.68 6.55-5.18 0 1.34-.01 2.68.01 4.02-1.39.19-2.7.9-3.56 1.99-.86 1.09-1.2 2.53-.94 3.91.26 1.38 1.06 2.58 2.23 3.3 1.17.72 2.6.96 3.94.66 1.34-.3 2.52-1.12 3.25-2.26.73-1.14 1.04-2.5 0-4.04.01-6.19.01-12.38.01-18.57z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[12px] font-bold tracking-[0.2em] uppercase mb-6">Shop</h3>
                        <ul className="space-y-4">
                            <li><Link href="/collections" className="text-sm text-muted-light hover:text-primary transition-colors">All Products</Link></li>
                            <li><Link href="/collections" className="text-sm text-muted-light hover:text-primary transition-colors">New Arrivals</Link></li>
                            <li><Link href="/collections" className="text-sm text-muted-light hover:text-primary transition-colors">Best Sellers</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-[12px] font-bold tracking-[0.2em] uppercase mb-6">Support</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-sm text-muted-light hover:text-primary transition-colors">FAQ</a></li>
                            <li><a href="#" className="text-sm text-muted-light hover:text-primary transition-colors">Shipping & Returns</a></li>
                            <li><a href="#" className="text-sm text-muted-light hover:text-primary transition-colors">Size Guide</a></li>
                            <li><a href="#" className="text-sm text-muted-light hover:text-primary transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-[12px] font-bold tracking-[0.2em] uppercase mb-6">The List</h3>
                        <p className="text-sm text-muted-light font-light mb-6">Sign up for exclusive drops, early access, and community news.</p>
                        <form className="flex border-b border-gray-200 pb-2 focus-within:border-primary transition-colors">
                            <input type="email" placeholder="Email Address" className="bg-transparent border-none w-full text-sm focus:ring-0 p-0 text-primary placeholder-gray-400 outline-none" />
                            <button type="submit" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/60 transition-colors ml-2">Join</button>
                        </form>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 text-[11px] text-muted-light uppercase tracking-widest font-medium">
                    <p>© 2024 Fenix Fit by Tahi Cruz.</p>
                    <div className="flex space-x-8 mt-6 md:mt-0">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
