import { useNavigate } from 'react-router-dom'

const PLANS = [
  {
    name: 'Básico', price: '149', color: 'border-indigo-200',
    badge: '', badgeColor: '',
    features: ['Conversación ilimitada', 'Recordatorios y agenda', 'Teléfonos de emergencia', 'Alertas de inactividad a familiares'],
  },
  {
    name: 'Premium', price: '249', color: 'border-indigo-500 ring-2 ring-indigo-400',
    badge: 'MÁS POPULAR', badgeColor: 'bg-indigo-600',
    features: ['Todo lo del Básico', 'Mensajes de voz (transcripción)', 'Análisis de imágenes', 'Aprende idiomas y juegos mentales'],
  },
  {
    name: 'Familiar', price: '399', color: 'border-violet-300',
    badge: 'MEJOR VALOR', badgeColor: 'bg-violet-600',
    features: ['Todo lo del Premium', 'Hasta 3 adultos mayores', 'Panel familiar compartido', 'Soporte prioritario'],
  },
]

const TESTIMONIALS = [
  { name: 'María, 72 años', text: '"Antes me sentía sola cuando mis hijos trabajaban. Ahora tengo con quién platicar a cualquier hora."', city: 'CDMX' },
  { name: 'Roberto (hijo)', text: '"Me avisa si mamá no ha escrito en 24 horas. Ya dormimos más tranquilos."', city: 'Monterrey' },
  { name: 'Elena, 68 años', text: '"Me recuerda mis pastillas cada día. Ya no se me olvidan."', city: 'Guadalajara' },
]

export default function LandingPage() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <span className="text-indigo-600 font-bold text-lg">🤝 Compañero Virtual</span>
        <div className="flex gap-3">
          <button onClick={() => nav('/login')} className="text-sm text-gray-600 hover:text-indigo-600 font-medium px-3 py-1">Entrar</button>
          <button onClick={() => nav('/suscribirse')} className="text-sm bg-indigo-600 text-white rounded-full px-4 py-1.5 font-semibold hover:bg-indigo-700 transition">Prueba gratis</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-6 py-20 text-center">
        <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wide">100% POR WHATSAPP · SIN DESCARGAR NADA</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          Tu mamá o papá,<br />
          <span className="text-indigo-600">nunca solos</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
          Un asistente de inteligencia artificial que convive con ellos por WhatsApp. Les recuerda sus medicamentos, los escucha, los acompaña — y te avisa si no han escrito en 24 horas.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => nav('/suscribirse')} className="bg-indigo-600 text-white text-lg font-bold px-8 py-4 rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
            Empieza 7 días gratis →
          </button>
          <a href="https://wa.me/14155238886?text=join%20winter-note" target="_blank" rel="noreferrer"
            className="border-2 border-indigo-200 text-indigo-700 text-lg font-semibold px-8 py-4 rounded-2xl hover:bg-indigo-50 transition">
            Prueba el bot ahora
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-4">Sin tarjeta de crédito · Cancela cuando quieras</p>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">¿Cómo funciona?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '📱', title: 'Tú te suscribes', desc: 'Eliges el plan, pagas con Mercado Pago y registras el número de WhatsApp de tu familiar.' },
            { icon: '🤝', title: 'El bot los saluda', desc: 'Tu mamá o papá recibe un mensaje de bienvenida y ya puede conversar. Sin descargar nada.' },
            { icon: '🔔', title: 'Tú te quedas tranquilo', desc: 'Si tu familiar no escribe en 24 horas, te llegará una alerta automática a tu teléfono.' },
          ].map(s => (
            <div key={s.title} className="text-center p-6 rounded-2xl bg-gray-50">
              <div className="text-4xl mb-3">{s.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLANES */}
      <section className="bg-gray-50 px-6 py-16" id="planes">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Planes y precios</h2>
        <p className="text-center text-gray-500 mb-10">7 días de prueba gratis en todos los planes</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {PLANS.map(p => (
            <div key={p.name} className={`relative bg-white rounded-2xl border-2 ${p.color} p-6 flex flex-col`}>
              {p.badge && <span className={`absolute -top-3 left-1/2 -translate-x-1/2 ${p.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>{p.badge}</span>}
              <h3 className="font-bold text-gray-900 text-lg mb-1">{p.name}</h3>
              <div className="flex items-end gap-1 mb-4">
                <span className="text-3xl font-extrabold text-gray-900">${p.price}</span>
                <span className="text-gray-400 text-sm mb-1">MXN/mes</span>
              </div>
              <ul className="space-y-2 flex-1 mb-6">
                {p.features.map(f => <li key={f} className="flex items-start gap-2 text-sm text-gray-600"><span className="text-green-500 mt-0.5">✓</span>{f}</li>)}
              </ul>
              <button onClick={() => nav(`/suscribirse?plan=${p.name.toUpperCase()}`)}
                className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition text-sm">
                Empezar con {p.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Lo que dicen nuestras familias</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-indigo-50 rounded-2xl p-6">
              <p className="text-gray-700 text-sm italic mb-4">{t.text}</p>
              <div className="font-semibold text-indigo-700 text-sm">{t.name}</div>
              <div className="text-gray-400 text-xs">{t.city}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-16 text-center text-white">
        <h2 className="text-3xl font-extrabold mb-3">Dale compañía, dales tranquilidad</h2>
        <p className="text-indigo-100 mb-8 max-w-lg mx-auto">Empieza hoy con 7 días completamente gratis. Sin compromisos.</p>
        <button onClick={() => nav('/suscribirse')} className="bg-white text-indigo-600 font-bold text-lg px-10 py-4 rounded-2xl hover:bg-indigo-50 transition shadow-lg">
          Empezar prueba gratis
        </button>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-8 text-center text-gray-400 text-sm border-t border-gray-100">
        <p>© 2026 Compañero Virtual · Ciudad de México</p>
        <div className="flex justify-center gap-4 mt-2">
          <button onClick={() => nav('/privacidad')} className="hover:text-indigo-600">Aviso de Privacidad</button>
          <a href="mailto:hola@companero-virtual.mx" className="hover:text-indigo-600">Contacto</a>
        </div>
      </footer>
    </div>
  )
}
