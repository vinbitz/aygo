import React from 'react';
import { LayoutGrid, CalendarDays, Sparkles, FileText, ArrowLeftRight, Crown } from 'lucide-react';
import { Sheet, ListRow, Badge, Button } from './ui';
import { usePro } from '../state/pro';
import { FREE_USES } from '../lib/pro';

const TOOLS = [
  { feature: 'workspace', icon: CalendarDays, tone: 'blue', title: 'Event workspace', subtitle: 'Budget, suppliers and checklist per event' },
  { feature: 'mockup', icon: Sparkles, tone: 'violet', title: 'AI mockup studio', subtitle: 'Your logo on shirts, totes, tumblers and more' },
  { feature: 'documents', icon: FileText, tone: 'amber', title: 'Quotes & documents', subtitle: 'Branded RFQs, POs, comparison sheets' },
  { feature: 'compare', icon: ArrowLeftRight, tone: 'green', title: 'Compare offers', subtitle: 'Every offer on your request, side by side' },
];

/** Organizer tools menu (opened from the floating Tools button) with free-use counters */
export default function ToolsSheet({ onClose, onOpen }) {
  const { isPro, remaining, openPaywall } = usePro();

  return (
    <Sheet
      title="Tools"
      subtitle={isPro ? 'Aygo Pro: every tool is unlimited.' : `Free plan: ${FREE_USES} tries of each tool, then go Pro.`}
      icon={LayoutGrid}
      onClose={onClose}
      size="sm"
      footer={
        isPro ? null : (
          <Button size="lg" full icon={Crown} onClick={() => openPaywall(null)}>
            See Aygo Pro
          </Button>
        )
      }
    >
      {TOOLS.map((tool) => {
        const left = remaining(tool.feature);
        return (
          <ListRow
            key={tool.feature}
            icon={tool.icon}
            tone={tool.tone}
            title={tool.title}
            subtitle={tool.subtitle}
            onClick={() => onOpen(tool.feature)}
            trailing={
              isPro ? (
                <Badge tone="violet" icon={Crown}>Pro</Badge>
              ) : left > 0 ? (
                <Badge tone="slate">{left} free left</Badge>
              ) : (
                <Badge tone="amber" icon={Crown}>Go Pro</Badge>
              )
            }
          />
        );
      })}
    </Sheet>
  );
}
