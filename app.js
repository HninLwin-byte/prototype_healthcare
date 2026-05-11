// ── Data ──
const patients = [
  { id: 'P-1001', name: 'Sarah Johnson', age: 45, gender: 'Female', dept: 'Cardiology', status: 'critical', doctor: 'Dr. Chen', room: 'ICU-3', bp: '160/95', hr: 112, temp: '38.5°C', diagnosis: 'Acute MI' },
  { id: 'P-1002', name: 'James Wilson', age: 62, gender: 'Male', dept: 'Neurology', status: 'stable', doctor: 'Dr. Patel', room: '302-A', bp: '130/85', hr: 78, temp: '36.8°C', diagnosis: 'Stroke Recovery' },
  { id: 'P-1003', name: 'Emily Davis', age: 28, gender: 'Female', dept: 'Orthopedics', status: 'observation', doctor: 'Dr. Kim', room: '415-B', bp: '120/80', hr: 72, temp: '37.0°C', diagnosis: 'Fracture - Tibia' },
  { id: 'P-1004', name: 'Robert Brown', age: 55, gender: 'Male', dept: 'Oncology', status: 'stable', doctor: 'Dr. Santos', room: '208-A', bp: '125/82', hr: 80, temp: '36.9°C', diagnosis: 'Chemo Cycle 3' },
  { id: 'P-1005', name: 'Maria Garcia', age: 34, gender: 'Female', dept: 'Pediatrics', status: 'discharged', doctor: 'Dr. Lee', room: '--', bp: '115/75', hr: 68, temp: '36.6°C', diagnosis: 'Post-natal care' },
  { id: 'P-1006', name: 'Michael Lee', age: 71, gender: 'Male', dept: 'Pulmonology', status: 'critical', doctor: 'Dr. Adams', room: 'ICU-7', bp: '145/90', hr: 98, temp: '39.1°C', diagnosis: 'COPD Exacerbation' },
  { id: 'P-1007', name: 'Anna Smith', age: 50, gender: 'Female', dept: 'Cardiology', status: 'observation', doctor: 'Dr. Chen', room: '310-C', bp: '140/88', hr: 85, temp: '37.2°C', diagnosis: 'Arrhythmia' },
  { id: 'P-1008', name: 'David Kim', age: 39, gender: 'Male', dept: 'Emergency', status: 'stable', doctor: 'Dr. Ortiz', room: 'ER-12', bp: '118/76', hr: 74, temp: '36.7°C', diagnosis: 'Laceration repair' }
];

const appointments = [
  { time: '08:00', title: 'Morning Rounds', doctor: 'Dr. Chen', type: 'Rounds', dept: 'Cardiology' },
  { time: '09:30', title: 'MRI Scan - Wilson', doctor: 'Dr. Patel', type: 'Imaging', dept: 'Neurology' },
  { time: '10:00', title: 'Surgery - Fracture Repair', doctor: 'Dr. Kim', type: 'Surgery', dept: 'Orthopedics' },
  { time: '11:30', title: 'Chemo Session', doctor: 'Dr. Santos', type: 'Treatment', dept: 'Oncology' },
  { time: '13:00', title: 'Post-Op Check', doctor: 'Dr. Kim', type: 'Follow-up', dept: 'Orthopedics' },
  { time: '14:30', title: 'Cardiac Consult', doctor: 'Dr. Chen', type: 'Consultation', dept: 'Cardiology' },
  { time: '16:00', title: 'Discharge Review', doctor: 'Dr. Lee', type: 'Admin', dept: 'Pediatrics' },
];

const departments = [
  { name: 'Emergency', patients: 24, capacity: 30, color: 'var(--accent-rose)' },
  { name: 'Cardiology', patients: 18, capacity: 25, color: 'var(--accent-cyan)' },
  { name: 'Neurology', patients: 12, capacity: 20, color: 'var(--accent-violet)' },
  { name: 'Orthopedics', patients: 15, capacity: 22, color: 'var(--accent-emerald)' },
  { name: 'Oncology', patients: 10, capacity: 18, color: 'var(--accent-amber)' },
  { name: 'Pulmonology', patients: 8, capacity: 15, color: 'var(--accent-blue)' },
];

// ── Agent Knowledge Base ──
const agentKB = {
  greetings: ["Hello! I'm MediBot, your AI healthcare assistant. How can I help you today?"],
  responses: {
    'patient count': () => `We currently have **${patients.length}** registered patients. ${patients.filter(p => p.status === 'critical').length} are in critical condition.`,
    'critical': () => { const c = patients.filter(p => p.status === 'critical'); return `⚠️ **${c.length} Critical Patients:**\n${c.map(p => `• ${p.name} — ${p.diagnosis} (${p.room})`).join('\n')}`; },
    'appointment': () => `📅 **Today's Appointments (${appointments.length}):**\n${appointments.slice(0, 4).map(a => `• ${a.time} — ${a.title} (${a.doctor})`).join('\n')}\n...and ${appointments.length - 4} more.`,
    'department': () => `🏥 **Department Occupancy:**\n${departments.map(d => `• ${d.name}: ${d.patients}/${d.capacity} (${Math.round(d.patients / d.capacity * 100)}%)`).join('\n')}`,
    'emergency': () => `🚨 **Emergency Department:** ${departments[0].patients}/${departments[0].capacity} beds occupied (${Math.round(departments[0].patients / departments[0].capacity * 100)}%). ${departments[0].patients >= departments[0].capacity * 0.8 ? '⚠️ Near capacity!' : 'Status: Normal.'}`,
    'bed': () => { const total = departments.reduce((s, d) => s + d.capacity, 0); const used = departments.reduce((s, d) => s + d.patients, 0); return `🛏️ **Bed Availability:**\nTotal: ${total} | Occupied: ${used} | Available: ${total - used}\nOccupancy Rate: ${Math.round(used / total * 100)}%`; },
    'help': () => `I can help you with:\n• 📊 Patient count & status\n• 🚨 Critical patients\n• 📅 Today's appointments\n• 🏥 Department stats\n• 🛏️ Bed availability\n• 🚑 Emergency status\n• 🔍 Search patients by name\n\nJust ask!`,
  }
};

function getAgentResponse(input) {
  const q = input.toLowerCase().trim();
  if (['hi', 'hello', 'hey', 'greetings'].some(g => q.includes(g))) return agentKB.greetings[0];
  for (const [key, fn] of Object.entries(agentKB.responses)) {
    if (q.includes(key)) return fn();
  }
  // Search patient by name
  const found = patients.find(p => p.name.toLowerCase().includes(q));
  if (found) return `📋 **${found.name}** (${found.id})\nAge: ${found.age} | Gender: ${found.gender}\nDept: ${found.dept} | Room: ${found.room}\nDoctor: ${found.doctor}\nStatus: ${found.status.toUpperCase()}\nDiagnosis: ${found.diagnosis}\nVitals: BP ${found.bp}, HR ${found.hr}, Temp ${found.temp}`;
  return `I'm not sure about that. Try asking about **patients**, **appointments**, **departments**, **beds**, or **critical** cases. Type **help** for all options.`;
}

// ── Navigation ──
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector(`.nav-item[data-page="${page}"]`).classList.add('active');
  const titles = { dashboard: 'Dashboard', patients: 'Patients', appointments: 'Appointments', departments: 'Departments' };
  document.getElementById('page-title').textContent = titles[page] || 'Dashboard';
  document.getElementById('page-subtitle').textContent = getSubtitle(page);
}

function getSubtitle(page) {
  const d = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const map = { dashboard: `Welcome back, Dr. Admin — ${d}`, patients: 'Manage and monitor all patients', appointments: `Schedule for ${d}`, departments: 'Department overview & capacity' };
  return map[page] || '';
}

// ── Render Functions ──
function renderDashboard() {
  // Stats
  const critCount = patients.filter(p => p.status === 'critical').length;
  const totalBeds = departments.reduce((s, d) => s + d.capacity, 0);
  const usedBeds = departments.reduce((s, d) => s + d.patients, 0);
  document.getElementById('stat-patients').textContent = patients.length;
  document.getElementById('stat-critical').textContent = critCount;
  document.getElementById('stat-appointments').textContent = appointments.length;
  document.getElementById('stat-beds').textContent = (totalBeds - usedBeds);

  // Recent patients
  const listEl = document.getElementById('recent-patients');
  listEl.innerHTML = patients.slice(0, 5).map(p => `
    <div class="patient-row" onclick="navigate('patients')">
      <div class="patient-avatar" style="background:${getAvatarColor(p.status)}">${p.name.split(' ').map(n => n[0]).join('')}</div>
      <div class="patient-info">
        <div class="patient-name">${p.name}</div>
        <div class="patient-detail">${p.dept} • ${p.doctor}</div>
      </div>
      <span class="patient-status status-${p.status}">${p.status}</span>
    </div>`).join('');

  // Appointments
  const apptEl = document.getElementById('today-appointments');
  apptEl.innerHTML = appointments.slice(0, 4).map(a => `
    <div class="appt-item">
      <div class="appt-time">${a.time}</div>
      <div class="appt-info">
        <div class="appt-title">${a.title}</div>
        <div class="appt-doc">${a.doctor} • ${a.dept}</div>
      </div>
      <span class="appt-type">${a.type}</span>
    </div>`).join('');

  // Department bars
  const deptEl = document.getElementById('dept-chart');
  deptEl.innerHTML = departments.map(d => `
    <div class="dept-bar-row">
      <div class="dept-label">${d.name}</div>
      <div class="dept-bar-bg">
        <div class="dept-bar-fill" data-value="${d.patients}" style="width:0;background:${d.color}"></div>
      </div>
    </div>`).join('');
  setTimeout(() => {
    deptEl.querySelectorAll('.dept-bar-fill').forEach(bar => {
      const d = departments.find(dd => dd.patients == bar.dataset.value);
      bar.style.width = Math.round(d.patients / d.capacity * 100) + '%';
    });
  }, 100);
}

function renderPatients(filter = '') {
  const filtered = filter ? patients.filter(p => p.name.toLowerCase().includes(filter) || p.dept.toLowerCase().includes(filter) || p.id.toLowerCase().includes(filter)) : patients;
  const el = document.getElementById('patients-table-body');
  el.innerHTML = filtered.map(p => `
    <tr>
      <td><strong>${p.id}</strong></td>
      <td><div style="display:flex;align-items:center;gap:10px"><div class="patient-avatar" style="width:32px;height:32px;border-radius:8px;font-size:11px;background:${getAvatarColor(p.status)}">${p.name.split(' ').map(n => n[0]).join('')}</div>${p.name}</div></td>
      <td>${p.age}</td><td>${p.gender}</td><td>${p.dept}</td>
      <td>${p.doctor}</td><td>${p.room}</td>
      <td><span class="patient-status status-${p.status}">${p.status}</span></td>
    </tr>`).join('');
}

function renderAppointments() {
  const el = document.getElementById('appointments-list');
  el.innerHTML = appointments.map(a => `
    <div class="appt-item">
      <div class="appt-time">${a.time}</div>
      <div class="appt-info"><div class="appt-title">${a.title}</div><div class="appt-doc">${a.doctor} • ${a.dept}</div></div>
      <span class="appt-type">${a.type}</span>
    </div>`).join('');
}

function renderDepartments() {
  const el = document.getElementById('departments-grid');
  el.innerHTML = departments.map(d => {
    const pct = Math.round(d.patients / d.capacity * 100);
    return `<div class="card">
      <div class="card-title">${d.name} <span class="badge">${pct}% Full</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <div><div class="stat-value" style="font-size:24px">${d.patients}</div><div class="stat-label">Current</div></div>
        <div><div class="stat-value" style="font-size:24px">${d.capacity}</div><div class="stat-label">Capacity</div></div>
        <div><div class="stat-value" style="font-size:24px">${d.capacity - d.patients}</div><div class="stat-label">Available</div></div>
      </div>
      <div class="dept-bar-bg"><div class="dept-bar-fill" style="width:${pct}%;background:${d.color}" data-value="${pct}%"></div></div>
    </div>`;
  }).join('');
}

function getAvatarColor(status) {
  const m = { critical: 'linear-gradient(135deg,#f43f5e,#fb7185)', stable: 'linear-gradient(135deg,#10b981,#34d399)', observation: 'linear-gradient(135deg,#f59e0b,#fbbf24)', discharged: 'linear-gradient(135deg,#3b82f6,#60a5fa)' };
  return m[status] || m.stable;
}

// ── Agent Chat ──
let chatOpen = false;
function toggleChat() {
  chatOpen = !chatOpen;
  document.getElementById('agent-panel').classList.toggle('open', chatOpen);
  document.getElementById('agent-fab').classList.toggle('hidden', chatOpen);
  if (chatOpen) document.getElementById('agent-input').focus();
}

function addMessage(text, isUser = false) {
  const el = document.getElementById('agent-messages');
  const div = document.createElement('div');
  div.className = 'msg ' + (isUser ? 'user' : 'bot');
  div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

function showTyping() {
  const el = document.getElementById('agent-messages');
  const div = document.createElement('div');
  div.className = 'msg-typing'; div.id = 'typing';
  div.innerHTML = '<span></span><span></span><span></span>';
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}
function hideTyping() { const t = document.getElementById('typing'); if (t) t.remove(); }

function sendMessage() {
  const input = document.getElementById('agent-input');
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, true);
  input.value = '';
  showTyping();
  setTimeout(() => { hideTyping(); addMessage(getAgentResponse(text)); }, 600 + Math.random() * 800);
}

function quickAsk(text) {
  document.getElementById('agent-input').value = text;
  sendMessage();
}

// ── Modal ──
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function addPatient(e) {
  e.preventDefault();
  const f = e.target;
  patients.push({
    id: 'P-' + (1000 + patients.length + 1),
    name: f.pname.value, age: parseInt(f.page.value), gender: f.pgender.value,
    dept: f.pdept.value, status: 'observation', doctor: f.pdoctor.value,
    room: f.proom.value, bp: '120/80', hr: 72, temp: '36.8°C', diagnosis: f.pdiagnosis.value
  });
  closeModal('add-patient-modal');
  f.reset();
  renderDashboard(); renderPatients();
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  navigate('dashboard');
  renderDashboard();
  renderPatients();
  renderAppointments();
  renderDepartments();

  document.getElementById('agent-input').addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage() });
  document.getElementById('patient-search').addEventListener('input', e => renderPatients(e.target.value.toLowerCase()));

  // Welcome message
  setTimeout(() => addMessage("👋 Hello! I'm **MediBot**, your AI healthcare assistant.\n\nI can help you check **patient status**, **appointments**, **department capacity**, and more.\n\nType **help** to see all commands!"), 500);
});
