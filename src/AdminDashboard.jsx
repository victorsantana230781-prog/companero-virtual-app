import { useState, useEffect, useCallback } from "react";

// ── CONFIGURACIÓN ──────────────────────────────────────────────────────────
const API_URL  = "https://companero-virtual.onrender.com";
const API_KEY  = "companero-admin-2024";
const HEADERS  = { "Content-Type": "application/json", "x-api-key": API_KEY };

// ── HELPERS ────────────────────────────────────────────────────────────────
const apiFetch = (path, opts = {}) =>
  fetch(`${API_URL}${path}`, { headers: HEADERS, ...opts }).then(r => r.json());

const fmt = n => (n ?? 0).toLocaleString("es-MX");
const planColor = {
  BASIC:   "bg-gray-100 text-gray-700",
  PREMIUM: "bg-amber-100 text-amber-800",
  FAMILY:  "bg-purple-100 text-purple-800",
};
const statusColor = {
  ACTIVE:    "bg-green-100 text-green-800",
  TRIAL:     "bg-blue-100 text-blue-800",
  SUSPENDED: "bg-red-100 text-red-700",
  INACTIVE:  "bg-gray-100 text-gray-500",
};

// ── TARJETA DE MÉTRICA ─────────────────────────────────────────────────────
function MetricCard({ icon, label, value, sub, color = "text-gray-900" }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-1">
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-2xl font-semibold ${color}`}>{value}</div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

// ── BADGE ──────────────────────────────────────────────────────────────────
function Badge({ text, cls }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {text}
    </span>
  );
}

// ── MODAL DE PROMPT ────────────────────────────────────────────────────────
function PromptModal({ client, onClose, onSave }) {
  const [prompt, setPrompt] = useState(client.systemPrompt || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSave = async () => {
    if (prompt.trim().length < 20) { setMsg({ type: "error", text: "Mínimo 20 caracteres" }); return; }
    setSaving(true);
    try {
      const res = await apiFetch(`/admin/clients/${client.id}/prompt`, {
        method: "PUT",
        body: JSON.stringify({ systemPrompt: prompt }),
      });
      if (res.ok) { setMsg({ type: "ok", text: "✅ Prompt guardado" }); onSave(client.id, prompt); }
      else setMsg({ type: "error", text: res.error || "Error al guardar" });
    } catch { setMsg({ type: "error", text: "Error de conexión" }); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col gap-4 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Editor de Prompt IA</h3>
            <p className="text-sm text-gray-500">{client.name || client.phoneNumber}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
          💡 Este prompt reemplaza la personalidad del bot solo para este usuario.
          Si lo dejas vacío, usará el prompt global por defecto.
        </div>

        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Eres 'Compañero Virtual', un asistente cálido para adultos mayores..."
          rows={10}
          className="w-full border border-gray-200 rounded-xl p-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-orange-300"
        />

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">{prompt.length} caracteres</span>
          {msg && (
            <span className={`text-sm ${msg.type === "ok" ? "text-green-600" : "text-red-500"}`}>
              {msg.text}
            </span>
          )}
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar Prompt"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD PRINCIPAL ────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats,      setStats]      = useState(null);
  const [clients,    setClients]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [twilio,     setTwilio]     = useState(null);
  const [promptFor,  setPromptFor]  = useState(null);
  const [search,     setSearch]     = useState("");
  const [actionMsg,  setActionMsg]  = useState(null);
  const [tab,        setTab]        = useState("overview");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([
        apiFetch("/admin/stats"),
        apiFetch("/admin/clients?limit=100"),
      ]);
      setStats(s);
      setClients(c.data ?? []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const checkTwilio = async () => {
    setTwilio({ checking: true });
    const res = await apiFetch("/admin/auth/status");
    setTwilio(res);
  };

  const updateClient = async (id, patch) => {
    const res = await apiFetch(`/admin/clients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    if (!res.error) {
      setClients(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
      setActionMsg("✅ Cliente actualizado");
      setTimeout(() => setActionMsg(null), 3000);
    }
  };

  const filtered = clients.filter(c =>
    !search || c.phoneNumber?.includes(search) || c.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">🤖</div>
          <p className="text-gray-500 text-sm">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── TOPBAR ── */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white text-sm font-bold">CV</div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">Compañero Virtual</h1>
            <p className="text-xs text-gray-400">Super Admin · {new Date().toLocaleDateString("es-MX")}</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {actionMsg && <span className="text-sm text-green-600 mr-2">{actionMsg}</span>}
          <button onClick={checkTwilio} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-1">
            📡 Verificar Twilio
          </button>
          <button onClick={load} className="px-3 py-1.5 text-xs rounded-lg bg-orange-500 text-white hover:bg-orange-600">
            ↻ Actualizar
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">

        {/* ── TWILIO STATUS BANNER ── */}
        {twilio && !twilio.checking && (
          <div className={`mb-4 rounded-xl p-3 flex items-center gap-3 text-sm ${twilio.valid ? "bg-green-50 text-green-800 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
            <span className="text-lg">{twilio.valid ? "✅" : "⚠️"}</span>
            <div>
              {twilio.valid
                ? `Twilio OK — Cuenta: "${twilio.accountName}" (${twilio.accountStatus})`
                : `Twilio ERROR — ${twilio.reason}`}
              <span className="text-xs ml-2 opacity-60">{twilio.checkedAt}</span>
            </div>
            <button onClick={() => setTwilio(null)} className="ml-auto opacity-50 hover:opacity-80">✕</button>
          </div>
        )}
        {twilio?.checking && (
          <div className="mb-4 rounded-xl p-3 bg-blue-50 text-blue-700 text-sm border border-blue-100">
            Verificando credenciales de Twilio...
          </div>
        )}

        {/* ── TABS ── */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 w-fit shadow-sm border border-gray-100">
          {[["overview","📊 Resumen"], ["clients","👥 Clientes"], ["prompts","🧠 Prompts IA"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ════════════════════ TAB: OVERVIEW ════════════════════ */}
        {tab === "overview" && stats && (
          <div className="flex flex-col gap-6">
            {/* Métricas principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard icon="👥" label="Usuarios totales"   value={fmt(stats.users?.total)}   sub={`${fmt(stats.users?.activeToday)} activos hoy`} />
              <MetricCard icon="✅" label="Suscritos activos"  value={fmt(stats.users?.active)}  sub={`${fmt(stats.users?.trial)} en trial`} color="text-green-600" />
              <MetricCard icon="🪙" label="Tokens hoy"         value={fmt(stats.tokens?.today)}  sub={`Total: ${fmt(stats.tokens?.allTime)}`} color="text-amber-600" />
              <MetricCard icon="💬" label="Mensajes hoy"       value={fmt(stats.messages?.today)} sub={`Total: ${fmt(stats.messages?.allTime)}`} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard icon="⏰" label="Recordatorios pendientes" value={fmt(stats.reminders?.pending)} />
              <MetricCard icon="💰" label="Ingresos totales"  value={`$${fmt(stats.revenue?.total)} MXN`} color="text-green-700" />
              <MetricCard icon="⛔" label="Suspendidos"        value={fmt(stats.users?.suspended)} color="text-red-500" />
              <MetricCard icon="📅" label="Generado"           value={new Date(stats.generatedAt).toLocaleTimeString("es-MX")} />
            </div>

            {/* Desglose de planes */}
            {stats.plans && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Distribución de planes</h3>
                <div className="flex gap-6 flex-wrap">
                  {Object.entries(stats.plans).map(([plan, count]) => (
                    <div key={plan} className="flex flex-col items-center gap-1">
                      <div className="text-2xl font-semibold text-gray-900">{count}</div>
                      <Badge text={plan} cls={planColor[plan] ?? "bg-gray-100 text-gray-600"} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════ TAB: CLIENTES ════════════════════ */}
        {tab === "clients" && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nombre o teléfono..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
              <span className="text-sm text-gray-400">{filtered.length} clientes</span>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-400 font-medium uppercase tracking-wide">
                    <th className="text-left px-5 py-3">Cliente</th>
                    <th className="text-left px-4 py-3">Plan</th>
                    <th className="text-left px-4 py-3">Estado</th>
                    <th className="text-right px-4 py-3">Tokens hoy</th>
                    <th className="text-right px-4 py-3">Mensajes</th>
                    <th className="text-left px-4 py-3">Último acceso</th>
                    <th className="text-right px-5 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="font-medium text-gray-900">{c.name || "Sin nombre"}</div>
                        <div className="text-xs text-gray-400">{c.phoneNumber}</div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={c.subscriptionPlan}
                          onChange={e => updateClient(c.id, { plan: e.target.value })}
                          className="text-xs border-0 bg-transparent cursor-pointer focus:outline-none"
                        >
                          <option value="BASIC">BASIC</option>
                          <option value="PREMIUM">PREMIUM</option>
                          <option value="FAMILY">FAMILY</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <Badge text={c.subscriptionStatus} cls={statusColor[c.subscriptionStatus] ?? "bg-gray-100 text-gray-600"} />
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-gray-500">
                        {fmt(c.tokenMetrics?.[0]?.tokensConsumed ?? 0)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-gray-500">
                        {fmt(c._count?.conversations ?? 0)}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {c.lastSeenAt ? new Date(c.lastSeenAt).toLocaleDateString("es-MX") : "—"}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex gap-1 justify-end">
                          {c.subscriptionStatus === "SUSPENDED" ? (
                            <button
                              onClick={() => updateClient(c.id, { status: "ACTIVE" })}
                              className="px-2.5 py-1 text-xs rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                            >
                              Activar
                            </button>
                          ) : (
                            <button
                              onClick={() => updateClient(c.id, { status: "SUSPENDED" })}
                              className="px-2.5 py-1 text-xs rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                            >
                              Suspender
                            </button>
                          )}
                          <button
                            onClick={() => { setPromptFor(c); setTab("prompts"); }}
                            className="px-2.5 py-1 text-xs rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200"
                          >
                            Prompt
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-400">No se encontraron clientes</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════════════════════ TAB: PROMPTS ════════════════════ */}
        {tab === "prompts" && (
          <div className="flex flex-col gap-4">
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
              🧠 Aquí puedes cambiar la personalidad y comportamiento del bot para cada cliente.
              Si un cliente no tiene prompt personalizado, usará el prompt global por defecto.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map(c => (
                <div key={c.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{c.name || "Sin nombre"}</div>
                      <div className="text-xs text-gray-400">{c.phoneNumber}</div>
                    </div>
                    <Badge text={c.subscriptionPlan} cls={planColor[c.subscriptionPlan] ?? ""} />
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2.5 min-h-[60px] font-mono leading-relaxed">
                    {c.systemPrompt
                      ? c.systemPrompt.slice(0, 120) + (c.systemPrompt.length > 120 ? "..." : "")
                      : <span className="text-gray-300 italic">Usando prompt global por defecto</span>
                    }
                  </div>
                  {c.systemPromptUpdatedAt && (
                    <div className="text-xs text-gray-400">
                      Actualizado: {new Date(c.systemPromptUpdatedAt).toLocaleDateString("es-MX")}
                    </div>
                  )}
                  <button
                    onClick={() => setPromptFor(c)}
                    className="w-full py-2 rounded-lg bg-orange-500 text-white text-xs font-medium hover:bg-orange-600 transition-colors"
                  >
                    ✏️ Editar Prompt
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── MODAL DE PROMPT ── */}
      {promptFor && (
        <PromptModal
          client={promptFor}
          onClose={() => setPromptFor(null)}
          onSave={(id, newPrompt) => {
            setClients(prev => prev.map(c => c.id === id ? { ...c, systemPrompt: newPrompt, systemPromptUpdatedAt: new Date().toISOString() } : c));
            setPromptFor(null);
          }}
        />
      )}
    </div>
  );
}
