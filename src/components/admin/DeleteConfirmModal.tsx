'use client'

import { useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'

interface DeleteConfirmModalProps {
    title: string
    description: string
    onConfirm: () => Promise<void>
    onClose: () => void
}

export default function DeleteConfirmModal({ title, description, onConfirm, onClose }: DeleteConfirmModalProps) {
    const [loading, setLoading] = useState(false)

    const handleConfirm = async () => {
        setLoading(true)
        try {
            await onConfirm()
            onClose()
        } catch (error) {
            console.error(error)
            alert('Error al eliminar el registro')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-[#0a0a0a] border border-rose-500/20 p-10 animate-in fade-in zoom-in-95 duration-200 shadow-[0_0_50px_rgba(244,63,94,0.1)]">
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20">
                        <AlertCircle size={32} className="text-rose-500" />
                    </div>

                    <div>
                        <h3 className="text-lg font-black uppercase tracking-widest text-white mb-2">{title}</h3>
                        <p className="text-white/40 text-[11px] leading-relaxed uppercase tracking-widest font-bold font-sans italic">
                            {description}
                        </p>
                    </div>

                    <div className="flex flex-col w-full space-y-3 pt-4">
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className="w-full bg-rose-600 text-white py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-500 transition-all flex items-center justify-center space-x-2"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                            <span>Confirmar Eliminación</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full bg-white/5 border border-white/5 text-white/40 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all"
                        >
                            Cancelar Operación
                        </button>
                    </div>
                </div>

                {/* Decorative dots */}
                <div className="absolute top-2 left-2 w-1 h-1 bg-rose-500/20" />
                <div className="absolute top-2 right-2 w-1 h-1 bg-rose-500/20" />
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-rose-500/20" />
                <div className="absolute bottom-2 right-2 w-1 h-1 bg-rose-500/20" />
            </div>
        </div>
    )
}
