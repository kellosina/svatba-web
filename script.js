function byId(id) { return document.getElementById(id); }
function norm(s) {
  return (s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function zkontrolujHeslo() {
  const vstup = (byId("heslo")?.value || "").trim().toLowerCase();
  const chybova = byId("chybova-zprava");
  if (vstup === "alohomora") {
    window.location.href = "ukol.html";
  } else if (chybova) {
    chybova.textContent = "Špatné kouzlo. Zkus to znovu!";
  }
}

/* ---------- Kolo 1: mapa.html (blur po každé správné odpovědi) ---------- */
function initMapa1() {
  const RIDDLES = [
    { q: "1. Bez hlasu pláče, bez nehtů štípá, bez nohou skáče, bez pysků pípá.", a: ["vítr","vitr"] },
    { q: "2. Není ji vidět, není ji cítit, není ji slyšet, nejde ji chytit. Je za hvězdami a pod horami a vyplňuje prázdné jámy. Byla tu předtím a přijde pak. a nakonec ti vytře zrak.", a: ["tma"] },
    { q: "3. Všechno žere, všechno se v něm ztrácí, stromy, květy, zvířata i ptáci. Hryže kov i pláty z ocele, tvrdý kámen na prach semele. Města rozvalí a krále skolí, vysokánské hory svrhne do údolí.", a: ["čas","cas"] },
    { q: "4. Co má město, ale ne domy; les, ale ne stromy; a řeku, ale ne vodu?", a: ["mapa"] },
    { q: "5. Kořeny má skryté v zemi, vypíná se nad jedlemi, stoupá pořád výš a výš, ale růst ji nevidíš.", a: ["hora"] }
  ];

  const KEY_IDX  = "mapa1_idx";
  const KEY_BLUR = "mapa1_blur";
  const START_BLUR = 20;
  const STEP       = 4;

  let idx = parseInt(localStorage.getItem(KEY_IDX) ?? "0", 10);
  if (Number.isNaN(idx)) idx = 0;

  let blurPx = parseInt(localStorage.getItem(KEY_BLUR) ?? String(START_BLUR), 10);
  if (Number.isNaN(blurPx)) blurPx = START_BLUR;

  if (idx === 0) {
    blurPx = START_BLUR;
    localStorage.setItem(KEY_BLUR, String(START_BLUR));
  }

  const img = byId("map-img");
  const qText = byId("q-text");
  const qProg = byId("q-progress");
  const status = byId("status");
  const form = byId("riddle-form");
  const input = byId("answer");
  const nextBtn = byId("next-map");
  const resetBtn = byId("reset-btn");

  if (!img || !qText || !qProg || !form || !input) return;

  img.style.filter = `blur(${Math.max(0, Math.min(START_BLUR, blurPx))}px)`;

  function render() {
    if (idx >= RIDDLES.length) {
      qProg.textContent = "Hotovo 🎉";
      qText.textContent = "Vyřešil(a) jsi všechny hádanky v 1. kole!";
      input.disabled = true;
      form.querySelector("button")?.setAttribute("disabled", "disabled");
      status.innerHTML = "<span class='ok'>Můžeš přejít na další mapu.</span>";
      if (nextBtn) nextBtn.style.display = "inline-block";
      return;
    }
    qProg.textContent = `Otázka ${idx + 1}/${RIDDLES.length}`;
    qText.textContent = RIDDLES[idx].q;
    status.textContent = "";
    input.value = "";
    input.focus();
  }
  render();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (idx >= RIDDLES.length) return;
    const user = norm(input.value);
    const ok = RIDDLES[idx].a.some(ans => user === norm(ans));
    if (ok) {
      blurPx = Math.max(0, blurPx - STEP);
      idx += 1;
      localStorage.setItem(KEY_BLUR, String(blurPx));
      localStorage.setItem(KEY_IDX, String(idx));
      location.reload(); 
    } else {
      status.innerHTML = "<span class='bad'>Špatná odpověď, zkus to znovu.</span>";
    }
  });

  resetBtn?.addEventListener("click", () => {
    localStorage.removeItem(KEY_IDX);
    localStorage.removeItem(KEY_BLUR);
    location.reload();
  });
}

/* ---------- Kolo 2: mapa2.html ---------- */
function initMapa2() {
  const IMAGES = ["mapall.png", "map4.png", "map3.png", "map2.png", "finalmap.png"];

  const RIDDLES = [
    { q: "1. Když to máš, chceš se podělit. Když se podělíš, už to nemáš.", a: ["tajemství","tajemstvi"] },
    { q: "2. Jsem jednou v minutě, dvakrát v momentě a ani jednou v roce.", a: ["m"] },
    { q: "3. Čím víc z toho ubíráš, tím větší to je.", a: ["díra","dira"] },
    { q: "4. Patří ti to, ale ostatní to používají víc než ty.", a: ["jméno","jmeno"] }
  ];

  const KEY_IDX = "mapa2_idx";
  let idx = parseInt(localStorage.getItem(KEY_IDX) ?? "0", 10);
  if (Number.isNaN(idx)) idx = 0;

  const img = byId("map-img");
  const qText = byId("q-text");
  const qProg = byId("q-progress");
  const status = byId("status");
  const form = byId("riddle-form");
  const input = byId("answer");
  const resetBtn = byId("reset-btn");
  const finishBtn = byId("finish-btn");

  if (!img || !qText || !qProg || !form || !input) return;

  function renderImage() {
    const clamped = Math.max(0, Math.min(IMAGES.length - 1, idx));
    img.src = IMAGES[clamped];
  }
  renderImage();

  function render() {
    if (idx >= RIDDLES.length) {
      qProg.textContent = "Hotovo 🎉";
      qText.textContent = "Zbyl poslední křížek!";
      input.disabled = true;
      form.querySelector("button")?.setAttribute("disabled", "disabled");
      status.innerHTML = "<span class='ok'>Odkryto.</span>";
      if (finishBtn) finishBtn.style.display = "inline-block";
      return;
    }
    qProg.textContent = `Otázka ${idx + 1}/${RIDDLES.length}`;
    qText.textContent = RIDDLES[idx].q;
    status.textContent = "";
    input.value = "";
    input.focus();
  }
  render();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (idx >= RIDDLES.length) return;
    const user = norm(input.value);
    const ok = RIDDLES[idx].a.some(ans => user === norm(ans));
    if (ok) {
      idx += 1;
      localStorage.setItem(KEY_IDX, String(idx));
      location.reload(); 
    } else {
      status.innerHTML = "<span class='bad'>Špatná odpověď, zkus to znovu.</span>";
    }
  });

  resetBtn?.addEventListener("click", () => {
    localStorage.removeItem(KEY_IDX);
    location.reload();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "mapa1") initMapa1();
  if (page === "mapa2") initMapa2();
});
