import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'https://companero-virtual.onrender.com'

export default function LoginPage({ admin = false }) {
  const nav = useNavigate()
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      if (admin) {
        const res = await fetch(`${API}/admin/stats`, { headers: { 'x-api-key': value } })
        if (res.ok) {
          localStorage.setItem('cv_admin_key', value)
          nav('/admin')
        } else {
          setError('Clave incorrecta')
        }
      } else {
        const phone = value.replace(/\D/g, '')
        const res = await fetch(`${API}/api/user/+52${phone}`)
        if (res.ok) {
          const user = await res.json()
          localStorage.setItem('cv_family_token', JSON.stringify({ phone: `+52${phone}`, userId: user.id, name: user.name }))
          nav('/dashboard')
        } else {
          setError('Número no encontrado. Primero debes suscribirte.')
        }
      }
    } catch {
      setError('Sin conexión. Intenta de nuevo.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{admin ? '🔐' : '👨‍👩‍👧'}</div>
          <h1 className="text-xl font-extrabold text-gray-900">{admin ? 'Panel Admin' : 'Acceso Familiar'}</h1>
          <p className="text-gray-500 text-sm mt-1">{admin ? 'Ingresa tu clave de administrador' : 'Ingresa el número de WhatsApp del adulto mayor'}</p>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 block mb-1">{admin ? 'Clave API' : 'Número de WhatsApp'}</label>
          <input
            type={admin ? 'password' : 'tel'}
            placeholder={admin ? '••••••••••••' : '55 1234 5678'}
            value={value} onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}

        <button onClick={handleLogin} disabled={loading}
          className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-60">
          {loading ? 'Verificando…' : 'Entrar'}
        </button>

        {!admin && (
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-xs">¿No tienes cuenta?</p>
            <button onClick={() => nav('/suscribirse')} className="text-indigo-600 text-sm font-semibold hover:underline">Suscríbete aquí</button>
          </div>
        )}

        <button onClick={() => nav('/')} className="w-full text-gray-400 text-xs mt-4 hover:text-gray-600">← Volver al inicio</button>
      </div>
    </div>
  )
}
