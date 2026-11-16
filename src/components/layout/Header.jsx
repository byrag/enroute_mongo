import { useState } from "react";
import { NAV_LINKS } from "../../config/site";

export default function Header({ toast }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        <a href="#home" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-enroute-600 text-white">
            <svg width="25" height="28" viewBox="0 0 25 28" fill="none">
              <path d="M12.5 27S22 17.4 22 11.2C22 5.5 17.75 1 12.5 1S3 5.5 3 11.2C3 17.4 12.5 27 12.5 27Z" fill="white" />
              <circle cx="12.5" cy="11" r="4.5" fill="#059669" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-black tracking-tight">Enroute</div>
            <div className="hidden text-[9px] font-bold uppercase tracking-[.18em] text-slate-400 sm:block">
              People • Parcels • A Smarter Tomorrow
            </div>
          </div>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-bold md:flex">
          {NAV_LINKS.map((l, i) => (
            <a key={l.href} href={l.href} className={i === 0 ? "text-enroute-700" : "text-slate-500 hover:text-slate-900"}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button onClick={() => toast("Login will be connected later.")}
            className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100">
            Login
          </button>
          <button onClick={() => toast("Registration will be connected later.")}
            className="rounded-xl bg-enroute-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-enroute-700">
            Get Started
          </button>
        </div>

        <button className="rounded-xl p-2 md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>
          <svg width="25" height="25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div id="mobileMenu" className={`border-t border-slate-100 bg-white md:hidden ${open ? "open" : ""}`}>
        <div className="space-y-1 px-5 py-4">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={close} className="block rounded-xl px-4 py-3 font-bold">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
