'use client';

import * as React from 'react';

export function DebugPanel({ user }: { user: any }) {
  const [serverSession, setServerSession] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/session');
      const json = await res.json();
      setServerSession(json.session ?? null);
    } catch (err) {
      console.error('fetch /api/session error', err);
      setServerSession(null);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSession();
  }, []);

  return (
    <div style={{ position: 'fixed', right: 12, bottom: 12, zIndex: 100, pointerEvents: 'auto' }}>
      <div style={{ background: 'rgba(0,0,0,0.7)', color: 'white', padding: 12, borderRadius: 8, fontSize: 12, maxWidth: 360 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>DEV DEBUG PANEL</div>
        <div><strong>Client user:</strong> {user ? (user.email ?? user.uid) : 'null'}</div>
        <div><strong>Client UID:</strong> {user ? user.uid : '-'}</div>
        <div><strong>Client cookie (document.cookie):</strong> {typeof window !== 'undefined' ? (document.cookie || '(empty)') : 'n/a'}</div>
        <div style={{ marginTop: 6 }}><strong>Server session:</strong> {loading ? 'checking...' : (serverSession ? (serverSession.email ?? serverSession.uid) : 'missing')}</div>
        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => location.reload()} style={{ padding: '6px 8px' }}>Reload</button>
          <button type="button" onClick={() => (location.href = '/')} style={{ padding: '6px 8px' }}>Go /</button>
          <button type="button" onClick={fetchSession} style={{ padding: '6px 8px' }}>Check session</button>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: '#ddd' }}>
          Nota: cookies httpOnly não aparecem em document.cookie. Use "Check session" para verificar se o servidor recebeu a sessão.
        </div>
        <div style={{ marginTop: 6, fontSize: 11, color: '#ddd' }}>
          Para habilitar este painel automaticamente no dev: execute no Console
          <div style={{ marginTop: 4 }}><code>localStorage.setItem('conecta:dev','1')</code> e recarregue a página.</div>
        </div>
      </div>
    </div>
  );
}
