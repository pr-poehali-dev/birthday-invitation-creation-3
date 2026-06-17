import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const RSVP_URL = 'https://functions.poehali.dev/717d0bba-7a12-452a-b846-f6527b690dc0';

const PARTY_DATE = new Date('2026-06-21T14:00:00');

const GALLERY = [
  'https://cdn.poehali.dev/projects/a8a0c233-7f88-4be8-aee5-87dd4f629653/bucket/c6c90d3f-a131-46a3-b696-dfa33221ccc0.jpg',
  'https://cdn.poehali.dev/projects/a8a0c233-7f88-4be8-aee5-87dd4f629653/bucket/40c913af-50b9-411a-a255-5e46226e07e4.jpg',
  'https://cdn.poehali.dev/projects/a8a0c233-7f88-4be8-aee5-87dd4f629653/bucket/ff87e077-5994-48dc-9e4f-e834c1946271.jpg',
  'https://cdn.poehali.dev/projects/a8a0c233-7f88-4be8-aee5-87dd4f629653/bucket/1dc78ed1-6ae6-47c5-9412-ebbd0480007c.jpg',
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

const RsvpForm = () => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'attending' | 'not_attending' | null>(null);
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!name.trim() || !status) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(RSVP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), status, guests_count: guests }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError('Не удалось отправить. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="mt-10 flex flex-col items-center gap-4 text-[#3A2A28]">
        <Icon name="CheckCircle" size={40} className="text-[#B08D57]" />
        <p className="font-heading text-2xl italic">
          {status === 'attending' ? 'Ждём вас с нетерпением!' : 'Жаль, что не получится'}
        </p>
        <p className="font-body text-sm font-light text-[#6B5A52]">Ответ сохранён, спасибо!</p>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-6 text-left">
      <div>
        <label className="font-body text-xs font-light uppercase tracking-[0.3em] text-[#9A8478]">Ваше имя</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Имя и фамилия"
          className="mt-2 w-full border-b border-[#C9B79C] bg-transparent py-2 font-body text-base text-[#3A2A28] outline-none placeholder:text-[#C9B79C] focus:border-[#B08D57] transition-colors"
        />
      </div>

      <div>
        <label className="font-body text-xs font-light uppercase tracking-[0.3em] text-[#9A8478]">Вы придёте?</label>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {(['attending', 'not_attending'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`border py-3 font-body text-sm font-light uppercase tracking-widest transition-all duration-300 ${
                status === s
                  ? 'border-[#B08D57] bg-[#B08D57] text-white'
                  : 'border-[#C9B79C] text-[#6B5A52] hover:border-[#B08D57]'
              }`}
            >
              {s === 'attending' ? 'Приду' : 'Не смогу'}
            </button>
          ))}
        </div>
      </div>

      {status === 'attending' && (
        <div>
          <label className="font-body text-xs font-light uppercase tracking-[0.3em] text-[#9A8478]">Количество гостей</label>
          <div className="mt-3 flex items-center gap-4">
            <button
              onClick={() => setGuests(g => Math.max(1, g - 1))}
              className="flex h-9 w-9 items-center justify-center border border-[#C9B79C] text-[#6B5A52] hover:border-[#B08D57] transition-colors"
            >
              <Icon name="Minus" size={14} />
            </button>
            <span className="font-display text-2xl font-semibold text-[#3A2A28] w-6 text-center">{guests}</span>
            <button
              onClick={() => setGuests(g => Math.min(10, g + 1))}
              className="flex h-9 w-9 items-center justify-center border border-[#C9B79C] text-[#6B5A52] hover:border-[#B08D57] transition-colors"
            >
              <Icon name="Plus" size={14} />
            </button>
          </div>
        </div>
      )}

      {error && <p className="font-body text-sm text-red-500">{error}</p>}

      <button
        onClick={submit}
        disabled={!name.trim() || !status || loading}
        className="w-full bg-[#3A2A28] py-4 font-body text-xs font-light uppercase tracking-[0.35em] text-[#E9DFCF] transition-all duration-300 hover:bg-[#B08D57] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Отправляю...' : 'Отправить ответ'}
      </button>
    </div>
  );
};

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
          Лусине
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
          <div className="grid gap-12 text-center md:grid-cols-3 md:gap-8">
            <div>
              <Icon name="Calendar" size={26} className="mx-auto text-[#B08D57]" />
              <h3 className="mt-5 font-body text-xs font-light uppercase tracking-[0.35em] text-[#9A8478]">
                Дата
              </h3>
              <p className="mt-3 font-heading text-3xl font-medium italic text-[#3A2A28]">21 июня 2026</p>
              <p className="mt-1 font-body text-sm font-light text-[#6B5A52]">Воскресенье</p>
            </div>
            <div>
              <Icon name="Clock" size={26} className="mx-auto text-[#B08D57]" />
              <h3 className="mt-5 font-body text-xs font-light uppercase tracking-[0.35em] text-[#9A8478]">
                Время
              </h3>
              <p className="mt-3 font-display text-6xl font-semibold text-[#B08D57]">14:00</p>
            </div>
            <div>
              <Icon name="MapPin" size={26} className="mx-auto text-[#B08D57]" />
              <h3 className="mt-5 font-body text-xs font-light uppercase tracking-[0.35em] text-[#9A8478]">
                Место
              </h3>
              <p className="mt-3 font-heading text-3xl font-medium italic text-[#3A2A28]">Своя Компания</p>
              <p className="mt-1 font-body text-sm font-light text-[#6B5A52]">ул. Мира, 11</p>
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
          <div className="mt-14 space-y-6">
            {/* Детская фото по центру */}
            <div className="flex justify-center">
              <div className="group w-full max-w-sm overflow-hidden border border-[#D8C9B0] p-2 transition-all duration-500 hover:border-[#B08D57]">
                <div className="overflow-hidden">
                  <img
                    src={GALLERY[0]}
                    alt="Момент 1"
                    className="aspect-[4/5] w-full object-cover grayscale-[15%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>
              </div>
            </div>
            {/* Остальные три */}
            <div className="grid gap-6 sm:grid-cols-3">
              {GALLERY.slice(1).map((src, i) => (
                <div
                  key={src}
                  className="group overflow-hidden border border-[#D8C9B0] p-2 transition-all duration-500 hover:border-[#B08D57]"
                >
                  <div className="overflow-hidden">
                    <img
                      src={src}
                      alt={`Момент ${i + 2}`}
                      className="aspect-[4/5] w-full object-cover grayscale-[15%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section className="bg-[#EFE7DA] px-6 py-24">
        <div className="mx-auto max-w-lg text-center">
          <p className="font-body text-xs font-light uppercase tracking-[0.4em] text-[#9A8478]">Подтверждение</p>
          <h2 className="mt-4 font-heading text-4xl font-medium italic text-[#3A2A28] md:text-5xl">Придёте?</h2>
          <div className="mt-3 flex justify-center"><Ornament /></div>
          <RsvpForm />
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