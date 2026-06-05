import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'https://companero-virtual.onrender.com'

function timeAgo(dateStr) {
  if (!dateStr) return 'Nunca'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Hace un momento'
  if (mins < 60) return `Hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `Hace ${hrs} hora${hrs > 1 ? 's' : ''}`
  const days = Math.floor(hrs / 24)
  return `Hace ${days} día${days > 1 ? 's' : ''}`
}

function StatusBadge({ lastSeen }) {
  if (!lastSeen) return <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">Sin actividad</span>
  const hrs = (Date.now() - new Date(lastSeen).getTime()) / 3600000
  if (hrs < 4) return <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">● Activo hoy</span>
  if (hrs < 24) return <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">● Activo hoy</span>
  if (hrs < 48) return <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">⚠ Sin escribir 1 día</span>
  return <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">🔴 Sin escribir +48h</span>
}

export default function FamilyDashboard() {
  const nav = useNavigate()
  const session = JSON.parse(localStorage.getItem('cv_family_token') || '{}')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session.phone) { nav('/login'); return }
    fetch(`${API}/api/user/${encodeURIComponent(session.phone)}`)
      .then(r => r.json())
      .then(data => { setUser(data); setLoading(false) })
      .catch(() => { setError('No se pudo cargar la información'); setLoading(false) })
  }, [])

  const logout = () => { localStorage.removeItem('cv_family_token'); nav('/login') }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <div className="text-indigo-600 text-lg animate-pulse">Cargando…</div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
      <p className="text-red-500">{error}</p>
      <button onClick={logout} className="text-indigo-600 underline text-sm">Salir</button>
    </div>
  )

  const planColor = { BASIC: 'bg-blue-100 text-blue-700', PREMIUM: 'bg-indigo-100 text-indigo-700', FAMILY: 'bg-violet-100 text-violet-700' }
  const statusColor = { ACTIVE: 'bg-green-100 text-green-700', TRIAL: 'bg-yellow-100 text-yellow-700', INACTIVE: 'bg-gray-100 text-gray-500', SUSPENDED: 'bg-red-100 text-red-700' }
  const statusLabel = { ACTIVE: 'Activo', TRIAL: 'Prueba gratuita', INACTIVE: 'Inactivo', SUSPENDED: 'Suspendido' }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤝</span>
          <span className="font-bold text-gray-800 text-sm">Compañero Virtual</span>
        </div>
        <button onClick={logout} className="text-xs text-gray-400 hover:text-red-500">Salir</button>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Tarjeta principal */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{user?.name || 'Tu familiar'}</h2>
              <p className="text-gray-400 text-xs">{user?.phoneNumber}</p>
            </div>
            <StatusBadge lastSeen={user?.lastSeenAt} />
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${planColor[user?.subscriptionPlan] || 'bg-gray-100 text-gray-500'}`}>
              Plan {user?.subscriptionPlan}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[user?.subscriptionStatus] || 'bg-gray-100 text-gray-500'}`}>
              {statusLabel[user?.subscriptionStatus] || user?.subscriptionStatus}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-3">Último mensaje: {timeAgo(user?.lastSeenAt)}</p>
        </div>

        {/* Alerta si está inactivo */}
        {user?.lastSeenAt && (Date.now() - new Date(user.lastSeenAt).getTime()) > 86400000 && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-orange-800 text-sm">Tu familiar lleva más de 24 horas sin escribir</p>
              <p className="text-orange-600 text-xs mt-0.5">Ya le enviamos una alerta automática. Considera comunicarte directamente.</p>
            </div>
          </div>
        )}

        {/* Suscripción */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3 text-sm">Suscripción</h3>
          {user?.subscriptionStatus === 'TRIAL' && user?.trialEndsAt && (
            <div className="bg-yellow-50 rounded-xl p-3 mb-3">
              <p className="text-yellow-800 text-xs font-medium">
                Prueba gratuita activa · Vence el {new Date(user.trialEndsAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}
              </p>
            </div>
          )}
          {(user?.subscriptionStatus === 'INACTIVE' || user?.subscriptionStatus === 'SUSPENDED') && (
            <button onClick={() => nav('/suscribirse')}
              className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-indigo-700 transition">
              Renovar suscripción
            </button>
          )}
          {user?.subscriptionStatus === 'ACTIVE' && (
            <p className="text-green-600 text-sm font-medium">✓ Suscripción activa — renovación automática mensual</p>
          )}
        </div>

        {/* Info del plan */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3 text-sm">¿Qué incluye tu plan?</h3>
          <ul className="space-y-1.5">
            {[
              '✓ Conversación ilimitada por WhatsApp',
              '✓ Recordatorios de medicamentos',
              '✓ Alertas de inactividad automáticas',
              user?.subscriptionPlan !== 'BASIC' && '✓ Mensajes de voz y análisis de imágenes',
              user?.subscriptionPlan === 'FAMILY' && '✓ Hasta 3 adultos mayores',
            ].filter(Boolean).map(f => (
              <li key={f} className="text-sm text-gray-600">{f}</li>
            ))}
          </ul>
          {user?.subscriptionPlan === 'BASIC' && (
            <button onClick={() => nav('/suscribirse?plan=PREMIUM')}
              className="mt-3 text-indigo-600 text-xs font-semibold hover:underline">
              Actualizar a Premium →
            </button>
          )}
        </div>

        {/* Acceso rápido */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3 text-sm">Acceso rápido</h3>
          <a href={`https://wa.me/${user?.phoneNumber?.replace('+', '')}`} target="_blank" rel="noreferrer"
            className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition">
            <span className="text-2xl">💬</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">Abrir WhatsApp</p>
              <p className="text-xs text-gray-400">Escribirle directamente a tu familiar</p>
            </div>
          </a>
        </div>

      </div>
    </div>
  )
}
