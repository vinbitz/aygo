import React, { useState } from 'react';
import { X, Video, Phone, CalendarPlus, CalendarClock, Crown } from 'lucide-react';
import { Button, Chip, cx } from './ui';
import AvailabilityCalendar from './AvailabilityCalendar';
import { loadAvailability, demoAvailability, fromKey, dayLabel, slotLabel, upcomingSlotCount } from '../lib/availability';

const meetingWhen = ({ day, slot }) => `${dayLabel(fromKey(day))} · ${slotLabel(slot)}`;

// .ics file so the call lands in Google Calendar, Outlook or the phone calendar
function icsHref({ day, slot, video }, name) {
  const start = fromKey(day);
  start.setHours(Number(slot.slice(0, 2)));
  const end = new Date(start.getTime() + 30 * 60000);
  const fmt = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Aygo//Calls//EN', 'BEGIN:VEVENT',
    `UID:${fmt(start)}-${name.replace(/\W/g, '')}@aygo.store`, `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`,
    `SUMMARY:Aygo ${video ? 'video' : 'voice'} call with ${name}`,
    'DESCRIPTION:Join from the chat in the Aygo app.', 'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

/** Book a call in one of the other person's free slots, without leaving the chat */
export function SchedulePanel({ name, onClose, onBook }) {
  const [free] = useState(() => demoAvailability(name));
  const [mine] = useState(loadAvailability);
  const [picked, setPicked] = useState(null);
  const [video, setVideo] = useState(true);

  return (
    <div className="absolute inset-0 z-10 bg-white flex flex-col animate-fade-in">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
        <div className="flex-1 min-w-0">
          <p className="text-[17px] font-semibold text-slate-900">Book a call</p>
          <p className="text-[13px] text-slate-500 truncate">Times when {name} is free</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="w-11 h-11 rounded-full hover:bg-[#F4F3F0] flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="flex gap-2">
          <Chip icon={Video} selected={video} onClick={() => setVideo(true)}>Video call</Chip>
          <Chip icon={Phone} selected={!video} onClick={() => setVideo(false)}>Voice call</Chip>
        </div>
        {video && (
          <p className="text-[12.5px] text-slate-500 -mt-1">Good for event setup: show the venue, booth spot or samples on camera.</p>
        )}
        <AvailabilityCalendar mode="pick" free={free} mine={mine} picked={picked} onPick={setPicked} />
        {upcomingSlotCount(mine) === 0 && (
          <p className="rounded-2xl bg-[#F4F3F0] p-3 text-[12.5px] text-slate-600">
            Tip: set when you're free in Menu → My availability, and the times that work for both of you get marked.
          </p>
        )}
      </div>
      <div className="border-t border-slate-100 p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <Button size="lg" full icon={CalendarClock} disabled={!picked} onClick={() => onBook({ ...picked, video })}>
          {picked ? `Book ${meetingWhen(picked)}` : 'Pick a time'}
        </Button>
      </div>
    </div>
  );
}

/** Booked call, shown in the chat */
export function MeetingCard({ meeting, name, canJoin, onJoin }) {
  const Icon = meeting.video ? Video : Phone;
  return (
    <div className="w-[290px] max-w-full rounded-2xl bg-white border border-slate-200/80 p-3.5 text-left">
      <div className="flex items-center gap-2.5">
        <span className="w-9 h-9 rounded-full bg-blue-50 text-[#003CF5] flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></span>
        <div className="min-w-0">
          <p className="text-[12px] text-slate-500">{meeting.video ? 'Video call booked' : 'Voice call booked'}</p>
          <p className="text-[15px] font-semibold text-slate-900 leading-tight">{meetingWhen(meeting)}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Button size="sm" icon={canJoin ? Icon : Crown} className="flex-1 min-w-0 h-10 whitespace-nowrap" onClick={onJoin}>Join call</Button>
        <a
          href={icsHref(meeting, name)}
          download="aygo-call.ics"
          className={cx('inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-full bg-[#F4F3F0] hover:bg-[#ECEAE5] text-[13px] font-semibold text-slate-800 whitespace-nowrap shrink-0')}
        >
          <CalendarPlus className="w-4 h-4" /> Add to calendar
        </a>
      </div>
      {!canJoin && <p className="mt-1.5 text-[11.5px] text-slate-500">Calls need Pro on either side.</p>}
    </div>
  );
}
