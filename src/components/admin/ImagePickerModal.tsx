'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { X, Upload, Loader2, Search, Check, ImageOff, FolderOpen } from 'lucide-react'
import { listBucketImages, uploadProductImage } from '@/app/actions/storage-actions'

interface ImagePickerModalProps {
    folder?: string
    onSelect: (url: string) => void
    onClose: () => void
}

export default function ImagePickerModal({ folder, onSelect, onClose }: ImagePickerModalProps) {
    const [images, setImages] = useState<{ name: string; url: string; path: string }[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const fileRef = useRef<HTMLInputElement>(null)

    const loadImages = useCallback(async () => {
        setLoading(true)
        try {
            const imgs = await listBucketImages(folder)
            setImages(imgs)
        } catch (e) {
            console.error('Error loading images', e)
        } finally {
            setLoading(false)
        }
    }, [folder])

    useEffect(() => {
        loadImages()
    }, [loadImages])

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setUploadProgress(0)

        try {
            // Convert to base64
            const reader = new FileReader()
            reader.onload = async (event) => {
                const base64 = event.target?.result as string
                setUploadProgress(40)
                try {
                    const url = await uploadProductImage(file.name, base64, file.type, folder)
                    setUploadProgress(100)
                    await loadImages() // Refresh list
                    onSelect(url) // auto select after upload
                    onClose()
                } catch (err: any) {
                    alert('Error al subir: ' + err.message)
                } finally {
                    setUploading(false)
                    setUploadProgress(0)
                }
            }
            reader.readAsDataURL(file)
        } catch {
            setUploading(false)
        }
    }

    const filteredImages = images.filter(img =>
        img.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleConfirm = () => {
        if (selectedUrl) {
            onSelect(selectedUrl)
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose} />

            <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#080808] border border-white/10 flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#0a0a0a]">
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center">
                            <FolderOpen size={16} className="text-white/40" />
                        </div>
                        <div>
                            <span className="text-white/20 text-[9px] uppercase tracking-[0.4em] font-black block">Supabase Storage</span>
                            <h3 className="text-sm font-black uppercase tracking-widest">
                                {folder ? `Bucket / ${folder}` : 'Bucket / prendas'}
                            </h3>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 text-white/40 hover:text-white transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-4 p-4 border-b border-white/5 bg-[#0a0a0a]">
                    <div className="flex items-center bg-white/5 border border-white/5 px-4 py-2.5 flex-1">
                        <Search size={14} className="text-white/20 shrink-0" />
                        <input
                            type="text"
                            placeholder="Buscar en el archivo..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-[10px] font-black tracking-widest uppercase ml-3 w-full placeholder:text-white/10 text-white outline-none"
                        />
                    </div>
                    <button
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        className="shrink-0 bg-white text-black px-6 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 hover:bg-emerald-400 transition-all disabled:opacity-50"
                    >
                        {uploading ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                <span>{uploadProgress}%</span>
                            </>
                        ) : (
                            <>
                                <Upload size={14} />
                                <span>Subir Nueva</span>
                            </>
                        )}
                    </button>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <Loader2 size={32} className="animate-spin text-white/20" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Sincronizando con el servidor...</p>
                        </div>
                    ) : filteredImages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <ImageOff size={48} className="text-white/10" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">No hay imágenes en este directorio</p>
                            <p className="text-[9px] text-white/10 uppercase tracking-widest">Sube una imagen con el botón de arriba</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {filteredImages.map((img) => (
                                <button
                                    key={img.path}
                                    type="button"
                                    onClick={() => setSelectedUrl(img.url)}
                                    className={`relative aspect-square overflow-hidden border-2 transition-all duration-200 group ${selectedUrl === img.url
                                        ? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                        : 'border-transparent hover:border-white/30'
                                        }`}
                                >
                                    <img
                                        src={img.url}
                                        alt={img.name}
                                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                                    />
                                    {selectedUrl === img.url && (
                                        <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
                                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                                                <Check size={16} className="text-black" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 px-2 py-1 translate-y-full group-hover:translate-y-0 transition-transform">
                                        <p className="text-[8px] font-black uppercase tracking-widest truncate text-white/60">{img.name}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 bg-[#0a0a0a] flex justify-between items-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20">
                        {filteredImages.length} archivos en el servidor
                    </p>
                    <div className="flex space-x-4">
                        <button
                            onClick={onClose}
                            className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all px-4 py-2"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedUrl}
                            className="bg-white text-black px-8 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all disabled:opacity-30 flex items-center space-x-2"
                        >
                            <Check size={14} />
                            <span>Usar esta imagen</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
