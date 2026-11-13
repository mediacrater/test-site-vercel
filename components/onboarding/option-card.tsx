//components/onboarding/option-card.tsx
'use client';

// One answer on an onboarding question screen: an icon, the answer and, when
// the question has them, a line of examples. The whole card is the button.

import { forwardRef } from 'react';
import { Check, Loader2 } from 'lucide-react';
import type { AnswerOption } from '@/lib/onboarding/questions';

interface OptionCardProps {
  option: AnswerOption;
  selected: boolean;
  /** This answer is being saved right now. */
  saving: boolean;
  /** Another answer is being saved; clicks are ignored until it finishes. */
  disabled: boolean;
  /** Only one card in the group is in the Tab order (the arrow keys move between them). */
  tabbable: boolean;
  onSelect: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

export const OptionCard = forwardRef<HTMLButtonElement, OptionCardProps>(function OptionCard(
  { option, selected, saving, disabled, tabbable, onSelect, onKeyDown },
  ref
) {
  const Icon = option.icon;

  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled || undefined}
      tabIndex={tabbable ? 0 : -1}
      onClick={() => {
        if (!disabled) onSelect();
      }}
      onKeyDown={onKeyDown}
      className={`group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none ${
        selected
          ? 'border-primary bg-primary/[0.07] ring-1 ring-primary'
          : 'border-border bg-card hover:border-primary/60 hover:bg-primary/[0.03]'
      } ${disabled ? 'cursor-default opacity-60' : 'cursor-pointer'}`}
    >
      <span
        aria-hidden="true"
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors motion-reduce:transition-none ${
          selected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
        }`}
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold leading-snug text-foreground">{option.label}</span>
        {option.example && (
          <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">{option.example}</span>
        )}
      </span>

      <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center text-primary">
        {saving ? (
          <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" />
        ) : selected ? (
          <Check className="h-5 w-5" strokeWidth={2.5} />
        ) : null}
      </span>
    </button>
  );
});
