import React, { useRef, useState } from 'react';
import { FolderUp, Paperclip, Check, X, FileText, Download, Film } from 'lucide-react';
import { Button, cx } from './ui';
import { BRAND_FILE_TYPES, MAX_BRAND_FILE_MB, fileTypeLabel, formatBytes } from '../lib/brandFiles';
import { maskDirectContact } from '../lib/contactGuard';
import { toast } from '../lib/toast';

const typeOf = (id) => BRAND_FILE_TYPES.find((t) => t.id === id);

// Files the brand already saved in their brand kit
function kitValues(kit) {
  if (!kit) return {};
  const values = {};
  if (kit.logo?.src) values.logo = { files: [{ name: kit.logo.name || 'logo.png', size: 0, type: 'image/png', url: kit.logo.src }] };
  if (kit.logoWhite?.src) values['logo-white'] = { files: [{ name: kit.logoWhite.name || 'logo-white.png', size: 0, type: 'image/png', url: kit.logoWhite.src }] };
  if (kit.colors) values.guidelines = { text: kit.colors };
  if (kit.socialPages) values.social = { text: kit.socialPages };
  return values;
}

const isReady = (v) => Boolean(v && (v.files?.length || v.text?.trim()));

function FileChip({ file, onRemove }) {
  const Icon = file.type?.startsWith('video/') ? Film : FileText;
  return (
    <span className="inline-flex items-center gap-2 max-w-full rounded-xl bg-[#F4F3F0] pl-1.5 pr-2 py-1.5">
      {file.type?.startsWith('image/')
        ? <img src={file.url} alt="" className="w-8 h-8 rounded-lg object-contain bg-white shrink-0" />
        : <span className="w-8 h-8 rounded-lg bg-white text-slate-500 flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></span>}
      <span className="min-w-0">
        <span className="block text-[12.5px] text-slate-900 truncate max-w-[150px]">{file.name}</span>
        {file.size > 0 && <span className="block text-[11px] text-slate-500">{formatBytes(file.size)}</span>}
      </span>
      {onRemove ? (
        <button type="button" onClick={onRemove} aria-label={`Remove ${file.name}`} className="w-7 h-7 rounded-full hover:bg-white text-slate-500 flex items-center justify-center shrink-0">
          <X className="w-3.5 h-3.5" />
        </button>
      ) : (
        <a href={file.url} download={file.name} aria-label={`Download ${file.name}`} className="w-7 h-7 rounded-full hover:bg-white text-slate-500 flex items-center justify-center shrink-0">
          <Download className="w-3.5 h-3.5" />
        </a>
      )}
    </span>
  );
}

function FileRow({ id, value, sent, onChange }) {
  const t = typeOf(id);
  const inputRef = useRef(null);
  const ready = sent || isReady(value);

  const addFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = '';
    const ok = picked.filter((f) => {
      if (f.size > MAX_BRAND_FILE_MB * 1024 * 1024) {
        toast(`${f.name} is over ${MAX_BRAND_FILE_MB} MB. Please send a smaller file.`);
        return false;
      }
      return true;
    });
    if (!ok.length) return;
    const files = ok.map((f) => ({ name: f.name, size: f.size, type: f.type, url: URL.createObjectURL(f) }));
    onChange({ ...value, files: t.multiple ? [...(value?.files || []), ...files] : files.slice(0, 1) });
  };

  return (
    <li className="py-3 flex items-start gap-3">
      <span className={cx('mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0', ready ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300')}>
        {ready && <Check className="w-3.5 h-3.5" />}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-slate-900">{t.label}</p>
        <p className="text-[12px] text-slate-500 leading-snug">{sent ? 'Sent to the organizer' : t.hint}</p>
        {!sent && (
          <div className="mt-2 space-y-2">
            {value?.files?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {value.files.map((f, i) => (
                  <FileChip key={f.url} file={f} onRemove={() => onChange({ ...value, files: value.files.filter((_, idx) => idx !== i) })} />
                ))}
              </div>
            )}
            {(t.kind === 'text' || t.allowText) && (
              <textarea
                value={value?.text || ''}
                onChange={(e) => onChange({ ...value, text: e.target.value })}
                rows={2}
                placeholder={t.kind === 'text' ? t.hint : 'Or type the details here'}
                aria-label={t.label}
                className="w-full rounded-xl bg-[#F4F3F0] px-3 py-2 text-[13px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003CF5]/40"
              />
            )}
            {t.kind !== 'text' && (
              <>
                <Button type="button" size="sm" variant="secondary" icon={Paperclip} className="h-10" onClick={() => inputRef.current?.click()}>
                  {value?.files?.length ? (t.multiple ? 'Add more' : 'Replace file') : 'Add file'}
                </Button>
                <input ref={inputRef} type="file" accept={t.accept} multiple={t.multiple} className="hidden" onChange={addFiles} aria-label={`Upload ${t.label}`} />
              </>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

/**
 * Checklist of files the organizer needs from the sponsor.
 * canUpload: the viewer is the brand. m.fileRequest = { items: [typeId], sent: [typeId] }
 */
export function FileRequestCard({ m, canUpload, brandKit, onSend }) {
  const { items, sent = [] } = m.fileRequest;
  const [values, setValues] = useState(() => kitValues(brandKit));
  const open = items.filter((id) => !sent.includes(id));
  const readyNow = open.filter((id) => isReady(values[id]));
  const doneCount = sent.length;

  const send = () => {
    let masked = false;
    const entries = readyNow.map((id) => {
      const v = values[id];
      let text = v.text?.trim() || '';
      if (id === 'billing' && text) {
        const res = maskDirectContact(text);
        text = res.text;
        masked = masked || res.found;
      }
      return { typeId: id, files: v.files || [], text };
    });
    if (masked) toast('Emails and mobile numbers are hidden. Keep talks in Aygo so your deal stays protected.');
    onSend(m.id, entries);
    setValues((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !readyNow.includes(id))));
  };

  return (
    <div className="w-[320px] max-w-full rounded-2xl bg-white border border-slate-200/80 p-3.5 text-left">
      <div className="flex items-center gap-2.5">
        <span className="w-9 h-9 rounded-full bg-blue-50 text-[#003CF5] flex items-center justify-center shrink-0"><FolderUp className="w-4 h-4" /></span>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-slate-900 leading-tight">Files needed from the brand</p>
          <p className="text-[12px] text-slate-500">{doneCount} of {items.length} received</p>
        </div>
      </div>
      <div className="mt-2.5 h-1.5 rounded-full bg-[#F4F3F0] overflow-hidden">
        <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${(doneCount / items.length) * 100}%` }} />
      </div>

      {canUpload ? (
        <>
          <ul className="divide-y divide-slate-100">
            {items.map((id) => (
              <FileRow key={id} id={id} value={values[id]} sent={sent.includes(id)} onChange={(v) => setValues((prev) => ({ ...prev, [id]: v }))} />
            ))}
          </ul>
          {open.length > 0 && (
            <>
              <Button size="sm" icon={FolderUp} className="w-full h-11" disabled={!readyNow.length} onClick={send}>
                {readyNow.length ? `Send ${readyNow.length} to organizer` : 'Add files to send'}
              </Button>
              <p className="mt-1.5 text-[11.5px] text-slate-500">You can send some now and the rest later. Files stay in this chat.</p>
            </>
          )}
        </>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {items.map((id) => (
            <li key={id} className="flex items-center gap-2 text-[13px]">
              <span className={cx('w-5 h-5 rounded-full flex items-center justify-center shrink-0', sent.includes(id) ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300')}>
                {sent.includes(id) && <Check className="w-3 h-3" />}
              </span>
              <span className={sent.includes(id) ? 'text-slate-900' : 'text-slate-500'}>{fileTypeLabel(id)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Files the brand sent, shown in the chat */
export function BrandFilesCard({ m }) {
  return (
    <div className="w-[320px] max-w-full rounded-2xl bg-white border border-slate-200/80 p-3.5 text-left space-y-3">
      {m.brandFiles.map((entry) => (
        <div key={entry.typeId}>
          <p className="text-[12px] font-semibold text-slate-500">{fileTypeLabel(entry.typeId)}</p>
          {entry.files.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {entry.files.map((f) => <FileChip key={f.url} file={f} />)}
            </div>
          )}
          {entry.text && <p className="mt-1 rounded-xl bg-[#F4F3F0] px-3 py-2 text-[13px] text-slate-800 whitespace-pre-line">{entry.text}</p>}
        </div>
      ))}
    </div>
  );
}
