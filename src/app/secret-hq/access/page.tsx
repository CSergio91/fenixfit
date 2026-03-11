"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Lock, UserPlus } from "lucide-react";

export default function AdminLoginPage() {
    const supabase = createClient();
    const router = useRouter();
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
                if (session) {
                    router.replace("/secret-hq/dashboard");
                }
            } catch (error) {
                console.error("Auth init error:", error);
            } finally {
                setLoading(false);
            }
        };

        initSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                router.replace("/secret-hq/dashboard");
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-[grid-white/[0.03]] bg-[size:40px_40px]">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-white text-black mx-auto mb-6 flex items-center justify-center transform -rotate-12 hover:rotate-0 transition-transform duration-500 shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                        <Lock size={32} />
                    </div>
                    <h1 className="font-display text-4xl font-black text-white italic tracking-tighter uppercase mb-2">FENIX FIT HQ</h1>
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">Terminal de Acceso Restringido</p>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 p-10 shadow-2xl backdrop-blur-xl rounded-sm">
                    <Auth
                        supabaseClient={supabase}
                        appearance={{
                            theme: ThemeSupa,
                            variables: {
                                default: {
                                    colors: {
                                        brand: '#ffffff',
                                        brandAccent: '#ffffff',
                                        brandButtonText: '#000000',
                                        inputBackground: '#111111',
                                        inputText: '#ffffff',
                                        inputPlaceholder: '#444444',
                                        inputBorder: '#222222',
                                        inputBorderHover: '#444444',
                                        inputBorderFocus: '#ffffff',
                                    }
                                }
                            },
                            className: {
                                container: 'space-y-6',
                                button: 'w-full bg-white !text-black font-black uppercase tracking-[0.2em] text-[11px] py-5 rounded-none hover:bg-white/90 transition-all border-none shadow-[0_4px_30px_rgba(255,255,255,0.15)]',
                                input: 'bg-[#111111] border-[#222222] !text-white rounded-none py-4 px-4 text-[13px] font-medium tracking-tight h-auto focus:border-white transition-colors placeholder:text-white/10',
                                label: 'text-white/40 text-[9px] uppercase tracking-[0.3em] font-black mb-3 block',
                                anchor: 'text-white/20 hover:text-white text-[10px] uppercase tracking-widest font-black transition-colors underline underline-offset-4 decoration-white/10 hover:decoration-white'
                            }
                        }}
                        localization={{
                            variables: {
                                sign_in: {
                                    email_label: 'CORREO ELECTRÓNICO',
                                    password_label: 'CONTRASEÑA',
                                    button_label: 'ENTRAR AL SISTEMA',
                                    link_text: '¿Ya tienes cuenta? Iniciar sesión',
                                },
                                sign_up: {
                                    email_label: 'CORREO ELECTRÓNICO',
                                    password_label: 'CREAR CONTRASEÑA',
                                    button_label: 'REGISTRAR NUEVO ACCESO',
                                    link_text: '¿No tienes cuenta? Registrarse',
                                },
                                forgotten_password: {
                                    link_text: '¿Olvidaste tu contraseña?',
                                    button_label: 'RECUPERAR ACCESO',
                                    email_label: 'CORREO ELECTRÓNICO',
                                }
                            }
                        }}
                        theme="dark"
                        providers={[]}
                    />
                </div>

                <div className="mt-8 text-center flex flex-col space-y-4">
                    <p className="text-white/20 text-[9px] uppercase tracking-widest leading-relaxed">
                        SISTEMA DE GESTIÓN FENIX FIT v2.0<br />ACCESO MONITOREADO IP: LOGGING
                    </p>
                </div>
            </div>
        </div>
    );
}
