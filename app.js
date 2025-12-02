/* Smart Study Planner — app.js 
*/
const el = (sel) => document.querySelector(sel);
const els = (sel) => Array.from(document.querySelectorAll(sel));

const STORAGE_KEYS = {
  sessions: 'ssp.sessions.v1',
  assignments: 'ssp.assignments.v1',
  classes: 'ssp.classes.v1'
};

let classes = load(STORAGE_KEYS.classes, []);

const views = {
  dashboard: el('#view-dashboard'),
  assignments: el('#view-assignments')
};
function switchView(key){
  els('.view').forEach(v=>v.classList.remove('active'));
  els('.nav button').forEach(b=>b.classList.remove('active'));
  if(key === 'assignments'){
    views.assignments.classList.add('active');
    el('#btn-assignments').classList.add('active');
  }else{
    views.dashboard.classList.add('active');
    el('#btn-dashboard').classList.add('active');
  }
}
el('#btn-dashboard').addEventListener('click', ()=>switchView('dashboard'));
el('#btn-assignments').addEventListener('click', ()=>switchView('assignments'));
el('#btn-about').addEventListener('click', ()=> openAbout(true));

function openAbout(show){ el('#about-modal').classList.toggle('show', !!show); }
el('#about-close').addEventListener('click', ()=> openAbout(false));
el('#about-modal').addEventListener('click', (e)=> { if(e.target.id==='about-modal') openAbout(false); });

function load(key, fallback){
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch(_) { return fallback; }
}
function save(key, value){ localStorage.setItem(key, JSON.stringify(value)); }

let sessions = load(STORAGE_KEYS.sessions, []);
let assignments = load(STORAGE_KEYS.assignments, []);

if(sessions.length === 0){
  sessions = [
    { id: uid(), date: isoDate(-2), course:'COSC 412', minutes: 65, focus: 4, notes: 'Use cases draft' },
    { id: uid(), date: isoDate(-1), course:'CMSC 215', minutes: 45, focus: 3, notes: 'Arrays + loops practice' },
    { id: uid(), date: isoDate(0),  course:'STAT 200', minutes: 90, focus: 5, notes: 'Hypothesis tests review' }
  ];
  save(STORAGE_KEYS.sessions, sessions);
}

function uid(){ return Math.random().toString(36).slice(2,10); }
function isoDate(deltaDays=0){
  const d = new Date(); d.setDate(d.getDate()+deltaDays);
  return d.toISOString().slice(0,10);
}

el('#session-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  const course = el('#course').value.trim();
  const minutes = parseInt(el('#minutes').value,10);
  const focus = parseInt(el('#focus').value,10) || null;
  const notes = el('#notes').value.trim();

  if(!course || !minutes || minutes < 5){
    alert('Please enter a course and at least 5 minutes.');
    return;
  }

  const sess = { id: uid(), date: isoDate(0), course, minutes, focus, notes };
  sessions.unshift(sess);
  save(STORAGE_KEYS.sessions, sessions);
  renderSessions();
  renderStats();
  el('#session-form').reset();
});

function prioritizeTasks(assignments){
  return assignments.slice().sort((a, b) => {
  const dateDiff = new Date(a.due) - new Date(b.due);
  const diffDiff = (b.difficulty || 0) - (a.difficulty || 0);
  return dateDiff || diffDiff;
  });
}

el('#btn-auto-schedule').addEventListener('click', generateSchedule);

function generateSchedule() {
  if (assignments.length === 0) {
    alert('No assignments to schedule!');
    return;
  }

  const sortedAssignments = prioritizeTasks(assignments);

  const scheduleList = el('#schedule-list');
  scheduleList.innerHTML = '';

  sortedAssignments.forEach(task => {
    const est = task.estimatedMinutes ? ` — ${task.estimatedMinutes} min` : '';
    const li = document.createElement('li');
    li.textContent = `${task.course}: ${task.title}${est}`;
    scheduleList.appendChild(li);
  });
}

function deleteSession(id){
  sessions = sessions.filter(s => s.id !== id);
  save(STORAGE_KEYS.sessions, sessions);
  renderSessions();
  renderStats();
}

function renderSessions(){
  const tbody = el('#sessions-table tbody');
  tbody.innerHTML = '';
  sessions.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.date}</td>
      <td>${escapeHtml(s.course)}</td>
      <td>${s.minutes}</td>
      <td>${s.focus ?? '—'}</td>
      <td>${escapeHtml(s.notes || '')}</td>
      <td><button data-id="${s.id}" class="danger small">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll('button.danger').forEach(btn => {
    btn.addEventListener('click', ()=> deleteSession(btn.dataset.id));
  });
}


function renderClasses() {
  const tbody = el('#classes-table tbody'); // make sure your table exists
  tbody.innerHTML = '';
  classes.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(c.name)}</td>
      <td>${escapeHtml(c.instructor || '')}</td>
      <td><button data-id="${c.id}" class="danger small">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('button.danger').forEach(btn => {
    btn.addEventListener('click', () => {
      classes = classes.filter(c => c.id !== btn.dataset.id);
      save(STORAGE_KEYS.classes, classes);
      renderClasses(); 
    });
  });
}

function renderAssignments() {
  const tbody = el('#assignments-table tbody');
  tbody.innerHTML = '';
  
  assignments.forEach(a => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(a.title)}</td>
      <td>${escapeHtml(a.course || '')}</td>
      <td>${a.due}</td>
      <td>${a.difficulty || 3}</td>
      <td>${a.estimatedMinutes ? a.estimatedMinutes + ' min' : '—'}</td>
      <td><button data-id="${a.id}" class="danger small">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('button.danger').forEach(btn => {
    btn.addEventListener('click', () => {
      assignments = assignments.filter(a => a.id !== btn.dataset.id);
      save(STORAGE_KEYS.assignments, assignments);
      renderAssignments();
    });
  });
}

el('#assignment-form').addEventListener('submit', e => {
  e.preventDefault();
  const title = el('#assignment-title').value.trim();
  const course = el('#assignment-course').value.trim();
  const due = el('#assignment-due').value;
  if (!title || !due) return alert('Title and Due Date are required');

  const estimatedMinutes = parseInt(el('#assignment-estimate').value, 10) || null;

  const newAssignment = {
    id: uid(),
    title,
    course,
    due,
    difficulty: parseInt(el('#assignment-difficulty').value, 10) || 3,
    estimatedMinutes: estimatedMinutes
  };

  assignments.unshift(newAssignment);
  save(STORAGE_KEYS.assignments, assignments);
  renderAssignments();
  el('#assignment-form').reset();
});

el('#class-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = el('#class-name').value.trim();
  const instructor = el('#class-instructor').value.trim();
  if (!name) return alert('Course Name is required');

  const newClass = { id: uid(), name, instructor };
  classes.unshift(newClass);
  save(STORAGE_KEYS.classes, classes);
  renderClasses();
  el('#class-form').reset();
});


function escapeHtml(str=''){ return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

function renderStats(){
  const totalMin = sessions.reduce((a,s)=>a + (s.minutes||0), 0);
  el('#stat-total').textContent = `${(totalMin/60).toFixed(1)}h`;

  const now = new Date();
  const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay()); 
  const weekCount = sessions.filter(s => new Date(s.date) >= startOfWeek).length;
  el('#stat-week').textContent = weekCount;

  const focused = sessions.filter(s => s.focus);
  const avgFocus = focused.length ? (focused.reduce((a,s)=>a+s.focus,0)/focused.length).toFixed(1) : '—';
  el('#stat-focus').textContent = avgFocus;
}

el('#btn-refresh-insights').addEventListener('click', refreshInsights);
function refreshInsights(){
  const list = el('#insights-list');
  list.innerHTML = '';
  const tips = getAIAdvicePrototype(sessions);
  tips.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t;
    list.appendChild(li);
  });
}

function getAIAdvicePrototype(sessions){
  const tips = [];
  const total = sessions.reduce((a,s)=>a+s.minutes,0);
  const avgFocus = sessions.filter(s=>s.focus).reduce((a,s)=>a+s.focus,0) / (sessions.filter(s=>s.focus).length || 1);
  if(total < 300) tips.push('Try scheduling two 50-60 minute blocks this week to build momentum.');
  if(avgFocus && avgFocus < 3.2) tips.push('Your focus trend is dipping. Consider 5-minute breaks every 25 minutes (Pomodoro).');
  const byCourse = groupBy(sessions, s=>s.course);
  const leastCourse = Object.entries(byCourse).sort((a,b)=> sum(b[1],'minutes') - sum(a[1],'minutes')).pop();
  if(leastCourse && leastCourse[1].length >= 1) tips.push(`You studied ${leastCourse[0]} the least. Add a short review block before bed.`);
  if(tips.length === 0) tips.push('Great consistency! Next: set a stretch goal of +10% minutes this week.');
  return tips.slice(0,3);
}

function groupBy(arr, fn){
  return arr.reduce((acc, x)=>{ const k = fn(x); (acc[k] ||= []).push(x); return acc; }, {});
}
function sum(arr, key){ return arr.reduce((a,x)=>a+(x[key]||0),0); }

el('#btn-add-asn').addEventListener('click', ()=>{
  alert('Assignments feature is still under construction. (MVP backlog)');
  
});

function drawPlaceholderChart(){
  const c = document.getElementById('progress-chart');
  if(!c) return;
  const ctx = c.getContext('2d');
  ctx.clearRect(0,0,c.width,c.height);
  ctx.globalAlpha = 1;
  ctx.font = '14px system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Weekly totals — placeholder chart', 18, 24);
 
  const bars = [120, 80, 150, 60, 90, 50, 0]; 
  const w = 60, gap = 20, base = 200;
  bars.forEach((m,i)=>{
    const h = Math.round((m/160)*140);
    ctx.fillStyle = i % 2 ? '#38bdf8' : '#a78bfa';
    ctx.fillRect(30 + i*(w+gap), base - h, w, h);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i], 34 + i*(w+gap), base + 16);
  });
}

function init(){
  renderSessions();
  renderStats();
  renderClasses();
  renderAssignments();
  refreshInsights();
  drawPlaceholderChart();
}
init();

window.__SSP__ = { sessions, assignments, classes, refreshInsights };
