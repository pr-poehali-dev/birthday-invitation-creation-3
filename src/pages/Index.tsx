import { useState, useEffect, useMemo } from 'react';
import Icon from '@/components/ui/icon';

const PARTY_DATE = new Date('2026-07-25T18:00:00');

const GALLERY = [
  'https://cdn.poehali.dev/projects/a8a0c233-7f88-4be8-aee5-87dd4f629653/files/1afe8ec7-6fcb-4549-8c8e-17ce1272d3ff.jpg',
  'https://cdn.poehali.dev/projects/a8a0c233-7f88-4be8-aee5-87dd4f629653/files/c442ae9c-02cf-49ac-aaa5-78258e4d2dba.jpg',
  'https://cdn.poehali.dev/projects/a8a0c233-7f88-4be8-aee5-87dd4f629653/files/6313307b-9f19-4fb6-b6ad-d14f53fbdf2d.jpg',
];

const CONFETTI_COLORS = ['#FF5DA2', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6B6B', '#C77DFF'];

function useCountdown(target: Date) {
  const [diff, setDiff] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setDiff(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  const clamped = Math.max(diff, 0);
  return {
    days: Math.floor(clamped / 86400000),
    hours: Math.floor((clamped / 3600000) % 24),
    minutes: Math.floor((clamped / 60000) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
  };
}

const Confetti = () => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 6,
        size: 6 + Math.random() * 8,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        round: Math.random() > 0.5,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 animate-confetti-fall"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.round ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

const Balloon = ({ color, className, delay }: { color: string; className?: string; delay?: string }) => (
  <div className={`animate-float ${className ?? ''}`} style={{ animationDelay: delay }}>
    <div
      className="relative h-24 w-[72px] rounded-[50%] shadow-lg"
      style={{ background: `radial-gradient(circle at 32% 28%, #ffffffaa, ${color} 55%)` }}
    >
      <span
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-x-[6px] border-x-transparent border-t-[10px]"
        style={{ borderTopColor: color }}
      />
      <span className="absolute -bottom-12 left-1/2 h-12 w-px -translate-x-1/2 bg-white/40" />
    </div>
  </div>
);

const TimeBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/95 shadow-xl backdrop-blur md:h-28 md:w-28">
      <span className="font-heading text-3xl font-extrabold text-[#C026A3] md:text-5xl tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <span className="mt-2 font-body text-xs font-medium uppercase tracking-widest text-white/90 md:text-sm">
      {label}
    </span>
  </div>
);

const Index = () => {
  const { days, hours, minutes, seconds } = useCountdown(PARTY_DATE);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FF5DA2] via-[#A14BE0] to-[#4D96FF] font-body text-white">
      <Confetti />

      {/* Garland */}
      <div className="relative z-10 flex justify-center gap-2 pt-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="h-4 w-4 rounded-full animate-wiggle"
            style={{
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              animationDelay: `${(i % 6) * 0.15}s`,
              marginTop: i % 2 ? '10px' : '0',
            }}
          />
        ))}
      </div>

      {/* Hero */}
      <header className="relative z-10 px-6 pb-10 pt-12 text-center">
        <div className="pointer-events-none absolute left-4 top-0 hidden md:block">
          <Balloon color="#FFD93D" delay="0s" />
        </div>
        <div className="pointer-events-none absolute right-6 top-4 hidden md:block">
          <Balloon color="#6BCB77" delay="1.2s" />
        </div>

        <p className="animate-fade-in font-heading text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
          Ты приглашён на праздник
        </p>
        <h1
          className="animate-fade-in mt-4 font-display text-5xl leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)] md:text-8xl"
          style={{ animationDelay: '0.1s', opacity: 0 }}
        >
          День рождения
        </h1>
        <p
          className="animate-fade-in mt-4 font-heading text-2xl font-extrabold text-[#FFD93D] drop-shadow md:text-4xl"
          style={{ animationDelay: '0.2s', opacity: 0 }}
        >
          Анны
        </p>
        <p
          className="animate-fade-in mx-auto mt-5 max-w-md text-base text-white/90 md:text-lg"
          style={{ animationDelay: '0.3s', opacity: 0 }}
        >
          Будет весело, вкусно и незабываемо. Приходи и подари нам своё хорошее настроение! 🎈
        </p>
      </header>

      {/* Countdown */}
      <section className="relative z-10 px-6 pb-14">
        <h2 className="mb-6 text-center font-display text-2xl text-white md:text-3xl">
          До праздника осталось
        </h2>
        <div className="flex justify-center gap-3 md:gap-6">
          <TimeBox value={days} label="дней" />
          <TimeBox value={hours} label="часов" />
          <TimeBox value={minutes} label="минут" />
          <TimeBox value={seconds} label="секунд" />
        </div>
      </section>

      {/* Details */}
      <section className="relative z-10 px-6 pb-14">
        <div className="mx-auto grid max-w-3xl gap-5 md:grid-cols-2">
          <div className="animate-pop rounded-3xl bg-white/95 p-7 text-center shadow-xl" style={{ opacity: 0 }}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FF5DA2]/15">
              <Icon name="CalendarHeart" size={30} className="text-[#C026A3]" />
            </div>
            <h3 className="font-heading text-lg font-extrabold text-[#333]">Когда</h3>
            <p className="mt-2 font-body text-xl font-bold text-[#C026A3]">25 июля 2026</p>
            <p className="mt-1 text-sm text-[#666]">Суббота, начало в 18:00</p>
          </div>
          <div
            className="animate-pop rounded-3xl bg-white/95 p-7 text-center shadow-xl"
            style={{ opacity: 0, animationDelay: '0.15s' }}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#4D96FF]/15">
              <Icon name="MapPin" size={30} className="text-[#2563EB]" />
            </div>
            <h3 className="font-heading text-lg font-extrabold text-[#333]">Где</h3>
            <p className="mt-2 font-body text-xl font-bold text-[#2563EB]">Лофт «Небо»</p>
            <p className="mt-1 text-sm text-[#666]">ул. Праздничная, 7</p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="relative z-10 px-6 pb-20">
        <h2 className="mb-8 text-center font-display text-3xl text-white md:text-4xl">Галерея</h2>
        <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY.map((src, i) => (
            <div
              key={src}
              className="group overflow-hidden rounded-3xl shadow-2xl ring-4 ring-white/40 transition-transform duration-300 hover:-translate-y-2 hover:rotate-1"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <img
                src={src}
                alt={`Праздник ${i + 1}`}
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 pb-8 text-center font-body text-sm text-white/70">
        Ждём именно тебя! 💖
      </footer>
    </div>
  );
};

export default Index;
