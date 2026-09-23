import React, { useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { Sheet, Button } from './ui';
import AvailabilityCalendar from './AvailabilityCalendar';
import { loadAvailability, saveAvailability, upcomingSlotCount } from '../lib/availability';
import { toast } from '../lib/toast';

/** Set the times you're free for calls. Makers, brands and organizers book from these. */
export default function AvailabilitySheet({ onClose }) {
  const [value, setValue] = useState(loadAvailability);
  const count = upcomingSlotCount(value);

  const save = () => {
    saveAvailability(value);
    toast(count ? `Saved ${count} free ${count === 1 ? 'slot' : 'slots'}. People can book calls in these times.` : 'Availability cleared');
    onClose();
  };

  return (
    <Sheet
      title="When you're free"
      subtitle="Makers, brands and organizers book calls in these times"
      icon={CalendarClock}
      onClose={onClose}
      size="md"
      footer={<Button size="lg" full onClick={save}>Save availability{count ? ` · ${count} ${count === 1 ? 'slot' : 'slots'}` : ''}</Button>}
    >
      <AvailabilityCalendar mode="edit" value={value} onChange={setValue} />
      <p className="mt-4 text-[12.5px] text-slate-500">Tap the hours you can take a call. Your phone number stays private; calls happen in Aygo.</p>
    </Sheet>
  );
}
