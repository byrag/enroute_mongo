export default function Toast({ message, visible }) {
  return (
    <div
      className={`pointer-events-none fixed bottom-5 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl bg-slate-950 px-5 py-4 text-center text-sm font-bold text-white shadow-2xl transition-all ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      <span>{message}</span>
    </div>
  );
}
