import { Button } from '@/components/ui/button';

export interface RefreshIntervalOption {
  label: string;
  value: number; // milliseconds
}

export const REFRESH_INTERVAL_PRESETS: RefreshIntervalOption[] = [
  { label: '1m', value: 60000 },
  { label: '5m', value: 300000 },
  { label: '15m', value: 900000 },
  { label: '30m', value: 1800000 },
];

interface RefreshIntervalSelectorProps {
  value: number | null;
  onChange: (value: number) => void;
}

export function RefreshIntervalSelector({ value, onChange }: RefreshIntervalSelectorProps) {
  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Refresh interval">
      {REFRESH_INTERVAL_PRESETS.map((preset) => {
        const isSelected = value === preset.value;
        return (
          <Button
            key={preset.value}
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(preset.value)}
            role="radio"
            aria-checked={isSelected}
            className="min-w-[3rem]"
          >
            {preset.label}
          </Button>
        );
      })}
    </div>
  );
}
