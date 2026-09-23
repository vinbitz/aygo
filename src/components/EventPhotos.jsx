import React, { useRef, useState } from 'react';
import { ImagePlus, Trash2, Star, Loader2, Camera } from 'lucide-react';
import { cx } from './ui';
import { loadImageFile, MAX_EVENT_PHOTOS, EMPTY_EVENT_PHOTOS } from '../lib/images';
import { toast } from '../lib/toast';


/**
 * Event photo uploader: one cover photo plus a gallery.
 * photos = { cover: {src,name}|null, gallery: [{id,src,name}] }
 */
export default function EventPhotos({ photos = EMPTY_EVENT_PHOTOS, onChange, compact = false }) {
  const coverInput = useRef(null);
  const galleryInput = useRef(null);
  const [busy, setBusy] = useState(false);

  const readFiles = async (files) => {
    const out = [];
    for (const file of files) {
      try {
        out.push(await loadImageFile(file));
      } catch (err) {
        toast(err.message);
      }
    }
    return out;
  };

  const setCover = async (files) => {
    if (!files?.length) return;
    setBusy(true);
    const [img] = await readFiles([files[0]]);
    setBusy(false);
    if (img) onChange({ ...photos, cover: img });
  };

  const addToGallery = async (files) => {
    if (!files?.length) return;
    const room = MAX_EVENT_PHOTOS - photos.gallery.length;
    if (room <= 0) {
      toast(`You can add up to ${MAX_EVENT_PHOTOS} event photos.`);
      return;
    }
    const picked = Array.from(files).slice(0, room);
    if (files.length > room) toast(`Only ${room} more photo${room === 1 ? '' : 's'} fit. Added the first ${room}.`);
    setBusy(true);
    const imgs = await readFiles(picked);
    setBusy(false);
    const added = imgs.map((img, i) => ({ ...img, id: `${Date.now()}-${i}` }));
    onChange({ cover: photos.cover || added[0] || null, gallery: [...photos.gallery, ...added] });
    if (added.length) toast(`${added.length} event photo${added.length === 1 ? '' : 's'} added`);
  };

  const removeFromGallery = (id) => onChange({ ...photos, gallery: photos.gallery.filter((p) => p.id !== id) });

  const onDrop = (handler) => (e) => {
    e.preventDefault();
    handler(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      {/* Cover photo */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop(setCover)}
        className={cx('relative w-full overflow-hidden rounded-[22px] bg-[#F4F3F0]', compact ? 'aspect-[21/9]' : 'aspect-[16/9]')}
      >
        {photos.cover ? (
          <>
            <img src={photos.cover.src} alt="Event cover" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute bottom-2 right-2 flex gap-2">
              <button type="button" onClick={() => coverInput.current?.click()} className="h-9 px-3 rounded-full bg-white/95 text-[13px] font-medium text-slate-800 shadow inline-flex items-center gap-1.5">
                <Camera className="w-4 h-4" /> Change cover
              </button>
              <button type="button" onClick={() => onChange({ ...photos, cover: null })} aria-label="Remove cover photo" className="w-9 h-9 rounded-full bg-white/95 text-red-600 shadow flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => coverInput.current?.click()}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-slate-300 hover:border-[#003CF5] rounded-[22px] text-center transition-colors"
          >
            {busy ? <Loader2 className="w-6 h-6 text-slate-500 animate-spin" /> : <ImagePlus className="w-6 h-6 text-slate-500" />}
            <span className="text-[15px] font-medium text-slate-800">Add event cover photo</span>
            <span className="text-[12px] text-slate-500">Tap to upload or drop a photo · JPG, PNG, WEBP</span>
          </button>
        )}
        <input ref={coverInput} type="file" accept="image/*" className="sr-only" onChange={(e) => { setCover(e.target.files); e.target.value = ''; }} />
      </div>

      {/* Gallery */}
      <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop(addToGallery)}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-medium text-slate-700">Event photos</span>
          <span className="text-[12px] text-slate-500">{photos.gallery.length}/{MAX_EVENT_PHOTOS}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {photos.gallery.map((p) => {
            const isCover = photos.cover?.src === p.src;
            return (
              <div key={p.id} className="relative aspect-square rounded-2xl overflow-hidden bg-[#F4F3F0] group">
                <img src={p.src} alt={p.name || 'Event photo'} className="w-full h-full object-cover" />
                {isCover && <span className="absolute top-1.5 left-1.5 rounded-full bg-white/95 px-1.5 py-0.5 text-[11px] font-semibold text-slate-800">Cover</span>}
                <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between">
                  {!isCover ? (
                    <button type="button" onClick={() => onChange({ ...photos, cover: p })} aria-label="Use as cover" className="w-8 h-8 rounded-full bg-white/95 text-amber-500 shadow flex items-center justify-center">
                      <Star className="w-4 h-4" />
                    </button>
                  ) : <span />}
                  <button type="button" onClick={() => removeFromGallery(p.id)} aria-label="Remove photo" className="w-8 h-8 rounded-full bg-white/95 text-red-600 shadow flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {photos.gallery.length < MAX_EVENT_PHOTOS && (
            <button
              type="button"
              onClick={() => galleryInput.current?.click()}
              className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#003CF5] flex flex-col items-center justify-center gap-1 text-slate-500 transition-colors"
            >
              {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
              <span className="text-[12px] font-medium">Add</span>
            </button>
          )}
        </div>
        <input ref={galleryInput} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { addToGallery(e.target.files); e.target.value = ''; }} />
      </div>
    </div>
  );
}
