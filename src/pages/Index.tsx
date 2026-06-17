import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const PARTY_DATE = new Date('2026-07-25T18:00:00');

const GALLERY = [
  'https://cdn.poehali.dev/projects/a8a0c233-7f88-4be8-aee5-87dd4f629653/files/1afe8ec7-6fcb-4549-8c8e-17ce1272d3ff.jpg',
  'https://cdn.poehali.dev/projects/a8a0c233-7f88-4be8-aee5-87dd4f629653/files/c442ae9c-02cf-49ac-aaa5-78258e4d2dba.jpg',
  'https://cdn.poehali.dev/projects/a8a0c233-7f88-4be8-aee5-87dd4f629653/files/6313307b-9f19-4fb6-b6ad-d14f53fbdf2d.jpg',
];

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

const Ornament = () => (
  <div className="flex items-center justify-center gap-4 text-[#B08D57]">
    <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#B08D57]/70" />
    <Icon name="Sparkle" size={16} />
    <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#B08D57]/70" />
  </div>
);

const TimeBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <span className="font-display text-4xl font-semibold text-[#3A2A28] tabular-nums md:text-6xl">
      {String(value).padStart(2, '0')}
    </span>
    <span className="mt-1 font-body text-[10px] font-light uppercase tracking-[0.3em] text-[#9A8478] md:text-xs">
      {label}
    </span>
  </div>
);

const Divider = () => <span className="font-display text-3xl font-light text-[#C9B79C] md:text-5xl">:</span>;

const Index = () => {
  const { days, hours, minutes, seconds } = useCountdown(PARTY_DATE);

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-body text-[#3A2A28]">
      {/* Hero */}
      <header className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div className="pointer-events-none absolute inset-4 border border-[#D8C9B0] md:inset-8" />

        <p
          className="animate-fade-in font-body text-xs font-light uppercase tracking-[0.45em] text-[#9A8478]"
          style={{ opacity: 0 }}
        >
          Приглашение
        </p>

        <h1
          className="animate-fade-in mt-8 font-heading text-6xl font-medium italic leading-none text-[#3A2A28] md:text-8xl"
          style={{ animationDelay: '0.1s', opacity: 0 }}
        >
          День рождения
        </h1>

        <div className="animate-fade-in mt-8" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <Ornament />
        </div>

        <p
          className="animate-fade-in mt-8 font-display text-3xl font-semibold tracking-wide text-[#B08D57] md:text-4xl"
          style={{ animationDelay: '0.3s', opacity: 0 }}
        >
          Анны
        </p>

        <p
          className="animate-fade-in mt-6 max-w-md font-body text-sm font-light leading-relaxed text-[#6B5A52] md:text-base"
          style={{ animationDelay: '0.4s', opacity: 0 }}
        >
          С большой радостью приглашаю вас разделить со мной этот особенный вечер
        </p>

        <div
          className="animate-fade-in absolute bottom-12 flex flex-col items-center gap-2 text-[#9A8478]"
          style={{ animationDelay: '0.6s', opacity: 0 }}
        >
          <span className="font-body text-[10px] uppercase tracking-[0.3em]">Листайте</span>
          <Icon name="ChevronDown" size={18} />
        </div>
      </header>

      {/* Countdown */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-body text-xs font-light uppercase tracking-[0.4em] text-[#9A8478]">
            До торжества осталось
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 md:gap-8">
            <TimeBox value={days} label="дней" />
            <Divider />
            <TimeBox value={hours} label="часов" />
            <Divider />
            <TimeBox value={minutes} label="минут" />
            <Divider />
            <TimeBox value={seconds} label="секунд" />
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="bg-[#EFE7DA] px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-14 flex justify-center">
            <Ornament />
          </div>
          <div className="grid gap-12 text-center md:grid-cols-2 md:gap-8">
            <div>
              <Icon name="Calendar" size={26} className="mx-auto text-[#B08D57]" />
              <h3 className="mt-5 font-body text-xs font-light uppercase tracking-[0.35em] text-[#9A8478]">
                Когда
              </h3>
              <p className="mt-3 font-heading text-3xl font-medium italic text-[#3A2A28]">25 июля 2026</p>
              <p className="mt-1 font-body text-sm font-light text-[#6B5A52]">Суббота · 18:00</p>
            </div>
            <div>
              <Icon name="MapPin" size={26} className="mx-auto text-[#B08D57]" />
              <h3 className="mt-5 font-body text-xs font-light uppercase tracking-[0.35em] text-[#9A8478]">
                Где
              </h3>
              <p className="mt-3 font-heading text-3xl font-medium italic text-[#3A2A28]">Лофт «Небо»</p>
              <p className="mt-1 font-body text-sm font-light text-[#6B5A52]">ул. Праздничная, 7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-heading text-5xl font-medium italic text-[#3A2A28] md:text-6xl">
            Моменты
          </h2>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY.map((src, i) => (
              <div
                key={src}
                className="group overflow-hidden border border-[#D8C9B0] p-2 transition-all duration-500 hover:border-[#B08D57]"
              >
                <div className="overflow-hidden">
                  <img
                    src={src}
                    alt={`Момент ${i + 1}`}
                    className="aspect-[4/5] w-full object-cover grayscale-[15%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#3A2A28] px-6 py-16 text-center text-[#E9DFCF]">
        <p className="font-heading text-2xl font-medium italic md:text-3xl">Буду счастлива видеть вас</p>
        <div className="mt-6 flex justify-center text-[#B08D57]">
          <Icon name="Heart" size={18} />
        </div>
      </footer>
    </div>
  );
};

export default Index;
