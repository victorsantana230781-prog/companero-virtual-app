import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const STYLE = `
:root {
  --warm: #E8593C; --warm-lt: #FAE8E3; --warm-dk: #B03820;
  --cream: #FBF7F2; --ink: #1C1A17; --ink-soft: #4A4640; --ink-muted: #8C867E;
  --green: #2D6A4F; --green-lt: #D8EDDF; --gold: #C9922A; --white: #FFFFFF;
  --radius: 16px; --serif: 'Lora', Georgia, serif; --sans: 'DM Sans', system-ui, sans-serif;
}
.cv-landing *, .cv-landing *::before, .cv-landing *::after { box-sizing: border-box; margin: 0; padding: 0; }
.cv-landing { font-family: var(--sans); background: var(--cream); color: var(--ink); line-height: 1.6; scroll-behavior: smooth; overflow-x: hidden; min-height: 100vh; }
.cv-landing nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 48px; background: rgba(251,247,242,0.92);
  backdrop-filter: blur(12px); border-bottom: 1px solid rgba(28,26,23,0.08);
}
.cv-landing .logo { font-family: var(--serif); font-size: 20px; color: var(--ink); text-decoration: none; }
.cv-landing .logo span { color: var(--warm); }
.cv-landing .nav-cta {
  background: var(--warm); color: var(--white); border: none; border-radius: 100px; padding: 10px 24px;
  font-family: var(--sans); font-size: 14px; font-weight: 500; cursor: pointer;
  transition: background 0.2s, transform 0.15s; text-decoration: none; display: inline-block;
}
.cv-landing .nav-cta:hover { background: var(--warm-dk); transform: translateY(-1px); }
.cv-landing .hero { min-height: 100vh; display: flex; align-items: center; padding: 120px 48px 80px; position: relative; overflow: hidden; }
.cv-landing .hero::before { content: ''; position: absolute; top: -100px; right: -200px; width: 700px; height: 700px; background: radial-gradient(circle, rgba(232,89,60,0.12) 0%, transparent 70%); pointer-events: none; }
.cv-landing .hero-content { max-width: 600px; position: relative; z-index: 1; }
.cv-landing .hero-tag { display: inline-flex; align-items: center; gap: 6px; background: var(--green-lt); color: var(--green); border-radius: 100px; padding: 6px 14px; font-size: 13px; font-weight: 500; margin-bottom: 28px; }
.cv-landing .hero-tag::before { content: '●'; font-size: 8px; animation: cvpulse 2s infinite; }
@keyframes cvpulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
.cv-landing .hero h1 { font-family: var(--serif); font-size: clamp(38px, 5vw, 62px); line-height: 1.15; color: var(--ink); margin-bottom: 24px; }
.cv-landing .hero h1 em { color: var(--warm); font-style: italic; }
.cv-landing .hero p { font-size: 18px; color: var(--ink-soft); line-height: 1.7; margin-bottom: 40px; max-width: 480px; }
.cv-landing .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
.cv-landing .btn-primary { background: var(--warm); color: var(--white); border: none; border-radius: 100px; padding: 16px 36px; font-family: var(--sans); font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; }
.cv-landing .btn-primary:hover { background: var(--warm-dk); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(232,89,60,0.3); }
.cv-landing .btn-ghost { color: var(--ink-soft); font-size: 15px; display: flex; align-items: center; gap: 8px; text-decoration: none; transition: color 0.2s; cursor: pointer; }
.cv-landing .btn-ghost:hover { color: var(--warm); }
.cv-landing .hero-visual { position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 45%; max-width: 520px; pointer-events: none; }
.cv-landing .phone-mockup { width: 280px; margin: 0 auto; background: var(--ink); border-radius: 36px; padding: 12px; box-shadow: 0 40px 80px rgba(28,26,23,0.25); position: relative; }
.cv-landing .phone-screen { background: #E5DDD5; border-radius: 28px; overflow: hidden; min-height: 480px; padding: 12px 8px; display: flex; flex-direction: column; gap: 8px; }
.cv-landing .phone-header { background: #075E54; color: white; border-radius: 20px 20px 0 0; padding: 12px 16px; margin: -12px -8px 0; font-size: 13px; display: flex; align-items: center; gap: 8px; }
.cv-landing .phone-avatar { width: 32px; height: 32px; border-radius: 50%; background: #128C7E; display:flex; align-items:center; justify-content:center; font-size:16px; }
.cv-landing .msg { max-width: 75%; padding: 8px 12px; border-radius: 12px; font-size: 13px; line-height: 1.5; animation: cvfadeUp 0.5s ease both; }
.cv-landing .msg-bot { background: white; color: var(--ink); border-radius: 2px 12px 12px 12px; align-self: flex-start; }
.cv-landing .msg-user { background: #DCF8C6; color: var(--ink); border-radius: 12px 2px 12px 12px; align-self: flex-end; }
.cv-landing .msg-time { font-size: 10px; color: var(--ink-muted); margin-top: 2px; }
@keyframes cvfadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
.cv-landing .msg:nth-child(1){animation-delay:0.1s} .cv-landing .msg:nth-child(2){animation-delay:0.4s} .cv-landing .msg:nth-child(3){animation-delay:0.8s} .cv-landing .msg:nth-child(4){animation-delay:1.2s} .cv-landing .msg:nth-child(5){animation-delay:1.6s}
.cv-landing .trust { background: var(--ink); color: rgba(255,255,255,0.6); padding: 24px 48px; display: flex; align-items: center; gap: 48px; justify-content: center; flex-wrap: wrap; font-size: 14px; }
.cv-landing .trust-item { display: flex; align-items: center; gap: 10px; }
.cv-landing .trust-item strong { color: white; }
.cv-landing section { padding: 100px 48px; }
.cv-landing .section-tag { font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--warm); margin-bottom: 16px; }
.cv-landing .section-title { font-family: var(--serif); font-size: clamp(28px, 3vw, 44px); line-height: 1.2; color: var(--ink); margin-bottom: 16px; }
.cv-landing .section-sub { font-size: 18px; color: var(--ink-soft); max-width: 520px; }
.cv-landing .how { background: var(--white); }
.cv-landing .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 40px; margin-top: 64px; }
.cv-landing .step-card { position: relative; }
.cv-landing .step-num { width: 48px; height: 48px; border-radius: 50%; background: var(--warm-lt); color: var(--warm); font-family: var(--serif); font-size: 22px; font-weight: 600; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
.cv-landing .step-card h3 { font-family: var(--serif); font-size: 20px; margin-bottom: 10px; }
.cv-landing .step-card p { font-size: 15px; color: var(--ink-soft); line-height: 1.6; }
.cv-landing .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-top: 64px; }
.cv-landing .feature-card { background: var(--white); border-radius: var(--radius); padding: 28px; border: 1px solid rgba(28,26,23,0.08); transition: box-shadow 0.2s, transform 0.2s; }
.cv-landing .feature-card:hover { box-shadow: 0 12px 40px rgba(28,26,23,0.1); transform: translateY(-4px); }
.cv-landing .feature-icon { width: 48px; height: 48px; border-radius: 12px; background: var(--warm-lt); color: var(--warm); font-size: 22px; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; }
.cv-landing .feature-card h3 { font-family: var(--serif); font-size: 18px; margin-bottom: 8px; }
.cv-landing .feature-card p { font-size: 14px; color: var(--ink-soft); line-height: 1.6; }
.cv-landing .pricing { background: var(--cream); }
.cv-landing .plans { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-top: 64px; max-width: 900px; margin-left: auto; margin-right: auto; }
.cv-landing .plan { background: var(--white); border-radius: var(--radius); padding: 32px; border: 1.5px solid rgba(28,26,23,0.1); transition: all 0.2s; }
.cv-landing .plan.featured { background: var(--ink); color: white; border-color: var(--ink); transform: scale(1.03); }
.cv-landing .plan-badge { display: inline-block; background: var(--warm); color: white; border-radius: 100px; padding: 4px 12px; font-size: 12px; font-weight: 500; margin-bottom: 16px; }
.cv-landing .plan-name { font-family: var(--serif); font-size: 22px; margin-bottom: 8px; }
.cv-landing .plan.featured .plan-name { color: white; }
.cv-landing .plan-price { font-size: 40px; font-weight: 300; margin: 16px 0 4px; }
.cv-landing .plan-price span { font-size: 16px; color: var(--ink-muted); }
.cv-landing .plan.featured .plan-price span { color: rgba(255,255,255,0.5); }
.cv-landing .plan-sub { font-size: 13px; color: var(--ink-muted); margin-bottom: 28px; }
.cv-landing .plan.featured .plan-sub { color: rgba(255,255,255,0.5); }
.cv-landing .plan-features { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
.cv-landing .plan-features li { font-size: 14px; display: flex; align-items: center; gap: 10px; }
.cv-landing .plan-features li::before { content: '✓'; color: var(--green); font-weight: 600; flex-shrink: 0; }
.cv-landing .plan.featured .plan-features li { color: rgba(255,255,255,0.85); }
.cv-landing .plan.featured .plan-features li::before { color: #7FFFA4; }
.cv-landing .btn-plan { width: 100%; padding: 14px; border-radius: 100px; font-family: var(--sans); font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.2s; border: 1.5px solid var(--ink); background: transparent; color: var(--ink); text-decoration: none; display: block; text-align: center; }
.cv-landing .btn-plan:hover { background: var(--ink); color: white; }
.cv-landing .plan.featured .btn-plan { background: var(--warm); color: white; border-color: var(--warm); }
.cv-landing .plan.featured .btn-plan:hover { background: var(--warm-dk); border-color: var(--warm-dk); }
.cv-landing .testimonials { background: var(--white); }
.cv-landing .testi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 64px; }
.cv-landing .testi-card { background: var(--cream); border-radius: var(--radius); padding: 28px; border: 1px solid rgba(28,26,23,0.06); }
.cv-landing .testi-stars { color: var(--gold); font-size: 16px; margin-bottom: 16px; letter-spacing: 2px; }
.cv-landing .testi-text { font-family: var(--serif); font-size: 16px; line-height: 1.7; color: var(--ink); font-style: italic; margin-bottom: 20px; }
.cv-landing .testi-author { font-size: 13px; color: var(--ink-soft); }
.cv-landing .testi-author strong { color: var(--ink); display: block; font-style: normal; font-family: var(--sans); }
.cv-landing .cta-section { background: var(--ink); color: white; text-align: center; padding: 100px 48px; position: relative; overflow: hidden; }
.cv-landing .cta-section::before { content: ''; position: absolute; top: -200px; left: 50%; transform: translateX(-50%); width: 600px; height: 600px; background: radial-gradient(circle, rgba(232,89,60,0.2) 0%, transparent 70%); pointer-events: none; }
.cv-landing .cta-section .section-title { color: white; }
.cv-landing .cta-section p { color: rgba(255,255,255,0.65); font-size: 18px; max-width: 480px; margin: 0 auto 40px; }
.cv-landing .cta-note { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 16px; }
.cv-landing footer { background: var(--ink); border-top: 1px solid rgba(255,255,255,0.08); padding: 32px 48px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.cv-landing footer .logo { color: white; }
.cv-landing footer p { font-size: 13px; color: rgba(255,255,255,0.4); }
.cv-landing footer a.priv { color: rgba(255,255,255,0.6); font-size: 13px; text-decoration: underline; cursor: pointer; }
.cv-landing footer a.priv:hover { color: var(--warm); }
@media (max-width: 768px) {
  .cv-landing nav { padding: 16px 24px; }
  .cv-landing .hero { padding: 100px 24px 60px; flex-direction: column; min-height: auto; }
  .cv-landing .hero-visual { display: none; }
  .cv-landing section { padding: 64px 24px; }
  .cv-landing .trust { padding: 20px 24px; gap: 24px; }
  .cv-landing footer { padding: 24px; }
}
`

const BODY = `
<nav>
  <a href="#top" class="logo">Compañero <span>Virtual</span></a>
  <a href="#planes" class="nav-cta">Prueba 7 días gratis</a>
</nav>
<section class="hero" id="top">
  <div class="hero-content">
    <div class="hero-tag">Bot de WhatsApp para adultos mayores</div>
    <h1>Dale a tu mamá un <em>amigo</em> que siempre está ahí</h1>
    <p>Compañero Virtual es un asistente por WhatsApp que acompaña, recuerda medicamentos, enseña inglés y ayuda con lo que tus papás no se atreven a preguntar.</p>
    <div class="hero-actions">
      <a href="#planes" class="btn-primary">Empezar gratis — 7 días</a>
      <a href="#como-funciona" class="btn-ghost">▶ Ver cómo funciona</a>
    </div>
  </div>
  <div class="hero-visual">
    <div class="phone-mockup">
      <div class="phone-screen">
        <div class="phone-header">
          <div class="phone-avatar">🤖</div>
          <div>
            <div style="font-weight:600;font-size:14px">Compañero Virtual</div>
            <div style="font-size:11px;opacity:0.8">en línea</div>
          </div>
        </div>
        <div style="height:12px"></div>
        <div class="msg msg-user">Hola, soy Rosa y tengo 72 años<div class="msg-time" style="text-align:right">10:02 a.m. ✓✓</div></div>
        <div class="msg msg-bot">¡Hola doña Rosa! Qué gusto saludarla 😊 Aquí estoy para lo que necesite. ¿En qué le puedo ayudar hoy?<div class="msg-time">10:02 a.m.</div></div>
        <div class="msg msg-user">Recuérdame tomar mi pastilla a las 8pm<div class="msg-time" style="text-align:right">10:03 a.m. ✓✓</div></div>
        <div class="msg msg-bot">¡Claro que sí, doña Rosa! Ya anoté que a las 8 de la noche le recuerdo su pastilla. ¡Su salud es lo más importante! 💊<div class="msg-time">10:03 a.m.</div></div>
        <div class="msg msg-user">¿Cómo se dice "buenos días" en inglés?<div class="msg-time" style="text-align:right">10:05 a.m. ✓✓</div></div>
        <div class="msg msg-bot">¡Muy bien que quiera aprender! Se dice "Good morning" 🌅 Repita conmigo: Guud mór-ning. ¿Le enseño más saludos?<div class="msg-time">10:05 a.m.</div></div>
      </div>
    </div>
  </div>
</section>
<div class="trust">
  <div class="trust-item">🇲🇽 <span>Hecho en <strong>México</strong></span></div>
  <div class="trust-item">📱 <span>Funciona en <strong>WhatsApp</strong></span></div>
  <div class="trust-item">🔒 <span>Datos <strong>seguros</strong></span></div>
  <div class="trust-item">⚡ <span>Responde en <strong>segundos</strong></span></div>
</div>
<section class="how" id="como-funciona">
  <div class="section-tag">Paso a paso</div>
  <h2 class="section-title">Listo en 3 minutos,<br>funciona para siempre</h2>
  <div class="steps">
    <div class="step-card"><div class="step-num">1</div><h3>Elige tu plan</h3><p>Selecciona el plan que mejor se adapte a tu familia. 7 días de prueba sin necesidad de tarjeta.</p></div>
    <div class="step-card"><div class="step-num">2</div><h3>Conecta WhatsApp</h3><p>Tu familiar agrega el número de Compañero Virtual y manda un mensaje. ¡Ya está, listo para chatear!</p></div>
    <div class="step-card"><div class="step-num">3</div><h3>El bot hace el resto</h3><p>Conversa, recuerda medicamentos, aprende inglés y acompaña. Tú recibes paz mental, ellos reciben cariño.</p></div>
  </div>
</section>
<section id="funciones">
  <div class="section-tag">Funciones</div>
  <h2 class="section-title">Todo lo que tu familiar mayor necesita</h2>
  <p class="section-sub">Diseñado para personas que no son expertas en tecnología. Si saben usar WhatsApp, ya saben usar Compañero Virtual.</p>
  <div class="features-grid">
    <div class="feature-card"><div class="feature-icon">💊</div><h3>Recordatorios de medicamentos</h3><p>Recuerda pastillas, insulina, presión. Cada día, a la hora exacta, con un mensaje cálido y amigable.</p></div>
    <div class="feature-card"><div class="feature-icon">🗓️</div><h3>Citas médicas y eventos</h3><p>Guarda citas con el doctor, cumpleaños de nietos y cualquier fecha importante. Avisa con anticipación.</p></div>
    <div class="feature-card"><div class="feature-icon">🇺🇸</div><h3>Clases de inglés</h3><p>Lecciones cortas y simples directo en WhatsApp. Sin apps, sin computadora. Solo chatear y aprender.</p></div>
    <div class="feature-card"><div class="feature-icon">📞</div><h3>Teléfonos de emergencia</h3><p>Farmacias, Cruz Roja, bomberos, hospitales. Siempre a la mano cuando más se necesitan.</p></div>
    <div class="feature-card"><div class="feature-icon">🎙️</div><h3>Mensajes de voz</h3><p>¿No quieren escribir? Mandan un audio y el bot entiende y responde. Sin necesidad de teclear.</p></div>
    <div class="feature-card"><div class="feature-icon">🤝</div><h3>Compañía y conversación</h3><p>Para cuando están solos. El bot platica, escucha, recuerda sus gustos y siempre tiene tiempo para ellos.</p></div>
  </div>
</section>
<section class="pricing" id="planes">
  <div style="text-align:center">
    <div class="section-tag">Precios</div>
    <h2 class="section-title">Simple y sin sorpresas</h2>
    <p class="section-sub" style="margin:0 auto">7 días gratis en cualquier plan. Cancela cuando quieras, sin penalizaciones.</p>
  </div>
  <div class="plans">
    <div class="plan">
      <div class="plan-name">Básico</div>
      <div class="plan-price">$149 <span>MXN/mes</span></div>
      <div class="plan-sub">Para empezar</div>
      <ul class="plan-features"><li>Conversación con IA ilimitada</li><li>Recordatorios (medicamentos y citas)</li><li>Agenda de contactos</li><li>Teléfonos de emergencia</li><li>1 usuario</li></ul>
      <a class="btn-plan" data-cta data-plan="BASIC">Empezar gratis</a>
    </div>
    <div class="plan featured">
      <div class="plan-badge">Más popular</div>
      <div class="plan-name">Premium</div>
      <div class="plan-price">$249 <span>MXN/mes</span></div>
      <div class="plan-sub">Para la experiencia completa</div>
      <ul class="plan-features"><li>Todo lo del plan Básico</li><li>Mensajes de voz (audios)</li><li>Análisis de imágenes y recetas</li><li>Clases de inglés interactivas</li><li>1 usuario prioritario</li></ul>
      <a class="btn-plan" data-cta data-plan="PREMIUM">Empezar gratis</a>
    </div>
    <div class="plan">
      <div class="plan-name">Familiar</div>
      <div class="plan-price">$399 <span>MXN/mes</span></div>
      <div class="plan-sub">Para toda la familia</div>
      <ul class="plan-features"><li>Todo lo del plan Premium</li><li>Hasta 3 adultos mayores</li><li>Panel familiar de seguimiento</li><li>Alertas para hijos y cuidadores</li><li>Soporte prioritario</li></ul>
      <a class="btn-plan" data-cta data-plan="FAMILY">Empezar gratis</a>
    </div>
  </div>
</section>
<section class="testimonials">
  <div class="section-tag">Testimonios</div>
  <h2 class="section-title">Familias que ya viven más tranquilas</h2>
  <div class="testi-grid">
    <div class="testi-card"><div class="testi-stars">★★★★★</div><p class="testi-text">"Mi mamá vive sola y yo trabajo todo el día. Desde que tiene a Compañero Virtual me llama menos angustiada y ya no olvida sus pastillas."</p><div class="testi-author"><strong>Gabriela M.</strong>Hija, 44 años — CDMX</div></div>
    <div class="testi-card"><div class="testi-stars">★★★★★</div><p class="testi-text">"Mi papá de 78 años le platica cosas que a nosotros no nos cuenta. Dice que el bot 'no lo juzga'. Nos tiene a todos sorprendidos."</p><div class="testi-author"><strong>Roberto S.</strong>Hijo, 51 años — Guadalajara</div></div>
    <div class="testi-card"><div class="testi-stars">★★★★★</div><p class="testi-text">"Nunca pensé que mis suegros iban a usar algo así. Ahora mi suegra le pregunta cómo se dicen cosas en inglés. ¡Tiene 75 años!"</p><div class="testi-author"><strong>Mariana T.</strong>Nuera, 39 años — Monterrey</div></div>
  </div>
</section>
<section class="cta-section">
  <div class="section-tag" style="color:var(--warm)">Empieza hoy</div>
  <h2 class="section-title">Tu familiar mayor merece<br>compañía todos los días</h2>
  <p>Sin aplicaciones que descargar. Sin cuentas que crear. Solo WhatsApp, que ya saben usar.</p>
  <a href="#planes" class="btn-primary" style="font-size:17px;padding:18px 44px">Prueba 7 días gratis</a>
  <p class="cta-note">Sin tarjeta de crédito · Cancela cuando quieras · Soporte en español</p>
</section>
<footer>
  <a href="#top" class="logo">Compañero <span style="color:var(--warm)">Virtual</span></a>
  <a class="priv" data-priv>Aviso de Privacidad</a>
  <p>© 2026 Compañero Virtual · Hecho con ❤️ en México</p>
</footer>
`

export default function LandingPage() {
  const nav = useNavigate()
  useEffect(() => {
    const handler = (e) => {
      const cta = e.target.closest('[data-cta]')
      if (cta) { e.preventDefault(); nav('/suscribirse?plan=' + (cta.dataset.plan || 'PREMIUM')); return }
      const priv = e.target.closest('[data-priv]')
      if (priv) { e.preventDefault(); nav('/privacidad') }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [nav])

  return (
    <div className="cv-landing">
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div dangerouslySetInnerHTML={{ __html: BODY }} />
    </div>
  )
}
