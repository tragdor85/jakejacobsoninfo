// Water-year picker: a labeled select over the years with inflow data.
// The selected year drives the what-if counterfactual and (when complete)
// the projection start year.

interface YearPickerProps {
  years: number[];
  value: number | null;
  note?: string;
  onChange: (year: number) => void;
}

export function YearPicker({ years, value, note, onChange }: YearPickerProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <label htmlFor="water-year" className="font-mono text-xs uppercase tracking-widest text-muted">
        Water year
      </label>
      <select
        id="water-year"
        value={value ?? ""}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="rounded-md border border-line bg-card px-2 py-1 font-mono text-sm"
      >
        {value == null && <option value="" disabled>
          —
        </option>}
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      {note ? <span className="text-xs text-muted">{note}</span> : null}
    </div>
  );
}
