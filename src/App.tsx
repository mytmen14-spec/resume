import { useState, useEffect, useCallback, useRef } from 'react';

const TOTAL_DURATION = 40;
const RED = '#E11D48';
const GREEN = '#16A34A';

// Scene timing definitions
const SCENES = {
  intro: { start: 0, end: 5 },
  cards: { start: 3, end: 6 },
  scene1: { start: 6, end: 16 },
  scene2: { start: 16, end: 26 },
  scene3: { start: 26, end: 36 },
  final: { start: 36, end: 40.5 },
};

function getSceneOpacity(time: number, start: number, end: number, fadeIn = 0.4, fadeOut = 0.4) {
  if (time < start || time > end) return 0;
  if (time < start + fadeIn) return (time - start) / fadeIn;
  if (time > end - fadeOut) return (end - time) / fadeOut;
  return 1;
}

export default function App() {
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const startAnimation = useCallback(() => {
    setIsPlaying(true);
    setHasStarted(true);
    setTime(0);
    lastTimeRef.current = performance.now();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const tick = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      setTime(prev => {
        const next = prev + delta;
        if (next >= TOTAL_DURATION) {
          setIsPlaying(false);
          return TOTAL_DURATION;
        }
        return next;
      });
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying]);

  const progress = Math.min((time / TOTAL_DURATION) * 100, 100);
  const displayTime = Math.floor(time);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-2 sm:p-4 select-none">
      {/* 9:16 Vertical Container */}
      <div
        className="relative bg-white overflow-hidden shadow-2xl rounded-2xl"
        style={{ aspectRatio: '9/16', maxHeight: '95vh', width: 'auto', maxWidth: 'min(100%, 420px)' }}
      >
        {/* Scenes */}
        <div className="absolute inset-0">
          <SceneIntro time={time} />
          <SceneCards time={time} />
          <Scene1 time={time} />
          <Scene2 time={time} />
          <Scene3 time={time} />
          <SceneFinal time={time} />
        </div>

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 z-50">
          <div
            className="h-full rounded-r-full"
            style={{
              width: `${progress}%`,
              backgroundColor: GREEN,
              transition: 'width 0.1s linear',
            }}
          />
        </div>

        {/* Timer */}
        {hasStarted && time < TOTAL_DURATION && (
          <div className="absolute top-3 right-3 z-50 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-mono px-2.5 py-1 rounded-full">
            {displayTime}/{TOTAL_DURATION}
          </div>
        )}

        {/* Start Overlay */}
        {!hasStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-white">
            <div className="mb-6">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="36" fill="none" stroke={GREEN} strokeWidth="3" />
                <polygon points="32,24 58,40 32,56" fill={GREEN} />
              </svg>
            </div>
            <button
              onClick={startAnimation}
              className="bg-gray-900 text-white px-8 py-3.5 rounded-full text-base font-bold hover:bg-gray-700 active:scale-95 transition-all shadow-lg"
            >
              ▶ Запустить
            </button>
            <p className="text-xs text-gray-400 mt-3">40 секунд • Резюме</p>
          </div>
        )}

        {/* Replay Overlay */}
        {hasStarted && time >= TOTAL_DURATION && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-white/90 backdrop-blur-sm">
            <button
              onClick={startAnimation}
              className="bg-gray-900 text-white px-8 py-3.5 rounded-full text-base font-bold hover:bg-gray-700 active:scale-95 transition-all shadow-lg"
            >
              ↻ Смотреть снова
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ SCENE: INTRO (0–5s) ============ */
function SceneIntro({ time }: { time: number }) {
  const opacity = getSceneOpacity(time, SCENES.intro.start, SCENES.intro.end, 0.01, 0.5);
  if (opacity <= 0) return null;

  const t = time;
  const resumeSlide = Math.min(t / 0.6, 1);
  const titleShow = t >= 0.6;
  const titleScale = t >= 0.6 ? Math.min((t - 0.6) / 0.3, 1) : 0;
  const characterShow = t >= 1.2;
  const progressBarShow = t >= 2;
  const progressValue = t >= 2 ? Math.min(((t - 2) / 1.5) * 10, 10) : 0;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ opacity }}>
      {/* Title */}
      <div
        className="absolute top-12 left-4 right-4 text-center z-10"
        style={{
          opacity: titleScale,
          transform: `scale(${0.5 + titleScale * 0.5})`,
          transition: 'none',
        }}
      >
        <h1 className="text-lg sm:text-xl font-black text-gray-900 leading-tight tracking-tight">
          ЗА 40 СЕКУНД —
        </h1>
        <h1 className="text-lg sm:text-xl font-black leading-tight tracking-tight mt-1">
          <span style={{ color: RED }}>РЕЗЮМЕ</span>,
        </h1>
        <h1 className="text-lg sm:text-xl font-black leading-tight tracking-tight">
          НА КОТОРОЕ <span style={{ color: GREEN }}>ОТВЕТЯТ</span>
        </h1>
      </div>

      {/* Resume Sheet */}
      <div
        className="w-40 h-56 bg-white border-2 border-gray-200 rounded-lg shadow-xl relative mt-8"
        style={{
          transform: `translateY(${(1 - resumeSlide) * 120}%)`,
        }}
      >
        <div className="p-3 space-y-2 pt-4">
          <div className="h-2 bg-gray-100 rounded-full w-3/4" />
          <div className="h-2 bg-gray-100 rounded-full w-full" />
          <div className="h-2 bg-gray-100 rounded-full w-2/3" />
          <div className="h-2 bg-gray-100 rounded-full w-full" />
          <div className="h-2 bg-gray-100 rounded-full w-1/2" />
          <div className="h-2 bg-gray-100 rounded-full w-5/6" />
          <div className="h-2 bg-gray-100 rounded-full w-3/4" />
        </div>
        {/* Header bar */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-gray-50 rounded-t-lg border-b border-gray-100" />
      </div>

      {/* Character */}
      <div
        className="absolute bottom-28 left-4 sm:left-8"
        style={{
          opacity: characterShow ? 1 : 0,
          transform: characterShow ? 'translateX(0)' : 'translateX(-60px)',
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <Character pointing />
      </div>

      {/* Progress Bar */}
      <div
        className="absolute bottom-12 left-6 right-6"
        style={{ opacity: progressBarShow ? 1 : 0, transition: 'opacity 0.3s' }}
      >
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${progressValue}%`,
              backgroundColor: GREEN,
              transition: 'width 0.3s ease-out',
            }}
          />
        </div>
        <p className="text-[10px] text-gray-400 mt-1 text-center font-bold tracking-wide">{Math.round(progressValue)}%</p>
      </div>
    </div>
  );
}

/* ============ SCENE: CARDS (3–6s) ============ */
function SceneCards({ time }: { time: number }) {
  const opacity = getSceneOpacity(time, SCENES.cards.start, SCENES.cards.end, 0.3, 0.5);
  if (opacity <= 0) return null;

  const t = time;
  const cards = [
    { label: 'ОДНА ДОЛЖНОСТЬ', emoji: '🎯', delay: 3.2 },
    { label: 'ЦИФРЫ', emoji: '📊', delay: 3.6 },
    { label: 'КОНТАКТЫ', emoji: '📞', delay: 4.0 },
  ];
  const showCross = t >= 4.6;
  const progressJump = t >= 3.1;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6" style={{ opacity }}>
      {/* Progress bar at 10% */}
      <div className="absolute top-8 left-6 right-6">
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: progressJump ? '10%' : '0%',
              backgroundColor: GREEN,
              transition: 'width 0.4s ease-out',
            }}
          />
        </div>
        <p className="text-[10px] text-gray-400 mt-1 text-center font-bold">10%</p>
      </div>

      <h2 className="text-base font-black text-gray-900 mb-6 tracking-tight mt-4">ТРИ ПРАВИЛА</h2>

      <div className="flex flex-col gap-3 w-full max-w-[260px]">
        {cards.map((card, i) => {
          const visible = t >= card.delay;
          const tapped = t >= card.delay + 0.4;
          return (
            <div
              key={i}
              className="bg-white border-2 border-gray-100 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible
                  ? tapped ? 'scale(1.03)' : 'scale(1) translateX(0)'
                  : 'translateX(80px) scale(0.9)',
                transition: visible ? 'transform 0.25s ease-out' : 'none',
                borderColor: tapped ? GREEN : '#f3f4f6',
              }}
            >
              <span className="text-xl">{card.emoji}</span>
              <span className="font-bold text-gray-800 text-sm tracking-tight">{card.label}</span>
              {tapped && (
                <svg width="16" height="16" viewBox="0 0 16 16" className="ml-auto">
                  <polyline points="3,8 6,11 13,4" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* Character tapping */}
      <div
        className="absolute bottom-28 left-4"
        style={{
          opacity: t >= 3.3 ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
      >
        <Character pointing />
      </div>

      {/* Red Cross over "УНИВЕРСАЛЬНОСТЬ" */}
      <div
        className="absolute bottom-12 left-0 right-0 text-center"
        style={{
          opacity: showCross ? 1 : 0,
          transform: showCross ? 'scale(1)' : 'scale(0.8)',
          transition: 'all 0.25s ease-out',
        }}
      >
        <div className="relative inline-block px-4 py-1">
          <span className="text-gray-300 text-sm font-bold tracking-wide">УНИВЕРСАЛЬНОСТЬ</span>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 30" preserveAspectRatio="none">
            <line x1="10" y1="25" x2="190" y2="5" stroke={RED} strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ============ SCENE 1: ONE POSITION (6–16s) ============ */
function Scene1({ time }: { time: number }) {
  const opacity = getSceneOpacity(time, SCENES.scene1.start, SCENES.scene1.end, 0.4, 0.5);
  if (opacity <= 0) return null;

  const lt = time - 6; // local time
  const jobs = [
    'Менеджер проектов', 'UX/UI Дизайнер', 'Бизнес-аналитик',
    'Frontend-разработчик', 'SMM-маркетолог', 'Копирайтер',
    'Менеджер по продажам', 'HR-специалист', 'Финансовый аналитик', 'Логист'
  ];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-start pt-10 px-4" style={{ opacity }}>
      {/* Scene badge */}
      <div
        className="mb-3 px-3 py-1 rounded-full text-xs font-bold"
        style={{
          backgroundColor: `${GREEN}15`,
          color: GREEN,
          opacity: lt >= 0 ? 1 : 0,
          transform: lt >= 0 ? 'translateY(0)' : 'translateY(-15px)',
          transition: 'all 0.3s',
        }}
      >
        ПРАВИЛО 1
      </div>

      <h2 className="text-base font-black text-gray-900 mb-3 tracking-tight text-center">ОДНА ДОЛЖНОСТЬ</h2>

      {/* Resume with job list */}
      <div className="w-52 bg-white border-2 border-gray-100 rounded-xl p-3 shadow-lg relative overflow-hidden">
        {/* Paper header */}
        <div className="h-4 bg-gray-50 rounded-t-md mb-2 -mt-1 -mx-1 px-2 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-300" />
        </div>

        <div className="space-y-1">
          {jobs.map((job, i) => {
            const crossTime = 0.5 + i * 0.7;
            const isCrossed = lt >= crossTime;
            const isLast = i === jobs.length - 1;
            const highlightLast = lt >= 7.5;

            return (
              <div
                key={i}
                className="flex items-center gap-2 py-0.5 px-1.5 rounded"
                style={{
                  opacity: isCrossed && !isLast ? 0.35 : 1,
                  backgroundColor: isLast && highlightLast ? '#dcfce7' : 'transparent',
                  transition: 'all 0.3s ease',
                }}
              >
                <span
                  className={`text-[11px] flex-1 ${isCrossed && !isLast ? 'line-through text-gray-400' : 'text-gray-700 font-medium'}`}
                >
                  {job}
                </span>
                {isCrossed && !isLast && (
                  <svg width="12" height="12" viewBox="0 0 12 12" className="flex-shrink-0">
                    <line x1="2" y1="2" x2="10" y2="10" stroke={RED} strokeWidth="2" strokeLinecap="round" />
                    <line x1="10" y1="2" x2="2" y2="10" stroke={RED} strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                {isLast && highlightLast && (
                  <svg width="14" height="14" viewBox="0 0 14 14" className="flex-shrink-0">
                    <polyline points="2,7 5,10 12,3" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Caption */}
      <div
        className="absolute bottom-10 left-4 right-4 text-center"
        style={{ opacity: lt >= 1 ? 1 : 0, transition: 'opacity 0.3s' }}
      >
        <p className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 inline-block">
          ОДНА ДОЛЖНОСТЬ = ОДИН ШАНС
        </p>
      </div>
    </div>
  );
}

/* ============ SCENE 2: NUMBERS (16–26s) ============ */
function Scene2({ time }: { time: number }) {
  const opacity = getSceneOpacity(time, SCENES.scene2.start, SCENES.scene2.end, 0.4, 0.5);
  if (opacity <= 0) return null;

  const lt = time - 16;
  const showNumbers = lt >= 4;

  const vagueLines = [
    'отвечал за задачи',
    'занимался продажами',
    'работал с клиентами',
    'управлял проектами',
  ];

  const numbers = [
    { value: '+30%', label: 'рост продаж', delay: 4.2 },
    { value: '×2', label: 'скорость работы', delay: 5.2 },
    { value: '−5 дней', label: 'цикл сделки', delay: 6.2 },
  ];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-start pt-10 px-4" style={{ opacity }}>
      {/* Scene badge */}
      <div
        className="mb-3 px-3 py-1 rounded-full text-xs font-bold"
        style={{ backgroundColor: `${GREEN}15`, color: GREEN }}
      >
        ПРАВИЛО 2
      </div>

      <h2 className="text-sm font-black text-gray-900 mb-3 tracking-tight text-center">ЦИФРЫ ВМЕСТО ОБЯЗАННОСТЕЙ</h2>

      {/* Resume */}
      <div className="w-52 bg-white border-2 border-gray-100 rounded-xl p-3 shadow-lg relative overflow-hidden">
        {/* Paper header */}
        <div className="h-4 bg-gray-50 rounded-t-md mb-2 -mt-1 -mx-1 px-2 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-300" />
        </div>

        {!showNumbers ? (
          <div className="space-y-2.5">
            {vagueLines.map((line, i) => {
              const crossTime = 1 + i * 0.7;
              const isCrossed = lt >= crossTime;
              return (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className={`text-[11px] italic flex-1 ${isCrossed ? 'text-gray-300 line-through' : 'text-gray-500'}`}
                    style={{ transition: 'all 0.3s' }}
                  >
                    «{line}»
                  </span>
                  {isCrossed && (
                    <svg width="12" height="12" viewBox="0 0 12 12" className="flex-shrink-0">
                      <line x1="2" y1="2" x2="10" y2="10" stroke={RED} strokeWidth="2" strokeLinecap="round" />
                      <line x1="10" y1="2" x2="2" y2="10" stroke={RED} strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {numbers.map((num, i) => {
              const visible = lt >= num.delay;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg p-2 border"
                  style={{
                    backgroundColor: '#f0fdf4',
                    borderColor: visible ? GREEN : 'transparent',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateX(0) scale(1)' : 'translateX(30px) scale(0.8)',
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  <span className="text-sm font-black" style={{ color: GREEN }}>{num.value}</span>
                  <span className="text-[10px] text-gray-600 flex-1">{num.label}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" className="flex-shrink-0">
                    <polyline points="2,7 5,10 12,3" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Caption */}
      <div
        className="absolute bottom-10 left-4 right-4 text-center"
        style={{ opacity: lt >= 1 ? 1 : 0, transition: 'opacity 0.3s' }}
      >
        <p className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 inline-block">
          ЦИФРЫ, А НЕ ОБЯЗАННОСТИ
        </p>
      </div>
    </div>
  );
}

/* ============ SCENE 3: CONTACTS ON TOP (26–36s) ============ */
function Scene3({ time }: { time: number }) {
  const opacity = getSceneOpacity(time, SCENES.scene3.start, SCENES.scene3.end, 0.4, 0.5);
  if (opacity <= 0) return null;

  const lt = time - 26;
  const movedToTop = lt >= 3.5;
  const showHand = lt >= 1 && lt < 3.5;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-start pt-10 px-4" style={{ opacity }}>
      {/* Scene badge */}
      <div
        className="mb-3 px-3 py-1 rounded-full text-xs font-bold"
        style={{ backgroundColor: `${GREEN}15`, color: GREEN }}
      >
        ПРАВИЛО 3
      </div>

      <h2 className="text-base font-black text-gray-900 mb-3 tracking-tight text-center">КОНТАКТЫ СВЕРХУ</h2>

      {/* Resume */}
      <div className="w-52 bg-white border-2 border-gray-100 rounded-xl shadow-lg relative overflow-hidden" style={{ height: '220px' }}>
        {!movedToTop ? (
          <>
            {/* Paper header */}
            <div className="h-4 bg-gray-50 rounded-t-md px-2 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-300" />
            </div>
            {/* Content lines */}
            <div className="p-3 space-y-2">
              <div className="h-2 bg-gray-100 rounded-full w-full" />
              <div className="h-2 bg-gray-100 rounded-full w-3/4" />
              <div className="h-2 bg-gray-100 rounded-full w-full" />
              <div className="h-2 bg-gray-100 rounded-full w-2/3" />
              <div className="h-2 bg-gray-100 rounded-full w-full" />
              <div className="h-2 bg-gray-100 rounded-full w-1/2" />
              <div className="h-2 bg-gray-100 rounded-full w-3/4" />
            </div>
            {/* Contact block at bottom, greyed out */}
            <div
              className="absolute bottom-0 left-0 right-0 bg-gray-50 p-2 border-t border-dashed border-gray-200"
              style={{ opacity: 0.6 }}
            >
              <div className="text-[9px] text-gray-400 text-center font-medium">
                📧 email@mail.ru &nbsp;|&nbsp; 📱 +7 999 000 00 00
              </div>
            </div>
            {/* Hand dragging */}
            {showHand && (
              <div className="absolute bottom-6 right-3 text-xl animate-bounce">
                👆
              </div>
            )}
          </>
        ) : (
          <>
            {/* Contact block at top */}
            <div
              className="p-2.5 border-b-2"
              style={{ backgroundColor: '#f0fdf4', borderColor: GREEN }}
            >
              <div className="text-[10px] font-bold text-gray-800 text-center">
                📧 email@mail.ru &nbsp;|&nbsp; 📱 +7 999 000 00 00
              </div>
              <div className="flex justify-center mt-1">
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <polyline points="2,7 5,10 12,3" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            {/* Content lines */}
            <div className="p-3 space-y-2">
              <div className="h-2 bg-gray-100 rounded-full w-full" />
              <div className="h-2 bg-gray-100 rounded-full w-3/4" />
              <div className="h-2 bg-gray-100 rounded-full w-full" />
              <div className="h-2 bg-gray-100 rounded-full w-2/3" />
              <div className="h-2 bg-gray-100 rounded-full w-full" />
              <div className="h-2 bg-gray-100 rounded-full w-1/2" />
            </div>
          </>
        )}
      </div>

      {/* Caption */}
      <div
        className="absolute bottom-10 left-4 right-4 text-center"
        style={{ opacity: lt >= 1 ? 1 : 0, transition: 'opacity 0.3s' }}
      >
        <p className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 inline-block">
          КОНТАКТЫ — В ПЕРВУЮ ОЧЕРЕДЬ
        </p>
      </div>
    </div>
  );
}

/* ============ SCENE: FINAL (36–40s) ============ */
function SceneFinal({ time }: { time: number }) {
  const opacity = getSceneOpacity(time, SCENES.final.start, SCENES.final.end, 0.3, 0.01);
  if (opacity <= 0) return null;

  const lt = time - 36;
  const showResume = lt >= 0.3;
  const showCheck = lt >= 1.2;
  const showText = lt >= 1.8;
  const showArrow = lt >= 2.3;
  const showCharacter = lt >= 2.8;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6" style={{ opacity }}>
      {/* Clean Resume */}
      <div
        className="w-44 bg-white border-2 rounded-xl shadow-xl p-3 relative"
        style={{
          borderColor: showCheck ? GREEN : '#e5e7eb',
          opacity: showResume ? 1 : 0,
          transform: showResume ? 'scale(1)' : 'scale(0.7)',
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Contacts on top */}
        <div className="bg-green-50 rounded-lg p-1.5 mb-2 border" style={{ borderColor: `${GREEN}40` }}>
          <div className="text-[9px] text-gray-700 text-center font-medium">📧 email@mail.ru | 📱 +7 999</div>
        </div>
        {/* Single position */}
        <div className="bg-green-50 rounded-lg p-1.5 mb-2">
          <div className="text-[10px] font-bold text-gray-800 text-center">Маркетолог</div>
        </div>
        {/* Numbers */}
        <div className="space-y-0.5">
          <div className="text-[9px] text-gray-600 font-medium">📈 +30% конверсия</div>
          <div className="text-[9px] text-gray-600 font-medium">⚡ ×2 скорость</div>
          <div className="text-[9px] text-gray-600 font-medium">📅 −5 дней цикл</div>
        </div>
      </div>

      {/* Big Green Checkmark */}
      <div
        className="absolute top-14 right-6"
        style={{
          opacity: showCheck ? 1 : 0,
          transform: showCheck ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-180deg)',
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <svg width="52" height="52" viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="24" fill={GREEN} opacity="0.1" />
          <circle cx="26" cy="26" r="24" fill="none" stroke={GREEN} strokeWidth="2.5" />
          <polyline points="15,26 22,33 37,18" fill="none" stroke={GREEN} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Main Text */}
      <div
        className="mt-5 text-center"
        style={{
          opacity: showText ? 1 : 0,
          transform: showText ? 'translateY(0) scale(1)' : 'translateY(15px) scale(0.9)',
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <h2 className="text-2xl font-black tracking-tight" style={{ color: GREEN }}>
          ОТКЛИК БУДЕТ
        </h2>
      </div>

      {/* Down Arrow */}
      <div
        className="mt-3"
        style={{
          opacity: showArrow ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" className="animate-bounce">
          <path d="M14 4 L14 20 M7 15 L14 22 L21 15" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* CTA Area */}
      <div
        className="mt-1 bg-gray-50 rounded-xl px-5 py-2.5 border-2 border-dashed border-gray-200"
        style={{
          opacity: showArrow ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
      >
        <p className="text-[10px] text-gray-500 font-bold text-center tracking-wide">ПОДПИСЫВАЙСЯ ↓</p>
      </div>

      {/* Character with thumbs up */}
      <div
        className="absolute bottom-10 right-4"
        style={{
          opacity: showCharacter ? 1 : 0,
          transform: showCharacter ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.5)',
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <Character thumbsUp />
      </div>
    </div>
  );
}

/* ============ CHARACTER COMPONENT ============ */
function Character({ pointing, thumbsUp }: { pointing?: boolean; thumbsUp?: boolean }) {
  return (
    <svg width="64" height="96" viewBox="0 0 64 96">
      {/* Head */}
      <circle cx="32" cy="18" r="14" fill="#fef3c7" stroke="#374151" strokeWidth="2" />
      {/* Eyes */}
      <circle cx="27" cy="16" r="2" fill="#374151" />
      <circle cx="37" cy="16" r="2" fill="#374151" />
      {/* Smile */}
      <path d="M28 22 Q32 26 36 22" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
      {/* Hoodie body */}
      <path
        d="M18 32 Q18 28 24 26 L40 26 Q46 28 46 32 L48 68 L16 68 Z"
        fill="#374151"
      />
      {/* Hood */}
      <path d="M22 28 Q32 22 42 28" fill="none" stroke="#1f2937" strokeWidth="2" />
      {/* Hoodie pocket */}
      <rect x="24" y="50" width="16" height="8" rx="2" fill="#4b5563" />
      {/* Left arm */}
      {pointing && (
        <>
          <path d="M18 38 L4 32" fill="none" stroke="#374151" strokeWidth="6" strokeLinecap="round" />
          {/* Pointing finger */}
          <circle cx="3" cy="31" r="3" fill="#fef3c7" stroke="#374151" strokeWidth="1" />
        </>
      )}
      {/* Right arm */}
      {thumbsUp && (
        <>
          <path d="M46 38 L56 28" fill="none" stroke="#374151" strokeWidth="6" strokeLinecap="round" />
          {/* Thumb up */}
          <rect x="53" y="18" width="5" height="12" rx="2.5" fill="#fef3c7" stroke="#374151" strokeWidth="1" />
          <rect x="50" y="26" width="10" height="6" rx="2" fill="#fef3c7" stroke="#374151" strokeWidth="1" />
        </>
      )}
      {/* Default arms if no action */}
      {!pointing && !thumbsUp && (
        <>
          <path d="M18 38 L12 52" fill="none" stroke="#374151" strokeWidth="5" strokeLinecap="round" />
          <path d="M46 38 L52 52" fill="none" stroke="#374151" strokeWidth="5" strokeLinecap="round" />
        </>
      )}
      {/* Legs */}
      <line x1="26" y1="68" x2="24" y2="84" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
      <line x1="38" y1="68" x2="40" y2="84" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
      {/* Shoes */}
      <ellipse cx="23" cy="86" rx="6" ry="3.5" fill="#1f2937" />
      <ellipse cx="41" cy="86" rx="6" ry="3.5" fill="#1f2937" />
    </svg>
  );
}
