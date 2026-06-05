import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const API = 'https://companero-virtual.onrender.com'
const PLANS = ['BASIC', 'PREMIUM', 'FAMILY']
const PLAN_LABELS = { BASIC: 'Básico — $149/mes', PREMIUM: 'Premium — $249/mes', FAMILY: 'Familiar — $399/mes' }

export default function SubscribePage() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    plan: params.get('plan') || 'PREMIUM',
    elderlyPhone: '',
    payerEmail: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const phone = form.elderlyPhone.replace(/\D/g, '')
      if (phone.length < 10) { setError('Ingresa un número de WhatsApp válido (10 dígitos)'); setLoading(false); return }
      if (!form.payerEmail.includes('@')) { setError('Ingresa un correo electrónico válido'); setLoading(false); return }

      const res = await fetch(`${API}/subscriptions/create-by-phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: `+52${phone}`, plan: form.plan, payerEmail: form.payerEmail }),
      })
      const data = await res.json()
      if (data.initPoint) {
        window.location.href = data.initPoint
      } else {
        setError(data.error === 'usuario_no_encontrado'
          ? 'Ese número aún no ha iniciado conversación con el bot. Pídele que envíe un mensaje primero.'
          : 'Ocurrió un error. Intenta de nuevo.')
      }
    } catch {
      setError('Sin conexión. Verifica tu internet e intenta de nuevo.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center px-4 py-12">
      <button onClick={() => nav('/')} className="self-start mb-6 text-indigo-600 text-sm font-medium flex items-center gap-1">
        ← Regresar
      </button>

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🤝</div>
          <h1 className="text-2xl font-extrabold text-gray-900">Compañero Virtual</h1>
          <p className="text-gray-500 text-sm mt-1">7 días gratis · Sin tarjeta de crédito</p>
        </div>

        {/* Paso 1: Elige plan */}
        {step === 1 && (
          <>
            <h2 className="font-bold text-gray-800 mb-3">Elige tu plan</h2>
            <div className="space-y-3 mb-6">
              {PLANS.map(p => (
                <label key={p} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition
                  ${form.plan === p ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}>
                  <input type="radio" name="plan" value={p} checked={form.plan === p} onChange={e => set('plan', e.target.value)} className="accent-indigo-600" />
                  <span className="text-sm font-medium text-gray-800">{PLAN_LABELS[p]}</span>
                </label>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition">
              Continuar →
            </button>
          </>
        )}

        {/* Paso 2: Datos */}
        {step === 2 && (
          <>
            <h2 className="font-bold text-gray-800 mb-1">Datos de registro</h2>
            <p className="text-gray-500 text-xs mb-4">Plan elegido: <span className="text-indigo-600 font-semibold">{PLAN_LABELS[form.plan]}</span></p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">WhatsApp del adulto mayor</label>
                <div className="flex">
                  <span className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl px-3 py-2 text-sm text-gray-500">+52</span>
                  <input
                    type="tel" placeholder="55 1234 5678" maxLength={10}
                    value={form.elderlyPhone} onChange={e => set('elderlyPhone', e.target.value.replace(/\D/g, ''))}
                    className="flex-1 border border-gray-300 rounded-r-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">El número que usa tu familiar en WhatsApp</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Tu correo electrónico</label>
                <input
                  type="email" placeholder="tuemail@ejemplo.com"
                  value={form.payerEmail} onChange={e => set('payerEmail', e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <p className="text-xs text-gray-400 mt-1">Para el recibo de pago</p>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}

            <button onClick={handleSubmit} disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><span className="animate-spin">⏳</span> Procesando…</> : 'Ir a pagar con Mercado Pago →'}
            </button>
            <button onClick={() => setStep(1)} className="w-full text-gray-400 text-sm mt-3 hover:text-gray-600">← Cambiar plan</button>

            <p className="text-xs text-gray-400 text-center mt-4">
              Al continuar aceptas nuestro{' '}
              <a href="/privacidad" className="text-indigo-600 underline">Aviso de Privacidad</a>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
