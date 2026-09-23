import React, { useState } from 'react';
import { 
  ArrowLeft, 
  X, 
  Moon, 
  MapPin, 
  Globe, 
  Radio, 
  FileText, 
  Smartphone, 
  Trash2, 
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-3 font-sans">
      <div className="relative w-full max-w-md bg-[#F4F4F4] rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[580px] max-h-[92vh]">
        
        {/* Top Header matching Image 2 */}
        <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          
          <h2 className="text-lg font-black text-slate-950 tracking-tight flex-1 text-center pr-9">
            App settings
          </h2>
        </div>

        {/* Scrollable Settings Content matching Image 2 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
          
          {/* Card 1: General Preferences */}
          <div className="bg-white rounded-3xl p-1.5 shadow-xs border border-slate-100 divide-y divide-slate-100">
            {/* Appearance */}
            <div 
              onClick={() => setShowAppearancePicker(!showAppearancePicker)}
              className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors rounded-2xl cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <Moon className="w-5 h-5 text-slate-800 shrink-0" />
                <div>
                  <span className="font-bold text-sm text-slate-900 block leading-tight">Appearance</span>
                  <span className="text-xs text-slate-500 font-medium">{appearance}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {showAppearancePicker && (
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 mx-2 my-1">
                {['System default', 'Light mode', 'Dark mode'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => { setAppearance(mode); setShowAppearancePicker(false); }}
                    className={`w-full p-2 text-left text-xs font-bold rounded-lg flex items-center justify-between ${
                      appearance === mode ? 'bg-blue-50 text-[#003CF5]' : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    <span>{mode}</span>
                    {appearance === mode && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}

            {/* Distance units */}
            <div 
              onClick={() => setDistanceUnits(distanceUnits === 'Kilometres' ? 'Miles' : 'Kilometres')}
              className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors rounded-2xl cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-5 h-5 flex items-center justify-center text-slate-800 font-bold text-xs">
                  S
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-900 block leading-tight">Distance units</span>
                  <span className="text-xs text-slate-500 font-medium">{distanceUnits}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* Language */}
            <div 
              onClick={() => setShowLanguagePicker(!showLanguagePicker)}
              className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors rounded-2xl cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <Globe className="w-5 h-5 text-slate-800 shrink-0" />
                <div>
                  <span className="font-bold text-sm text-slate-900 block leading-tight">Language</span>
                  <span className="text-xs text-slate-500 font-medium">{language}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {showLanguagePicker && (
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 mx-2 my-1">
                {['English', 'Filipino / Tagalog', 'Cebuano'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => { setLanguage(lang); setShowLanguagePicker(false); }}
                    className={`w-full p-2 text-left text-xs font-bold rounded-lg flex items-center justify-between ${
                      language === lang ? 'bg-blue-50 text-[#003CF5]' : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    <span>{lang}</span>
                    {language === lang && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}

            {/* Show location to your maker / driver */}
            <div 
              onClick={() => setShowLocation(!showLocation)}
              className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors rounded-2xl cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <Radio className="w-5 h-5 text-slate-800 shrink-0" />
                <div>
                  <span className="font-bold text-sm text-slate-900 block leading-tight">Show location to your maker</span>
                  <span className="text-xs text-slate-500 font-medium">{showLocation ? 'On' : 'Off'}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Card 2: Legal & App Version */}
          <div className="bg-white rounded-3xl p-1.5 shadow-xs border border-slate-100 divide-y divide-slate-100">
            <div 
              onClick={() => alert('Aygo Terms of Service, Privacy Policy & Escrow Guarantee (Version 2026.1)')}
              className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors rounded-2xl cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <FileText className="w-5 h-5 text-slate-800 shrink-0" />
                <span className="font-bold text-sm text-slate-900">Legal documents</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <Smartphone className="w-5 h-5 text-slate-800 shrink-0" />
                <div>
                  <span className="font-bold text-sm text-slate-900 block leading-tight">App version</span>
                  <span className="text-xs text-slate-500 font-medium">5.185.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Delete Account */}
          <div className="bg-white rounded-3xl p-1.5 shadow-xs border border-slate-100">
            <div 
              onClick={() => {
                if (confirm('Are you sure you want to request account deletion? All active bids and history will be cleared.')) {
                  alert('Account deletion request submitted.');
                }
              }}
              className="p-3.5 flex items-center gap-3.5 hover:bg-red-50 text-slate-900 hover:text-red-600 transition-colors rounded-2xl cursor-pointer"
            >
              <Trash2 className="w-5 h-5 shrink-0" />
              <span className="font-bold text-sm">Delete account</span>
            </div>
          </div>

          {/* Light Blue Info Box matching Image 2 */}
          <div className="p-4 bg-[#E2F3FC] rounded-3xl space-y-2.5">
            <p className="text-xs font-semibold text-slate-800 leading-relaxed">
              Some settings moved to make things simpler. Tap to find
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenProfileSettings) onOpenProfileSettings();
              }}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Phone number
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
