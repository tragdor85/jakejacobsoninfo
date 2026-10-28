// Projection horizon picker: 5 / 10 / 15 / 20 years.

interface HorizonSelectProps {
  options: number[];
  value: number;
  onChange: (horizon: number) => void;
}

export function HorizonSelect({ options, value, onChange }: HorizonSelectProps) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="water-horizon" className="font-mono text-xs uppercase tracking-widest text-muted">
        Horizon
      </label>
      <select
        id="water-horizon"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="rounded-md border border-line bg-card px-2 py-1 font-mono text-sm"
      >
        {options.map((h) => (
          <option key={h} value={h}>
            {h} years
          </option>
        ))}
      </select>
    </div>
  );
}
