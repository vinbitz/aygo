import React, { useState } from 'react';
import {
  Moon,
  Globe,
  Radio,
  FileText,
  Smartphone,
  Trash2,
  Ruler,
  Settings,
  UserRound
} from 'lucide-react';
import { toast } from '../lib/toast';
import { Sheet, Button, Chip, ListRow, Section, Panel } from './ui';

const APPEARANCE_OPTIONS = ['System default', 'Light mode', 'Dark mode'];
const LANGUAGE_OPTIONS = ['English', 'Filipino / Tagalog', 'Cebuano'];

/** Visual on/off switch; the whole row is the tap target */
function Switch({ on }) {
  return (
    <span
      aria-hidden="true"
      className={`relative w-11 h-6 rounded-full shrink-0 transition-colors ${on ? 'bg-[#003CF5]' : 'bg-slate-300'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : ''}`} />
    </span>
  );
}

function Value({ children }) {
  return <span className="text-[13px] text-slate-500 shrink-0">{children}</span>;
}

export default function AppSettingsModal({
  isOpen,
  onClose,
  onOpenProfileSettings
}) {
  const [appearance, setAppearance] = useState('System default');
  const [distanceUnits, setDistanceUnits] = useState('Kilometres');
  const [language, setLanguage] = useState('English');
  const [showLocation, setShowLocation] = useState(true);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showAppearancePicker, setShowAppearancePicker] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen) return null;

  return (
    <Sheet onClose={onClose} title="Settings" subtitle="Make Aygo work the way you like" icon={Settings} size="sm">
      <Section title="Preferences">
        <ListRow
          icon={Moon}
          tone="slate"
          title="Appearance"
          onClick={() => setShowAppearancePicker(!showAppearancePicker)}
          trailing={<Value>{appearance}</Value>}
        />
        {showAppearancePicker && (
          <div className="flex flex-wrap gap-2 pb-3 pl-[52px]">
            {APPEARANCE_OPTIONS.map((mode) => (
              <Chip
                key={mode}
                selected={appearance === mode}
                className="!h-11"
                onClick={() => {
                  setAppearance(mode);
                  setShowAppearancePicker(false);
                }}
              >
                {mode}
              </Chip>
            ))}
          </div>
        )}

        <ListRow
          icon={Ruler}
          tone="slate"
          title="Distance units"
          onClick={() => setDistanceUnits(distanceUnits === 'Kilometres' ? 'Miles' : 'Kilometres')}
          trailing={<Value>{distanceUnits}</Value>}
        />

        <ListRow
          icon={Globe}
          tone="slate"
          title="Language"
          onClick={() => setShowLanguagePicker(!showLanguagePicker)}
          trailing={<Value>{language}</Value>}
        />
        {showLanguagePicker && (
          <div className="flex flex-wrap gap-2 pb-3 pl-[52px]">
            {LANGUAGE_OPTIONS.map((lang) => (
              <Chip
                key={lang}
                selected={language === lang}
                className="!h-11"
                onClick={() => {
                  setLanguage(lang);
                  setShowLanguagePicker(false);
                }}
              >
                {lang}
              </Chip>
            ))}
          </div>
        )}
      </Section>

      <Section title="Privacy">
        <ListRow
          icon={Radio}
          tone="slate"
          title="Share location with makers"
          subtitle={showLocation ? 'Makers see your delivery area' : 'Hidden until you accept a bid'}
          onClick={() => setShowLocation(!showLocation)}
          trailing={<Switch on={showLocation} />}
        />
      </Section>

      <Section title="About">
        <ListRow
          icon={FileText}
          tone="slate"
          title="Legal documents"
          subtitle="Terms, privacy and escrow guarantee"
          onClick={() => toast('Aygo Terms of Service, Privacy Policy & Escrow Guarantee (Version 2026.1)')}
        />
        <ListRow icon={Smartphone} tone="slate" title="App version" trailing={<Value>5.185.0</Value>} />
      </Section>

      {/* Moved settings hint */}
      <Panel className="flex items-center gap-3 mt-1">
        <span className="w-10 h-10 rounded-full bg-white text-[#003CF5] flex items-center justify-center shrink-0">
          <UserRound className="w-5 h-5" />
        </span>
        <p className="flex-1 text-[13px] text-slate-600 leading-snug">
          Looking for your phone number? It now lives in your profile.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            onClose();
            if (onOpenProfileSettings) onOpenProfileSettings();
          }}
        >
          Open
        </Button>
      </Panel>

      {/* Danger zone */}
      <div className="pt-4">
        {confirmDelete ? (
          <div className="rounded-2xl bg-red-50 p-4 space-y-3">
            <div>
              <p className="text-[15px] font-semibold text-red-700">Delete your account?</p>
              <p className="text-[13px] text-red-600/80 leading-snug">
                All active bids and request history will be cleared. This can't be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" full onClick={() => setConfirmDelete(false)}>
                Keep account
              </Button>
              <button
                type="button"
                className="w-full h-11 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-[14px] font-semibold inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                onClick={() => {
                  toast('Account deletion request submitted.');
                  setConfirmDelete(false);
                }}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ) : (
          <Button variant="danger" full icon={Trash2} onClick={() => setConfirmDelete(true)}>
            Delete account
          </Button>
        )}
      </div>
    </Sheet>
  );
}
