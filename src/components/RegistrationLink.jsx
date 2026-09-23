import React, { useState } from 'react';
import { Link2, Copy, ExternalLink, Share2, Check, Pencil } from 'lucide-react';
import { Button, Input } from './ui';
import { toast } from '../lib/toast';

// Adds https:// when missing and checks it is a real web address
function normalizeUrl(value) {
  const raw = (value || '').trim();
  if (!raw) return '';
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    return url.hostname.includes('.') ? url.href : null;
  } catch {
    return null;
  }
}

/** Event registration link: paste once, then open, copy or share it */
export default function RegistrationLink({ value, onChange }) {
  const [editing, setEditing] = useState(!value);
  const [draft, setDraft] = useState(value || '');
  const [error, setError] = useState('');

  const save = () => {
    const url = normalizeUrl(draft);
    if (url === null) {
      setError('That link does not look right. Example: forms.gle/abc123 or lu.ma/your-event');
      return;
    }
    setError('');
    onChange(url);
    setEditing(!url);
    if (url) toast('Registration link saved');
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast('Registration link copied');
    } catch {
      toast('Could not copy. Press and hold the link to copy it.');
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Register for our event', url: value });
      } catch {
        // share sheet closed
      }
    } else {
      copy();
    }
  };

  if (editing) {
    return (
      <div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <Input
              type="url"
              inputMode="url"
              value={draft}
              onChange={(e) => { setDraft(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), save())}
              placeholder="Paste your registration link"
              className="pl-10"
              aria-label="Event registration link"
            />
          </div>
          <Button onClick={save} icon={Check} disabled={!draft.trim()}>Save</Button>
        </div>
        {error ? (
          <p className="mt-1.5 text-[12px] text-red-600">{error}</p>
        ) : (
          <p className="mt-1.5 text-[12px] text-slate-500">Google Forms, Luma, Eventbrite, Facebook event or your own site.</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#F4F3F0] p-3">
      <div className="flex items-center gap-2 min-w-0">
        <Link2 className="w-4 h-4 text-[#003CF5] shrink-0" />
        <a href={value} target="_blank" rel="noreferrer" className="text-[14px] font-medium text-[#003CF5] truncate hover:underline">
          {value.replace(/^https?:\/\//, '')}
        </a>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" icon={ExternalLink} onClick={() => window.open(value, '_blank', 'noopener')}>Open</Button>
        <Button size="sm" variant="outline" icon={Copy} onClick={copy}>Copy</Button>
        <Button size="sm" variant="outline" icon={Share2} onClick={share}>Share</Button>
        <Button size="sm" variant="ghost" icon={Pencil} onClick={() => { setDraft(value); setEditing(true); }}>Edit</Button>
      </div>
    </div>
  );
}
