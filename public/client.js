// ScribeAI Client Logic

// 1. Vector Alphabet Definition
// Normalized coordinates from (0,0) to (10,10) representing stroke paths.
// Multiple arrays in a letter represent separate strokes (lifting the pen).
const VectorFont = {
  // Lowercase
  'a': [[[7,4], [5,4], [4,5.5], [5,7], [7,7], [7,4]], [[7,4], [7,7], [9,7.5]]],
  'b': [[[3,1], [3,7]], [[3,4.5], [6,4.5], [7,5.5], [6,7], [3,7], [8,7.5]]],
  'c': [[[7,4.5], [5,4], [4,5.5], [5,7], [7,7], [9,7.2]]],
  'd': [[[7,4], [5,4], [4,5.5], [5,7], [7,7], [7,4]], [[7,1.5], [7,7], [9,7.5]]],
  'e': [[[3,6], [7,4], [6,4], [4,4.5], [4,6.5], [6,7], [8,6.8]]],
  'f': [[[6,7.5], [5,1.5], [6,1], [7,1.5], [6,4.5]], [[4,4.5], [8,4.5]]],
  'g': [[[7,4], [5,4], [4,5.5], [5,7], [7,7], [7,4]], [[7,4], [7,9.5], [5.5,10], [4.5,9.5], [8,7.5]]],
  'h': [[[3,1.5], [3,7]], [[3,5], [5,4], [6,5], [6,7], [8,7.5]]],
  'i': [[[5,4], [5,7], [7,7.5]], [[5,2]]], // second stroke is the dot
  'j': [[[5,4], [5,9.5], [4,10], [3,9.5]], [[5,2]]],
  'k': [[[3,1.5], [3,7]], [[6,4], [3,5.5], [5.5,7], [7.5,7.5]]],
  'l': [[[4,1.5], [4,7], [6,7.5]]],
  'm': [[[2,4], [2,7]], [[2,5], [4,4], [4,7]], [[4,5], [6,4], [6,7], [8,7.5]]],
  'n': [[[3,4], [3,7]], [[3,5], [5,4], [6,5], [6,7], [8,7.5]]],
  'o': [[[5,4], [3.5,4.5], [3.5,6.5], [5,7], [6.5,6.5], [6.5,4.5], [5,4]], [[6,4.5], [8,4]]],
  'p': [[[3,4], [3,9.5]], [[3,5], [5.5,5], [6.5,6], [5.5,7], [3,7], [5,7.5]]],
  'q': [[[7,4], [5,4], [4,5.5], [5,7], [7,7], [7,4]], [[7,4], [7,9.5], [9,10]]],
  'r': [[[3,4], [3,7]], [[3,5], [5,4], [6,4.2]]],
  's': [[[7,4.2], [5,4], [4.2,4.8], [6,5.8], [7,6.5], [5.5,7], [3.8,6.8]]],
  't': [[[5,1.8], [5,7], [7,7.5]], [[3.5,3.5], [6.5,3.5]]],
  'u': [[[3,4], [3,6.5], [5,7], [6.5,6.5], [6.5,4]], [[6.5,4], [6.5,7], [8.5,7.5]]],
  'v': [[[3,4], [4.5,7], [6,4], [7.5,4]]],
  'w': [[[2,4], [3,7], [4.5,5], [6,7], [7,4], [8,4]]],
  'x': [[[3,4], [7,7]], [[7,4], [3,7]]],
  'y': [[[3,4], [3,6], [5,7], [6.5,6], [6.5,4]], [[6.5,4], [6.5,9.5], [5,10], [4,9.5]]],
  'z': [[[3,4], [7,4], [3.5,7], [7.5,7]]],

  // Uppercase
  'A': [[[5,1.5], [2,7.5]], [[5,1.5], [8,7.5]], [[3.5,5], [6.5,5]]],
  'B': [[[3,1.5], [3,7.5]], [[3,1.5], [6.5,1.5], [7,3], [5.5,4.5], [3,4.5]], [[5.5,4.5], [7,4.5], [7.5,6], [6.5,7.5], [3,7.5]]],
  'C': [[[7.5,2.5], [5,1.5], [3,3.5], [3,5.5], [5,7.5], [7.5,6.5]]],
  'D': [[[3,1.5], [3,7.5]], [[3,1.5], [6,1.5], [7.5,3.5], [7.5,5.5], [6,7.5], [3,7.5]]],
  'E': [[[7,1.5], [3,1.5], [3,7.5], [7,7.5]], [[3,4.5], [6,4.5]]],
  'F': [[[7,1.5], [3,1.5], [3,7.5]], [[3,4.5], [6,4.5]]],
  'G': [[[7.5,2.5], [5,1.5], [3,3.5], [3,5.5], [5,7.5], [7,7.5], [7,4.5], [5.5,4.5]]],
  'H': [[[3,1.5], [3,7.5]], [[7,1.5], [7,7.5]], [[3,4.5], [7,4.5]]],
  'I': [[[5,1.5], [5,7.5]], [[3,1.5], [7,1.5]], [[3,7.5], [7,7.5]]],
  'J': [[[6.5,1.5], [6.5,6.5], [5,7.5], [3,6.5]], [[4.5,1.5], [8.5,1.5]]],
  'K': [[[3,1.5], [3,7.5]], [[7,1.5], [3,4.5], [7,7.5]]],
  'L': [[[3,1.5], [3,7.5], [7,7.5]]],
  'M': [[[2,7.5], [2,1.5], [5,5], [8,1.5], [8,7.5]]],
  'N': [[[3,7.5], [3,1.5], [7,7.5], [7,1.5]]],
  'O': [[[5,1.5], [3,3], [3,6], [5,7.5], [7,6], [7,3], [5,1.5]]],
  'P': [[[3,1.5], [3,7.5]], [[3,1.5], [6.5,1.5], [7,3], [6.5,4.5], [3,4.5]]],
  'Q': [[[5,1.5], [3,3], [3,6], [5,7.5], [7,6], [7,3], [5,1.5]], [[5.5,5.5], [7.5,7.5]]],
  'r': [[[3,1.5], [3,7.5]], [[3,1.5], [6.5,1.5], [7,3], [6.5,4.5], [3,4.5]], [[4.5,4.5], [7.5,7.5]]], // Will handle uppercase fallback
  'R': [[[3,1.5], [3,7.5]], [[3,1.5], [6.5,1.5], [7,3], [6.5,4.5], [3,4.5]], [[4.5,4.5], [7.5,7.5]]],
  'S': [[[7,2.5], [5,1.5], [3.5,2.5], [5.5,4.5], [7,5.5], [5.5,7.5], [3,6.5]]],
  'T': [[[5,1.5], [5,7.5]], [[2,1.5], [8,1.5]]],
  'U': [[[3,1.5], [3,6], [5,7.5], [7,6], [7,1.5]]],
  'V': [[[2,1.5], [5,7.5], [8,1.5]]],
  'W': [[[2,1.5], [3.5,7.5], [5,4], [6.5,7.5], [8,1.5]]],
  'X': [[[2.5,1.5], [7.5,7.5]], [[7.5,1.5], [2.5,7.5]]],
  'Y': [[[2.5,1.5], [5,4.5], [7.5,1.5]], [[5,4.5], [5,7.5]]],
  'Z': [[[2.5,1.5], [7.5,1.5], [2.5,7.5], [7.5,7.5]]],

  // Numbers & Symbols
  '0': [[[5,1.5], [3,3.5], [3,5.5], [5,7.5], [7,5.5], [7,3.5], [5,1.5]]],
  '1': [[[3,3.5], [5,1.5], [5,7.5]], [[3,7.5], [7,7.5]]],
  '2': [[[3,2.5], [4.5,1.5], [6.5,2], [6.5,3.5], [3,7.5], [7.5,7.5]]],
  '3': [[[3,2], [6.5,2], [4.5,4.5], [6.5,4.5], [7,6], [5.5,7.5], [3,7]]],
  '4': [[[6,1.5], [2.5,5.5], [7.5,5.5]], [[6,1.5], [6,7.5]]],
  '5': [[[6.5,1.5], [3,1.5], [3,4], [6.5,4.5], [7,6], [5.5,7.5], [3,7]]],
  '6': [[[6,1.5], [3.5,4], [3,5.5], [4,7.5], [6,7], [6.5,5.5], [4.5,4.5]]],
  '7': [[[2.5,1.5], [7.5,1.5], [4.5,7.5]]],
  '8': [[[5,4.5], [3,3], [5,1.5], [7,3], [5,4.5], [3,6], [5,7.5], [7,6], [5,4.5]]],
  '9': [[[5,4.5], [3.5,4], [3,2.5], [4.5,1.5], [6,2.5], [6,4.5], [5,4.5]], [[6,2.5], [6,7.5], [4.5,7.5]]],
  
  '+': [[[5,2.5], [5,7.5]], [[2.5,5], [7.5,5]]],
  '-': [[[2.5,5], [7.5,5]]],
  '*': [[[3,3], [7,7]], [[7,3], [3,7]], [[5,2.5], [5,7.5]], [[2.5,5], [7.5,5]]],
  '/': [[[2.5,7.5], [7.5,1.5]]],
  '=': [[[2.5,3.5], [7.5,3.5]], [[2.5,6], [7.5,6]]],
  '(': [[[5.5,1.5], [3.5,4.5], [5.5,7.5]]],
  ')': [[[4.5,1.5], [6.5,4.5], [4.5,7.5]]],
  '[': [[[6,1.5], [4,1.5], [4,7.5], [6,7.5]]],
  ']': [[[4,1.5], [6,1.5], [6,7.5], [4,7.5]]],
  ',': [[[5,6.5], [5,8.5], [4,9.5]]],
  '.': [[[5,6.8], [5,7.2], [4.8,7.2], [4.8,6.8], [5,6.8]]],
  ':': [[[5,3], [5,3.5]], [[5,6], [5,6.5]]],
  ';': [[[5,3], [5,3.5]], [[5,6.5], [5,8.5], [4,9.5]]],
  '?': [[[3,2.5], [5,1.5], [6.5,2.5], [5,4.5], [5,6]], [[5,7.2], [5,7.5]]],
  '!': [[[5,1.5], [5,5.5]], [[5,7.2], [5,7.5]]],
  '\'': [[[5,1.5], [4,3]]],
  '"': [[[3.5,1.5], [2.5,3]], [[6.5,1.5], [5.5,3]]],
  '>': [[[3,2.5], [6.5,5], [3,7.5]]],
  '<': [[[6.5,2.5], [3,5], [6.5,7.5]]],
  '→': [[[2,5], [8,5]], [[6,3], [8,5], [6,7]]],
  '→_sub': [[[2,5], [8,5]], [[6,3], [8,5], [6,7]]], // Mapping fallback
  
  // Basic math symbols fallback paths
  'integral': [[[6.5,1.5], [5.5,1.5], [4.5,2.5], [4.5,6.5], [3.5,7.5], [2.5,7.5]]],
  'sqrt': [[[1,5], [2.5,5], [3.5,9], [5,1], [9.5,1]]]
};

// Map alternate characters & math symbols
VectorFont['ç'] = VectorFont['c']; // Accent drawn separately
VectorFont['é'] = VectorFont['e']; // Accent drawn separately
VectorFont['è'] = VectorFont['e'];
VectorFont['à'] = VectorFont['a'];
VectorFont['ù'] = VectorFont['u'];
VectorFont['â'] = VectorFont['a'];
VectorFont['ê'] = VectorFont['e'];
VectorFont['î'] = VectorFont['i'];
VectorFont['ô'] = VectorFont['o'];
VectorFont['û'] = VectorFont['u'];
VectorFont['ë'] = VectorFont['e'];
VectorFont['ï'] = VectorFont['i'];

// 2. Main App State Manager
const AppState = {
  activePanel: 'dashboard',
  cameraStream: null,
  userEmail: localStorage.getItem('userEmail') || 'default',
  userName: localStorage.getItem('userName') || 'Guest Student',
  activeProfile: {
    slant: 5,
    strokeWidth: 2.5,
    letterSpacing: 3,
    jitter: 1.0,
    wordSpacing: 8,
    connectionRatio: 0.4,
    size: 1.0,
    color: '#1c2d5a',
    sessions: 0,
    history: []
  },
  chats: [],
  selectedFile: null,
  subject: 'general'
};

// 3. UI Selectors
const elements = {
  navBtns: document.querySelectorAll('.nav-btn'),
  panels: document.querySelectorAll('.content-panel'),
  pageTitle: document.getElementById('page-title'),
  pageSubtitle: document.getElementById('page-subtitle'),
  
  // Dashboard indicators
  dashSlant: document.getElementById('dash-slant'),
  dashWidth: document.getElementById('dash-width'),
  dashConsistency: document.getElementById('dash-consistency'),
  dashCursive: document.getElementById('dash-cursive'),
  dashSpacing: document.getElementById('dash-spacing'),
  dashSessions: document.getElementById('dash-sessions'),
  consistencyPercent: document.getElementById('consistency-percent'),
  consistencyCircle: document.getElementById('consistency-circle'),
  learningStatus: document.getElementById('learning-status'),
  profileStatusName: document.getElementById('profile-status-name'),
  
  // Dashboard playground
  quickInput: document.getElementById('quick-input'),
  quickCanvas: document.getElementById('quick-canvas'),
  btnQuickGen: document.getElementById('btn-quick-generate'),
  
  // Analyzer Tab & Camera
  tabCamera: document.getElementById('tab-camera'),
  tabFile: document.getElementById('tab-file'),
  cameraContainer: document.getElementById('camera-viewport-container'),
  fileContainer: document.getElementById('file-viewport-container'),
  cameraStream: document.getElementById('camera-stream'),
  cameraPlaceholder: document.getElementById('camera-placeholder'),
  btnStartCamera: document.getElementById('btn-start-camera'),
  btnCapture: document.getElementById('btn-capture-snapshot'),
  dragZone: document.getElementById('drag-zone'),
  fileInput: document.getElementById('file-input'),
  fileInfoPanel: document.getElementById('file-info-panel'),
  selectedFileName: document.getElementById('selected-file-name'),
  btnSubmitUpload: document.getElementById('btn-submit-upload'),
  
  // Extraction logs
  analysisLogs: document.getElementById('analysis-logs'),
  analysisPreviewCanvas: document.getElementById('analysis-preview-canvas'),
  scanLine: document.querySelector('.analysis-scan-line'),
  analysisStatsCard: document.getElementById('analysis-stats-card'),
  statSlant: document.getElementById('stat-slant'),
  statWidth: document.getElementById('stat-width'),
  statSpacing: document.getElementById('stat-spacing'),
  statJitter: document.getElementById('stat-jitter'),
  statCursive: document.getElementById('stat-cursive'),
  
  // Generator & Practice Labs
  practTabs: document.querySelectorAll('.pract-tab'),
  subjectPanels: document.querySelectorAll('.subject-panel'),
  genTextInput: document.getElementById('gen-text-input'),
  sciTextInput: document.getElementById('sci-text-input'),
  mathTextInput: document.getElementById('math-text-input'),
  socTextInput: document.getElementById('soc-text-input'),
  freTextInput: document.getElementById('fre-text-input'),
  synthesisCanvas: document.getElementById('synthesis-canvas'),
  btnSynthesisGenerate: document.getElementById('btn-synthesis-generate'),
  btnResetTuning: document.getElementById('btn-reset-tuning'),
  btnDownloadSheet: document.getElementById('btn-download-sheet'),
  btnClearSheet: document.getElementById('btn-clear-sheet'),
  
  // Generator Sliders
  tuneSlant: document.getElementById('tune-slant'),
  tuneWidth: document.getElementById('tune-width'),
  tuneSpacing: document.getElementById('tune-spacing'),
  tuneJitter: document.getElementById('tune-jitter'),
  tuneCursive: document.getElementById('tune-cursive'),
  tuneSize: document.getElementById('tune-size'),
  tuneColor: document.getElementById('tune-color'),
  
  valSlant: document.getElementById('val-slant'),
  valWidth: document.getElementById('val-width'),
  valSpacing: document.getElementById('val-spacing'),
  valJitter: document.getElementById('val-jitter'),
  valCursive: document.getElementById('val-cursive'),
  valSize: document.getElementById('val-size'),
  
  // Chat Dashboard
  chatMessages: document.getElementById('chat-messages'),
  chatUserInput: document.getElementById('chat-user-input'),
  btnSendMessage: document.getElementById('btn-send-message'),
  btnClearChats: document.getElementById('btn-clear-chats'),
  chatCountBadge: document.getElementById('chat-count'),
  chatShortcuts: document.querySelectorAll('.shortcut-chip'),
  
  // History & Trends
  chartSlant: document.getElementById('chart-slant'),
  chartJitter: document.getElementById('chart-jitter'),
  historyGallery: document.getElementById('history-gallery'),
  emptyHistoryNotice: document.getElementById('empty-history-notice'),

  // Auth Selectors
  authOverlay: document.getElementById('auth-overlay'),
  loginForm: document.getElementById('login-form'),
  signupForm: document.getElementById('signup-form'),
  loginEmail: document.getElementById('login-email'),
  loginPassword: document.getElementById('login-password'),
  signupName: document.getElementById('signup-name'),
  signupEmail: document.getElementById('signup-email'),
  signupPassword: document.getElementById('signup-password'),
  btnTabLogin: document.getElementById('btn-tab-login'),
  btnTabSignup: document.getElementById('btn-tab-signup'),
  btnAuthGuest: document.getElementById('btn-auth-guest'),
  authError: document.getElementById('auth-error'),
  btnLogout: document.getElementById('btn-logout'),
  sidebarName: document.getElementById('sidebar-name'),
  sidebarAvatar: document.getElementById('sidebar-avatar')
};

// 4. Initial Navigation and Routing
function initNavigation() {
  elements.navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      switchPanel(target);
    });
  });

  // Switch subject practice tabs
  elements.practTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      elements.practTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const subject = tab.dataset.subject;
      AppState.subject = subject;
      
      elements.subjectPanels.forEach(p => p.classList.remove('active'));
      const activePanel = document.getElementById(`subject-${subject}`);
      if (activePanel) activePanel.classList.add('active');
      
      // Auto-trigger drawing when tabs switch if we have some text
      drawSubjectContent();
    });
  });
}

function switchPanel(panelId) {
  AppState.activePanel = panelId;
  
  elements.navBtns.forEach(b => b.classList.remove('active'));
  elements.panels.forEach(p => p.classList.remove('active'));
  
  const targetBtn = document.querySelector(`.nav-btn[data-target="${panelId}"]`);
  if (targetBtn) targetBtn.classList.add('active');
  
  const targetPanel = document.getElementById(`panel-${panelId}`);
  if (targetPanel) targetPanel.classList.add('active');
  
  // Stop camera if leaving analyzer
  if (panelId !== 'analyzer') {
    stopCamera();
  }

  // Handle panel entry actions
  if (panelId === 'dashboard') {
    elements.pageTitle.textContent = "Dashboard Overview";
    elements.pageSubtitle.textContent = "Monitor learning progression and handwriting statistics.";
    renderPlaygroundPreview();
  } else if (panelId === 'analyzer') {
    elements.pageTitle.textContent = "Handwriting Analyzer";
    elements.pageSubtitle.textContent = "Upload images or capture webcam photos to extract handwriting patterns.";
  } else if (panelId === 'generator') {
    elements.pageTitle.textContent = "Practice & Synthesis Labs";
    elements.pageSubtitle.textContent = "Generate handwritten pages with math, science, timelines or French scripts.";
    drawSubjectContent();
  } else if (panelId === 'chat') {
    elements.pageTitle.textContent = "AI Penmanship Coach";
    elements.pageSubtitle.textContent = "Interact with your AI assistant to query progress and review tips.";
    elements.chatCountBadge.textContent = "0";
    elements.chatCountBadge.style.display = 'none';
    scrollChatBottom();
  } else if (panelId === 'history') {
    elements.pageTitle.textContent = "History & Model Trends";
    elements.pageSubtitle.textContent = "Visualize model adaptation, consistency charts and calibrations.";
    renderHistoryCharts();
  }
}

// 5. REST Client APIs Calls
async function fetchProfile() {
  try {
    const response = await fetch(`/api/profile?email=${AppState.userEmail}`);
    const profile = await response.json();
    updateProfileState(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
}

async function updateManualProfile(payload) {
  try {
    payload.email = AppState.userEmail;
    const response = await fetch('/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (result.profile) {
      updateProfileState(result.profile);
    }
  } catch (error) {
    console.error('Error updating tuning parameters:', error);
  }
}

async function fetchChats() {
  try {
    const response = await fetch(`/api/chats?email=${AppState.userEmail}`);
    const chats = await response.json();
    AppState.chats = chats;
    renderChats();
  } catch (error) {
    console.error('Error fetching chats:', error);
  }
}

async function sendChatMessage(message) {
  if (!message.trim()) return;
  
  // Optimistically add user message
  const userMsg = {
    id: Date.now() + '-user',
    sender: 'user',
    text: message,
    timestamp: new Date().toISOString()
  };
  AppState.chats.push(userMsg);
  renderChats();
  elements.chatUserInput.value = '';
  
  try {
    const response = await fetch('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, email: AppState.userEmail })
    });
    const result = await response.json();
    // Replace with confirmed chat structure
    AppState.chats = AppState.chats.filter(c => c.id !== userMsg.id);
    AppState.chats.push(result.userMsg);
    AppState.chats.push(result.aiMsg);
    renderChats();
  } catch (error) {
    console.error('Error sending chat message:', error);
  }
}

async function clearChats() {
  // Client-side empty and mock restart
  AppState.chats = [];
  renderChats();
}

function updateProfileState(profile) {
  AppState.activeProfile = { ...AppState.activeProfile, ...profile };
  
  // Update dashboard labels
  elements.dashSlant.textContent = `${AppState.activeProfile.slant}°`;
  elements.dashWidth.textContent = `${AppState.activeProfile.strokeWidth}px`;
  elements.dashCursive.textContent = `${Math.round(AppState.activeProfile.connectionRatio * 100)}%`;
  elements.dashSpacing.textContent = `${AppState.activeProfile.letterSpacing}px`;
  elements.dashSessions.textContent = `${AppState.activeProfile.sessions} upload${AppState.activeProfile.sessions !== 1 ? 's' : ''}`;
  
  // Update student avatar/name
  elements.sidebarName.textContent = AppState.userName;
  elements.sidebarAvatar.textContent = AppState.userName.charAt(0).toUpperCase();

  // Calculate a fake yet plausible Consistency Score based on variations in history
  let consistency = 75; // Baseline
  if (AppState.activeProfile.sessions > 1 && AppState.activeProfile.history.length > 1) {
    // Standard deviation-like check on slant and jitter
    const history = AppState.activeProfile.history;
    const slants = history.map(h => h.slant);
    const meanSlant = slants.reduce((a,b) => a+b, 0) / slants.length;
    const variance = slants.reduce((a,b) => a + Math.pow(b - meanSlant, 2), 0) / slants.length;
    const stdDev = Math.sqrt(variance);
    
    // Low std dev = high consistency
    consistency = Math.min(98, Math.max(45, 95 - (stdDev * 6)));
  } else if (AppState.activeProfile.sessions === 0) {
    consistency = 0;
  }
  
  elements.dashConsistency.textContent = consistency > 0 ? `${Math.round(consistency)}%` : '--';
  elements.consistencyPercent.textContent = `${Math.round(consistency)}%`;
  
  // Circle progress animate
  const circleOffset = 100 - consistency;
  elements.consistencyCircle.setAttribute('stroke-dasharray', `${consistency}, 100`);
  
  // Update badges
  if (AppState.activeProfile.sessions === 0) {
    elements.learningStatus.textContent = "Awaiting First Upload";
    elements.learningStatus.style.borderColor = 'var(--warning-color)';
    elements.learningStatus.style.color = 'var(--warning-color)';
    elements.learningStatus.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
    elements.profileStatusName.textContent = "Calibrating";
  } else if (AppState.activeProfile.sessions < 3) {
    elements.learningStatus.textContent = "Calibrating Profile";
    elements.learningStatus.style.borderColor = 'var(--accent-color)';
    elements.learningStatus.style.color = 'var(--accent-color)';
    elements.learningStatus.style.backgroundColor = 'var(--accent-light)';
    elements.profileStatusName.textContent = "Refining";
  } else {
    elements.learningStatus.textContent = "Profile Calibrated";
    elements.learningStatus.style.borderColor = 'var(--success-color)';
    elements.learningStatus.style.color = 'var(--success-color)';
    elements.learningStatus.style.backgroundColor = 'var(--success-light)';
    elements.profileStatusName.textContent = "Established";
  }

  // Update slider positions on the generator panel to reflect the profile
  elements.tuneSlant.value = AppState.activeProfile.slant;
  elements.tuneWidth.value = AppState.activeProfile.strokeWidth;
  elements.tuneSpacing.value = AppState.activeProfile.letterSpacing;
  elements.tuneJitter.value = AppState.activeProfile.jitter;
  elements.tuneCursive.value = AppState.activeProfile.connectionRatio;
  
  updateSliderTextValues();
  renderHistoryGallery();
}

function updateSliderTextValues() {
  elements.valSlant.textContent = `${elements.tuneSlant.value}°`;
  elements.valWidth.textContent = `${elements.tuneWidth.value}px`;
  elements.valSpacing.textContent = `${elements.tuneSpacing.value}`;
  elements.valJitter.textContent = `${elements.tuneJitter.value}px`;
  elements.valCursive.textContent = parseFloat(elements.tuneCursive.value).toFixed(2);
  elements.valSize.textContent = parseFloat(elements.tuneSize.value).toFixed(1);
}

// 6. Camera Capturing and Upload Handler
function initCamera() {
  elements.tabCamera.addEventListener('click', () => {
    elements.tabCamera.classList.add('active');
    elements.tabFile.classList.remove('active');
    elements.cameraContainer.classList.add('active');
    elements.fileContainer.classList.remove('active');
    elements.fileInfoPanel.style.display = 'none';
  });

  elements.tabFile.addEventListener('click', () => {
    elements.tabFile.classList.add('active');
    elements.tabCamera.classList.remove('active');
    elements.fileContainer.classList.add('active');
    elements.cameraContainer.classList.remove('active');
    stopCamera();
  });

  elements.btnStartCamera.addEventListener('click', startCamera);

  elements.btnCapture.addEventListener('click', () => {
    captureSnapshot();
  });

  // Setup drag drop
  const zone = elements.dragZone;
  ['dragenter', 'dragover'].forEach(eventName => {
    zone.addEventListener(eventName, (e) => {
      e.preventDefault();
      zone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    zone.addEventListener(eventName, (e) => {
      e.preventDefault();
      zone.classList.remove('dragover');
    }, false);
  });

  zone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      handleFileSelected(files[0]);
    }
  });

  elements.fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  });

  elements.btnSubmitUpload.addEventListener('click', uploadSelectedFile);
}

async function startCamera() {
  elements.cameraPlaceholder.style.display = 'none';
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: 640, height: 480 },
      audio: false
    });
    AppState.cameraStream = stream;
    elements.cameraStream.srcObject = stream;
    elements.cameraStream.style.display = 'block';
    elements.btnCapture.disabled = false;
    logAnalysis("System", "Camera feed initialized. Align handwriting sheet inside overlay.");
  } catch (error) {
    console.error('Camera access error:', error);
    elements.cameraPlaceholder.style.display = 'flex';
    elements.cameraPlaceholder.querySelector('p').textContent = "Camera permission denied or camera unavailable.";
    logAnalysis("System", "Error starting camera: Permission denied.");
  }
}

function stopCamera() {
  if (AppState.cameraStream) {
    AppState.cameraStream.getTracks().forEach(track => track.stop());
    AppState.cameraStream = null;
    elements.cameraStream.srcObject = null;
    elements.cameraStream.style.display = 'none';
    elements.cameraPlaceholder.style.display = 'flex';
    elements.btnCapture.disabled = true;
  }
}

function captureSnapshot() {
  if (!AppState.cameraStream) return;
  
  const video = elements.cameraStream;
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  canvas.toBlob(blob => {
    const file = new File([blob], `handwriting-capture-${Date.now()}.png`, { type: 'image/png' });
    AppState.selectedFile = file;
    
    // Draw preview image
    const pCtx = elements.analysisPreviewCanvas.getContext('2d');
    elements.analysisPreviewCanvas.width = canvas.width;
    elements.analysisPreviewCanvas.height = canvas.height;
    pCtx.drawImage(canvas, 0, 0);
    
    // Auto submit captured snapshot
    logAnalysis("System", "Handwriting snapshot captured successfully. Initializing neural parsing...");
    uploadSelectedFile();
  }, 'image/png');
}

function handleFileSelected(file) {
  AppState.selectedFile = file;
  elements.selectedFileName.textContent = file.name;
  elements.fileInfoPanel.style.display = 'flex';
  
  // Render upload image onto analysis preview canvas
  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      const pCanvas = elements.analysisPreviewCanvas;
      const pCtx = pCanvas.getContext('2d');
      pCanvas.width = img.width;
      pCanvas.height = img.height;
      pCtx.drawImage(img, 0, 0);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
  
  logAnalysis("System", `Loaded document: ${file.name}. Click 'Process Photo' to analyze.`);
}

async function uploadSelectedFile() {
  if (!AppState.selectedFile) return;

  // Show scan UI
  elements.scanLine.style.display = 'block';
  elements.btnSubmitUpload.disabled = true;
  elements.btnCapture.disabled = true;
  elements.analysisStatsCard.style.display = 'none';

  logAnalysis("AI Model", "Extracting luminance channels...");
  await sleep(600);
  
  logAnalysis("AI Model", "Thresholding pixel grid & grouping contours...");
  await sleep(800);
  
  logAnalysis("AI Model", "Calculating slant vectors and ink thickness runs...");
  await sleep(1000);

  const formData = new FormData();
  formData.append('photo', AppState.selectedFile);
  formData.append('email', AppState.userEmail);

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    
    // Turn off scan UI
    elements.scanLine.style.display = 'none';
    elements.btnSubmitUpload.disabled = false;
    if (AppState.cameraStream) elements.btnCapture.disabled = false;
    
    if (result.error) {
      logAnalysis("Error", result.error);
      return;
    }

    logAnalysis("Success", "Handwriting profile computed successfully!");
    logAnalysis("Success", `Refined slant: ${result.refinedProfile.slant}° | Width: ${result.refinedProfile.strokeWidth}px | Cursive connection: ${Math.round(result.refinedProfile.connectionRatio * 100)}%`);

    // Show extracted statistics
    elements.statSlant.textContent = `${result.newSample.slant}°`;
    elements.statWidth.textContent = `${result.newSample.strokeWidth}px`;
    elements.statSpacing.textContent = `${result.newSample.letterSpacing}px`;
    elements.statJitter.textContent = `${result.newSample.jitter}px`;
    elements.statCursive.textContent = `${Math.round(result.newSample.connectionRatio * 100)}%`;
    elements.analysisStatsCard.style.display = 'block';

    // Update active profile
    updateProfileState(result.refinedProfile);

    // Notify Chat Count badge if not on chat page
    if (AppState.activePanel !== 'chat') {
      const badge = elements.chatCountBadge;
      const count = parseInt(badge.textContent) + 1;
      badge.textContent = count;
      badge.style.display = 'block';
    }

    // Refresh chats to show AI coach response which was triggered in background
    fetchChats();
  } catch (error) {
    console.error('Upload process failed:', error);
    elements.scanLine.style.display = 'none';
    elements.btnSubmitUpload.disabled = false;
    logAnalysis("Error", "Server error. Ensure server is running.");
  }
}

function logAnalysis(sender, message) {
  const box = elements.analysisLogs;
  const line = document.createElement('div');
  line.className = `log-line ${sender.toLowerCase().replace(' ', '-')}`;
  line.innerHTML = `<span>[${sender}]</span> ${message}`;
  box.appendChild(line);
  box.scrollTop = box.scrollHeight;
}

// 7. Handwriting Stroke Synthesis Engine (Canvas rendering)
// Renders cursive path lines representing human hand drawing
function generateHandwriting(text, canvas, config = {}) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const slant = parseFloat(config.slant || 0);
  const strokeWidth = parseFloat(config.strokeWidth || 2);
  const letterSpacing = parseFloat(config.letterSpacing || 3);
  const wordSpacing = parseFloat(config.wordSpacing || 8);
  const connectionRatio = parseFloat(config.connectionRatio || 0.4);
  const jitter = parseFloat(config.jitter || 1);
  const baseScale = parseFloat(config.size || 1.0) * 3.5; // Scale factor for coordinates
  const inkColor = config.color || '#1c2d5a';

  ctx.strokeStyle = inkColor;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const marginX = 40;
  const marginY = 50;
  const lineSpacingHeight = 65;

  let cursorX = marginX;
  let cursorY = marginY;

  // Draw lined rule sheet on canvas (representing homework notebook)
  if (canvas.id === 'synthesis-canvas') {
    ctx.strokeStyle = 'rgba(79, 70, 229, 0.1)'; // soft blue rules
    ctx.lineWidth = 1;
    for (let y = marginY + 20; y < canvas.height; y += lineSpacingHeight) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    // Red margin rule on left
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)'; // red margin
    ctx.beginPath();
    ctx.moveTo(marginX - 10, 0);
    ctx.lineTo(marginX - 10, canvas.height);
    ctx.stroke();
    ctx.strokeStyle = inkColor; // Restore
  }

  // Jitter generator helper
  function getJitterVal() {
    if (jitter === 0) return 0;
    return (Math.random() - 0.5) * jitter * 0.75;
  }

  // Main cursor drawing routine
  let lastCharEndpoint = null;

  // Pre-process Science scripts for subscripts (e.g. H2O -> 2 is subscript)
  const tokens = parseFormulas(text);

  tokens.forEach((token) => {
    const char = token.char;
    const isSubscript = token.sub;
    const isSuperscript = token.super;

    // Line wrap
    if (char === '\n') {
      cursorX = marginX;
      cursorY += lineSpacingHeight;
      lastCharEndpoint = null;
      return;
    }

    // Word spacing
    if (char === ' ') {
      cursorX += wordSpacing * baseScale * 0.5;
      lastCharEndpoint = null;
      return;
    }

    // Scale adjustments for super/subscripts
    let currentScale = baseScale;
    let offsetY = 0;
    if (isSubscript) {
      currentScale = baseScale * 0.65;
      offsetY = lineSpacingHeight * 0.22; // Shift down
    } else if (isSuperscript) {
      currentScale = baseScale * 0.65;
      offsetY = -lineSpacingHeight * 0.22; // Shift up
    }

    const glyph = VectorFont[char] || VectorFont[char.toLowerCase()] || VectorFont[char.toUpperCase()];
    if (!glyph) {
      // Unrecognized symbols space out
      cursorX += currentScale * 1.5;
      lastCharEndpoint = null;
      return;
    }

    const cellWidth = 10 * currentScale * 0.15; // standard width of normalized box
    
    // Draw connections if recursive cursive line connection ratio permits
    if (connectionRatio > 0.1 && lastCharEndpoint && !isSubscript && !isSuperscript) {
      const connectChance = Math.random();
      if (connectChance < connectionRatio) {
        ctx.beginPath();
        ctx.lineWidth = strokeWidth * 0.75; // thinner connections
        ctx.moveTo(lastCharEndpoint.x, lastCharEndpoint.y);
        
        // Define starting coordinates of current glyph's first stroke
        const startPt = glyph[0][0];
        const rawStartX = cursorX + startPt[0] * currentScale * 0.15;
        const rawStartY = cursorY + offsetY + startPt[1] * currentScale * 0.15;
        const targetStartX = rawStartX + (10 - startPt[1]) * Math.tan(slant * Math.PI / 180) + getJitterVal();
        const targetStartY = rawStartY + getJitterVal();

        // Control point for smooth cursive curve
        const ctrlX = (lastCharEndpoint.x + targetStartX) / 2;
        const ctrlY = Math.max(lastCharEndpoint.y, targetStartY) + 4;

        ctx.quadraticCurveTo(ctrlX, ctrlY, targetStartX, targetStartY);
        ctx.stroke();
      }
    }

    // Render strokes
    glyph.forEach((stroke, sIdx) => {
      // Set varying brush width to mimic hand pressure
      ctx.lineWidth = strokeWidth;

      ctx.beginPath();
      stroke.forEach((pt, pIdx) => {
        const rawX = cursorX + pt[0] * currentScale * 0.15;
        const rawY = cursorY + offsetY + pt[1] * currentScale * 0.15;

        // Apply slant matrix transformation: x_slanted = x + (base_y - y) * tan(slant_angle)
        // We use (10 - pt[1]) to anchor the slant to the base of the cell
        const slantOffset = (10 - pt[1]) * Math.tan(slant * Math.PI / 180);
        const finalX = rawX + slantOffset + getJitterVal();
        const finalY = rawY + getJitterVal();

        if (pIdx === 0) {
          ctx.moveTo(finalX, finalY);
        } else {
          // Add wiggle curves
          const prevPt = stroke[pIdx - 1];
          const prevRawX = cursorX + prevPt[0] * currentScale * 0.15;
          const prevRawY = cursorY + offsetY + prevPt[1] * currentScale * 0.15;
          const prevSlantOffset = (10 - prevPt[1]) * Math.tan(slant * Math.PI / 180);
          const prevFinalX = prevRawX + prevSlantOffset;
          const prevFinalY = prevRawY;

          const cx = (prevFinalX + finalX) / 2 + getJitterVal();
          const cy = (prevFinalY + finalY) / 2 + getJitterVal();
          
          ctx.quadraticCurveTo(cx, cy, finalX, finalY);
        }

        // Keep last point coordinates for connection lines
        if (sIdx === glyph.length - 1 && pIdx === stroke.length - 1) {
          lastCharEndpoint = { x: finalX, y: finalY };
        }
      });
      ctx.stroke();
    });

    // Special Case: Draw French Accents overlay dynamically
    drawFrenchAccents(ctx, char, cursorX, cursorY + offsetY, currentScale, slant, getJitterVal);

    // Advance cursor
    cursorX += cellWidth + (letterSpacing * currentScale * 0.12);

    // Column Wrap
    if (cursorX > canvas.width - marginX * 1.5) {
      cursorX = marginX;
      cursorY += lineSpacingHeight;
      lastCharEndpoint = null;
    }
  });
}

// Parses formulas for super/subscripts (CO2, C6H12O6, x^2)
function parseFormulas(text) {
  const result = [];
  let isSub = false;
  let isSuper = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    // Super script handle (e.g., x^2)
    if (char === '^') {
      isSuper = true;
      continue;
    }

    // Bracket sub/superscripts handling
    if (char === '{' && (isSuper || isSub)) {
      continue;
    }
    if (char === '}') {
      isSuper = false;
      isSub = false;
      continue;
    }

    // Automatic chemical subscript detection: number after letters (e.g., H2O, CO2, C6H12)
    const prevChar = i > 0 ? text[i - 1] : '';
    const isNum = char >= '0' && char <= '9';
    const isPrevLetter = (prevChar >= 'a' && prevChar <= 'z') || (prevChar >= 'A' && prevChar <= 'Z');
    
    if (isNum && isPrevLetter && !isSuper) {
      isSub = true;
    }

    result.push({
      char: char,
      sub: isSub,
      super: isSuper
    });

    // Reset single digit chemical subscripts immediately
    if (isNum && isSub && (i === text.length - 1 || text[i+1] === ' ' || isLetter(text[i+1]))) {
      isSub = false;
    }
    if (isSuper && (i === text.length - 1 || text[i+1] === ' ' || text[i+1] === '+' || text[i+1] === '-')) {
      isSuper = false;
    }
  }
  return result;
}

function isLetter(c) {
  return c && ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'));
}

// Draw Accents for French: é, è, ç, à, ù, â, ê, î, ô, û, ë, ï
function drawFrenchAccents(ctx, char, x, y, scale, slant, jitterFunc) {
  const accentSlantOffset = (10 - 0) * Math.tan(slant * Math.PI / 180);
  ctx.lineWidth = ctx.lineWidth * 0.8;
  
  if (['é'].includes(char)) {
    // acute accent (slash going up-right)
    ctx.beginPath();
    ctx.moveTo(x + 4 * scale * 0.15 + accentSlantOffset + jitterFunc(), y - 1 * scale * 0.15 + jitterFunc());
    ctx.lineTo(x + 7 * scale * 0.15 + accentSlantOffset + jitterFunc(), y - 4 * scale * 0.15 + jitterFunc());
    ctx.stroke();
  } else if (['è', 'à', 'ù'].includes(char)) {
    // grave accent (slash going down-right)
    ctx.beginPath();
    ctx.moveTo(x + 7 * scale * 0.15 + accentSlantOffset + jitterFunc(), y - 4 * scale * 0.15 + jitterFunc());
    ctx.lineTo(x + 4 * scale * 0.15 + accentSlantOffset + jitterFunc(), y - 1 * scale * 0.15 + jitterFunc());
    ctx.stroke();
  } else if (['â', 'ê', 'î', 'ô', 'û'].includes(char)) {
    // circumflex (caret above)
    ctx.beginPath();
    ctx.moveTo(x + 3.5 * scale * 0.15 + accentSlantOffset + jitterFunc(), y - 2 * scale * 0.15 + jitterFunc());
    ctx.lineTo(x + 5.5 * scale * 0.15 + accentSlantOffset + jitterFunc(), y - 4.5 * scale * 0.15 + jitterFunc());
    ctx.lineTo(x + 7.5 * scale * 0.15 + accentSlantOffset + jitterFunc(), y - 2 * scale * 0.15 + jitterFunc());
    ctx.stroke();
  } else if (['ë', 'ï'].includes(char)) {
    // Umlaut / diaeresis (two dots above)
    ctx.beginPath();
    ctx.arc(x + 4 * scale * 0.15 + accentSlantOffset, y - 3 * scale * 0.15, 1, 0, Math.PI * 2);
    ctx.arc(x + 7 * scale * 0.15 + accentSlantOffset, y - 3 * scale * 0.15, 1, 0, Math.PI * 2);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
  } else if (['ç'].includes(char)) {
    // Cedilla (hook under c)
    ctx.beginPath();
    ctx.moveTo(x + 5 * scale * 0.15, y + 7.5 * scale * 0.15);
    ctx.quadraticCurveTo(x + 3 * scale * 0.15, y + 9.5 * scale * 0.15, x + 5 * scale * 0.15, y + 10.5 * scale * 0.15);
    ctx.stroke();
  }
}

// 8. Custom Lightweight Analytical Dashboard Charts drawing
function renderHistoryCharts() {
  const history = AppState.activeProfile.history || [];
  if (history.length === 0) return;
  drawSlantLineChart(elements.chartSlant, history);
  drawJitterBarChart(elements.chartJitter, history);
}

function drawSlantLineChart(canvas, history) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const padding = 30;
  const width = canvas.width - padding * 2;
  const height = canvas.height - padding * 2;

  // Grid
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, padding + height);
  ctx.lineTo(padding + width, padding + height);
  ctx.stroke();

  // Draw y ticks (slant values -20 to 20)
  ctx.fillStyle = '#64748b';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  
  const minVal = -20;
  const maxVal = 20;
  const valRange = maxVal - minVal;

  for (let i = 0; i <= 4; i++) {
    const val = minVal + (valRange / 4) * i;
    const y = padding + height - (height / 4) * i;
    ctx.fillText(`${val}°`, padding - 6, y);
    // Gridlines
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.5)';
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(padding + width, y);
    ctx.stroke();
  }

  // Draw plot line
  if (history.length > 0) {
    ctx.strokeStyle = '#6366f1'; // Indigo
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const points = [];
    history.forEach((record, index) => {
      const x = padding + (width / Math.max(1, history.length - 1)) * index;
      const val = record.slant;
      const y = padding + height - ((val - minVal) / valRange) * height;
      points.push({ x, y });
      
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw point nodes
    ctx.fillStyle = '#6366f1';
    points.forEach((pt, index) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#6366f1'; // Restore

      // Labels below nodes
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText(`#${index + 1}`, pt.x, padding + height + 12);
    });
  }
}

function drawJitterBarChart(canvas, history) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const padding = 30;
  const width = canvas.width - padding * 2;
  const height = canvas.height - padding * 2;

  // Grid border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, padding + height);
  ctx.lineTo(padding + width, padding + height);
  ctx.stroke();

  // Y ticks (jitter levels 0 to 4 px)
  ctx.fillStyle = '#64748b';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  
  const minVal = 0;
  const maxVal = 4;
  const valRange = maxVal - minVal;

  for (let i = 0; i <= 4; i++) {
    const val = minVal + (valRange / 4) * i;
    const y = padding + height - (height / 4) * i;
    ctx.fillText(`${val}px`, padding - 6, y);
    
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.5)';
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(padding + width, y);
    ctx.stroke();
  }

  // Draw Bars representing stroke wiggles
  if (history.length > 0) {
    const barWidth = Math.min(25, (width / history.length) * 0.4);
    const spacing = (width - barWidth * history.length) / Math.max(1, history.length - 1);

    history.forEach((record, index) => {
      const val = record.jitter;
      const barHeight = (val / valRange) * height;
      const x = padding + (barWidth + spacing) * index;
      const y = padding + height - barHeight;

      // Draw rounded column bar
      ctx.fillStyle = '#10b981'; // Success Emerald
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // X labels
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText(`#${index + 1}`, x + barWidth / 2, padding + height + 12);
    });
  }
}

// 9. History Gallery log lists
function renderHistoryGallery() {
  const history = AppState.activeProfile.history || [];
  const gallery = elements.historyGallery;
  
  // Clear layout
  gallery.innerHTML = '';
  
  if (history.length === 0) {
    gallery.appendChild(elements.emptyHistoryNotice);
    elements.emptyHistoryNotice.style.display = 'flex';
    return;
  }

  elements.emptyHistoryNotice.style.display = 'none';

  history.forEach((record, idx) => {
    const date = new Date(record.timestamp).toLocaleDateString(undefined, { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });

    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
      <img src="${record.image}" alt="Handwriting Sample #${idx+1}">
      <div class="gallery-item-info">
        <div class="gallery-item-date">${date}</div>
        <div class="gallery-item-metrics">
          <span>Slant: ${record.slant}°</span>
          <span>Jitter: ${record.jitter}px</span>
        </div>
      </div>
    `;
    gallery.appendChild(item);
  });
}

// 10. Chat bubbles drawing
function renderChats() {
  const container = elements.chatMessages;
  container.innerHTML = '';

  if (AppState.chats.length === 0) {
    container.innerHTML = `
      <div class="message assistant">
        <p class="text">Hello! I am your HandScribe AI Penmanship Coach. Upload your handwriting in the camera portal, and I will track your progress. I can give advice on slant, strokes, or set exercises for Math, Science, or French. How can I help you today?</p>
        <span class="time">Just now</span>
      </div>
    `;
    return;
  }

  AppState.chats.forEach(msg => {
    const entry = document.createElement('div');
    entry.className = `message ${msg.sender === 'user' ? 'user' : 'assistant'}`;
    
    // Format paragraph breaks
    const textHtml = msg.text.replace(/\n/g, '<br>');
    const date = new Date(msg.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    entry.innerHTML = `
      <p class="text">${textHtml}</p>
      <span class="time">${date}</span>
    `;
    container.appendChild(entry);
  });

  scrollChatBottom();
}

function scrollChatBottom() {
  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

// Helper: draw based on active subject practice tab
function drawSubjectContent() {
  const subject = AppState.subject;
  let text = '';
  
  if (subject === 'general') {
    text = elements.genTextInput.value;
  } else if (subject === 'science') {
    text = elements.sciTextInput.value || "H2O + CO2 -> H2CO3";
    elements.sciTextInput.value = text;
  } else if (subject === 'maths') {
    text = elements.mathTextInput.value || "y = ax^2 + bx + c";
    elements.mathTextInput.value = text;
  } else if (subject === 'social') {
    text = elements.socTextInput.value || "July 14, 1789: Storming of the Bastille";
    elements.socTextInput.value = text;
  } else if (subject === 'french') {
    text = elements.freTextInput.value || "Éléonore a fêté son Noël à Genève.";
    elements.freTextInput.value = text;
  }

  // Get current parameters
  const config = {
    slant: elements.tuneSlant.value,
    strokeWidth: elements.tuneWidth.value,
    letterSpacing: elements.tuneSpacing.value,
    jitter: elements.tuneJitter.value,
    connectionRatio: elements.tuneCursive.value,
    size: elements.tuneSize.value,
    color: elements.tuneColor.value
  };

  generateHandwriting(text, elements.synthesisCanvas, config);
}

function renderPlaygroundPreview() {
  const text = elements.quickInput.value || "Hello, I am testing HandScribe AI!";
  elements.quickInput.value = text;

  const config = {
    slant: AppState.activeProfile.slant,
    strokeWidth: AppState.activeProfile.strokeWidth,
    letterSpacing: AppState.activeProfile.letterSpacing,
    jitter: AppState.activeProfile.jitter,
    connectionRatio: AppState.activeProfile.connectionRatio,
    size: 1.0,
    color: '#1c2d5a'
  };

  generateHandwriting(text, elements.quickCanvas, config);
}

// Utilities
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 11. Authentication Logic
function initAuth() {
  // Toggle Tabs
  elements.btnTabLogin.addEventListener('click', () => {
    elements.btnTabLogin.classList.add('active');
    elements.btnTabSignup.classList.remove('active');
    elements.loginForm.classList.add('active');
    elements.signupForm.classList.remove('active');
    elements.authError.style.display = 'none';
  });

  elements.btnTabSignup.addEventListener('click', () => {
    elements.btnTabSignup.classList.add('active');
    elements.btnTabLogin.classList.remove('active');
    elements.signupForm.classList.add('active');
    elements.loginForm.classList.remove('active');
    elements.authError.style.display = 'none';
  });

  // Login Submit
  elements.loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    elements.authError.style.display = 'none';
    
    const email = elements.loginEmail.value;
    const password = elements.loginPassword.value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        setLoggedInSession(data.email, data.name);
      } else {
        showAuthError(data.error || 'Authentication failed');
      }
    } catch (err) {
      showAuthError('Server error, check connection');
    }
  });

  // Signup Submit
  elements.signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    elements.authError.style.display = 'none';
    
    const name = elements.signupName.value;
    const email = elements.signupEmail.value;
    const password = elements.signupPassword.value;

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        setLoggedInSession(data.email, data.name);
      } else {
        showAuthError(data.error || 'Signup failed');
      }
    } catch (err) {
      showAuthError('Server error, check connection');
    }
  });

  // Guest Access
  elements.btnAuthGuest.addEventListener('click', () => {
    setLoggedInSession('default', 'Guest Student');
  });

  // Logout Trigger
  elements.btnLogout.addEventListener('click', () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    
    AppState.userEmail = 'default';
    AppState.userName = 'Guest Student';

    elements.btnLogout.style.display = 'none';
    elements.authOverlay.classList.add('active');

    // Clean inputs
    elements.loginEmail.value = '';
    elements.loginPassword.value = '';
    elements.signupName.value = '';
    elements.signupEmail.value = '';
    elements.signupPassword.value = '';

    fetchProfile();
    fetchChats();
    switchPanel('dashboard');
  });

  // Initial Auth Check
  if (AppState.userEmail === 'default') {
    elements.authOverlay.classList.add('active');
    elements.btnLogout.style.display = 'none';
  } else {
    elements.authOverlay.classList.remove('active');
    elements.btnLogout.style.display = 'block';
  }
}

function setLoggedInSession(email, name) {
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userName', name);
  
  AppState.userEmail = email;
  AppState.userName = name;
  
  elements.authOverlay.classList.remove('active');
  if (email !== 'default') {
    elements.btnLogout.style.display = 'block';
  } else {
    elements.btnLogout.style.display = 'none';
  }

  fetchProfile();
  fetchChats();
  setTimeout(() => {
    switchPanel('dashboard');
  }, 100);
}

function showAuthError(msg) {
  elements.authError.textContent = msg;
  elements.authError.style.display = 'block';
}

// 12. Event Listeners Initializer
function initEvents() {
  initAuth();
  
  // Real-time quick preview
  elements.btnQuickGen.addEventListener('click', renderPlaygroundPreview);
  elements.quickInput.addEventListener('input', renderPlaygroundPreview);

  // Synthesis generator settings sliders update
  const sliders = [
    elements.tuneSlant, elements.tuneWidth, elements.tuneSpacing,
    elements.tuneJitter, elements.tuneCursive, elements.tuneSize
  ];
  
  sliders.forEach(slider => {
    slider.addEventListener('input', () => {
      updateSliderTextValues();
      drawSubjectContent();
      
      // Auto-save adjustments to update the primary profile settings
      saveTunedProfile();
    });
  });

  elements.tuneColor.addEventListener('change', drawSubjectContent);
  elements.btnSynthesisGenerate.addEventListener('click', drawSubjectContent);
  
  elements.btnResetTuning.addEventListener('click', () => {
    // Reset to current profile loaded
    fetchProfile();
    setTimeout(drawSubjectContent, 200);
  });

  // Chat send listeners
  elements.btnSendMessage.addEventListener('click', () => {
    sendChatMessage(elements.chatUserInput.value);
  });
  elements.chatUserInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendChatMessage(elements.chatUserInput.value);
    }
  });
  elements.btnClearChats.addEventListener('click', clearChats);

  // Quick Chat triggers
  elements.chatShortcuts.forEach(btn => {
    btn.addEventListener('click', () => {
      sendChatMessage(btn.dataset.prompt);
    });
  });

  // Template chips triggers inside subjects
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const targetText = chip.dataset.text;
      const panel = chip.closest('.subject-panel');
      const textarea = panel.querySelector('textarea');
      if (textarea) {
        textarea.value = targetText;
        drawSubjectContent();
      }
    });
  });

  // Textarea input changes trigger updates
  [
    elements.genTextInput, elements.sciTextInput, elements.mathTextInput,
    elements.socTextInput, elements.freTextInput
  ].forEach(textarea => {
    textarea.addEventListener('input', drawSubjectContent);
  });

  // Download canvas sheet
  elements.btnDownloadSheet.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `handwriting-sheet-${Date.now()}.png`;
    link.href = elements.synthesisCanvas.toDataURL();
    link.click();
  });

  // Clear sheet
  elements.btnClearSheet.addEventListener('click', () => {
    const canvas = elements.synthesisCanvas;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Clear current text area
    const subject = AppState.subject;
    const textarea = document.getElementById(`${subject === 'general' ? 'gen' : subject.substring(0,3)}-text-input`);
    if (textarea) textarea.value = '';
  });
}

// Debounce timer for saving profile updates
let saveProfileTimeout;
function saveTunedProfile() {
  clearTimeout(saveProfileTimeout);
  saveProfileTimeout = setTimeout(() => {
    const payload = {
      slant: elements.tuneSlant.value,
      strokeWidth: elements.tuneWidth.value,
      letterSpacing: elements.tuneSpacing.value,
      jitter: elements.tuneJitter.value,
      connectionRatio: elements.tuneCursive.value,
      wordSpacing: AppState.activeProfile.wordSpacing
    };
    updateManualProfile(payload);
  }, 1000);
}

// Boot up
window.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCamera();
  initEvents();
  
  // Load database files
  fetchProfile();
  fetchChats();
  
  // Set default panel view
  switchPanel('dashboard');
});
