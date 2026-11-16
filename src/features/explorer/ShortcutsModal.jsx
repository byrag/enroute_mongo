const SHORTCUTS = [
  ["/", "Focus the location search"],
  ["M", "Recenter the map"],
  ["?", "Show / hide this dialog"],
  ["Esc", "Close the open dialog"],
];

export default function ShortcutsModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/60 p-4" onMouseDown={onClose}>
      <div onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Keyboard shortcuts"
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black">Keyboard shortcuts</h3>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-800">✕</button>
        </div>
        <ul className="mt-4 space-y-2">
          {SHORTCUTS.map(([k, d]) => (
            <li key={k} className="flex items-center justify-between text-sm">
              <span className="text-slate-600">{d}</span>
              <kbd className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs font-bold">{k}</kbd>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
