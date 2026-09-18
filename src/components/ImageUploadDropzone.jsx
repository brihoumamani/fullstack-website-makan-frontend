'use client';

import { useState, useRef } from 'react';

/**
 * ImageUploadDropzone
 * Reusable image uploader supporting:
 * - Drag-and-drop of local image files
 * - Device file browser (multi-file selection)
 * - Remote URL input fallback
 * - Real-time thumbnail preview grid
 * - Set as Cover / Photo Principale
 * - Delete / Remove image
 */
export default function ImageUploadDropzone({
  images = [],
  onChange,
  maxImages = 12,
  title = 'Photos du Bien',
  subtitle = 'Glissez-déposez vos photos ici ou parcourez vos fichiers (JPG, PNG, WebP)'
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Handle Drag Over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // Handle Drag Leave
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Process Files to Base64
  const processFiles = (files) => {
    setUploadError('');
    const validImageFiles = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (validImageFiles.length === 0) {
      setUploadError('Veuillez sélectionner des fichiers image valides (JPG, PNG, WebP).');
      return;
    }

    if (images.length + validImageFiles.length > maxImages) {
      setUploadError(`Vous pouvez ajouter un maximum de ${maxImages} photos.`);
    }

    const filesToRead = validImageFiles.slice(0, maxImages - images.length);

    filesToRead.forEach((file) => {
      // Check file size limit (max 10MB per file)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`Le fichier "${file.name}" dépasse la limite de 10 Mo.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target.result;
        onChange((prev) => {
          if (prev.includes(base64Data)) return prev;
          if (prev.length >= maxImages) return prev;
          return [...prev, base64Data];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle Drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Handle File Input Change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // Reset file input value so same file can be re-uploaded if desired
    e.target.value = '';
  };

  // Handle Adding Image by Web URL
  const handleAddUrl = (e) => {
    e.preventDefault();
    setUploadError('');
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
      setUploadError('Veuillez entrer une URL valide commençant par http:// ou https://');
      return;
    }

    if (images.length >= maxImages) {
      setUploadError(`Vous avez atteint le maximum de ${maxImages} photos.`);
      return;
    }

    onChange((prev) => [...prev, trimmed]);
    setUrlInput('');
    setShowUrlInput(false);
  };

  // Remove an Image
  const handleRemoveImage = (indexToRemove) => {
    onChange((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Set an Image as Cover Photo (Reorder to first index)
  const handleSetCover = (indexToCover) => {
    onChange((prev) => {
      const target = prev[indexToCover];
      const remaining = prev.filter((_, idx) => idx !== indexToCover);
      return [target, ...remaining];
    });
  };

  return (
    <div className="space-y-4">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
      />

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-3 ${
          isDragging
            ? 'border-[#E53935] bg-red-50/40 dark:bg-red-950/30 scale-[0.99]'
            : 'border-gray-300 dark:border-slate-700 bg-gray-50/60 dark:bg-slate-800/40 hover:border-[#E53935] hover:bg-red-50/20 dark:hover:bg-slate-800/80'
        }`}
      >
        {/* Upload Icon */}
        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
          isDragging
            ? 'bg-[#E53935] text-white shadow-md'
            : 'bg-white dark:bg-slate-700 text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-slate-600 shadow-2xs'
        }`}>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <div>
          <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">
            {isDragging ? 'Déposez vos images ici' : 'Cliquez pour parcourir ou glissez vos photos ici'}
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            {subtitle} • Max {maxImages} photos (jusqu&apos;à 10 Mo chacune)
          </p>
        </div>

        <div className="flex items-center space-x-2 pt-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            Sélectionner des Photos
          </button>
          
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-slate-600 text-xs font-medium px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            {showUrlInput ? 'Fermer URL' : 'Ajouter par URL'}
          </button>
        </div>
      </div>

      {/* URL Input Accordion */}
      {showUrlInput && (
        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 space-y-2 animate-in fade-in duration-150">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
            Lien Web de l&apos;Image (URL)
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-[#E53935]"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Ajouter
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-lg text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>{uploadError}</span>
        </div>
      )}

      {/* Uploaded Images Grid & Thumbnail Manager */}
      {images.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
              <span>🖼️ Photos Ajoutées</span>
              <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-[10.5px] px-2 py-0.5 rounded-full font-semibold">
                {images.length} / {maxImages}
              </span>
            </span>
            <span className="text-[11px] text-gray-400">
              La 1ère photo sera la photo principale de l&apos;annonce
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {images.map((imgUrl, idx) => {
              const isCover = idx === 0;
              return (
                <div
                  key={idx}
                  className={`relative group rounded-xl overflow-hidden aspect-[4/3] border bg-gray-100 dark:bg-slate-800 transition-all ${
                    isCover
                      ? 'border-[#E53935] ring-2 ring-[#E53935]/30 shadow-sm'
                      : 'border-gray-200 dark:border-slate-700 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Primary / Cover Badge */}
                  {isCover && (
                    <div className="absolute top-1.5 left-1.5 bg-[#E53935] text-white text-[9.5px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow-xs tracking-wider">
                      ★ Principale
                    </div>
                  )}

                  {/* Top Right: Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    title="Supprimer cette photo"
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/65 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-85 group-hover:opacity-100 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    ✕
                  </button>

                  {/* Bottom Overlay Action: Make Cover */}
                  {!isCover && (
                    <button
                      type="button"
                      onClick={() => handleSetCover(idx)}
                      className="absolute bottom-0 inset-x-0 bg-black/75 hover:bg-[#E53935] text-white text-[10px] font-bold py-1 text-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-2xs"
                    >
                      Définir Principale
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
