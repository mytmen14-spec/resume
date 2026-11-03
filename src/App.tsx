import { useState, useEffect, useRef } from 'react';
import { videoRecorder } from '../scripts/VideoRecorder';

const TOTAL_DURATION = 40;
const RED = '#E11D48';
const GREEN = '#16A34A';

export default function App() {
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startAnimation = async () => {
    setTime(0);
    setHasStarted(true);
    setIsPlaying(true);
  };

  const startRecording = async () => {
    if (containerRef.current && !isRecording) {
      try {
        await videoRecorder.startRecording(containerRef.current);
        setIsRecording(true);
        // Автоматически запускаем анимацию
        startAnimation();
      } catch (err) {
        console.error('Не удалось начать запись:', err);
        alert('Не удалось начать запись. Убедитесь, что браузер поддерживает MediaRecorder API.');
      }
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      videoRecorder.stopRecording();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          const next = prev + 0.05;
          if (next >= TOTAL_DURATION) {
            setIsPlaying(false);
            // Автоматически останавливаем запись когда анимация заканчивается
            if (isRecording) {
              setTimeout(() => stopRecording(), 500);
            }
            return TOTAL_DURATION;
          }
          return next;
        });
      }, 50);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, isRecording]);

  const progress = Math.min((time / TOTAL_DURATION) * 100, 100);
  const displayTime = Math.floor(time);

  return (
    <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{
        position: 'relative',
        background: 'white',
        overflow: 'hidden',
        width: '375px',
        height: '667px',
        maxWidth: '95vw',
        maxHeight: '95vh',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }} ref={containerRef}>
        {/* Scenes */}
        {time < 5.5 && <IntroScene time={time} />}
        {time >= 3 && time < 6 && <CardsScene time={time} />}
        {time >= 6 && time < 16 && <Scene1Job time={time} />}
        {time >= 16 && time < 26 && <Scene2Numbers time={time} />}
        {time >= 26 && time < 36 && <Scene3Contacts time={time} />}
        {time >= 36 && time <= TOTAL_DURATION && <SceneFinalEnd time={time} />}

        {/* Progress Bar */}
        {hasStarted && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#f3f4f6', zIndex: 50 }}>
            <div style={{ height: '100%', width: `${progress}%`, background: GREEN }} />
          </div>
        )}

        {/* Timer */}
        {hasStarted && time < TOTAL_DURATION && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 50,
            background: 'rgba(17, 24, 39, 0.8)',
            color: 'white',
            fontSize: '12px',
            fontFamily: 'monospace',
            padding: '4px 10px',
            borderRadius: '9999px',
          }}>
            {displayTime}/{TOTAL_DURATION}
          </div>
        )}

        {/* Record Button */}
        {!hasStarted && (
          <button
            onClick={startRecording}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              zIndex: 50,
              background: isRecording ? RED : '#111827',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {isRecording ? (
              <>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white', animation: 'pulse 1s infinite' }} />
                Запись...
              </>
            ) : (
              <>🎬 Записать видео</>
            )}
          </button>
        )}

        {/* Start Overlay */}
        {!hasStarted && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            background: 'white',
          }}>
            <div style={{ marginBottom: '24px' }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="36" fill="none" stroke={GREEN} strokeWidth="3" />
                <polygon points="32,24 58,40 32,56" fill={GREEN} />
              </svg>
            </div>
            <button
              onClick={startAnimation}
              style={{
                background: '#111827',
                color: 'white',
                padding: '14px 32px',
                borderRadius: '9999px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
            >
              ▶ Запустить видео
            </button>
            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '12px' }}>40 секунд • Резюме</p>
          </div>
        )}

        {/* Replay Overlay */}
        {hasStarted && time >= TOTAL_DURATION && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            background: 'rgba(255,255,255,0.9)',
          }}>
            <button
              onClick={startAnimation}
              style={{
                background: '#111827',
                color: 'white',
                padding: '14px 32px',
                borderRadius: '9999px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
            >
              ↻ Смотреть снова
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== INTRO SCENE =====
function IntroScene({ time }: { time: number }) {
  const opacity = time < 0.5 ? time / 0.5 : time > 5 ? (5.5 - time) / 0.5 : 1;
  
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '16px', opacity }}>
      {/* Title */}
      <div style={{
        marginTop: '32px',
        textAlign: 'center',
        opacity: time >= 0.8 ? 1 : 0,
        transform: time >= 0.8 ? 'scale(1)' : 'scale(0.5)',
        transition: 'all 0.3s ease-out',
      }}>
        <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#111827', lineHeight: 1.2 }}>
          ЗА 40 СЕКУНД —
        </h1>
        <h1 style={{ fontSize: '18px', fontWeight: 900, lineHeight: 1.2, marginTop: '4px' }}>
          <span style={{ color: RED }}>РЕЗЮМЕ</span>,
        </h1>
        <h1 style={{ fontSize: '18px', fontWeight: 900, lineHeight: 1.2 }}>
          НА КОТОРОЕ <span style={{ color: GREEN }}>ОТВЕТЯТ</span>
        </h1>
      </div>

      {/* Resume Sheet */}
      <div style={{
        width: '160px',
        height: '208px',
        background: 'white',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        marginTop: '32px',
        transform: time < 0.6 ? 'translateY(120%)' : 'translateY(0)',
        transition: 'transform 0.6s ease-out',
      }}>
        <div style={{ padding: '12px', paddingTop: '16px' }}>
          {[0.75, 1, 0.66, 1, 0.5, 0.83].map((w, i) => (
            <div key={i} style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px', width: `${w * 100}%`, marginBottom: '8px' }} />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '24px',
        right: '24px',
        opacity: time >= 2 ? 1 : 0,
        transition: 'opacity 0.3s',
      }}>
        <div style={{ height: '10px', background: '#f3f4f6', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            borderRadius: '9999px',
            width: `${time >= 2 ? Math.min(((time - 2) / 1.5) * 10, 10) : 0}%`,
            background: GREEN,
            transition: 'width 0.3s',
          }} />
        </div>
        <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px', textAlign: 'center', fontWeight: 'bold' }}>
          {time >= 2 ? Math.round(Math.min(((time - 2) / 1.5) * 10, 10)) : 0}%
        </p>
      </div>
    </div>
  );
}

// ===== CARDS SCENE =====
function CardsScene({ time }: { time: number }) {
  const lt = time - 3;
  const opacity = lt < 0.3 ? lt / 0.3 : time > 5.5 ? (6 - time) / 0.5 : 1;

  const cards = [
    { label: 'ОДНА ДОЛЖНОСТЬ', emoji: '🎯', delay: 0.2 },
    { label: 'ЦИФРЫ', emoji: '📊', delay: 0.6 },
    { label: 'КОНТАКТЫ', emoji: '📞', delay: 1.0 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', opacity }}>
      {/* Progress bar at 10% */}
      <div style={{ position: 'absolute', top: '32px', left: '24px', right: '24px' }}>
        <div style={{ height: '10px', background: '#f3f4f6', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: '9999px', width: '10%', background: GREEN }} />
        </div>
        <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px', textAlign: 'center', fontWeight: 'bold' }}>10%</p>
      </div>

      <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#111827', marginBottom: '24px', marginTop: '16px' }}>ТРИ ПРАВИЛА</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '260px' }}>
        {cards.map((card, i) => {
          const visible = lt >= card.delay;
          const tapped = lt >= card.delay + 0.4;
          return (
            <div key={i} style={{
              background: 'white',
              border: `2px solid ${tapped ? GREEN : '#f3f4f6'}`,
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              opacity: visible ? 1 : 0,
              transform: visible ? (tapped ? 'scale(1.03)' : 'scale(1)') : 'translateX(80px)',
              transition: 'all 0.3s ease-out',
            }}>
              <span style={{ fontSize: '24px' }}>{card.emoji}</span>
              <span style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '14px' }}>{card.label}</span>
              {tapped && (
                <svg width="16" height="16" viewBox="0 0 16 16" style={{ marginLeft: 'auto' }}>
                  <polyline points="3,8 6,11 13,4" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* Character */}
      <div style={{ position: 'absolute', bottom: '96px', left: '16px', opacity: lt >= 0.3 ? 1 : 0, transition: 'opacity 0.3s' }}>
        <Character pointing />
      </div>

      {/* Red Cross */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: lt >= 1.6 ? 1 : 0,
        transform: lt >= 1.6 ? 'scale(1)' : 'scale(0.8)',
        transition: 'all 0.25s',
      }}>
        <div style={{ position: 'relative', display: 'inline-block', padding: '4px 16px' }}>
          <span style={{ color: '#d1d5db', fontSize: '14px', fontWeight: 'bold' }}>УНИВЕРСАЛЬНОСТЬ</span>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 200 30" preserveAspectRatio="none">
            <line x1="10" y1="25" x2="190" y2="5" stroke={RED} strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ===== SCENE 1: ONE POSITION =====
function Scene1Job({ time }: { time: number }) {
  const lt = time - 6;
  const fadeIn = Math.min(lt / 0.4, 1);
  const fadeOut = time > 15.5 ? (16 - time) / 0.5 : 1;
  const opacity = Math.min(fadeIn, fadeOut);

  const jobs = [
    'Менеджер проектов', 'UX/UI Дизайнер', 'Бизнес-аналитик',
    'Frontend-разработчик', 'SMM-маркетолог', 'Копирайтер',
    'Менеджер по продажам', 'HR-специалист', 'Финансовый аналитик', 'Логист'
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '40px', padding: '40px 16px 16px', opacity }}>
      <div style={{ marginBottom: '8px', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 'bold', background: '#f0fdf4', color: GREEN }}>
        ПРАВИЛО 1
      </div>
      <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#111827', marginBottom: '12px', textAlign: 'center' }}>ОДНА ДОЛЖНОСТЬ</h2>

      <div style={{ width: '208px', background: 'white', border: '2px solid #f3f4f6', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ height: '12px', background: '#f9fafb', borderRadius: '4px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fca5a5' }} />
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fde047' }} />
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#86efac' }} />
        </div>
        <div>
          {jobs.map((job, i) => {
            const crossTime = 0.5 + i * 0.7;
            const isCrossed = lt >= crossTime;
            const isLast = i === jobs.length - 1;
            const highlightLast = lt >= 7.5;

            return (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '2px 4px',
                borderRadius: '4px',
                opacity: isCrossed && !isLast ? 0.35 : 1,
                background: isLast && highlightLast ? '#dcfce7' : 'transparent',
                transition: 'all 0.3s',
              }}>
                <span style={{
                  fontSize: '11px',
                  flex: 1,
                  textDecoration: isCrossed && !isLast ? 'line-through' : 'none',
                  color: isCrossed && !isLast ? '#9ca3af' : '#374151',
                  fontWeight: '500',
                }}>
                  {job}
                </span>
                {isCrossed && !isLast && (
                  <svg width="12" height="12" viewBox="0 0 12 12" style={{ flexShrink: 0 }}>
                    <line x1="2" y1="2" x2="10" y2="10" stroke={RED} strokeWidth="2" strokeLinecap="round" />
                    <line x1="10" y1="2" x2="2" y2="10" stroke={RED} strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                {isLast && highlightLast && (
                  <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
                    <polyline points="2,7 5,10 12,3" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '40px', left: '16px', right: '16px', textAlign: 'center', opacity: lt >= 1 ? 1 : 0, transition: 'opacity 0.3s' }}>
        <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '8px', padding: '8px 16px', display: 'inline-block' }}>
          ОДНА ДОЛЖНОСТЬ = ОДИН ШАНС
        </p>
      </div>
    </div>
  );
}

// ===== SCENE 2: NUMBERS =====
function Scene2Numbers({ time }: { time: number }) {
  const lt = time - 16;
  const fadeIn = Math.min(lt / 0.4, 1);
  const fadeOut = time > 25.5 ? (26 - time) / 0.5 : 1;
  const opacity = Math.min(fadeIn, fadeOut);
  const showNumbers = lt >= 4;

  const vagueLines = ['отвечал за задачи', 'занимался продажами', 'работал с клиентами', 'управлял проектами'];
  const numbers = [
    { value: '+30%', label: 'рост продаж', delay: 4.2 },
    { value: '×2', label: 'скорость работы', delay: 5.2 },
    { value: '−5 дней', label: 'цикл сделки', delay: 6.2 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '40px', padding: '40px 16px 16px', opacity }}>
      <div style={{ marginBottom: '8px', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 'bold', background: '#f0fdf4', color: GREEN }}>
        ПРАВИЛО 2
      </div>
      <h2 style={{ fontSize: '14px', fontWeight: 900, color: '#111827', marginBottom: '12px', textAlign: 'center' }}>ЦИФРЫ ВМЕСТО ОБЯЗАННОСТЕЙ</h2>

      <div style={{ width: '208px', background: 'white', border: '2px solid #f3f4f6', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ height: '12px', background: '#f9fafb', borderRadius: '4px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fca5a5' }} />
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fde047' }} />
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#86efac' }} />
        </div>

        {!showNumbers ? (
          <div>
            {vagueLines.map((line, i) => {
              const crossTime = 1 + i * 0.7;
              const isCrossed = lt >= crossTime;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontStyle: 'italic',
                    flex: 1,
                    color: isCrossed ? '#d1d5db' : '#6b7280',
                    textDecoration: isCrossed ? 'line-through' : 'none',
                    transition: 'all 0.3s',
                  }}>
                    «{line}»
                  </span>
                  {isCrossed && (
                    <svg width="12" height="12" viewBox="0 0 12 12" style={{ flexShrink: 0 }}>
                      <line x1="2" y1="2" x2="10" y2="10" stroke={RED} strokeWidth="2" strokeLinecap="round" />
                      <line x1="10" y1="2" x2="2" y2="10" stroke={RED} strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            {numbers.map((num, i) => {
              const visible = lt >= num.delay;
              return (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '8px',
                  padding: '8px',
                  border: `2px solid ${visible ? GREEN : 'transparent'}`,
                  background: '#f0fdf4',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateX(0)' : 'translateX(30px)',
                  transition: 'all 0.4s ease-out',
                  marginBottom: '8px',
                }}>
                  <span style={{ fontSize: '14px', fontWeight: 900, color: GREEN }}>{num.value}</span>
                  <span style={{ fontSize: '10px', color: '#4b5563', flex: 1 }}>{num.label}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
                    <polyline points="2,7 5,10 12,3" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: '40px', left: '16px', right: '16px', textAlign: 'center', opacity: lt >= 1 ? 1 : 0, transition: 'opacity 0.3s' }}>
        <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '8px', padding: '8px 16px', display: 'inline-block' }}>
          ЦИФРЫ, А НЕ ОБЯЗАННОСТИ
        </p>
      </div>
    </div>
  );
}

// ===== SCENE 3: CONTACTS =====
function Scene3Contacts({ time }: { time: number }) {
  const lt = time - 26;
  const fadeIn = Math.min(lt / 0.4, 1);
  const fadeOut = time > 35.5 ? (36 - time) / 0.5 : 1;
  const opacity = Math.min(fadeIn, fadeOut);
  const movedToTop = lt >= 3.5;
  const showHand = lt >= 1 && lt < 3.5;

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '40px', padding: '40px 16px 16px', opacity }}>
      <div style={{ marginBottom: '8px', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 'bold', background: '#f0fdf4', color: GREEN }}>
        ПРАВИЛО 3
      </div>
      <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#111827', marginBottom: '12px', textAlign: 'center' }}>КОНТАКТЫ СВЕРХУ</h2>

      <div style={{ width: '208px', background: 'white', border: '2px solid #f3f4f6', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', position: 'relative', overflow: 'hidden', height: '220px' }}>
        {!movedToTop ? (
          <>
            <div style={{ height: '12px', background: '#f9fafb', borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fca5a5' }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fde047' }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#86efac' }} />
            </div>
            <div style={{ padding: '12px' }}>
              {[1, 0.75, 1, 0.66, 1, 0.5, 0.75].map((w, i) => (
                <div key={i} style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px', width: `${w * 100}%`, marginBottom: '8px' }} />
              ))}
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#f9fafb', padding: '8px', borderTop: '1px dashed #e5e7eb', opacity: 0.6 }}>
              <div style={{ fontSize: '9px', color: '#9ca3af', textAlign: 'center', fontWeight: 500 }}>
                📧 email@mail.ru | 📱 +7 999 000 00
              </div>
            </div>
            {showHand && (
              <div style={{ position: 'absolute', bottom: '20px', right: '12px', fontSize: '20px', animation: 'bounce 0.8s infinite' }}>
                👆
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ padding: '10px', borderBottom: `2px solid ${GREEN}`, background: '#f0fdf4' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#1f2937', textAlign: 'center' }}>
                📧 email@mail.ru | 📱 +7 999 000 00
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <polyline points="2,7 5,10 12,3" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div style={{ padding: '12px' }}>
              {[1, 0.75, 1, 0.66, 1, 0.5].map((w, i) => (
                <div key={i} style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px', width: `${w * 100}%`, marginBottom: '8px' }} />
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: '40px', left: '16px', right: '16px', textAlign: 'center', opacity: lt >= 1 ? 1 : 0, transition: 'opacity 0.3s' }}>
        <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '8px', padding: '8px 16px', display: 'inline-block' }}>
          КОНТАКТЫ — В ПЕРВУЮ ОЧЕРЕДЬ
        </p>
      </div>
    </div>
  );
}

// ===== FINAL SCENE =====
function SceneFinalEnd({ time }: { time: number }) {
  const lt = time - 36;
  const showResume = lt >= 0.3;
  const showCheck = lt >= 1.2;
  const showText = lt >= 1.8;
  const showArrow = lt >= 2.3;
  const showCharacter = lt >= 2.8;

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {/* Clean Resume */}
      <div style={{
        width: '176px',
        background: 'white',
        border: `2px solid ${showCheck ? GREEN : '#e5e7eb'}`,
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        padding: '12px',
        opacity: showResume ? 1 : 0,
        transform: showResume ? 'scale(1)' : 'scale(0.7)',
        transition: 'all 0.5s ease-out',
      }}>
        <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '6px', marginBottom: '8px', border: `1px solid ${GREEN}40` }}>
          <div style={{ fontSize: '9px', color: '#374151', textAlign: 'center', fontWeight: 500 }}>📧 email@mail.ru | 📱 +7 999</div>
        </div>
        <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '6px', marginBottom: '8px' }}>
          <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#1f2937', textAlign: 'center' }}>Маркетолог</div>
        </div>
        <div>
          <div style={{ fontSize: '9px', color: '#4b5563', fontWeight: 500, marginBottom: '2px' }}>📈 +30% конверсия</div>
          <div style={{ fontSize: '9px', color: '#4b5563', fontWeight: 500, marginBottom: '2px' }}>⚡ ×2 скорость</div>
          <div style={{ fontSize: '9px', color: '#4b5563', fontWeight: 500 }}>📅 −5 дней цикл</div>
        </div>
      </div>

      {/* Big Green Checkmark */}
      <div style={{
        position: 'absolute',
        top: '56px',
        right: '24px',
        opacity: showCheck ? 1 : 0,
        transform: showCheck ? 'scale(1)' : 'scale(0)',
        transition: 'all 0.4s ease-out',
      }}>
        <svg width="52" height="52" viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="24" fill={GREEN} opacity="0.1" />
          <circle cx="26" cy="26" r="24" fill="none" stroke={GREEN} strokeWidth="2.5" />
          <polyline points="15,26 22,33 37,18" fill="none" stroke={GREEN} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Main Text */}
      <div style={{
        marginTop: '20px',
        textAlign: 'center',
        opacity: showText ? 1 : 0,
        transform: showText ? 'translateY(0)' : 'translateY(15px)',
        transition: 'all 0.4s ease-out',
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 900, color: GREEN, letterSpacing: '-0.025em' }}>
          ОТКЛИК БУДЕТ
        </h2>
      </div>

      {/* Down Arrow */}
      <div style={{ marginTop: '12px', opacity: showArrow ? 1 : 0, transition: 'opacity 0.3s' }}>
        <svg width="28" height="28" viewBox="0 0 28 28" style={{ animation: showArrow ? 'bounce 1s infinite' : 'none' }}>
          <path d="M14 4 L14 20 M7 15 L14 22 L21 15" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* CTA */}
      <div style={{
        marginTop: '4px',
        background: '#f9fafb',
        borderRadius: '12px',
        padding: '10px 20px',
        border: '2px dashed #e5e7eb',
        opacity: showArrow ? 1 : 0,
        transition: 'opacity 0.3s',
      }}>
        <p style={{ fontSize: '10px', color: '#6b7280', fontWeight: 'bold', textAlign: 'center', letterSpacing: '0.05em' }}>ПОДПИСЫВАЙСЯ ↓</p>
      </div>

      {/* Character */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        right: '16px',
        opacity: showCharacter ? 1 : 0,
        transform: showCharacter ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 0.5s ease-out',
      }}>
        <Character thumbsUp />
      </div>
    </div>
  );
}

// ===== CHARACTER =====
function Character({ pointing, thumbsUp }: { pointing?: boolean; thumbsUp?: boolean }) {
  return (
    <svg width="60" height="90" viewBox="0 0 64 96">
      <circle cx="32" cy="18" r="14" fill="#fef3c7" stroke="#374151" strokeWidth="2" />
      <circle cx="27" cy="16" r="2" fill="#374151" />
      <circle cx="37" cy="16" r="2" fill="#374151" />
      <path d="M28 22 Q32 26 36 22" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 32 Q18 28 24 26 L40 26 Q46 28 46 32 L48 68 L16 68 Z" fill="#374151" />
      <path d="M22 28 Q32 22 42 28" fill="none" stroke="#1f2937" strokeWidth="2" />
      <rect x="24" y="50" width="16" height="8" rx="2" fill="#4b5563" />
      {pointing && (
        <>
          <path d="M18 38 L4 32" fill="none" stroke="#374151" strokeWidth="6" strokeLinecap="round" />
          <circle cx="3" cy="31" r="3" fill="#fef3c7" stroke="#374151" strokeWidth="1" />
        </>
      )}
      {thumbsUp && (
        <>
          <path d="M46 38 L56 28" fill="none" stroke="#374151" strokeWidth="6" strokeLinecap="round" />
          <rect x="53" y="18" width="5" height="12" rx="2.5" fill="#fef3c7" stroke="#374151" strokeWidth="1" />
          <rect x="50" y="26" width="10" height="6" rx="2" fill="#fef3c7" stroke="#374151" strokeWidth="1" />
        </>
      )}
      {!pointing && !thumbsUp && (
        <>
          <path d="M18 38 L12 52" fill="none" stroke="#374151" strokeWidth="5" strokeLinecap="round" />
          <path d="M46 38 L52 52" fill="none" stroke="#374151" strokeWidth="5" strokeLinecap="round" />
        </>
      )}
      <line x1="26" y1="68" x2="24" y2="84" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
      <line x1="38" y1="68" x2="40" y2="84" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="23" cy="86" rx="6" ry="3.5" fill="#1f2937" />
      <ellipse cx="41" cy="86" rx="6" ry="3.5" fill="#1f2937" />
    </svg>
  );
}
