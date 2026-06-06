"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function ImageUploader({ images, setImages, type = "product-images", accept = { 'image/*': [] } }: { images: string[], setImages: (v: string[]) => void, type?: "product-images" | "store-logo" | "product-videos" | "pwa-icons", accept?: any }) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const supabase = createClient();
    
    // For React Dropzone batch dropping
    let currentImages = [...images];
    for (const file of acceptedFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from(type).upload(filePath, file);
      
      if (!uploadError) {
        const { data } = supabase.storage.from(type).getPublicUrl(filePath);
        if (data) {
          currentImages.push(data.publicUrl);
        }
      }
    }
    setImages(currentImages);
  }, [images, setImages, type]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept });

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-[24px] p-10 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-violet-500 bg-violet-500/10" : "border-white/10 hover:border-violet-500/50 bg-black/20 backdrop-blur-sm"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-8 h-8 mx-auto text-slate-500 mb-4" />
        <p className="text-sm font-medium text-slate-400">
          {isDragActive ? "Drop the files here ..." : "Drag 'n' drop some files here, or click to select files"}
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((url, i) => {
            const isVideo = url.match(/\.(mp4|mov|webm)$/i) || url.includes('product-videos');
            return (
            <div key={i} className="relative aspect-square rounded-[16px] overflow-hidden border border-white/10 bg-black/20 group">
              {isVideo ? (
                <video src={url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" muted loop playsInline />
              ) : (
                <img src={url} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              )}
              <button 
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
