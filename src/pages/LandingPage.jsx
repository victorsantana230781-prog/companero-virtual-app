import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STYLE = `
:root {
  --warm: #E8593C; --warm-lt: #FAE8E3; --warm-dk: #B03820;
  --cream: #FBF7F2; --ink: #1C1A17; --ink-soft: #4A4640; --ink-muted: #8C867E;
  --green: #2D6A4F; --green-lt: #D8EDDF; --gold: #C9922A; --white: #FFFFFF;
  --blue: #2B5C8A; --blue-lt: #DCEAF5;
  --radius: 16px; --serif: 'Lora', Georgia, serif; --sans: 'DM Sans', system-ui, sans-serif;
}
.cv-landing *, .cv-landing *::before, .cv-landing *::after { box-sizing: border-box; margin: 0; padding: 0; }
.cv-landing { font-family: var(--sans); background: var(--cream); color: var(--ink); line-height: 1.6; scroll-behavior: smooth; overflow-x: hidden; min-height: 100vh; }
.cv-landing nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 16px 48px; background: rgba(251,247,242,0.92); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(28,26,23,0.08); }
.cv-landing .logo { font-family: var(--serif); font-size: 20px; color: var(--ink); text-decoration: none; }
.cv-landing .logo span { color: var(--warm); }
.cv-landing .nav-cta { background: var(--warm); color: var(--white); border: none; border-radius: 100px; padding: 10px 24px; font-family: var(--sans); font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.2s, transform 0.15s; text-decoration: none; display: inline-block; }
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
.cv-landing .msg { max-width: 75%; padding: 8px 12px; border-radius: 12px; font-size: 13px; line-height: 1.5; }
.cv-landing .msg-bot { background: white; color: var(--ink); border-radius: 2px 12px 12px 12px; align-self: flex-start; }
.cv-landing .msg-user { background: #DCF8C6; color: var(--ink); border-radius: 12px 2px 12px 12px; align-self: flex-end; }
.cv-landing .msg-time { font-size: 10px; color: var(--ink-muted); margin-top: 2px; }
.cv-landing .trust { background: var(--ink); color: rgba(255,255,255,0.6); padding: 24px 48px; display: flex; align-items: center; gap: 48px; justify-content: center; flex-wrap: wrap; font-size: 14px; }
.cv-landing .trust-item { display: flex; align-items: center; gap: 10px; }
.cv-landing .trust-item strong { color: white; }
.cv-landing section { padding: 100px 48px; position: relative; }
.cv-landing .section-tag { font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--warm); margin-bottom: 16px; }
.cv-landing .section-title { font-family: var(--serif); font-size: clamp(28px, 3vw, 44px); line-height: 1.2; color: var(--ink); margin-bottom: 16px; }
.cv-landing .section-sub { font-size: 18px; color: var(--ink-soft); max-width: 520px; }
/* PHOTO blocks (expand on scroll) */
.cv-photoband { padding: 60px 48px; background: var(--cream); }
.cv-photo { position: relative; width: 100%; max-width: 1000px; margin: 0 auto; aspect-ratio: 16/8; border-radius: 28px; overflow: hidden; box-shadow: 0 30px 70px rgba(28,26,23,0.18); background: linear-gradient(135deg, var(--warm-lt) 0%, #F3DFCF 50%, var(--green-lt) 100%); display: flex; align-items: center; justify-content: center; will-change: transform; }
.cv-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 22%; }
.cv-photo .cv-photo-illus { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; padding: 24px; }
.cv-photo .cv-photo-illus .emoji { font-size: clamp(48px, 8vw, 96px); filter: drop-shadow(0 6px 12px rgba(0,0,0,0.12)); }
.cv-photo .cv-photo-illus .cap { font-family: var(--serif); font-style: italic; font-size: clamp(15px, 2vw, 20px); color: var(--ink-soft); max-width: 520px; }
.cv-photo .cv-photo-caption { position: absolute; left: 0; right: 0; bottom: 0; padding: 28px; background: linear-gradient(to top, rgba(28,26,23,0.75), transparent); color: white; font-size: 15px; font-weight: 500; }
.cv-photo.cv-has-img .cv-photo-illus { display: none; }
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
/* ── FAMILY PEACE PREMIUM SECTION ────────────────────────────────────────── */
.cv-landing .fp-section { background: linear-gradient(160deg, #0F0E0C 0%, #1A1035 55%, #0F0E0C 100%); color: white; position: relative; overflow: hidden; }
.cv-landing .fp-section::before { content:''; position:absolute; top:-200px; right:-200px; width:700px; height:700px; background:radial-gradient(circle,rgba(130,80,255,.18) 0%,transparent 70%); pointer-events:none; }
.cv-landing .fp-section::after { content:''; position:absolute; bottom:-200px; left:-200px; width:550px; height:550px; background:radial-gradient(circle,rgba(232,89,60,.14) 0%,transparent 70%); pointer-events:none; }
.cv-landing .fp-header { text-align:center; max-width:680px; margin:0 auto 72px; position:relative; z-index:1; }
.cv-landing .fp-pill { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg,rgba(130,80,255,.25),rgba(232,89,60,.2)); border:1px solid rgba(255,255,255,.15); border-radius:100px; padding:8px 20px; font-size:12px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:rgba(255,255,255,.9); margin-bottom:24px; }
.cv-landing .fp-header h2 { font-family:var(--serif); font-size:clamp(30px,4vw,52px); line-height:1.15; color:white; margin-bottom:20px; }
.cv-landing .fp-header h2 em { color:#A78BFA; font-style:italic; }
.cv-landing .fp-header p { font-size:18px; color:rgba(255,255,255,.6); max-width:520px; margin:0 auto; }
.cv-landing .fp-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:20px; max-width:1100px; margin:0 auto; position:relative; z-index:1; }
.cv-landing .fp-card { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); border-radius:20px; padding:32px 28px; transition:all .3s; backdrop-filter:blur(12px); position:relative; overflow:hidden; }
.cv-landing .fp-card::after { content:''; position:absolute; inset:0; border-radius:20px; opacity:0; transition:opacity .3s; }
.cv-landing .fp-card.fp-sos::after { background:linear-gradient(135deg,rgba(255,71,87,.08),transparent); }
.cv-landing .fp-card.fp-checkin::after { background:linear-gradient(135deg,rgba(255,165,2,.08),transparent); }
.cv-landing .fp-card.fp-silence::after { background:linear-gradient(135deg,rgba(46,213,115,.08),transparent); }
.cv-landing .fp-card.fp-geo::after { background:linear-gradient(135deg,rgba(30,144,255,.08),transparent); }
.cv-landing .fp-card.fp-summary::after { background:linear-gradient(135deg,rgba(162,155,254,.08),transparent); }
.cv-landing .fp-card:hover { transform:translateY(-6px); border-color:rgba(255,255,255,.22); box-shadow:0 28px 64px rgba(0,0,0,.45); }
.cv-landing .fp-card:hover::after { opacity:1; }
.cv-landing .fp-icon { width:56px; height:56px; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:26px; margin-bottom:20px; }
.cv-landing .fp-icon-sos { background:linear-gradient(135deg,#FF4757,#FF6B81); }
.cv-landing .fp-icon-checkin { background:linear-gradient(135deg,#FFA502,#FFD700); }
.cv-landing .fp-icon-silence { background:linear-gradient(135deg,#2ED573,#1E90FF); }
.cv-landing .fp-icon-geo { background:linear-gradient(135deg,#1E90FF,#00D2FF); }
.cv-landing .fp-icon-summary { background:linear-gradient(135deg,#A29BFE,#6C5CE7); }
.cv-landing .fp-card-badge { display:inline-block; background:rgba(167,139,250,.18); border:1px solid rgba(167,139,250,.35); color:#A78BFA; border-radius:100px; padding:3px 10px; font-size:11px; font-weight:600; letter-spacing:.08em; margin-bottom:12px; }
.cv-landing .fp-card h3 { font-family:var(--serif); font-size:20px; color:white; margin-bottom:10px; }
.cv-landing .fp-card p { font-size:14px; color:rgba(255,255,255,.6); line-height:1.65; }
.cv-landing .fp-tag { display:inline-flex; align-items:center; gap:6px; margin-top:16px; font-size:12px; color:rgba(255,255,255,.4); }
.cv-landing .fp-cta-wrap { text-align:center; margin-top:64px; position:relative; z-index:1; }
.cv-landing .fp-cta-wrap p { color:rgba(255,255,255,.45); font-size:13px; margin-top:14px; }
.cv-landing .btn-gradient { background:linear-gradient(135deg,#8250FF,#E8593C); color:white; border:none; border-radius:100px; padding:16px 44px; font-family:var(--sans); font-size:16px; font-weight:500; cursor:pointer; transition:all .25s; text-decoration:none; display:inline-block; }
.cv-landing .btn-gradient:hover { transform:translateY(-2px); box-shadow:0 12px 36px rgba(130,80,255,.4); filter:brightness(1.1); }
/* SPOTLIGHT split sections */
.cv-landing .spotlight { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; max-width: 1100px; margin: 0 auto; }
.cv-landing .spotlight.rev .spot-media { order: -1; }
.cv-landing .spot-media { border-radius: 24px; overflow: hidden; aspect-ratio: 4/3; box-shadow: 0 24px 60px rgba(28,26,23,0.16); position: relative; will-change: transform; display:flex; align-items:center; justify-content:center; }
.cv-landing .spot-media img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position: center 25%; }
.cv-landing .spot-media .cv-photo-illus .emoji { font-size: clamp(40px,6vw,80px); }
.cv-landing .spot-media .cv-photo-illus .cap { font-family: var(--serif); font-style: italic; color: var(--ink-soft); padding: 0 20px; text-align:center; }
.cv-landing .spot-alert { background: linear-gradient(135deg, var(--blue-lt), #EAF3FA); }
.cv-landing .spot-games { background: linear-gradient(135deg, #F3E8FA, #FBE8F2); }
.cv-landing .spot-emergency { background: linear-gradient(135deg, #FBE0DC, #FAE8E3); }
.cv-landing .spot-body h2 { font-family: var(--serif); font-size: clamp(26px,2.6vw,38px); line-height:1.2; margin-bottom: 16px; }
.cv-landing .spot-body p { font-size: 16px; color: var(--ink-soft); margin-bottom: 20px; }
.cv-landing .spot-list { list-style:none; display:flex; flex-direction:column; gap:12px; }
.cv-landing .spot-list li { display:flex; gap:10px; align-items:flex-start; font-size:15px; }
.cv-landing .spot-list li::before { content:'✓'; color: var(--green); font-weight:700; }
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
  .cv-landing .spotlight { grid-template-columns: 1fr; gap: 32px; }
  .cv-landing .spotlight.rev .spot-media { order: 0; }
  .cv-landing .cv-photoband { padding: 40px 20px; }
  .cv-landing footer { padding: 24px; }
}
`

// Cada cv-photo intenta cargar una imagen real de /images/. Si no existe, muestra la ilustración.
const photo = (file, emoji, illusCap, overlay) => `
<div class="cv-photo cv-expand">
  <img src="/images/${file}" alt="${overlay}" onerror="this.remove(); this.parentElement && this.parentElement.classList.remove('cv-has-img');" onload="this.parentElement.classList.add('cv-has-img');" />
  <div class="cv-photo-illus"><div class="emoji">${emoji}</div><div class="cap">${illusCap}</div></div>
  <div class="cv-photo-caption">${overlay}</div>
</div>`

const spotMedia = (file, emoji, illusCap, alt) => `
<div class="spot-media cv-expand">
  <img src="/images/${file}" alt="${alt}" onerror="this.remove();" />
  <div class="cv-photo-illus"><div class="emoji">${emoji}</div><div class="cap">${illusCap}</div></div>
</div>`

const BODY = `
<nav>
  <a href="#top" class="logo">Compañero <span>Virtual</span></a>
  <a href="#planes" class="nav-cta">Prueba 7 días gratis</a>
</nav>

<section class="hero" id="top">
  <div class="hero-content">
    <div class="hero-tag">Bot de WhatsApp para adultos mayores</div>
    <h1>Dale a tu mamá un <em>amigo</em> que siempre está ahí</h1>
    <p>Compañero Virtual acompaña, recuerda medicamentos, enseña inglés, juega, cuida y avisa a la familia. Todo por WhatsApp, sin descargar nada.</p>
    <div class="hero-actions">
      <a href="#planes" class="btn-primary">Empezar gratis — 7 días</a>
      <a href="#como-funciona" class="btn-ghost">▶ Ver cómo funciona</a>
    </div>
  </div>
  <div class="hero-visual" data-parallax data-depth="0.12">
    <div class="phone-mockup">
      <div class="phone-screen">
        <div class="phone-header">
          <div class="phone-avatar">🤖</div>
          <div><div style="font-weight:600;font-size:14px">Compañero Virtual</div><div style="font-size:11px;opacity:0.8">en línea</div></div>
        </div>
        <div style="height:12px"></div>
        <div class="msg msg-user">Hola, soy Rosa y tengo 72 años<div class="msg-time" style="text-align:right">10:02 a.m. ✓✓</div></div>
        <div class="msg msg-bot">¡Hola doña Rosa! Qué gusto saludarla 😊 ¿En qué le puedo ayudar hoy?<div class="msg-time">10:02 a.m.</div></div>
        <div class="msg msg-user">Recuérdame mi pastilla a las 8pm<div class="msg-time" style="text-align:right">10:03 a.m. ✓✓</div></div>
        <div class="msg msg-bot">¡Claro doña Rosa! A las 8 de la noche le recuerdo su pastilla 💊<div class="msg-time">10:03 a.m.</div></div>
        <div class="msg msg-user">¿Jugamos una adivinanza?<div class="msg-time" style="text-align:right">10:05 a.m. ✓✓</div></div>
        <div class="msg msg-bot">¡Me encanta! 🧩 Oro parece, plata no es… ¿qué fruta es?<div class="msg-time">10:05 a.m.</div></div>
      </div>
    </div>
  </div>
</section>

<div class="trust">
  <div class="trust-item">🇲🇽 <span>Hecho en <strong>México</strong></span></div>
  <div class="trust-item">📱 <span>Funciona en <strong>WhatsApp</strong></span></div>
  <div class="trust-item">🔒 <span>Datos <strong>seguros</strong></span></div>
  <div class="trust-item">🔔 <span>Avisa a la <strong>familia</strong></span></div>
</div>

<div class="cv-photoband">
  ${photo('foto1.jpg', '👵📱', 'Doña Carmen aprende y se acompaña con su teléfono de siempre.', 'Un adulto mayor feliz usando Compañero Virtual en WhatsApp')}
</div>

<section class="how" id="como-funciona">
  <div class="cv-reveal"><div class="section-tag">Paso a paso</div>
  <h2 class="section-title">Listo en 3 minutos,<br>funciona para siempre</h2></div>
  <div class="steps">
    <div class="step-card cv-reveal"><div class="step-num">1</div><h3>Elige tu plan</h3><p>Selecciona el plan que mejor se adapte a tu familia. 7 días de prueba sin tarjeta.</p></div>
    <div class="step-card cv-reveal"><div class="step-num">2</div><h3>Conecta WhatsApp</h3><p>Tu familiar agrega el número de Compañero Virtual y manda un mensaje. ¡Listo!</p></div>
    <div class="step-card cv-reveal"><div class="step-num">3</div><h3>El bot hace el resto</h3><p>Conversa, recuerda, enseña, juega y avisa a la familia. Tú recibes paz mental.</p></div>
  </div>
</section>

<section id="funciones">
  <div class="cv-reveal"><div class="section-tag">Funciones</div>
  <h2 class="section-title">Todo lo que tu familiar mayor necesita</h2>
  <p class="section-sub">Si saben usar WhatsApp, ya saben usar Compañero Virtual. Sin apps, sin complicaciones.</p></div>
  <div class="features-grid">
    <div class="feature-card cv-reveal"><div class="feature-icon">💊</div><h3>Recordatorios de medicamentos</h3><p>Pastillas, insulina, presión. Cada día, a la hora exacta, con un mensaje cálido.</p></div>
    <div class="feature-card cv-reveal"><div class="feature-icon">🗓️</div><h3>Citas médicas y eventos</h3><p>Citas con el doctor, cumpleaños de nietos y fechas importantes. Avisa con anticipación.</p></div>
    <div class="feature-card cv-reveal"><div class="feature-icon">🔔</div><h3>Alertas a familiares</h3><p>Si el adulto mayor deja de escribir por 24 o 48 horas, el bot avisa automáticamente a un familiar registrado.</p></div>
    <div class="feature-card cv-reveal"><div class="feature-icon">🧩</div><h3>Juegos mentales e interactivos</h3><p>Adivinanzas, trivia, series de números y memoria. Ejercita la mente jugando todos los días.</p></div>
    <div class="feature-card cv-reveal"><div class="feature-icon">🌎</div><h3>Aprende idiomas</h3><p>Inglés, francés, italiano… lecciones cortas y simples directo en el chat. A su propio ritmo.</p></div>
    <div class="feature-card cv-reveal"><div class="feature-icon">🤟</div><h3>Lengua de Señas Mexicana</h3><p>Aprende LSM paso a paso, con descripciones claras para comunicarse con todos.</p></div>
    <div class="feature-card cv-reveal"><div class="feature-icon">🚨</div><h3>Contacto de emergencia</h3><p>911, Cruz Roja, bomberos y el teléfono de un familiar, siempre a la mano cuando más se necesita.</p></div>
    <div class="feature-card cv-reveal"><div class="feature-icon">🎙️</div><h3>Mensajes de voz</h3><p>¿No quieren escribir? Mandan un audio y el bot entiende y responde. Sin teclear.</p></div>
    <div class="feature-card cv-reveal"><div class="feature-icon">🤝</div><h3>Compañía y conversación</h3><p>Para cuando están solos. El bot platica, escucha y recuerda sus gustos.</p></div>
  </div>
</section>

<div class="cv-photoband">
  ${photo('foto2.jpg', '👨‍🦳😊', 'Don Manuel juega una trivia y ejercita su memoria cada mañana.', 'Adulto mayor sonriendo mientras juega con el bot')}
</div>

<section class="spot-alert">
  <div class="spotlight cv-reveal">
    <div class="spot-body">
      <div class="section-tag">Tranquilidad para la familia</div>
      <h2>Avisamos a la familia cuando algo no anda bien</h2>
      <p>Tú no puedes estar todo el día pendiente. Compañero Virtual sí. Si tu mamá o papá deja de escribir, te avisamos antes de que tengas que preocuparte.</p>
      <ul class="spot-list">
        <li>Detecta inactividad de 24 horas y manda un aviso suave al familiar.</li>
        <li>A las 48 horas, envía una alerta urgente para que actúes a tiempo.</li>
        <li>Cuando el adulto mayor vuelve a escribir, te avisa que ya está bien.</li>
        <li>Disponible en el plan Familiar, para hasta 3 adultos mayores.</li>
      </ul>
    </div>
    ${spotMedia('alertas.jpg', '👨‍👩‍👧', 'La familia recibe un aviso en su WhatsApp y queda tranquila.', 'Familia tranquila recibiendo alerta de bienestar')}
  </div>
</section>

<section class="spot-games">
  <div class="spotlight rev cv-reveal">
    ${spotMedia('juegos.jpg', '🧠🎲', 'Adivinanzas, trivia y memoria: la mente activa todos los días.', 'Adulto mayor jugando juegos mentales en WhatsApp')}
    <div class="spot-body">
      <div class="section-tag">Mente activa</div>
      <h2>Juegos que entretienen y ejercitan la memoria</h2>
      <p>Mantener la mente despierta es tan importante como el cuerpo. El bot propone retos diarios, divertidos y a la medida.</p>
      <ul class="spot-list">
        <li>Adivinanzas y acertijos clásicos mexicanos.</li>
        <li>Trivia de cultura general, historia y música de su época.</li>
        <li>Series de números y juegos de memoria progresivos.</li>
        <li>Conversaciones que estimulan recuerdos y relatos de vida.</li>
      </ul>
    </div>
  </div>
</section>

<section class="spot-emergency">
  <div class="spotlight cv-reveal">
    <div class="spot-body">
      <div class="section-tag">Siempre protegido</div>
      <h2>Ayuda de emergencia a un mensaje de distancia</h2>
      <p>En un momento difícil, no hay que recordar números ni buscar nada. El bot tiene todo listo y lo entrega al instante.</p>
      <ul class="spot-list">
        <li>Teléfonos clave: 911, Cruz Roja (065), Bomberos (068).</li>
        <li>Contacto directo del familiar o cuidador registrado.</li>
        <li>Orientación para encontrar farmacias y hospitales cercanos.</li>
        <li>Respuestas claras y pacientes, sin tecnicismos.</li>
      </ul>
    </div>
    ${spotMedia('emergencia.jpg', '🚨📞', 'Los números de emergencia, siempre a la mano y fáciles de usar.', 'Adulto mayor usando contacto de emergencia')}
  </div>
</section>

<section class="fp-section" id="tranquilidad">
  <div class="fp-header cv-reveal">
    <div class="fp-pill">🛡️ Exclusivo Premium &amp; Familiar</div>
    <h2>5 escudos de tranquilidad<br>para <em>tu familia</em></h2>
    <p>Mientras trabajas o descansas, Compañero Virtual cuida a mamá y te mantiene informado. En tiempo real, por WhatsApp.</p>
  </div>
  <div class="fp-grid">

    <div class="fp-card fp-sos cv-reveal">
      <div class="fp-icon fp-icon-sos">🆘</div>
      <div class="fp-card-badge">INMEDIATO</div>
      <h3>Botón de pánico SOS</h3>
      <p>Mamá escribe <strong style="color:rgba(255,255,255,.85)">"AYUDA"</strong> o <strong style="color:rgba(255,255,255,.85)">"SOS"</strong> y en segundos toda la familia recibe una alerta por WhatsApp. Sin apps, sin botones físicos.</p>
      <div class="fp-tag">⚡ Respuesta en menos de 30 segundos</div>
    </div>

    <div class="fp-card fp-checkin cv-reveal">
      <div class="fp-icon fp-icon-checkin">🌅</div>
      <div class="fp-card-badge">DIARIO</div>
      <h3>Buenos días automático</h3>
      <p>Cada mañana el bot saluda a mamá y verifica cómo amanece. Si no responde en 2 horas, avisa a la familia antes de que tengas que preocuparte.</p>
      <div class="fp-tag">🕗 Todos los días a las 8 a.m.</div>
    </div>

    <div class="fp-card fp-silence cv-reveal">
      <div class="fp-icon fp-icon-silence">😶</div>
      <div class="fp-card-badge">MONITOREO</div>
      <h3>Alerta de silencio prolongado</h3>
      <p>24 horas sin escribir → aviso suave a la familia. 48 horas → alerta urgente. Cuando regresa al chat, avisa que ya está bien.</p>
      <div class="fp-tag">🔔 Alertas graduales e inteligentes</div>
    </div>

    <div class="fp-card fp-geo cv-reveal">
      <div class="fp-icon fp-icon-geo">📍</div>
      <div class="fp-card-badge">TIEMPO REAL</div>
      <h3>Geolocalización de salidas</h3>
      <p>Mamá dice "voy al mercado" → el bot le pide su ubicación. Ella la comparte con un tap en WhatsApp y la familia la recibe al instante.</p>
      <div class="fp-tag">📱 Nativo de WhatsApp, sin apps extra</div>
    </div>

    <div class="fp-card fp-summary cv-reveal">
      <div class="fp-icon fp-icon-summary">📋</div>
      <div class="fp-card-badge">SEMANAL</div>
      <h3>Resumen semanal para la familia</h3>
      <p>Cada domingo reciben: cuántos días estuvo activa, pastillas confirmadas, estado de ánimo general y momentos especiales de la semana.</p>
      <div class="fp-tag">📊 Llega automático cada domingo</div>
    </div>

  </div>
  <div class="fp-cta-wrap cv-reveal">
    <a href="#planes" class="btn-gradient">Ver planes con estas funciones →</a>
    <p>Disponible en planes Premium y Familiar · Sin configuración extra · Solo WhatsApp</p>
  </div>
</section>

<section class="pricing" id="planes">
  <div style="text-align:center" class="cv-reveal">
    <div class="section-tag">Precios</div>
    <h2 class="section-title">Simple y sin sorpresas</h2>
    <p class="section-sub" style="margin:0 auto">7 días gratis en cualquier plan. Cancela cuando quieras, sin penalizaciones.</p>
  </div>
  <div class="plans">
    <div class="plan cv-reveal">
      <div class="plan-name">Básico</div>
      <div class="plan-price">$149 <span>MXN/mes</span></div>
      <div class="plan-sub">Para empezar</div>
      <ul class="plan-features"><li>Conversación con IA ilimitada</li><li>Recordatorios y agenda</li><li>Juegos mentales y adivinanzas</li><li>Teléfonos de emergencia</li><li>1 usuario</li></ul>
      <a class="btn-plan" data-cta data-plan="BASIC">Empezar gratis</a>
    </div>
    <div class="plan featured cv-reveal">
      <div class="plan-badge">Más popular</div>
      <div class="plan-name">Premium</div>
      <div class="plan-price">$249 <span>MXN/mes</span></div>
      <div class="plan-sub">Para la experiencia completa</div>
      <ul class="plan-features"><li>Todo lo del plan Básico</li><li>Mensajes de voz (audios)</li><li>Análisis de imágenes y recetas</li><li>🆘 Botón SOS de emergencia</li><li>🌅 Check-in matutino diario</li><li>📍 Geolocalización de salidas</li><li>📋 Resumen semanal a la familia</li><li>Idiomas y Lengua de Señas (LSM)</li><li>1 usuario prioritario</li></ul>
      <a class="btn-plan" data-cta data-plan="PREMIUM">Empezar gratis</a>
    </div>
    <div class="plan cv-reveal">
      <div class="plan-name">Familiar</div>
      <div class="plan-price">$399 <span>MXN/mes</span></div>
      <div class="plan-sub">Para toda la familia</div>
      <ul class="plan-features"><li>Todo lo del plan Premium</li><li>Hasta 3 adultos mayores</li><li>🛡️ Los 5 escudos de tranquilidad</li><li>😶 Alerta de silencio 24/48h</li><li>Alertas de bienestar a familiares</li><li>Panel familiar de seguimiento</li><li>Soporte prioritario</li></ul>
      <a class="btn-plan" data-cta data-plan="FAMILY">Empezar gratis</a>
    </div>
  </div>
</section>

<section class="testimonials">
  <div class="cv-reveal"><div class="section-tag">Testimonios</div>
  <h2 class="section-title">Familias que ya viven más tranquilas</h2></div>
  <div class="testi-grid">
    <div class="testi-card cv-reveal"><div class="testi-stars">★★★★★</div><p class="testi-text">"Mi mamá vive sola y yo trabajo todo el día. Desde que tiene a Compañero Virtual me llama menos angustiada y ya no olvida sus pastillas."</p><div class="testi-author"><strong>Gabriela M.</strong>Hija, 44 años — CDMX</div></div>
    <div class="testi-card cv-reveal"><div class="testi-stars">★★★★★</div><p class="testi-text">"Lo mejor son las alertas: un fin de semana me avisó que mi papá no había escrito y pude llamarle a tiempo. Me dio una tranquilidad enorme."</p><div class="testi-author"><strong>Roberto S.</strong>Hijo, 51 años — Guadalajara</div></div>
    <div class="testi-card cv-reveal"><div class="testi-stars">★★★★★</div><p class="testi-text">"Mi suegra de 75 años juega adivinanzas con el bot y le pregunta cómo se dicen cosas en inglés. ¡Está feliz y más activa que nunca!"</p><div class="testi-author"><strong>Mariana T.</strong>Nuera, 39 años — Monterrey</div></div>
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
  const root = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      const cta = e.target.closest('[data-cta]')
      if (cta) { e.preventDefault(); nav('/suscribirse?plan=' + (cta.dataset.plan || 'PREMIUM')); return }
      const priv = e.target.closest('[data-priv]')
      if (priv) { e.preventDefault(); nav('/privacidad') }
    }
    document.addEventListener('click', handler)

    const ctx = gsap.context(() => {
      // Reveal: aparece suave al entrar
      gsap.utils.toArray('.cv-reveal').forEach((el) => {
        gsap.from(el, {
          y: 48, opacity: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })
      // Expand: las imágenes se expanden suavemente con el scroll
      gsap.utils.toArray('.cv-expand').forEach((el) => {
        gsap.fromTo(el,
          { scale: 0.82, autoAlpha: 0.6 },
          { scale: 1, autoAlpha: 1, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 45%', scrub: true } })
      })
      // Parallax: profundidad al hacer scroll
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        const depth = parseFloat(el.dataset.depth || '0.15')
        gsap.to(el, {
          yPercent: -depth * 100, ease: 'none',
          scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    }, root)

    const t = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => { clearTimeout(t); document.removeEventListener('click', handler); ctx.revert() }
  }, [nav])

  return (
    <div className="cv-landing" ref={root}>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div dangerouslySetInnerHTML={{ __html: BODY }} />
    </div>
  )
}
