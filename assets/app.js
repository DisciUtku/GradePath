// Basit durum ve kalıcılık
const STORAGE_KEY = 'grade-planner-v1';
let globalCourses = [];
let globalContextMenuOpen = false;
// Track document listeners for context menu cleanup
let ctxDocClick = null;
let ctxDocCtx = null;

// Dil ve harf notu eşikleri
const DEFAULT_GRADE_THRESHOLDS = { AA: 90, BA: 85, BB: 80, CB: 75, CC: 70, DC: 65, DD: 60, FD: 55, FF: 0 };
let gradeThresholds = { ...DEFAULT_GRADE_THRESHOLDS };
let currentLang = 'tr';

const I18N = {
  tr: {
    appTitle: 'Ağırlıklı Not Hesaplayıcı',
    navOverview: 'Genel Bakış',
    navAddCourse: 'Ders Ekle',
    navAdvice: 'Ne Yapmalıyım?',
    navImport: 'İçe Aktar (CSV/JSON)',
    navExport: 'Dışa Aktar',
    generalSettings: 'Genel Ayarlar',
    targetGpaLabel: 'Hedef GANO (Sınıf Geçme için)',
    passThresholdLabel: 'Geçme Puanı (Ders için)',
    scaleLabel: 'Not Ölçeği',
    scale100: "TR 100'lük → 4.0 (varsayılan)",
    scale4: '4.0 Gösterimi',
    languageLabel: 'Dil',
    quickActions: 'Hızlı işlemler',
    addCourse: 'Ders Ekle',
    save: 'Kaydet',
    gradeThresholdsBtn: 'Harf Notu Eşikleri',
    coursesTitle: 'Dersler',
    summaryTitle: 'Özet',
    footerText: 'Web + Android (PWA) • Yerel kayıt • Offline destek',
    scaleHint100: 'Notlar 100 üzerinden gösteriliyor. GANO 4.00 üzerinden hesaplanır.',
    scaleHint4: 'Notlar 4.00 üzerinden gösteriliyor.',
    colCourseName: 'Ders Adı',
    colCredits: 'Kredi',
    colPass: 'Geçme Puanı',
    segmentAddDetail: 'Bölüm Ekle (Quiz/Ödev/Proje)',
    back: 'Geri',
    weightInfo: 'Ağırlık toplamı 100 olmalı; kalan kısım için gereken not hesaplanır.',
    tileScore: 'Toplam Not',
    tileStatus: 'Durum',
    passed: 'Geçti',
    failed: 'Kaldı',
    creditsShort: 'kr',
    sumGpaEst: 'GANO (tahmini)',
    sumTargetGpa: 'Hedef GANO',
    sumPassClass: 'Sınıf Geçme',
    meets: 'Ulaşılıyor',
    below: 'Altında',
    toastSaved: 'Kaydedildi',
    colorTitle: 'Renk Seç',
    modalClose: 'Kapat',
    modalCancel: 'İptal',
    modalOk: 'Onayla',
    courseCreateTitle: 'Ders Oluştur',
    courseEditTitle: 'Ders Düzenle',
    adviceTitle: 'Ne Yapmalıyım? - Akıllı Öneriler',
    needCourseAlert: 'Önce en az bir ders ekleyin!',
    thresholdsTitle: 'Harf Notu Eşikleri',
    thresholdsDesc: 'Her harf için minimum 100’lük puanı belirleyin (üstten alta azalan).',
    thresholdsReset: 'Varsayılanlara Sıfırla',
    thresholdsNote: 'Geçersiz girişler yok sayılır; değerler 0-100 arası olmalı.',
    help: 'Yardım',
    helpTitle: 'Nasıl çalışır?',
    helpBody: 'Ders oluştur, ağırlıkları (toplam 100) ayarla, notları gir. Kartlar toplam not ve durumu gösterir. Bir dersi silmek veya rengini değiştirmek için tile’a sağ tıkla/uzun bas. Ayrıntı için tile’a tıkla. Minimum gerekenler için önerileri kullan.',
    startTour: 'Tutorialı Başlat',
    tourNext: 'İleri',
    tourBack: 'Geri',
    tourFinish: 'Bitir',
    tourSkip: 'Atla',
    tourStepHeader: 'Başlık ve GANO rozeti. Güncel GANO değiştikçe burada güncellenir.',
    tourStepAdd: 'Yeni ders eklemek için bu butonu kullanın.',
    tourStepTiles: 'Ders kartları: tıkla → ayrıntı; sağ tık/uzun bas → sil veya renk.',
    tourStepSummary: 'Özet paneli: GANO, hedef GANO ve durum.',
    tourStepAdvice: 'Akıllı öneriler: eksik bölümler için minimum gerekli puanlar.',
    tourStepSettings: 'Genel Ayarlar: dil, not ölçeği, geçme puanı ve harf eşikleri.',
  },
  en: {
    appTitle: 'Weighted Grade Calculator',
    navOverview: 'Overview',
    navAddCourse: 'Add Course',
    navAdvice: 'What should I do?',
    navImport: 'Import (CSV/JSON)',
    navExport: 'Export',
    generalSettings: 'General Settings',
    targetGpaLabel: 'Target GPA (to pass)',
    passThresholdLabel: 'Passing Score (per course)',
    scaleLabel: 'Scale',
    scale100: 'TR 100 → 4.0 (default)',
    scale4: 'Show as 4.0',
    languageLabel: 'Language',
    quickActions: 'Quick actions',
    addCourse: 'Add Course',
    save: 'Save',
    gradeThresholdsBtn: 'Letter Grade Thresholds',
    coursesTitle: 'Courses',
    summaryTitle: 'Summary',
    footerText: 'Web + Android (PWA) • Local storage • Offline support',
    scaleHint100: 'Scores are shown out of 100. GPA is calculated on 4.00.',
    scaleHint4: 'Scores are shown on a 4.00 scale.',
    colCourseName: 'Course Name',
    colCredits: 'Credits',
    colPass: 'Passing Score',
    segmentAddDetail: 'Add Segment (Quiz/HW/Project)',
    back: 'Back',
    weightInfo: 'Weights must sum to 100; needed score on remaining is computed.',
    tileScore: 'Total Score',
    tileStatus: 'Status',
    passed: 'Passed',
    failed: 'Failed',
    creditsShort: 'cr',
    sumGpaEst: 'GPA (estimated)',
    sumTargetGpa: 'Target GPA',
    sumPassClass: 'Class Pass',
    meets: 'Meets',
    below: 'Below',
    toastSaved: 'Saved',
    colorTitle: 'Pick Color',
    modalClose: 'Close',
    modalCancel: 'Cancel',
    modalOk: 'Confirm',
    courseCreateTitle: 'Create Course',
    courseEditTitle: 'Edit Course',
    adviceTitle: 'What should I do? - Smart Advice',
    needCourseAlert: 'Add at least one course first!',
    thresholdsTitle: 'Letter Grade Thresholds',
    thresholdsDesc: 'Set minimum 100-scale score for each letter (descending).',
    thresholdsReset: 'Reset to Defaults',
    thresholdsNote: 'Invalid inputs are ignored; values must be 0-100.',
    help: 'Help',
    helpTitle: 'How it works',
    helpBody: 'Create courses, set weights (sum 100), enter scores. Tiles show total and status. Right‑click or long‑press a tile to delete or change color. Click a tile for details. Use advice for minimum required scores.',
    startTour: 'Start tutorial',
    tourNext: 'Next',
    tourBack: 'Back',
    tourFinish: 'Finish',
    tourSkip: 'Skip',
    tourStepHeader: 'Header and GPA badge. It updates whenever your GPA changes.',
    tourStepAdd: 'Use this button to add a new course.',
    tourStepTiles: 'Course tiles: click → details; right‑click/long‑press → delete or color.',
    tourStepSummary: 'Summary: GPA, target GPA, and pass status.',
    tourStepAdvice: 'Smart advice: minimum required scores for missing segments.',
    tourStepSettings: 'General Settings: language, scale, passing score, and letter thresholds.',
  }
};

function t(key) {
  const lang = getLang();
  return (I18N[lang] && I18N[lang][key]) || I18N.tr[key] || key;
}

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; } catch { return null; }
}
function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Not ölçeği: 100'lükten 4.0'a basit dönüşüm (örnek)
function toGpa4(score100) {
  if (score100 == null || isNaN(score100)) return 0;
  if (score100 >= 90) return 4.0;
  if (score100 >= 85) return 3.7;
  if (score100 >= 80) return 3.3;
  if (score100 >= 75) return 3.0;
  if (score100 >= 70) return 2.7;
  if (score100 >= 65) return 2.3;
  if (score100 >= 60) return 2.0;
  if (score100 >= 55) return 1.7;
  if (score100 >= 50) return 1.3;
  if (score100 >= 45) return 1.0;
  return 0.0;
}

// Hesaplama motoru
function computeCourseScore(course, defaultPassThreshold) {
  const pass = Number(course.passThreshold ?? defaultPassThreshold);
  let total = 0;
  let usedWeight = 0;
  let missingWeight = 0;
  for (const s of course.segments) {
    const w = Number(s.weight || 0);
    const hasScore = s.score !== '' && s.score != null && !isNaN(Number(s.score));
    const v = hasScore ? Number(s.score) : 0;
    total += (v * w) / 100;
    usedWeight += w;
    if (!hasScore) missingWeight += w;
  }
  const remaining = Math.max(0, 100 - usedWeight);
  const needForPass = remaining > 0 ? Math.max(0, pass - total) * (100 / remaining) : null;
  const passed = total >= pass;
  const needOnMissingEntered = missingWeight > 0 ? Math.max(0, pass - total) * (100 / missingWeight) : null;
  return { total: round1(total), passed, needOnRemaining: needForPass != null ? round1(needForPass) : null, needOnMissingEntered: needOnMissingEntered != null ? round1(needOnMissingEntered) : null };
}

function computeOverallGpa(courses) {
  let totalPoints = 0;
  let totalCredits = 0;
  for (const c of courses) {
    const score = computeCourseScore(c, c._defaults.defaultPassThreshold).total;
    const gpa = toGpa4(score);
    const cr = Number(c.credits || 0);
    totalPoints += gpa * cr;
    totalCredits += cr;
  }
  const gano = totalCredits > 0 ? totalPoints / totalCredits : 0;
  return round2(gano);
}

function round1(x){ return Math.round(x * 10) / 10; }
function round2(x){ return Math.round(x * 100) / 100; }

// UI
const coursesEl = document.getElementById('courses');
const addCourseBtn = document.getElementById('add-course-btn');
// Manuel kaydet butonları kaldırıldı
const navAddCourseBtn = document.getElementById('nav-add-course');
// Örnek doldur kaldırıldı
const gpaBadgeEl = document.getElementById('gpa-badge');
const targetGpaEl = document.getElementById('target-gpa');
const defaultPassEl = document.getElementById('default-pass-threshold');
const summaryEl = document.getElementById('summary');
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const drawerScrim = document.getElementById('drawer-scrim');
const langSelectEl = document.getElementById('lang-select');
const gradeThresholdsBtn = document.getElementById('grade-thresholds-btn');
const helpBtn = document.getElementById('help-btn');
const langFab = document.getElementById('lang-fab');
const langMenu = document.getElementById('lang-menu');

function newCourse() {
  return {
    id: crypto.randomUUID(),
    name: 'Yeni Ders',
    credits: 3,
    passThreshold: null, // null → genel eşik
    segments: [
      { name: 'Vize', weight: 40, score: '' },
      { name: 'Final', weight: 60, score: '' },
    ],
  };
}

function getState() {
  // Grid görünümünde DOM'dan değil, globalCourses listesinden oku
  const inGrid = coursesEl.classList.contains('grid');
  const courses = inGrid
    ? (Array.isArray(globalCourses) ? globalCourses : [])
    : Array.from(coursesEl.querySelectorAll('.course-card')).map(card => deserializeCourse(card));
  return {
    targetGpa: Number(targetGpaEl?.value || 0),
    defaultPassThreshold: Number(defaultPassEl?.value || 60),
    courses,
    lang: getLang(),
    gradeThresholds: gradeThresholds
  };
}

function setState(state) {
  if (targetGpaEl) targetGpaEl.value = state.targetGpa ?? 2.0;
  if (defaultPassEl) defaultPassEl.value = state.defaultPassThreshold ?? 60;
  currentLang = (state.lang === 'en' ? 'en' : 'tr');
  if (langSelectEl) langSelectEl.value = currentLang;
  gradeThresholds = sanitizeThresholds(state.gradeThresholds) || { ...DEFAULT_GRADE_THRESHOLDS };
  applyTranslations();
  renderCourses(state.courses || []);
  renderSummary();
  closeAllDropdowns();
}

function renderCourses(courses) {
  globalCourses = courses; // Global listeyi güncelle
  coursesEl.classList.add('grid');
  coursesEl.innerHTML = '';
  for (const c of courses) {
    coursesEl.appendChild(renderCourseTile(c));
  }
  // Overview modunda genel ayarlar/özet görünsün
  document.querySelectorAll('.hide-in-detail').forEach(el => { el.style.display = 'block'; });
}

function renderCourseCard(course) {
  const card = document.createElement('div');
  card.className = 'course-card detail';
  card.dataset.id = course.id;
  // Apply and persist color on detail card
  const color = course.color || '#0d1730';
  card.dataset.color = color;
  card.style.background = color;

  const head = document.createElement('div');
  head.className = 'course-head';
  const defaultThreshold = Number(defaultPassEl?.value || 60);
  head.innerHTML = `
    <div class="grid" style="flex:1">
      <label class="field"><span>${t('colCourseName')}</span><input class="c-name" value="${course.name || ''}" /></label>
      <label class="field"><span>${t('colCredits')}</span><input class="c-credits" type="number" min="0" step="1" value="${course.credits || 0}" /></label>
      <label class="field"><span>${t('colPass')}</span><input class="c-pass" type="number" min="0" max="100" step="1" placeholder="${defaultThreshold}" value="${course.passThreshold ?? ''}" /></label>
    </div>
  `;
  card.appendChild(head);

  const segs = document.createElement('div');
  segs.className = 'segments';
  for (const s of course.segments) {
    segs.appendChild(renderSegmentRow(s));
  }
  card.appendChild(segs);

  const info = document.createElement('div');
  info.className = 'muted';
  info.style.marginTop = '8px';
  info.textContent = t('weightInfo');
  card.appendChild(info);

  card.addEventListener('input', onAnyChange);
  card.addEventListener('click', (e)=>{
    const act = e.target?.dataset?.act;
    if (act === 'del-course') {
      card.remove();
      onAnyChange();
    } else if (act === 'del-seg') {
      e.target.closest('.segment-row').remove();
      onAnyChange();
    }
  });

  return card;
}

function renderCourseTile(course){
  const tile = document.createElement('div');
  tile.className = 'course-card tile';
  tile.dataset.id = course.id;
  tile.dataset.color = course.color || 'default';
  const res = computeCourseScore({...course, _defaults:{defaultPassThreshold: Number(defaultPassEl.value||60)}}, Number(defaultPassEl.value||60));

  // Renk uygula
  const tileColor = course.color || '#0d1730';
  tile.style.background = tileColor;
  applyTextColorFromBg(tile, tileColor);

  const displayTotal = formatScore100ToScale(res.total);
  tile.setAttribute('tabindex', '0');
  tile.setAttribute('role', 'button');
  tile.setAttribute('aria-label', `${course.name || 'Ders'} ayrıntılarını aç`);

  tile.innerHTML = `
    <div class="tile-head">
      <div class="tile-title">${course.name || 'Ders'}</div>
      <span class="tile-meta">${course.credits||0} ${t('creditsShort')}</span>
    </div>
    <div class="tile-stats">
      <div class="pill">${t('tileScore')}: <b>${displayTotal}</b></div>
      <div class="pill">${t('tileStatus')}: <b>${res.passed? t('passed') : t('failed')}</b></div>
    </div>
  `;

  // Context menu - PC: sağ tık, Mobil: basılı tutma
  let pressTimer;
  let contextMenuOpen = false;

  // PC için sağ tık
  tile.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    globalContextMenuOpen = true;
    showContextMenu(e, course, tile);
  });

  // Mobil için basılı tutma
  tile.addEventListener('touchstart', (e) => {
    pressTimer = setTimeout(() => {
      contextMenuOpen = true;
      showContextMenu(e.touches[0], course, tile);
    }, 500);
  });

  tile.addEventListener('touchend', () => {
    clearTimeout(pressTimer);
  });

  tile.addEventListener('touchmove', () => {
    clearTimeout(pressTimer);
  });

  // Klavye erişimi
  tile.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!globalContextMenuOpen) openCourseDetail(course);
    } else if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
      e.preventDefault();
      const rect = tile.getBoundingClientRect();
      const fakeEvent = { clientX: rect.left + 16, clientY: rect.top + 16 };
      showContextMenu(fakeEvent, course, tile);
    }
  });

  // Sol tık - ders detayına git (context menü açık değilse)
  tile.addEventListener('click', (e) => {
    if (!globalContextMenuOpen) {
      openCourseDetail(course);
    }
  });

  return tile;
}

function openCourseDetail(course){
  // Grid yerine tek kart görünümü
  coursesEl.classList.remove('grid');
  coursesEl.innerHTML = '';
  const card = renderCourseCard(course);
  coursesEl.appendChild(card);
  // Detay modunda genel ayarlar ve özet gizlenir
  document.querySelectorAll('.hide-in-detail').forEach(el => { el.style.display = 'none'; });

  // Detay görünümünde segment ekleme butonu
  const addRow = document.createElement('div');
  addRow.style.marginTop = '8px';
  addRow.innerHTML = `<button class="btn" id="add-segment-detail">${t('segmentAddDetail')}</button>
  <button class="btn" id="back-to-grid" style="margin-left:8px">${t('back')}</button>`;
  coursesEl.appendChild(addRow);
  document.getElementById('add-segment-detail').addEventListener('click', ()=>{
    const segs = card.querySelector('.segments');
    segs.appendChild(renderSegmentRow({ name: 'Quiz', weight: 0, score: '' }));
    onAnyChange();
  });
  document.getElementById('back-to-grid').addEventListener('click', ()=>{
    // Detay görünümündeki değişiklikleri kaydet
    const currentCourse = deserializeCourse(card);
    // Kaydedilmiş tüm kursları al
    const saved = loadState();
    let list = (saved && saved.courses) ? saved.courses : globalCourses;
    if (!Array.isArray(list)) list = [];
    const idx = list.findIndex(c => c.id === currentCourse.id);
    if (idx >= 0) list[idx] = currentCourse; else list.push(currentCourse);
    globalCourses = list;
    saveState({ targetGpa: Number(targetGpaEl?.value || 0), defaultPassThreshold: Number(defaultPassEl?.value || 60), courses: globalCourses });

    renderCourses(globalCourses);
    renderSummary();
  });
}

// Drag & drop reorder
let dragSrc = null;
function enableDrag(row){
  const handle = row.querySelector('.drag');
  if (!handle) return;
  handle.addEventListener('dragstart', (e)=>{
    dragSrc = row;
    row.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });
  handle.addEventListener('dragend', ()=>{
    if (dragSrc) dragSrc.classList.remove('dragging');
    dragSrc = null;
    onAnyChange();
  });
  row.addEventListener('dragover', (e)=>{
    if (!dragSrc) return;
    e.preventDefault();
    const container = row.parentElement;
    const children = Array.from(container.children);
    const srcIndex = children.indexOf(dragSrc);
    const targetIndex = children.indexOf(row);
    if (srcIndex < 0 || targetIndex < 0 || dragSrc === row) return;
    if (srcIndex < targetIndex) container.insertBefore(dragSrc, row.nextSibling); else container.insertBefore(dragSrc, row);
  });
}

function renderSegmentRow(seg) {
  const row = document.createElement('div');
  row.className = 'segment-row';
  row.innerHTML = `
    <div style="display:flex; gap:8px; align-items:center">
      <span class="drag" draggable="true" title="Sürükle">↕</span>
      <input class="s-name" placeholder="Bölüm adı" value="${seg.name || ''}" />
    </div>
    <input class="s-weight" type="number" min="0" max="100" step="1" placeholder="Ağırlık %" value="${seg.weight || 0}" />
    <div style="display:flex; gap:8px">
      <input class="s-score" type="number" min="0" max="100" step="0.1" placeholder="Not %" value="${seg.score ?? ''}" />
      <button class="btn" data-act="del-seg">×</button>
    </div>
  `;
  enableDrag(row);
  return row;
}

function deserializeCourse(card) {
  // Tile kartları için temel + renk
  if (card.classList.contains('tile')) {
    const titleEl = card.querySelector('.tile-title');
    const metaEl = card.querySelector('.tile-meta');
    const color = card.dataset.color || '#0d1730';
    return {
      id: card.dataset.id,
      name: titleEl ? titleEl.textContent : 'Ders',
      credits: metaEl ? Number((metaEl.textContent || '0').replace(/\D/g, '')) || 0 : 0,
      passThreshold: null,
      color,
      segments: [
        { name: 'Vize', weight: 40, score: '' },
        { name: 'Final', weight: 60, score: '' },
      ],
    };
  }

  // Detay kartları için tam deserializasyon (renk dahil)
  const nameEl = card.querySelector('.c-name');
  const creditsEl = card.querySelector('.c-credits');
  const passEl = card.querySelector('.c-pass');
  const color = card.dataset.color || card.style.background || '#0d1730';

  return {
    id: card.dataset.id,
    name: nameEl ? nameEl.value : 'Ders',
    credits: creditsEl ? Number(creditsEl.value || 0) : 0,
    passThreshold: (passEl && passEl.value !== '' ? Number(passEl.value) : null),
    color,
    segments: Array.from(card.querySelectorAll('.segment-row')).map(r => {
      const nameInput = r.querySelector('.s-name');
      const weightInput = r.querySelector('.s-weight');
      const scoreInput = r.querySelector('.s-score');
      return {
        name: nameInput ? nameInput.value : '',
        weight: weightInput ? Number(weightInput.value || 0) : 0,
        score: (scoreInput && scoreInput.value !== '' ? Number(scoreInput.value) : ''),
      };
    }),
  };
}

function onAnyChange() {
  renderSummary();
  // otomatik kaydet - detay görünümündeyse sadece o kursu güncelle
  if (!coursesEl.classList.contains('grid')) {
    // Detay modunda: mevcut kursu global listede güncelle
    const currentCard = coursesEl.querySelector('.course-card.detail');
    if (currentCard) {
      const updatedCourse = deserializeCourse(currentCard);
      const courseIndex = globalCourses.findIndex(c => c.id === updatedCourse.id);
      if (courseIndex >= 0) {
        globalCourses[courseIndex] = updatedCourse;
      } else {
        globalCourses.push(updatedCourse);
      }
      const st = {
        targetGpa: Number(targetGpaEl?.value || 0),
        defaultPassThreshold: Number(defaultPassEl?.value || 60),
        courses: globalCourses,
        lang: getLang(),
        gradeThresholds: gradeThresholds
      };
      saveState(st);
    }
  } else {
    // Grid modunda: normal kayıt
    const st = getState();
    saveState(st);
  }
}

function renderSummary() {
  const state = getState();
  // small hack to pass default into compute
  for (const c of state.courses) c._defaults = { defaultPassThreshold: state.defaultPassThreshold };

  const cards = coursesEl.querySelectorAll('.course-card');
  cards.forEach((card, idx)=>{
    if (card.classList.contains('tile')) return; // tile'lar özet içeriyor, detay kartlarına uygula
    const c = state.courses[idx] || deserializeCourse(card);
    const res = computeCourseScore(c, state.defaultPassThreshold);
    let info = card.querySelector('.course-info');
    if (!info) {
      info = document.createElement('div');
      info.className = 'summary course-info card';
      info.style.marginTop = '8px';
      card.appendChild(info);
    }
    const displayTotal = formatScore100ToScale(res.total);
    const letter = getScale() === '100' ? ` (<span class="muted">${toLetterGradeCustom(res.total)}</span>)` : '';
    info.innerHTML = `
      <div class="card"><div>${t('tileScore')}</div><strong>${displayTotal}${letter}</strong></div>
      <div class="card"><div>${t('tileStatus')}</div><strong>${res.passed ? t('passed') : t('failed')}</strong></div>
    `;
  });

  const gano = computeOverallGpa(state.courses.map(c => ({...c, _defaults:{defaultPassThreshold: state.defaultPassThreshold}})));
  const meets = gano >= state.targetGpa;
  summaryEl.innerHTML = `
    <div class="card"><div>${t('sumGpaEst')}</div><strong>${gano}</strong></div>
    <div class="card"><div>${t('sumTargetGpa')}</div><strong>${state.targetGpa}</strong></div>
    <div class="card"><div>${t('sumPassClass')}</div><strong>${meets ? t('meets') : t('below')}</strong></div>
  `;
  if (gpaBadgeEl) gpaBadgeEl.textContent = `${getLang()==='tr'?'GANO':'GPA'}: ${gano.toFixed(2)}`;
  updateScaleHint();
}

addCourseBtn.addEventListener('click', ()=>{
  const nc = newCourse();
  // Otomatik renk ata
  nc.color = nextAutoColor();
  // grid modundaysa yeni ders tile olarak eklenir, detayda ise karta eklenir
  if (coursesEl.classList.contains('grid')) {
    coursesEl.appendChild(renderCourseTile(nc));
    // Global listeyi güncelle
    globalCourses = [...globalCourses, nc];
  } else {
    coursesEl.appendChild(renderCourseCard(nc));
  }
  renderSummary();
  // Yeni ders eklendiğinde kaydet
  const st = getState();
  saveState(st);
});

// Manuel kaydet event'leri kaldırıldı
if (navAddCourseBtn) navAddCourseBtn.addEventListener('click', ()=>{
  openCourseCreateModal();
});

const navAdviceBtn = document.getElementById('nav-advice');
if (navAdviceBtn) navAdviceBtn.addEventListener('click', ()=>{
  openAdviceModal();
});

// Sidebar toggle (mobil ve masaüstü)
if (sidebarToggle) sidebarToggle.addEventListener('click', ()=>{
  if (window.matchMedia('(max-width: 900px)').matches) {
    sidebar.classList.toggle('open');
    drawerScrim.hidden = !sidebar.classList.contains('open');
  } else {
    sidebar.classList.toggle('hidden');
  }
});
if (drawerScrim) drawerScrim.addEventListener('click', ()=>{
  sidebar.classList.remove('open');
  drawerScrim.hidden = true;
});

// Sidebar her modda erişilebilir olsun: detayda da pointer-events açık
sidebar.style.pointerEvents = 'auto';
// Uygulama başlarken sidebar kapalı olsun
sidebar.classList.add('hidden');

// Mobilde menü öğesine tıklanınca menüyü otomatik kapat
const sidebarMenu = document.querySelector('.sidebar .menu');
if (sidebarMenu) {
  sidebarMenu.addEventListener('click', (e)=>{
    const item = e.target.closest('.menu-item');
    if (!item) return;
    if (window.matchMedia('(max-width: 900px)').matches) {
      sidebar.classList.remove('open');
      drawerScrim.hidden = true;
    }
  });
}

// Örnek doldur işlemi kaldırıldı

// İlk yükleme
const saved = loadState();
if (saved) setState(saved); else setState({ targetGpa: 2.0, defaultPassThreshold: 60, lang: 'tr', gradeThresholds: { ...DEFAULT_GRADE_THRESHOLDS }, courses: [ newCourse() ] });

// Modal altyapısı
const modal = document.getElementById('modal');
const backdrop = document.getElementById('modal-backdrop');
function openModal(title, contentNode, onConfirm) {
  // Clean any previous modal listeners
  if (modal._cleanup) {
    modal._cleanup();
  }

  modal.innerHTML = '';
  const dialog = document.createElement('div');
  dialog.className = 'dialog';
  dialog.innerHTML = `<div class="dialog-head"><h3 id="modal-title">${title}</h3><button class="btn" data-act="close">${t('modalClose')}</button></div>`;
  dialog.appendChild(contentNode);
  // Only show footer actions when there is a confirm action; otherwise header close is enough
  if (typeof onConfirm === 'function') {
    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.justifyContent = 'flex-end';
    actions.style.gap = '8px';
    actions.style.marginTop = '12px';
    actions.innerHTML = `<button class="btn" data-act="cancel">${t('modalCancel')}</button><button class="btn primary" data-act="ok">${t('modalOk')}</button>`;
    dialog.appendChild(actions);
  }
  modal.appendChild(dialog);
  modal.hidden = false; backdrop.hidden = false;

  const onClick = (e) => {
    const act = e.target?.dataset?.act;
    if (!act) return; // Only react to explicit actions
    if (act === 'close' || act === 'cancel') {
      cleanup();
    }
    if (act === 'ok') {
      try { if (onConfirm) onConfirm(); } finally { cleanup(); }
    }
  };

  const onBackdropClick = () => { cleanup(); };
  const onKey = (e) => { if (e.key === 'Escape') cleanup(); };

  modal.addEventListener('click', onClick);
  backdrop.addEventListener('click', onBackdropClick);
  document.addEventListener('keydown', onKey);

  function cleanup() {
    modal.removeEventListener('click', onClick);
    backdrop.removeEventListener('click', onBackdropClick);
    document.removeEventListener('keydown', onKey);
    modal.hidden = true; backdrop.hidden = true;
    delete modal._cleanup;
  }

  // Expose for external close calls
  modal._cleanup = cleanup;
}
function closeModal(){ if (modal._cleanup) { modal._cleanup(); } else { modal.hidden = true; backdrop.hidden = true; } }

// SW güncellemesi olduğunda otomatik yenile
if (navigator.serviceWorker) {
  navigator.serviceWorker.getRegistrations().then(regs=>{
    for (const r of regs) r.update();
  });
}

// Ders oluşturma modalı
function openCourseCreateModal(){
  const wrap = document.createElement('div');
  const defaultThreshold = Number(defaultPassEl?.value || 60);
  wrap.innerHTML = `
    <div class="grid">
      <label class="field"><span>${t('colCourseName')}</span><input id="m-name" /></label>
      <label class="field"><span>${t('colCredits')}</span><input id="m-credits" type="number" min="0" step="1" value="3" /></label>
      <label class="field"><span>${t('colPass')}</span><input id="m-pass" type="number" min="0" max="100" step="1" placeholder="${defaultThreshold}" /></label>
    </div>
  `;
  openModal(t('courseCreateTitle'), wrap, () => {
    const base = newCourse();
    base.name = wrap.querySelector('#m-name').value || 'Yeni Ders';
    base.credits = Number(wrap.querySelector('#m-credits').value || 3);
    const passRaw = wrap.querySelector('#m-pass').value;
    base.passThreshold = passRaw === '' ? null : Number(passRaw);
    base.color = nextAutoColor();
    if (coursesEl.classList.contains('grid')) {
      coursesEl.appendChild(renderCourseTile(base));
      globalCourses = [...globalCourses, base];
    } else {
      coursesEl.appendChild(renderCourseCard(base));
    }
    renderSummary();
    // Modal ile ders oluşturulduğunda kaydet
    const st = getState();
    saveState(st);
  });
}

// Ders düzenleme modalı (Vize/Final başta, otomatik ağırlık)
function openCourseEditModal(card){
  const data = deserializeCourse(card);
  const wrap = document.createElement('div');
  const segs = JSON.parse(JSON.stringify(data.segments || []));
  // Vize ve Final'i en üste taşı
  segs.sort((a,b)=>{
    const rank = (n)=>{
      const t = (n?.name||'').toLowerCase();
      if (t.includes('vize')) return 0;
      if (t.includes('final')) return 1;
      return 2;
    };
    return rank(a) - rank(b);
  });
  wrap.appendChild(renderSegmentsEditor(segs));

  openModal(t('courseEditTitle'), wrap, () => {
    const edited = readSegmentsEditor(wrap);
    data.segments = edited;
    // Kartı güncelle
    if (coursesEl.classList.contains('grid')) {
      // tile modunda sadece state'i güncelle ve grid'i yeniden çiz
      const all = getState();
      const idx = Array.from(coursesEl.children).findIndex(el => el.dataset.id === data.id);
      // basit yeniden çizim
      const tiles = Array.from(coursesEl.children);
      coursesEl.innerHTML = '';
      for (const t of tiles) {
        const id = t.dataset.id;
        if (id === data.id) coursesEl.appendChild(renderCourseTile(data)); else {
          // mevcut tile datasını yakalayamıyoruz; basit yaklaşım: yeniden hesap
          const name = t.querySelector('.tile-title')?.textContent || 'Ders';
          const cr = Number((t.querySelector('.tile-meta')?.textContent||'0').replace(/\D/g,'')) || 0;
          coursesEl.appendChild(renderCourseTile({ id, name, credits: cr, passThreshold: null, segments: [] }));
        }
      }
    } else {
      const newCard = renderCourseCard(data);
      card.replaceWith(newCard);
    }
    onAnyChange();
  });
}

function renderSegmentsEditor(segments){
  const box = document.createElement('div');
  const list = document.createElement('div');
  list.className = 'segments';

  for (const s of segments) list.appendChild(segmentEditorRow(s));

  const addRow = document.createElement('div');
  addRow.style.marginTop = '8px';
  addRow.innerHTML = `<button class="btn" data-act="add">Bölüm Ekle</button>`;

  box.appendChild(list);
  box.appendChild(addRow);

  box.addEventListener('input', (e)=>{
    if (!(e.target instanceof HTMLInputElement)) return;
    if (!e.target.classList.contains('e-weight')) return;
    const rows = Array.from(list.querySelectorAll('.seg-edit'));
    const mid = rows.find(r => (r.querySelector('.e-name').value||'').toLowerCase().includes('vize'));
    const fin = rows.find(r => (r.querySelector('.e-name').value||'').toLowerCase().includes('final'));
    if (mid && fin && e.target === mid.querySelector('.e-weight')){
      let others = 0;
      for (const r of rows) {
        if (r === fin) continue;
        const w = Number(r.querySelector('.e-weight').value || 0);
        others += w;
      }
      const finW = Math.max(0, 100 - others);
      fin.querySelector('.e-weight').value = String(finW);
    }
  });

  box.addEventListener('click', (e)=>{
    const act = e.target?.dataset?.act;
    if (act === 'add') {
      list.appendChild(segmentEditorRow({ name: 'Bölüm', weight: 0, score: '' }));
    } else if (act === 'del') {
      e.target.closest('.seg-edit').remove();
    }
  });

  return box;
}

function segmentEditorRow(seg){
  const r = document.createElement('div');
  r.className = 'seg-edit segment-row';
  r.innerHTML = `
    <input class="e-name" placeholder="Bölüm adı" value="${seg.name||''}" />
    <input class="e-weight" type="number" min="0" max="100" step="1" placeholder="Ağırlık %" value="${seg.weight||0}" />
    <div style="display:flex; gap:8px">
      <input class="e-score" type="number" min="0" max="100" step="0.1" placeholder="Not %" value="${seg.score ?? ''}" />
      <button class="btn" data-act="del">×</button>
    </div>
  `;
  return r;
}

function readSegmentsEditor(container){
  return Array.from(container.querySelectorAll('.seg-edit')).map(r => ({
    name: r.querySelector('.e-name').value,
    weight: Number(r.querySelector('.e-weight').value || 0),
    score: (r.querySelector('.e-score').value === '' ? '' : Number(r.querySelector('.e-score').value)),
  }));
}

// Segment ağırlık otomatik tamamlama
document.addEventListener('input', (e)=>{
  if (!(e.target instanceof HTMLInputElement)) return;
  if (!e.target.classList.contains('s-weight')) return;
  const row = e.target.closest('.course-card');
  if (!row) return;
  const segRows = Array.from(row.querySelectorAll('.segment-row'));
  // Varsayılan: Vize ve Final öncelik
  const findByName = (name) => segRows.find(r => (r.querySelector('.s-name').value || '').toLowerCase().includes(name));
  const mid = findByName('vize');
  const fin = findByName('final');
  // Sadece vize değişince otomatik final ayarla (diğerlerinin ağırlıkları sabit kalır)
  if (mid && fin && e.target === mid.querySelector('.s-weight')) {
    const midW = Number(mid.querySelector('.s-weight').value || 0);
    // Diğerlerinin toplamını hesapla (final hariç)
    let others = 0;
    for (const r of segRows) {
      if (r === fin) continue;
      const w = Number(r.querySelector('.s-weight').value || 0);
      others += w;
    }
    const finW = Math.max(0, 100 - others);
    fin.querySelector('.s-weight').value = String(finW);
  }
  // Final değişirse toplam 100'ü korumak için (yalnız final) diğerlerine dokunmadan sadece finali sınırlı tut
  if (fin && e.target === fin.querySelector('.s-weight')) {
    let others = 0;
    for (const r of segRows) {
      if (r === fin) continue;
      const w = Number(r.querySelector('.s-weight').value || 0);
      others += w;
    }
    const maxFin = Math.max(0, 100 - others);
    const current = Number(fin.querySelector('.s-weight').value || 0);
    if (current > maxFin) fin.querySelector('.s-weight').value = String(maxFin);
  }
});

// Tüm değişiklikleri dinle ve kaydet
document.addEventListener('input', (e)=>{
  if (e.target.matches('input, select, textarea')) {
    // Kısa gecikme ile kaydet (çok sık kayıt önlemek için)
    clearTimeout(window.autoSaveTimeout);
    window.autoSaveTimeout = setTimeout(()=>{
      onAnyChange();
    }, 500);
  }
});

// Tıklanabilirlik: dinamik butonlar için event delegation (ör. sil, düzenle vb.)
document.addEventListener('click', (e)=>{
  const t = e.target;
  if (!(t instanceof HTMLElement)) return;
  // dropdown kapanışı
  if (t.matches('.dropdown-menu .menu-item')) {
    const menu = t.closest('.dropdown-menu');
    if (menu) menu.hidden = true;
  }
  // dışarı tıklayınca tüm dropdownları kapat
  if (!t.closest('.dropdown')) {
    closeAllDropdowns();
  }
});

function closeAllDropdowns(){
  document.querySelectorAll('.dropdown-menu').forEach(m=>{ m.hidden = true; });
  document.querySelectorAll('[data-act="menu"]').forEach(b=>{ b.setAttribute('aria-expanded','false'); });
}

// Context Menu sistemi
function showContextMenu(event, course, tile) {
  event.preventDefault();

  // Already open? Close and reopen at new position
  closeContextMenu();

  globalContextMenuOpen = true;

  // Tile'a aktif efekt ekle
  tile.classList.add('context-active');

  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.innerHTML = `
    <button class="menu-item btn" data-action="delete">🗑️ Dersi Sil</button>
    <button class="menu-item btn" data-action="color">🎨 Renk Değiştir</button>
  `;

  // Pozisyon hesapla
  const x = event.clientX || event.pageX;
  const y = event.clientY || event.pageY;

  menu.style.left = `${Math.min(x, window.innerWidth - 180)}px`;
  menu.style.top = `${Math.min(y, window.innerHeight - 100)}px`;

  document.body.appendChild(menu);

  // Menü tıklamalarını dinle
  menu.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    if (action === 'delete') {
      deleteCourse(course.id);
    } else if (action === 'color') {
      showColorPicker(course, tile);
    }
    closeContextMenu();
  });

  // Dışarı tık ve başka bir sağ tıkta kapat (document seviyesinde, tekil handler)
  ctxDocClick = (e) => {
    if (!menu.contains(e.target)) closeContextMenu();
  };
  ctxDocCtx = (e) => {
    // Yeni context menu açılmadan önce eskisini kapat
    if (!menu.contains(e.target)) closeContextMenu();
  };
  document.addEventListener('click', ctxDocClick);
  document.addEventListener('contextmenu', ctxDocCtx, { capture: true });
}

function closeContextMenu() {
  const existing = document.querySelector('.context-menu');
  if (existing) {
    existing.remove();
  }
  // Tüm tile'lardan aktif efekti kaldır
  document.querySelectorAll('.course-card.tile.context-active').forEach(tile => {
    tile.classList.remove('context-active');
  });
  // Document dinleyicilerini kaldır
  if (ctxDocClick) {
    document.removeEventListener('click', ctxDocClick);
    ctxDocClick = null;
  }
  if (ctxDocCtx) {
    document.removeEventListener('contextmenu', ctxDocCtx, { capture: true });
    ctxDocCtx = null;
  }
  // Global context menu durumunu sıfırla
  globalContextMenuOpen = false;
}

function deleteCourse(courseId) {
  if (confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
    // Global listeden kaldır
    globalCourses = globalCourses.filter(c => c.id !== courseId);

    // State'i güncelle ve kaydet
    const state = {
      targetGpa: Number(targetGpaEl?.value || 0),
      defaultPassThreshold: Number(defaultPassEl?.value || 60),
      courses: globalCourses,
      lang: getLang(),
      gradeThresholds: gradeThresholds
    };
    saveState(state);

    // UI'yi yenile
    renderCourses(globalCourses);
    renderSummary();
  }
}

function showColorPicker(course, tile) {
  const colors = [
    '#0d1730', // Default
    '#7c2d12', // Red
    '#a16207', // Yellow
    '#166534', // Green
    '#1e40af', // Blue
    '#7c2d92', // Purple
    '#be123c', // Pink
    '#0f766e'  // Teal
  ];

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 12px 0;">
      ${colors.map(color => `
        <button class="color-option" data-color="${color}" style="width: 40px; height: 40px; background: ${color}; border: 2px solid var(--border); border-radius: 8px; cursor: pointer;"></button>
      `).join('')}
    </div>
  `;

  openModal('🎨 Renk Seç', wrap, () => {
    const selected = wrap.querySelector('.color-option.selected');
    if (selected) {
      const newColor = selected.dataset.color;

      // Course objesini güncelle
      course.color = newColor;

      // Global listede güncelle
      const courseIndex = globalCourses.findIndex(c => c.id === course.id);
      if (courseIndex >= 0) {
        globalCourses[courseIndex].color = newColor;
      }

      // Kaydet
      const state = {
        targetGpa: Number(targetGpaEl?.value || 0),
        defaultPassThreshold: Number(defaultPassEl?.value || 60),
        courses: globalCourses,
        lang: getLang(),
        gradeThresholds: gradeThresholds
      };
      saveState(state);

      // Tile'ı güncelle
      tile.style.background = newColor;
      tile.dataset.color = newColor;
    } else {
      // Hiçbir renk seçilmediyse varsayılan rengi kullan
      const defaultColor = '#0d1730';
      course.color = defaultColor;

      const courseIndex = globalCourses.findIndex(c => c.id === course.id);
      if (courseIndex >= 0) {
        globalCourses[courseIndex].color = defaultColor;
      }

      const state = {
        targetGpa: Number(targetGpaEl?.value || 0),
        defaultPassThreshold: Number(defaultPassEl?.value || 60),
        courses: globalCourses,
        lang: getLang(),
        gradeThresholds: gradeThresholds
      };
      saveState(state);

      tile.style.background = defaultColor;
      tile.dataset.color = defaultColor;
    }
  });

  // Renk seçimini dinle
  wrap.addEventListener('click', (e) => {
    if (e.target.classList.contains('color-option')) {
      // Önceki seçimi temizle
      wrap.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.remove('selected');
        opt.style.borderColor = 'var(--border)';
        opt.style.borderWidth = '2px';
        opt.style.transform = 'scale(1)';
      });

      // Yeni seçimi işaretle
      e.target.classList.add('selected');
      e.target.style.borderColor = 'var(--primary)';
      e.target.style.borderWidth = '3px';
      e.target.style.transform = 'scale(1.1)';
    }
  });

  // Mevcut rengi işaretle (varsa)
  if (course.color) {
    const currentColorBtn = wrap.querySelector(`[data-color="${course.color}"]`);
    if (currentColorBtn) {
      currentColorBtn.classList.add('selected');
      currentColorBtn.style.borderColor = 'var(--primary)';
      currentColorBtn.style.borderWidth = '3px';
      currentColorBtn.style.transform = 'scale(1.1)';
    }
  }
}

// "Ne Yapmalıyım?" Akıllı Öneri Sistemi
function openAdviceModal(){
  const state = getState();
  if (!state.courses || state.courses.length === 0) {
    alert(t('needCourseAlert'));
    return;
  }

  const advice = generateAdvice(state);
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="max-height: 400px; overflow-y: auto;">
      ${advice.html}
    </div>
    <div style="margin-top: 12px; padding: 12px; background: #0d1730; border-radius: 8px; border: 1px solid var(--border);">
      <strong>📊 Genel Durum:</strong><br>
      Mevcut GANO: <strong>${advice.currentGpa}</strong> | Hedef: <strong>${state.targetGpa}</strong><br>
      ${advice.overallStatus}
    </div>
  `;

  openModal('💡 ' + t('adviceTitle'), wrap, null);
}

function generateAdvice(state) {
  let html = '';
  let totalPoints = 0;
  let totalCredits = 0;
  let hasIncompleteData = false;

  for (const course of state.courses) {
    course._defaults = { defaultPassThreshold: state.defaultPassThreshold };
    const res = computeCourseScore(course, state.defaultPassThreshold);
    const gpa = toGpa4(res.total);
    const credits = Number(course.credits || 0);

    totalPoints += gpa * credits;
    totalCredits += credits;

    // Eksik segmentleri bul
    const missingSegments = course.segments.filter(s => s.score === '' || s.score == null);
    const completedSegments = course.segments.filter(s => s.score !== '' && s.score != null);

    if (missingSegments.length > 0) {
      hasIncompleteData = true;

      html += `<div style="margin-bottom: 16px; padding: 12px; background: #0d1730; border-radius: 8px; border: 1px solid var(--border);">`;
      html += `<h4 style="margin: 0 0 8px 0; color: var(--primary);">📚 ${course.name} (${credits} kredi)</h4>`;

      // Mevcut durum
      if (completedSegments.length > 0) {
        html += `<div style="margin-bottom: 8px;">`;
        html += `<strong>Mevcut:</strong> `;
        completedSegments.forEach(s => {
          html += `${s.name}: ${s.score}% (${s.weight}%) • `;
        });
        html = html.slice(0, -2); // Son • kaldır
        html += `</div>`;
      }

      // Eksik bölümler için öneriler
      html += `<div style="margin-bottom: 8px;"><strong>📋 Yapılacaklar:</strong></div>`;

      for (const missing of missingSegments) {
        const otherWeight = course.segments
          .filter(s => s !== missing)
          .reduce((sum, s) => sum + Number(s.weight || 0), 0);

        const otherScore = course.segments
          .filter(s => s !== missing && s.score !== '' && s.score != null)
          .reduce((sum, s) => sum + (Number(s.score) * Number(s.weight)) / 100, 0);

        const passThreshold = Number(course.passThreshold ?? state.defaultPassThreshold);
        const neededFromThis = Math.max(0, passThreshold - otherScore);
        const thisWeight = Number(missing.weight || 0);

        if (thisWeight > 0) {
          const minScore = Math.max(0, (neededFromThis * 100) / thisWeight);

          let status = '';
          let emoji = '';
          if (minScore <= 50) {
            status = 'Çok Kolay 😎';
            emoji = '🟢';
          } else if (minScore <= 70) {
            status = 'Kolay 😊';
            emoji = '🟡';
          } else if (minScore <= 85) {
            status = 'Orta 😐';
            emoji = '🟠';
          } else if (minScore <= 100) {
            status = 'Zor 😰';
            emoji = '🔴';
          } else {
            status = 'İmkansız ❌';
            emoji = '⚫';
          }

          html += `<div style="margin: 4px 0; padding: 8px; background: #0b1626; border-radius: 6px;">`;
          html += `${emoji} <strong>${missing.name}</strong> (${missing.weight}%): En az <strong>${Math.round(minScore)}</strong> puan • ${status}`;
          html += `</div>`;
        }
      }

      // Geçme durumu
      if (res.passed) {
        html += `<div style="color: #22c55e; font-weight: bold;">✅ Bu dersi geçebilirsiniz!</div>`;
      } else {
        html += `<div style="color: #ef4444; font-weight: bold;">⚠️ Bu dersten geçmek için yukarıdaki minimum puanları almalısınız.</div>`;
      }

      html += `</div>`;
    } else {
      // Tamamlanmış ders
      html += `<div style="margin-bottom: 12px; padding: 8px; background: #0d1730; border-radius: 8px; border: 1px solid #22c55e;">`;
      html += `✅ <strong>${course.name}</strong>: ${res.total} puan - ${res.passed ? 'Geçti' : 'Kaldı'}`;
      html += `</div>`;
    }
  }

  const currentGpa = totalCredits > 0 ? round2(totalPoints / totalCredits) : 0;
  const meetsTarget = currentGpa >= state.targetGpa;

  let overallStatus = '';
  if (!hasIncompleteData) {
    overallStatus = meetsTarget ?
      '🎉 Tebrikler! Hedef GANO\'nuza ulaştınız!' :
      '⚠️ Hedef GANO\'nuzun altındasınız.';
  } else {
    overallStatus = meetsTarget ?
      '✨ Şu anki durumunuz hedef GANO\'yu karşılıyor. Yukarıdaki önerileri takip edin.' :
      '🎯 Hedef GANO\'ya ulaşmak için yukarıdaki minimum puanları almanız gerekiyor.';
  }

  if (html === '') {
    html = '<div style="text-align: center; padding: 20px; color: var(--muted);">Henüz analiz edilecek ders bulunamadı.</div>';
  }

  return {
    html,
    currentGpa: currentGpa.toFixed(2),
    overallStatus
  };
}

// Ölçek ve yardımcılar
function getScale() {
  const el = document.getElementById('scale-select');
  const val = (el && el.value) || 'tr-default';
  // 'tr-default' => 100'lük gösterim; '4' => 4.0 gösterim
  return val === '4' ? '4' : '100';
}
function formatScore100ToScale(score100) {
  return getScale() === '4' ? toGpa4(score100) : round1(score100);
}
function applyTextColorFromBg(element, bgColor) {
  // bgColor in hex like #rrggbb
  let hex = (bgColor || '').toString();
  if (!hex.startsWith('#')) {
    // Try to parse rgb(a)
    const m = hex.match(/rgb\s*\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (m) {
      const r = parseInt(m[1], 10), g = parseInt(m[2], 10), b = parseInt(m[3], 10);
      hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
    } else {
      hex = '#0d1730';
    }
  }
  const r = parseInt(hex.substr(1, 2), 16) / 255;
  const g = parseInt(hex.substr(3, 2), 16) / 255;
  const b = parseInt(hex.substr(5, 2), 16) / 255;
  // Relative luminance
  const srgb = [r, g, b].map(c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  const L = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  const text = L > 0.5 ? '#031423' : '#e6edf3';
  element.style.color = text;
}

function getScaleHintText() {
  return getScale() === '4' ? t('scaleHint4') : t('scaleHint100');
}
function updateScaleHint() {
  const hint = document.getElementById('scale-hint');
  if (hint) hint.textContent = getScaleHintText();
}
// Harf notu eşlemesi (özelleştirilebilir)
function sanitizeThresholds(obj) {
  if (!obj || typeof obj !== 'object') return null;
  const cleaned = {};
  for (const k of Object.keys(DEFAULT_GRADE_THRESHOLDS)) {
    const v = Number(obj[k]);
    if (!isNaN(v) && v >= 0 && v <= 100) cleaned[k] = v;
  }
  if (cleaned.FF == null) cleaned.FF = 0;
  return Object.keys(cleaned).length ? cleaned : null;
}
function toLetterGradeCustom(score100) {
  const s = Number(score100 || 0);
  const th = gradeThresholds || DEFAULT_GRADE_THRESHOLDS;
  const entries = Object.entries(th).sort((a,b)=>b[1]-a[1]);
  for (const [letter, min] of entries) {
    if (s >= min) return letter;
  }
  return 'FF';
}
// Otomatik ders rengi paleti
const AUTO_COLORS = ['#0d1730','#1e3a8a','#166534','#7c2d12','#7c2d92','#0f766e','#a16207','#be123c'];
let autoColorIdx = 0;
function nextAutoColor() { const c = AUTO_COLORS[autoColorIdx % AUTO_COLORS.length]; autoColorIdx++; return c; }

// Ölçek değiştiğinde yeniden render
const scaleSelectEl = document.getElementById('scale-select');
if (scaleSelectEl) {
  scaleSelectEl.addEventListener('change', () => {
    // Grid görünümündeysek tüm tile'ları baştan çizelim
    if (coursesEl.classList.contains('grid')) {
      const list = Array.isArray(globalCourses) ? globalCourses : [];
      renderCourses(list);
    }
    renderSummary();
  });
  // İlk yüklemede ipucu
  updateScaleHint();
}
// Dil seçimi ve çeviri uygulama
function getLang(){ return (langSelectEl && (langSelectEl.value === 'en')) ? 'en' : currentLang || 'tr'; }
function applyTranslations(){
  const byId = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
  byId('app-title', t('appTitle'));
  byId('nav-overview', t('navOverview'));
  byId('nav-add-course', t('navAddCourse'));
  byId('nav-advice', t('navAdvice'));
  // Import/Export kaldırıldı
  byId('general-settings-title', t('generalSettings'));
  byId('label-target-gpa', t('targetGpaLabel'));
  byId('label-pass-threshold', t('passThresholdLabel'));
  byId('label-scale', t('scaleLabel'));
  const opt100 = document.getElementById('opt-scale-100'); if (opt100) opt100.textContent = t('scale100');
  const opt4 = document.getElementById('opt-scale-4'); if (opt4) opt4.textContent = t('scale4');
  byId('label-language', t('languageLabel'));
  byId('label-quick-actions', t('quickActions'));
  const addBtn = document.getElementById('add-course-btn'); if (addBtn) addBtn.textContent = t('addCourse');
  const saveBtnEl = document.getElementById('quick-save'); if (saveBtnEl) saveBtnEl.textContent = t('save');
  const thrBtn = document.getElementById('grade-thresholds-btn'); if (thrBtn) thrBtn.textContent = t('gradeThresholdsBtn');
  byId('courses-title', t('coursesTitle'));
  byId('summary-title', t('summaryTitle'));
  byId('footer-text', t('footerText'));
  const helpBtnEl = document.getElementById('help-btn'); if (helpBtnEl) helpBtnEl.innerHTML = `❓ ${t('help')}`;
  updateScaleHint();
  // Re-render dynamic components for text changes
  if (coursesEl.classList.contains('grid')) {
    renderCourses(globalCourses || []);
  } else {
    renderSummary();
  }
}
if (langSelectEl) {
  langSelectEl.addEventListener('change', ()=>{
    currentLang = langSelectEl.value === 'en' ? 'en' : 'tr';
    applyTranslations();
    const st = getState();
    saveState(st);
  });
}

// Floating language switcher
if (langFab && langMenu) {
  langFab.addEventListener('click', ()=>{
    const expanded = langFab.getAttribute('aria-expanded') === 'true';
    langFab.setAttribute('aria-expanded', String(!expanded));
    langMenu.hidden = expanded;
  });
  langMenu.addEventListener('click', (e)=>{
    const btn = e.target.closest('.lang-opt');
    if (!btn) return;
    const v = btn.dataset.lang === 'en' ? 'en' : 'tr';
    currentLang = v;
    if (langSelectEl) langSelectEl.value = v; // keep hidden select in sync if exists
    applyTranslations();
    const st = getState();
    saveState(st);
    langMenu.hidden = true;
    langFab.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('click', (e)=>{
    if (!langMenu.hidden && !e.target.closest('#lang-menu') && !e.target.closest('#lang-fab')) {
      langMenu.hidden = true;
      langFab.setAttribute('aria-expanded', 'false');
    }
  });
}

// Harf notu eşikleri modalı
function openThresholdsModal(){
  const wrap = document.createElement('div');
  const letters = Object.keys(DEFAULT_GRADE_THRESHOLDS);
  const current = gradeThresholds || DEFAULT_GRADE_THRESHOLDS;
  const rows = letters.map(letter => `
    <label class="field">
      <span>${letter}</span>
      <input type="number" min="0" max="100" step="1" data-letter="${letter}" value="${current[letter]}" />
    </label>
  `).join('');
  wrap.innerHTML = `
    <div class="muted" style="margin-bottom:8px">${t('thresholdsDesc')}</div>
    <div class="grid">${rows}</div>
    <div class="muted" style="margin-top:8px">${t('thresholdsNote')}</div>
    <div style="margin-top:8px"><button class="btn" id="thr-reset">${t('thresholdsReset')}</button></div>
  `;
  wrap.querySelector('#thr-reset').addEventListener('click', ()=>{
    gradeThresholds = { ...DEFAULT_GRADE_THRESHOLDS };
    wrap.querySelectorAll('input[data-letter]').forEach(inp=>{
      const l = inp.getAttribute('data-letter');
      inp.value = String(gradeThresholds[l]);
    });
  });
  openModal(t('thresholdsTitle'), wrap, ()=>{
    const inputs = Array.from(wrap.querySelectorAll('input[data-letter]'));
    const obj = {};
    for (const input of inputs) {
      const letter = input.getAttribute('data-letter');
      const val = Number(input.value);
      if (!isNaN(val) && val >= 0 && val <= 100) obj[letter] = val;
    }
    const ordered = Object.entries(DEFAULT_GRADE_THRESHOLDS).map(([k])=>k);
    let last = 101;
    for (const l of ordered) {
      let v = obj[l] != null ? obj[l] : (gradeThresholds[l] != null ? gradeThresholds[l] : DEFAULT_GRADE_THRESHOLDS[l]);
      if (v >= last) v = Math.max(0, last - 1);
      obj[l] = v;
      last = v;
    }
    gradeThresholds = obj;
    const st = getState();
    saveState(st);
    renderSummary();
  });
}
if (gradeThresholdsBtn) {
  gradeThresholdsBtn.addEventListener('click', openThresholdsModal);
}

// Yardım modalı ve tur
function openHelpModal(){
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div class="muted" style="margin-bottom:8px">${t('helpBody')}</div>
    <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:8px">
      <button class="btn primary" id="start-tour-btn">${t('startTour')}</button>
    </div>
  `;
  openModal(t('helpTitle'), wrap, null);
  const startBtn = wrap.querySelector('#start-tour-btn');
  if (startBtn) startBtn.addEventListener('click', ()=>{ closeModal(); startTour(); });
}
if (helpBtn) {
  helpBtn.addEventListener('click', openHelpModal);
}

function startTour(){
  const steps = [
    { el: document.querySelector('.app-header'), text: t('tourStepHeader') },
    { el: document.getElementById('add-course-btn'), text: t('tourStepAdd') },
    { el: document.getElementById('courses'), text: t('tourStepTiles') },
    { el: document.getElementById('summary').parentElement, text: t('tourStepSummary') },
    { el: document.getElementById('nav-advice'), text: t('tourStepAdvice') },
    { el: document.querySelector('.panel.hide-in-detail'), text: t('tourStepSettings') },
  ].filter(s => !!s.el);

  if (steps.length === 0) return;

  let idx = 0;
  const backdrop = document.createElement('div');
  backdrop.className = 'tour-backdrop';
  const highlight = document.createElement('div');
  highlight.className = 'tour-highlight';
  const tip = document.createElement('div');
  tip.className = 'tour-tooltip';

  function place(){
    // Tutorial sırasında sidebar'ı görünür yap (hedef öğe menüdeyse)
    const target = steps[idx].el;
    if (sidebar && (target === document.getElementById('nav-advice') || target.closest('.sidebar'))) {
      sidebar.classList.remove('hidden');
    }
    const rect = target.getBoundingClientRect();
    highlight.style.left = rect.left + 'px';
    highlight.style.top = rect.top + 'px';
    highlight.style.width = rect.width + 'px';
    highlight.style.height = rect.height + 'px';

    // Tooltip below if space else above
    const margin = 8;
    let top = rect.bottom + margin;
    if (top + 160 > window.innerHeight) top = rect.top - 160 - margin;
    tip.style.left = Math.max(12, Math.min(rect.left, window.innerWidth - 380)) + 'px';
    tip.style.top = Math.max(12, top) + 'px';

    tip.innerHTML = `
      <div>${steps[idx].text}</div>
      <div class="tour-controls">
        <button class="btn" data-act="skip">${t('tourSkip')}</button>
        ${idx>0?`<button class="btn" data-act="back">${t('tourBack')}</button>`:''}
        <button class="btn primary" data-act="next">${idx<steps.length-1?t('tourNext'):t('tourFinish')}</button>
      </div>
    `;
  }

  function cleanup(){
    window.removeEventListener('resize', place);
    document.removeEventListener('scroll', place, true);
    [backdrop, highlight, tip].forEach(n=> n.remove());
  }

  tip.addEventListener('click', (e)=>{
    const act = e.target?.dataset?.act;
    if (!act) return;
    if (act === 'skip') { cleanup(); return; }
    if (act === 'back') { idx = Math.max(0, idx-1); place(); return; }
    if (act === 'next') {
      if (idx < steps.length - 1) { idx++; place(); } else { cleanup(); }
    }
  });
  window.addEventListener('resize', place);
  document.addEventListener('scroll', place, true);

  document.body.appendChild(backdrop);
  document.body.appendChild(highlight);
  document.body.appendChild(tip);
  place();
}
