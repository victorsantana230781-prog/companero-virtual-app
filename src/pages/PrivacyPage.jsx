import { useNavigate } from 'react-router-dom'

export default function PrivacyPage() {
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => nav(-1)} className="text-indigo-600 font-medium text-sm">← Regresar</button>
        <span className="font-bold text-gray-800">Aviso de Privacidad</span>
      </header>
      <div className="max-w-2xl mx-auto px-6 py-10">
        <iframe
          src="https://companero-virtual.onrender.com/privacidad"
          title="Aviso de Privacidad"
          className="w-full border-0 rounded-2xl shadow"
          style={{ height: '80vh' }}
        />
      </div>
    </div>
  )
}
