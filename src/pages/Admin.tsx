import { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';

const RSVP_URL = 'https://functions.poehali.dev/717d0bba-7a12-452a-b846-f6527b690dc0';

type Rsvp = {
  name: string;
  status: 'attending' | 'not_attending';
  guests_count: number;
  created_at: string;
};

const Admin = () => {
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [attendingCount, setAttendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'attending' | 'not_attending'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(RSVP_URL);
      const data = await res.json();
      setRsvps(data.rsvps);
      setAttendingCount(data.attending_count);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = rsvps.filter(r => filter === 'all' || r.status === filter);
  const notAttendingCount = rsvps.filter(r => r.status === 'not_attending').length;

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-body text-[#3A2A28]">
      {/* Header */}
      <header className="border-b border-[#D8C9B0] bg-white/60 px-6 py-6 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
            <p className="font-body text-xs font-light uppercase tracking-[0.35em] text-[#9A8478]">Панель</p>
            <h1 className="mt-1 font-heading text-3xl font-medium italic text-[#3A2A28]">Гости Лусине</h1>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-2 border border-[#C9B79C] px-4 py-2 font-body text-xs uppercase tracking-widest text-[#6B5A52] transition-all hover:border-[#B08D57] hover:text-[#B08D57]"
          >
            <Icon name="RefreshCw" size={13} />
            Обновить
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          {[
            { label: 'Всего ответов', value: rsvps.length, icon: 'Users' },
            { label: 'Придут', value: attendingCount, icon: 'CheckCircle', gold: true },
            { label: 'Не смогут', value: notAttendingCount, icon: 'XCircle' },
          ].map(s => (
            <div key={s.label} className={`border p-5 text-center ${s.gold ? 'border-[#B08D57] bg-[#B08D57]/8' : 'border-[#D8C9B0] bg-white/60'}`}>
              <Icon name={s.icon} fallback="Circle" size={22} className={`mx-auto ${s.gold ? 'text-[#B08D57]' : 'text-[#9A8478]'}`} />
              <p className={`mt-3 font-display text-4xl font-semibold ${s.gold ? 'text-[#B08D57]' : 'text-[#3A2A28]'}`}>{s.value}</p>
              <p className="mt-1 font-body text-[10px] font-light uppercase tracking-widest text-[#9A8478]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="mt-10 flex gap-2">
          {(['all', 'attending', 'not_attending'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`border px-4 py-2 font-body text-xs uppercase tracking-widest transition-all ${
                filter === f ? 'border-[#B08D57] bg-[#B08D57] text-white' : 'border-[#C9B79C] text-[#6B5A52] hover:border-[#B08D57]'
              }`}
            >
              {f === 'all' ? 'Все' : f === 'attending' ? 'Придут' : 'Не придут'}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="mt-6">
          {loading ? (
            <div className="py-20 text-center text-[#9A8478]">
              <Icon name="Loader" size={28} className="mx-auto animate-spin" />
              <p className="mt-4 font-body text-sm font-light">Загружаю...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Icon name="Inbox" size={28} className="mx-auto text-[#C9B79C]" />
              <p className="mt-4 font-body text-sm font-light text-[#9A8478]">Ответов пока нет</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E8DDD0] border border-[#D8C9B0] bg-white/60">
              {filtered.map((r, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                      r.status === 'attending' ? 'bg-[#B08D57]/15 text-[#B08D57]' : 'bg-[#9A8478]/10 text-[#9A8478]'
                    }`}>
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-body font-medium text-[#3A2A28]">{r.name}</p>
                      <p className="font-body text-xs font-light text-[#9A8478]">
                        {new Date(r.created_at).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {r.status === 'attending' && (
                      <span className="font-body text-xs font-light text-[#9A8478]">
                        {r.guests_count} {r.guests_count === 1 ? 'гость' : r.guests_count < 5 ? 'гостя' : 'гостей'}
                      </span>
                    )}
                    <span className={`flex items-center gap-1.5 font-body text-xs font-light uppercase tracking-wider ${
                      r.status === 'attending' ? 'text-[#B08D57]' : 'text-[#9A8478]'
                    }`}>
                      <Icon name={r.status === 'attending' ? 'Check' : 'X'} size={12} />
                      {r.status === 'attending' ? 'Придёт' : 'Не придёт'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;