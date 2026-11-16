// Hills, houses, trees, road and moving cars (from your Part 1 hero)
export default function ScenicRoad() {
  return (
    <div className="relative mt-20 -mx-5 lg:-mx-8">
      {/* background hills */}
      <div className="absolute bottom-[135px] left-0 right-0 h-36 overflow-hidden">
        <svg className="h-full w-full" viewBox="0 0 1200 150" preserveAspectRatio="none">
          <path d="M0 145C130 65 190 85 310 135C420 180 510 55 650 110C760 155 850 50 980 100C1080 140 1130 65 1200 80V150H0Z" fill="#d7eee4" />
          <path d="M0 150C160 90 230 105 350 140C490 180 570 85 690 125C820 165 920 70 1040 110C1120 135 1160 105 1200 110V150Z" fill="#c4e5d7" />
        </svg>
      </div>

      {/* houses and trees */}
      <div className="absolute bottom-[135px] left-0 right-0 z-10 h-40">
        <svg className="absolute bottom-2 left-[5%] w-24 sm:w-32" viewBox="0 0 140 105">
          <path d="M18 52 70 15l52 37v43H18Z" fill="#fff" />
          <path d="m10 55 60-45 60 45-9 10-51-38-51 38Z" fill="#f59e0b" />
          <rect x="29" y="58" width="25" height="37" rx="2" fill="#dbeafe" />
          <rect x="78" y="64" width="22" height="31" fill="#78350f" />
          <path d="M32 64h19M32 74h19" stroke="#93c5fd" strokeWidth="3" />
          <rect x="73" y="43" width="12" height="7" fill="#94a3b8" />
        </svg>

        <svg className="absolute bottom-1 left-[28%] w-20 sm:w-28" viewBox="0 0 140 105">
          <path d="M18 50 70 12l52 38v45H18Z" fill="#fefce8" />
          <path d="m10 53 60-45 60 45-9 10-51-38-51 38Z" fill="#ef4444" />
          <rect x="31" y="58" width="22" height="36" fill="#bfdbfe" />
          <rect x="76" y="63" width="22" height="31" fill="#92400e" />
        </svg>

        <svg className="absolute bottom-0 right-[27%] w-24 sm:w-32" viewBox="0 0 140 105">
          <path d="M18 52 70 15l52 37v43H18Z" fill="#fff" />
          <path d="m10 55 60-45 60 45-9 10-51-38-51 38Z" fill="#fb923c" />
          <rect x="30" y="58" width="24" height="36" fill="#bae6fd" />
          <rect x="78" y="61" width="21" height="33" fill="#92400e" />
          <rect x="48" y="32" width="44" height="5" fill="#10b981" />
        </svg>

        <div className="tree absolute bottom-0 left-[17%] text-5xl">🌳</div>
        <div className="tree absolute bottom-1 left-[40%] text-4xl">🌳</div>
        <div className="tree absolute bottom-0 right-[15%] text-5xl">🌳</div>
        <div className="tree absolute bottom-0 right-[5%] text-4xl">🌳</div>
      </div>

      {/* ROAD */}
      <div className="road">
        <div className="road-lane lane-a"></div>
        <div className="road-lane lane-b"></div>
        <div className="road-center"></div>

        <div className="vehicle right-fast" style={{ top: 17 }}>
          <svg width="88" height="47" viewBox="0 0 88 47">
            <path d="M12 29h62c5 0 9 4 9 9v2H5v-4c0-4 3-7 7-7Z" fill="#10b981" />
            <path d="m20 28 10-14h25l14 14" fill="#10b981" />
            <path d="M31 16h22l8 12H24l7-12Z" fill="#d9f8e9" />
            <circle cx="22" cy="40" r="7" fill="#172033" />
            <circle cx="66" cy="40" r="7" fill="#172033" />
            <circle cx="22" cy="40" r="2.5" fill="#94a3b8" />
            <circle cx="66" cy="40" r="2.5" fill="#94a3b8" />
          </svg>
        </div>

        <div className="vehicle left-fast" style={{ top: 72 }}>
          <svg width="92" height="48" viewBox="0 0 92 48">
            <path d="M11 30h67c5 0 9 4 9 9v2H4v-4c0-4 3-7 7-7Z" fill="#2563eb" />
            <path d="m20 29 11-15h25l15 15" fill="#2563eb" />
            <path d="M32 17h22l9 12H24l8-12Z" fill="#dbeafe" />
            <circle cx="22" cy="41" r="7" fill="#172033" />
            <circle cx="69" cy="41" r="7" fill="#172033" />
            <circle cx="22" cy="41" r="2.5" fill="#94a3b8" />
            <circle cx="69" cy="41" r="2.5" fill="#94a3b8" />
          </svg>
        </div>

        <div className="vehicle right-slow" style={{ top: 119 }}>
          <svg width="105" height="49" viewBox="0 0 105 49">
            <rect x="5" y="7" width="69" height="34" rx="5" fill="#f8fafc" />
            <path d="M74 17h13l12 12v12H74Z" fill="#f8fafc" />
            <rect x="13" y="13" width="53" height="18" rx="3" fill="#d9f8e9" />
            <path d="M30 16h18v12H30Z" fill="#10b981" />
            <circle cx="22" cy="42" r="7" fill="#172033" />
            <circle cx="84" cy="42" r="7" fill="#172033" />
            <circle cx="22" cy="42" r="2.5" fill="#94a3b8" />
            <circle cx="84" cy="42" r="2.5" fill="#94a3b8" />
          </svg>
        </div>

        <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/10 px-5 py-2 text-[10px] font-black tracking-[.15em] text-white backdrop-blur">
          A GREENER WAY TO MOVE →
        </div>
      </div>
    </div>
  );
}
