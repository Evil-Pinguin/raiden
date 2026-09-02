// RAIDEN MEI — SPEC.01
// Automotive editorial interactions

document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loader-progress');
  const loaderCounter = document.getElementById('loader-counter');
  const loaderPercent = document.getElementById('loader-percent');
  const scrollProgress = document.getElementById('scrollProgress');
  const heroImage = document.getElementById('heroImage');
  const enterBtn = document.getElementById('enterBtn');
  const evoTrack = document.getElementById('evoTrack');
  const trailCanvas = document.getElementById('trailCanvas');
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  // LOADER
  let progress = 0;
  const totalSteps = 9;
  const loaderInterval = setInterval(() => {
    progress += Math.random() * 8 + 2;
    if (progress >= 100) progress = 100;
    loaderProgress.style.width = progress + '%';
    loaderPercent.textContent = Math.floor(progress) + '%';
    const step = Math.min(totalSteps, Math.floor((progress / 100) * totalSteps));
    loaderCounter.textContent = `0${step} / 09`;
    if (progress >= 100) {
      clearInterval(loaderInterval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.add('loaded');
        startHeroAnim();
      }, 600);
    }
  }, 80);

  function startHeroAnim() {
    if (heroImage) heroImage.style.transform = 'scale(1)';
  }

  // CURSOR - FASTER FOLLOW
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  let dotX = 0, dotY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  function animateCursor() {
    // dot follows almost instantly (0.5)
    dotX += (mouseX - dotX) * 0.5;
    dotY += (mouseY - dotY) * 0.5;
    // ring follows fast (0.35) instead of slow 0.12
    ringX += (mouseX - ringX) * 0.35;
    ringY += (mouseY - ringY) * 0.35;
    
    cursorDot.style.left = dotX - 2.5 + 'px';
    cursorDot.style.top = dotY - 2.5 + 'px';
    cursorRing.style.left = ringX - 18 + 'px';
    cursorRing.style.top = ringY - 18 + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('button, a, .evo-card, .combat-mode, .design-block, .callout-content, .nav-profile, .spec-row, .dot').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hover'));
  });

  // SCROLL PROGRESS
  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.width = scrolled + '%';
    
    // Hero parallax
    if (heroImage) {
      const hero = document.getElementById('hero');
      const rect = hero.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const speed = window.scrollY * 0.3;
        heroImage.style.transform = `scale(${1 + window.scrollY * 0.0002}) translateY(${speed * 0.1}px)`;
      }
    }
  });

  // ENTER BUTTON
  enterBtn?.addEventListener('click', () => {
    document.getElementById('specs').scrollIntoView({ behavior: 'smooth' });
  });

  // INTERSECTION OBSERVER FOR REVEALS
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section-title, .specs-desc, .spec-row, .design-block, .perf-item, .combat-title, .starrail-quote').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // EVOLUTION DRAG SCROLL
  let isDown = false, startX, scrollLeft;
  evoTrack?.addEventListener('mousedown', (e) => {
    isDown = true;
    evoTrack.classList.add('dragging');
    startX = e.pageX - evoTrack.offsetLeft;
    scrollLeft = evoTrack.scrollLeft;
  });
  evoTrack?.addEventListener('mouseleave', () => { isDown = false; evoTrack.classList.remove('dragging'); });
  evoTrack?.addEventListener('mouseup', () => { isDown = false; evoTrack.classList.remove('dragging'); });
  evoTrack?.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - evoTrack.offsetLeft;
    const walk = (x - startX) * 2;
    evoTrack.scrollLeft = scrollLeft - walk;
  });
  // Touch
  evoTrack?.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - evoTrack.offsetLeft;
    scrollLeft = evoTrack.scrollLeft;
  });
  evoTrack?.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX - evoTrack.offsetLeft;
    const walk = (x - startX) * 2;
    evoTrack.scrollLeft = scrollLeft - walk;
  });

  // PERFORMANCE TRAIL CANVAS
  if (trailCanvas) {
    const ctx = trailCanvas.getContext('2d');
    let particles = [];
    let w, h;
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      w = trailCanvas.width = trailCanvas.offsetWidth * dpr;
      h = trailCanvas.height = trailCanvas.offsetHeight * dpr;
      trailCanvas.style.width = trailCanvas.offsetWidth + 'px';
      trailCanvas.style.height = trailCanvas.offsetHeight + 'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    resize();
    window.addEventListener('resize', resize);

    let lastX = 0, lastY = 0;
    let active = false;
    const perfSection = document.getElementById('performance');
    
    const perfObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => active = entry.isIntersecting);
    }, { threshold: 0.2 });
    perfObserver.observe(perfSection);

    perfSection.addEventListener('mousemove', (e) => {
      if (!active) return;
      const rect = perfSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // add particles
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1,
          decay: Math.random() * 0.02 + 0.015,
          size: Math.random() * 3 + 1,
          hue: 270 + Math.random() * 20
        });
      }
      lastX = x; lastY = y;
    });

    function animateTrail() {
      const rectW = trailCanvas.offsetWidth;
      const rectH = trailCanvas.offsetHeight;
      ctx.clearRect(0, 0, rectW, rectH);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        p.vx *= 0.98;
        p.vy *= 0.98;
        
        if (p.life <= 0) {
          particles.splice(i, 1);
          return;
        }
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.life * 0.8})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsl(${p.hue}, 80%, 60%)`;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // lightning connection
        if (i > 0) {
          const prev = particles[i-1];
          const dist = Math.hypot(p.x - prev.x, p.y - prev.y);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(prev.x, prev.y);
            ctx.strokeStyle = `hsla(${p.hue}, 80%, 60%, ${p.life * 0.15})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });
      
      requestAnimationFrame(animateTrail);
    }
    animateTrail();
  }

  // COMBAT MODE SWITCHER
  const combatModes = document.querySelectorAll('.combat-mode');
  const combatImg = document.getElementById('combatImg');
  const combatData = document.getElementById('combatData');
  const combatGlitch = document.getElementById('combatGlitch');
  
  const combatContent = {
    speed: {
      text: "Скорость — не характеристика, а состояние. В режиме SPEED Mei перестает быть видимой. Остается только линия разреза. 0.0s до контакта.",
      glitch: "SPEED",
      filter: "contrast(1.2) saturate(1.3) hue-rotate(-10deg)"
    },
    precision: {
      text: "PRECISION — это когда катана становится продолжением нервной системы. Одно движение — один разрез реальности. Iai-стиль, доведенный до абсолюта.",
      glitch: "PRECISION",
      filter: "contrast(1.1) grayscale(0.2) brightness(1.1)"
    },
    lightning: {
      text: "LIGHTNING — поле боя превращается в проводник. Каждый шаг — разряд. Каждый взмах — шторм. Воздух ионизируется до того, как лезвие коснется цели.",
      glitch: "VOLTAGE",
      filter: "contrast(1.3) saturate(1.8) hue-rotate(20deg) brightness(1.2)"
    },
    burst: {
      text: "BURST — Herrscher пробуждается полностью. Пространство трескается. Время замедляется. Это не атака — это приговор, вынесенный молнией.",
      glitch: "BURST",
      filter: "contrast(1.5) saturate(2) hue-rotate(40deg) brightness(1.3) blur(0.5px)"
    }
  };

  combatModes.forEach(mode => {
    mode.addEventListener('click', () => {
      combatModes.forEach(m => m.classList.remove('active'));
      mode.classList.add('active');
      const type = mode.dataset.mode;
      const content = combatContent[type];
      
      combatData.style.opacity = '0';
      combatGlitch.style.opacity = '0';
      combatImg.style.filter = 'blur(10px)';
      
      setTimeout(() => {
        combatData.innerHTML = `<p>${content.text}</p>`;
        combatGlitch.textContent = content.glitch;
        combatImg.style.filter = content.filter;
        combatData.style.opacity = '1';
        combatGlitch.style.opacity = '0.15';
      }, 200);
    });
  });

  // MACHINE WORDS ANIMATION
  const machineSection = document.getElementById('machine');
  const machineWords = document.querySelectorAll('.m-word');
  const machineFinal = document.querySelector('.machine-final');
  
  const machineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        machineWords.forEach((word, i) => {
          setTimeout(() => word.classList.add('visible'), i * 300);
        });
        setTimeout(() => machineFinal.classList.add('visible'), 1400);
      }
    });
  }, { threshold: 0.5 });
  if (machineSection) machineObserver.observe(machineSection);

  // Smooth scroll for all internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Konami / easter egg: press T for thunder
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 't') {
      document.body.style.animation = 'flash 0.2s';
      setTimeout(() => document.body.style.animation = '', 200);
      // create lightning flash overlay
      const flash = document.createElement('div');
      flash.style.cssText = 'position:fixed; inset:0; background:white; z-index:10001; pointer-events:none; opacity:0.8; mix-blend-mode:screen';
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 100);
    }
  });

  // Add flash keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `@keyframes flash{0%{filter:brightness(1)} 50%{filter:brightness(1.5) contrast(1.2)} 100%{filter:brightness(1)}}`;
  document.head.appendChild(style);

  console.log('%cRAIDEN MEI — SPEC.01', 'font-size:24px; font-weight:800; color:#8B5CF6; font-family:monospace');
  console.log('%cSHE DOESN\'T CHASE THE STORM. SHE IS THE STORM.', 'color:#9CA3AF; font-family:monospace');
});
