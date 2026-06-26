/**
 * PulsePrep - FMGE Practice Application Controller
 * Handles state management, tab routing, localStorage persistence, 
 * practice mode, mock exam simulations, flashcard revisions, and SVG data charts.
 */

class PulsePrepApp {
  constructor() {
    // Initial State
    this.userData = {
      practicedIds: {}, // { questionId: selectedIndex }
      history: [],      // Array of { id, subject, isCorrect }
      bookmarks: [],    // Array of questionIds
      flashcardCount: 0,
      mockCompleted: 0
    };
    
    // UI/Routing states
    this.activeTab = 'dashboard';
    
    // Practice States
    this.practiceSubject = null;
    this.practiceQuestions = [];
    this.practiceIndex = 0;
    this.practiceAnswered = false;
    this.explanationOpen = false;
    
    // Mock Exam States
    this.mockQuestions = [];
    this.mockAnswers = []; // Array of selected option indices (null if unselected)
    this.mockFlags = [];   // Array of booleans
    this.mockIndex = 0;
    this.mockTimeLeft = 0;
    this.mockTimer = null;
    this.mockActive = false;
    
    // Flashcard States
    this.flashcardsList = [];
    this.flashcardIndex = 0;
    this.flashcardFlipped = false;
  }

  init() {
    this.loadUserData();
    this.renderDashboardSubjects();
    this.updateGlobalStats();
    this.populateMockSubjectsDropdown();
    
    // Initialize Lucide icons on page load
    if (window.lucide) {
      window.lucide.createIcons();
    }
    
    // Load first flashcard ready
    if (typeof FLASHCARDS !== 'undefined' && FLASHCARDS.length > 0) {
      this.flashcardsList = [...FLASHCARDS];
      this.shuffleArray(this.flashcardsList);
      this.renderFlashcard();
    }
  }

  populateMockSubjectsDropdown() {
    const select = document.getElementById('mock-subject');
    if (!select) return;
    
    // Clear existing options except first
    const firstOption = select.options[0];
    select.innerHTML = '';
    select.appendChild(firstOption);
    
    // Get unique subjects
    const subjects = [...new Set(QUESTIONS.map(q => q.subject))].sort();
    
    subjects.forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub;
      opt.textContent = sub;
      select.appendChild(opt);
    });
  }

  // Helper: Shuffle items
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Load state from localStorage
  loadUserData() {
    const saved = localStorage.getItem('pulse_prep_data');
    if (saved) {
      try {
        this.userData = JSON.parse(saved);
        if (!this.userData.bookmarks) this.userData.bookmarks = [];
        if (!this.userData.history) this.userData.history = [];
        if (!this.userData.practicedIds) this.userData.practicedIds = {};
      } catch (e) {
        console.error("Error loading user data from localStorage", e);
      }
    }
  }

  // Save state to localStorage
  saveUserData() {
    localStorage.setItem('pulse_prep_data', JSON.stringify(this.userData));
    this.updateGlobalStats();
  }

  // Tab switching router
  switchTab(tabName) {
    // If an active mock exam is running, prompt confirmation before leaving
    if (this.mockActive && tabName !== 'mock') {
      const confirmLeave = confirm("An active mock exam is in progress. Leaving will abort the exam and discard progress. Are you sure you want to exit?");
      if (!confirmLeave) return;
      this.abortMockExam();
    }

    this.activeTab = tabName;
    
    // Update active nav link classes
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      const onclickAttr = link.getAttribute('onclick');
      if (onclickAttr && onclickAttr.includes(`'${tabName}'`)) {
        link.classList.add('active');
      }
    });

    // Update tab sections visibility
    document.querySelectorAll('.tab-section').forEach(section => {
      section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(`${tabName}-tab`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Trigger tab specific renders
    if (tabName === 'analytics') {
      this.renderAnalytics();
    } else if (tabName === 'bookmarks') {
      this.renderBookmarks();
    } else if (tabName === 'dashboard') {
      this.renderDashboardSubjects();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Render stats counters
  updateGlobalStats() {
    // Calculations
    const totalPracticed = this.userData.history.length;
    const correctCount = this.userData.history.filter(h => h.isCorrect).length;
    const accuracy = totalPracticed > 0 ? Math.round((correctCount / totalPracticed) * 100) : 0;
    
    document.getElementById('stats-total-practiced').textContent = totalPracticed;
    document.getElementById('stats-accuracy').textContent = `${accuracy}%`;
    document.getElementById('stats-flashcards').textContent = this.userData.flashcardCount || 0;
    document.getElementById('stats-mock-exams').textContent = this.userData.mockCompleted || 0;
  }

  // Render subjects list on dashboard
  renderDashboardSubjects() {
    const container = document.getElementById('subjects-container');
    if (!container) return;
    container.innerHTML = '';
    
    // Group questions by subject
    const subjectsMap = {};
    // Add custom "All Subjects" option
    subjectsMap['All Subjects'] = { total: QUESTIONS.length, correct: 0, completed: 0 };

    QUESTIONS.forEach(q => {
      if (!subjectsMap[q.subject]) {
        subjectsMap[q.subject] = { total: 0, correct: 0, completed: 0 };
      }
      subjectsMap[q.subject].total++;
    });

    // Calculate completion & accuracy from history
    this.userData.history.forEach(h => {
      // Find question
      const q = QUESTIONS.find(qu => qu.id === h.id);
      if (q) {
        if (subjectsMap[q.subject]) {
          subjectsMap[q.subject].completed++;
          if (h.isCorrect) subjectsMap[q.subject].correct++;
        }
        // Increment for global "All Subjects"
        subjectsMap['All Subjects'].completed++;
        if (h.isCorrect) subjectsMap['All Subjects'].correct++;
      }
    });

    // Subject keys list
    const subjects = Object.keys(subjectsMap).sort((a, b) => {
      if (a === 'All Subjects') return -1;
      if (b === 'All Subjects') return 1;
      return a.localeCompare(b);
    });

    // Icons map based on subject names
    const subjectIcons = {
      'All Subjects': 'shield',
      'Anatomy': 'activity', // Lucide body icon fallback
      'Physiology': 'heart',
      'Biochemistry': 'dna',
      'Pharmacology': 'droplet',
      'Pathology': 'microscope',
      'Microbiology': 'bug',
      'Social & Preventive Medicine': 'globe',
      'Pediatrics': 'baby',
      'OBG': 'venus',
      'Obstetrics & Gynecology': 'venus',
      'Orthopedics': 'bone',
      'Forensic Medicine': 'shield-alert',
      'Surgery': 'scissors',
      'Medicine': 'activity',
      'Ophthalmology': 'eye',
      'ENT': 'volume-2', // Lucide hearing fallback
      'Dermatology': 'sparkles',
      'Psychiatry': 'brain',
      'Radiology': 'scan',
      'Anesthesia': 'wind'
    };

    subjects.forEach(subject => {
      const data = subjectsMap[subject];
      const percent = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
      // Cap percent at 100% just in case of multiple attempts in history
      const displayPercent = Math.min(percent, 100);
      
      const iconName = subjectIcons[subject] || 'book-open';
      
      const card = document.createElement('div');
      card.className = 'glass-panel subject-card';
      card.onclick = () => this.startPractice(subject);
      
      card.innerHTML = `
        <div class="subject-header">
          <div class="subject-icon-wrap">
            <i data-lucide="${iconName}"></i>
          </div>
          <span class="question-count-badge">${data.total} MCQs</span>
        </div>
        <h3 class="subject-name">${subject}</h3>
        <div class="subject-progress-bar">
          <div class="subject-progress-fill" style="width: ${displayPercent}%"></div>
        </div>
        <div class="subject-stats">
          <span>Progress: ${displayPercent}%</span>
          <span>Acc: ${data.completed > 0 ? Math.round((data.correct / data.completed) * 100) : 0}%</span>
        </div>
      `;
      container.appendChild(card);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // ================= PRACTICE MODE =================

  startPractice(subject) {
    this.practiceSubject = subject;
    this.explanationOpen = false;
    this.practiceAnswered = false;
    
    // Filter questions
    if (subject === 'All Subjects') {
      this.practiceQuestions = [...QUESTIONS];
    } else {
      this.practiceQuestions = QUESTIONS.filter(q => q.subject === subject);
    }
    
    // Shuffle practice questions
    this.shuffleArray(this.practiceQuestions);
    this.practiceIndex = 0;
    
    this.switchTab('practice');
    
    // Update headers
    document.getElementById('practice-subtitle').textContent = `Reviewing high-yield questions for ${subject}`;
    
    // Toggle containers
    document.getElementById('practice-select-prompt').style.display = 'none';
    document.getElementById('active-practice-panel').style.display = 'block';
    
    this.renderPracticeQuestion();
  }

  renderPracticeQuestion() {
    if (this.practiceQuestions.length === 0) {
      document.getElementById('active-practice-panel').innerHTML = `
        <div class="no-data-placeholder">
          <i data-lucide="alert-circle"></i>
          <h3>No Questions Found</h3>
          <p>We couldn't find any questions matching this subject category.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    const q = this.practiceQuestions[this.practiceIndex];
    this.practiceAnswered = false;
    this.explanationOpen = false;

    // Reset layout elements
    document.getElementById('practice-subject-tag').textContent = q.subject;
    document.getElementById('practice-index-tag').textContent = `Question ${this.practiceIndex + 1} of ${this.practiceQuestions.length}`;
    
    // PYQ badge
    const pyqBadge = document.getElementById('practice-pyq-tag');
    if (q.isPYQ) {
      pyqBadge.textContent = `PYQ ${q.year || ''}`;
      pyqBadge.style.display = 'inline-block';
    } else {
      pyqBadge.style.display = 'none';
    }

    // Bookmark button state
    const isBookmarked = this.userData.bookmarks.includes(q.id);
    const bkBtn = document.getElementById('practice-bookmark-btn');
    if (isBookmarked) {
      bkBtn.classList.add('active');
    } else {
      bkBtn.classList.remove('active');
    }

    document.getElementById('practice-question-text').textContent = q.question;
    
    // Hide footer buttons initially
    document.getElementById('practice-explain-btn').style.display = 'none';
    document.getElementById('practice-next-btn').style.display = 'none';
    document.getElementById('practice-explanation-panel').style.display = 'none';

    // Render Options
    const optContainer = document.getElementById('practice-options-container');
    optContainer.innerHTML = '';

    const alphabet = ['A', 'B', 'C', 'D'];
    q.options.forEach((optText, index) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.onclick = () => this.selectPracticeOption(index);
      
      btn.innerHTML = `
        <span class="option-prefix">${alphabet[index]}</span>
        <span class="option-text">${optText}</span>
      `;
      optContainer.appendChild(btn);
    });
  }

  selectPracticeOption(selIndex) {
    if (this.practiceAnswered) return; // Prevent multiple submissions
    this.practiceAnswered = true;
    
    const q = this.practiceQuestions[this.practiceIndex];
    const isCorrect = (selIndex === q.correctAnswer);
    
    // Record into history
    this.userData.history.push({
      id: q.id,
      subject: q.subject,
      isCorrect: isCorrect
    });
    
    // Record index attempted
    this.userData.practicedIds[q.id] = selIndex;
    this.saveUserData();

    // Style options to show feedback
    const optionButtons = document.querySelectorAll('#practice-options-container .option-btn');
    optionButtons.forEach((btn, idx) => {
      btn.classList.add('locked');
      if (idx === q.correctAnswer) {
        btn.classList.add('correct');
      } else if (idx === selIndex) {
        btn.classList.add('incorrect');
      } else {
        btn.classList.add('dimmed');
      }
    });

    // Reveal explanation trigger
    document.getElementById('practice-explain-btn').style.display = 'flex';
    
    // If not the last question, show next button
    if (this.practiceIndex < this.practiceQuestions.length - 1) {
      document.getElementById('practice-next-btn').style.display = 'flex';
    }
    
    // Pre-populate explanation
    document.getElementById('practice-explanation-text').textContent = q.explanation;
    // Auto-reveal explanation for educational focus
    this.revealExplanation(true);
  }

  toggleExplanation() {
    this.explanationOpen = !this.explanationOpen;
    this.revealExplanation(this.explanationOpen);
  }

  revealExplanation(show) {
    const panel = document.getElementById('practice-explanation-panel');
    const btnSpan = document.querySelector('#practice-explain-btn span');
    const btnIcon = document.querySelector('#practice-explain-btn i');

    if (show) {
      panel.style.display = 'block';
      if (btnSpan) btnSpan.textContent = 'Hide Explanation';
      if (btnIcon && window.lucide) {
        btnIcon.setAttribute('data-lucide', 'eye-off');
        window.lucide.createIcons();
      }
    } else {
      panel.style.display = 'none';
      if (btnSpan) btnSpan.textContent = 'Show Explanation';
      if (btnIcon && window.lucide) {
        btnIcon.setAttribute('data-lucide', 'info');
        window.lucide.createIcons();
      }
    }
  }

  nextPracticeQuestion() {
    if (this.practiceIndex < this.practiceQuestions.length - 1) {
      this.practiceIndex++;
      this.renderPracticeQuestion();
    }
  }

  toggleBookmarkCurrent() {
    if (this.practiceQuestions.length === 0) return;
    const q = this.practiceQuestions[this.practiceIndex];
    const bkIdx = this.userData.bookmarks.indexOf(q.id);
    
    const btn = document.getElementById('practice-bookmark-btn');

    if (bkIdx > -1) {
      // Remove
      this.userData.bookmarks.splice(bkIdx, 1);
      btn.classList.remove('active');
    } else {
      // Add
      this.userData.bookmarks.push(q.id);
      btn.classList.add('active');
    }
    this.saveUserData();
  }

  // ================= MOCK EXAM SYSTEM =================

  startMockExam() {
    const subjectFilter = document.getElementById('mock-subject').value;
    const totalCount = parseInt(document.getElementById('mock-size').value, 10);
    
    // Filter questions pool
    let pool = [];
    if (subjectFilter === 'all') {
      pool = [...QUESTIONS];
    } else {
      pool = QUESTIONS.filter(q => q.subject === subjectFilter);
    }

    if (pool.length === 0) {
      alert("No questions found for this category to generate a mock exam.");
      return;
    }

    // Shuffle and pick limit
    this.shuffleArray(pool);
    this.mockQuestions = pool.slice(0, Math.min(totalCount, pool.length));
    
    // Initialize mock exam states
    this.mockAnswers = new Array(this.mockQuestions.length).fill(null);
    this.mockFlags = new Array(this.mockQuestions.length).fill(false);
    this.mockIndex = 0;
    this.mockActive = true;
    
    // Timer calculation: 1 minute per question
    this.mockTimeLeft = this.mockQuestions.length * 60;
    
    // Set UI displays
    document.getElementById('mock-setup-view').style.display = 'none';
    document.getElementById('mock-exam-view').style.display = 'grid';
    document.getElementById('mock-results-view').style.display = 'none';
    
    this.renderMockQuestion();
    this.renderMockPalette();
    this.startMockTimer();
  }

  startMockTimer() {
    if (this.mockTimer) clearInterval(this.mockTimer);
    
    const timerText = document.getElementById('mock-timer-text');
    const timerBox = document.getElementById('mock-timer');
    timerBox.classList.remove('warning');

    const updateTimerUI = () => {
      const minutes = Math.floor(this.mockTimeLeft / 60);
      const seconds = this.mockTimeLeft % 60;
      timerText.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      if (this.mockTimeLeft <= 60) {
        timerBox.classList.add('warning');
      }
      
      if (this.mockTimeLeft <= 0) {
        clearInterval(this.mockTimer);
        this.submitMockExam(true); // Auto submit on timeout
      }
      this.mockTimeLeft--;
    };

    updateTimerUI();
    this.mockTimer = setInterval(updateTimerUI, 1000);
  }

  renderMockQuestion() {
    const q = this.mockQuestions[this.mockIndex];
    
    // Update headers
    document.getElementById('mock-subject-tag').textContent = q.subject;
    document.getElementById('mock-index-tag').textContent = `Question ${this.mockIndex + 1} of ${this.mockQuestions.length}`;
    
    const pyqTag = document.getElementById('mock-pyq-indicator');
    if (q.isPYQ) {
      pyqTag.textContent = `PYQ ${q.year || ''}`;
      pyqTag.style.display = 'inline-block';
    } else {
      pyqTag.style.display = 'none';
    }

    // Bookmark state
    const isBookmarked = this.userData.bookmarks.includes(q.id);
    const bkBtn = document.getElementById('mock-bookmark-btn');
    if (isBookmarked) {
      bkBtn.classList.add('active');
    } else {
      bkBtn.classList.remove('active');
    }

    document.getElementById('mock-question-text').textContent = q.question;
    
    // Options
    const container = document.getElementById('mock-options-container');
    container.innerHTML = '';
    
    const alphabet = ['A', 'B', 'C', 'D'];
    const selectedIdx = this.mockAnswers[this.mockIndex];

    q.options.forEach((optText, index) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      if (selectedIdx === index) {
        btn.classList.add('correct'); // reuse highlight styling for selection
      }
      btn.onclick = () => this.selectMockOption(index);
      
      btn.innerHTML = `
        <span class="option-prefix">${alphabet[index]}</span>
        <span class="option-text">${optText}</span>
      `;
      container.appendChild(btn);
    });

    // Control buttons state
    document.getElementById('mock-prev-btn').style.visibility = (this.mockIndex === 0) ? 'hidden' : 'visible';
    
    const nextBtnSpan = document.querySelector('#mock-next-btn-action span');
    if (this.mockIndex === this.mockQuestions.length - 1) {
      nextBtnSpan.textContent = 'Review';
    } else {
      nextBtnSpan.textContent = 'Next';
    }

    // Flag button visual update
    const flagText = document.getElementById('mock-flag-text');
    const isFlagged = this.mockFlags[this.mockIndex];
    if (isFlagged) {
      flagText.textContent = 'Unflag Question';
    } else {
      flagText.textContent = 'Flag for Review';
    }
  }

  selectMockOption(index) {
    // Save selection
    this.mockAnswers[this.mockIndex] = index;
    
    // Re-render options to update highlights
    const optionButtons = document.querySelectorAll('#mock-options-container .option-btn');
    optionButtons.forEach((btn, idx) => {
      if (idx === index) {
        btn.classList.add('correct');
      } else {
        btn.classList.remove('correct');
      }
    });

    this.renderMockPalette();
  }

  flagQuestion() {
    this.mockFlags[this.mockIndex] = !this.mockFlags[this.mockIndex];
    this.renderMockQuestion();
    this.renderMockPalette();
  }

  toggleBookmarkCurrentMock() {
    if (!this.mockActive) return;
    const q = this.mockQuestions[this.mockIndex];
    const bkIdx = this.userData.bookmarks.indexOf(q.id);
    const btn = document.getElementById('mock-bookmark-btn');

    if (bkIdx > -1) {
      this.userData.bookmarks.splice(bkIdx, 1);
      btn.classList.remove('active');
    } else {
      this.userData.bookmarks.push(q.id);
      btn.classList.add('active');
    }
    this.saveUserData();
  }

  prevMockQuestion() {
    if (this.mockIndex > 0) {
      this.mockIndex--;
      this.renderMockQuestion();
      this.renderMockPalette();
    }
  }

  nextMockQuestion() {
    if (this.mockIndex < this.mockQuestions.length - 1) {
      this.mockIndex++;
      this.renderMockQuestion();
      this.renderMockPalette();
    } else {
      // Last question clicked "Next" acts as review alert
      alert("You have reached the end of the exam. Click 'Submit Examination' in the side panel to complete the test.");
    }
  }

  renderMockPalette() {
    const paletteGrid = document.getElementById('mock-palette-grid');
    if (!paletteGrid) return;
    paletteGrid.innerHTML = '';

    this.mockQuestions.forEach((q, index) => {
      const item = document.createElement('button');
      item.className = 'palette-item';
      item.textContent = index + 1;
      
      // Determine statuses
      if (index === this.mockIndex) {
        item.classList.add('active');
      }
      
      if (this.mockAnswers[index] !== null) {
        item.classList.add('answered');
      }
      
      if (this.mockFlags[index]) {
        item.classList.add('flagged');
      }

      item.onclick = () => {
        this.mockIndex = index;
        this.renderMockQuestion();
        this.renderMockPalette();
      };

      paletteGrid.appendChild(item);
    });
  }

  submitMockConfirm() {
    const unanswered = this.mockAnswers.filter(a => a === null).length;
    let msg = "Are you sure you want to finish the exam?";
    if (unanswered > 0) {
      msg = `You have ${unanswered} unanswered questions. Are you sure you want to submit and complete the exam?`;
    }

    if (confirm(msg)) {
      this.submitMockExam();
    }
  }

  submitMockExam(forced = false) {
    if (this.mockTimer) clearInterval(this.mockTimer);
    this.mockActive = false;

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    // Grade and record to stats
    this.mockQuestions.forEach((q, idx) => {
      const answer = this.mockAnswers[idx];
      if (answer === null) {
        unansweredCount++;
      } else {
        const isCorrect = (answer === q.correctAnswer);
        if (isCorrect) {
          correctCount++;
        } else {
          incorrectCount++;
        }

        // Add to learning analytics history
        this.userData.history.push({
          id: q.id,
          subject: q.subject,
          isCorrect: isCorrect
        });
      }
    });

    // Increment completed counts
    this.userData.mockCompleted = (this.userData.mockCompleted || 0) + 1;
    this.saveUserData();

    // Render scorecard
    document.getElementById('mock-exam-view').style.display = 'none';
    document.getElementById('mock-results-view').style.display = 'block';

    const accuracyVal = this.mockQuestions.length > 0 ? Math.round((correctCount / this.mockQuestions.length) * 100) : 0;
    document.getElementById('result-percentage').textContent = `${accuracyVal}%`;
    document.getElementById('result-fraction').textContent = `${correctCount} / ${this.mockQuestions.length}`;
    
    document.getElementById('result-correct').textContent = correctCount;
    document.getElementById('result-incorrect').textContent = incorrectCount;
    document.getElementById('result-unanswered').textContent = unansweredCount;

    const resultHeader = document.getElementById('result-header');
    const resultMsg = document.getElementById('result-msg');

    if (accuracyVal >= 75) {
      resultHeader.textContent = "Excellent Job!";
      resultMsg.textContent = "You're showing high mastery of these topics. Keep it up!";
    } else if (accuracyVal >= 50) {
      resultHeader.textContent = "Good Effort!";
      resultMsg.textContent = "You passed the standard FMGE cut-off (50%). Aim higher next time!";
    } else {
      resultHeader.textContent = "Keep Studying!";
      resultMsg.textContent = "Review your incorrect questions and strengthen your fundamentals.";
    }

    if (window.lucide) window.lucide.createIcons();
  }

  abortMockExam() {
    if (this.mockTimer) clearInterval(this.mockTimer);
    this.mockActive = false;
    document.getElementById('mock-exam-view').style.display = 'none';
    document.getElementById('mock-results-view').style.display = 'none';
    document.getElementById('mock-setup-view').style.display = 'block';
  }

  restartMock() {
    document.getElementById('mock-results-view').style.display = 'none';
    document.getElementById('mock-setup-view').style.display = 'block';
  }

  // ================= REVISION FLASHCARDS =================

  renderFlashcard() {
    if (this.flashcardsList.length === 0) return;
    
    const card = this.flashcardsList[this.flashcardIndex];
    
    // Front side render
    document.getElementById('card-category').textContent = card.category;
    document.getElementById('card-front-text').textContent = card.front;
    
    // Back side render
    document.getElementById('card-category-back').textContent = card.category;
    document.getElementById('card-back-text').textContent = card.back;

    // Reset card orientation
    const innerCard = document.getElementById('flashcard-inner-card');
    innerCard.classList.remove('flipped');
    this.flashcardFlipped = false;

    // Hide controls
    document.getElementById('card-control-buttons').style.visibility = 'hidden';
  }

  flipFlashcard() {
    const innerCard = document.getElementById('flashcard-inner-card');
    this.flashcardFlipped = !this.flashcardFlipped;
    
    if (this.flashcardFlipped) {
      innerCard.classList.add('flipped');
      // Show controls when flipped
      document.getElementById('card-control-buttons').style.visibility = 'visible';
    } else {
      innerCard.classList.remove('flipped');
      document.getElementById('card-control-buttons').style.visibility = 'hidden';
    }
  }

  nextFlashcard(known) {
    if (known) {
      this.userData.flashcardCount = (this.userData.flashcardCount || 0) + 1;
      this.saveUserData();
    }
    
    this.flashcardIndex++;
    if (this.flashcardIndex >= this.flashcardsList.length) {
      // Loop over list and reshuffle
      this.flashcardIndex = 0;
      this.shuffleArray(this.flashcardsList);
      alert("You have completed the current flashcard deck! Shuffling for another round.");
    }
    
    this.renderFlashcard();
  }

  // ================= BOOKMARKS MANAGER =================

  renderBookmarks() {
    const container = document.getElementById('bookmarks-list-container');
    if (!container) return;
    container.innerHTML = '';

    if (this.userData.bookmarks.length === 0) {
      container.innerHTML = `
        <div class="glass-panel no-data-placeholder">
          <i data-lucide="bookmark-x"></i>
          <h3>No Saved Bookmarks</h3>
          <p>Bookmarked questions will appear here for fast revision. You can bookmark questions in Practice Mode or Mock Exams.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    this.userData.bookmarks.forEach(qId => {
      const q = QUESTIONS.find(qu => qu.id === qId);
      if (!q) return;

      const item = document.createElement('div');
      item.className = 'bookmark-item';
      
      item.innerHTML = `
        <div class="bookmark-item-left">
          <div class="bookmark-item-meta">
            <span class="bookmark-subject-badge">${q.subject}</span>
            ${q.isPYQ ? `<span style="font-size: 0.75rem; color: var(--text-dark);">PYQ ${q.year}</span>` : ''}
          </div>
          <p class="bookmark-item-text">${q.question}</p>
        </div>
        <div class="bookmark-actions">
          <button class="btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="app.practiceSpecificQuestion(${q.id})">
            <i data-lucide="play" style="width: 14px; height: 14px;"></i>
            <span>Practice</span>
          </button>
          <button class="btn-secondary" style="padding: 0.5rem 0.5rem; color: var(--danger);" onclick="app.removeBookmark(${q.id})">
            <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
          </button>
        </div>
      `;
      container.appendChild(item);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  practiceSpecificQuestion(qId) {
    const q = QUESTIONS.find(qu => qu.id === qId);
    if (!q) return;

    this.practiceSubject = q.subject;
    this.practiceQuestions = [q];
    this.practiceIndex = 0;
    this.explanationOpen = false;
    this.practiceAnswered = false;

    this.switchTab('practice');
    document.getElementById('practice-subtitle').textContent = `Reviewing Saved Bookmark`;
    document.getElementById('practice-select-prompt').style.display = 'none';
    document.getElementById('active-practice-panel').style.display = 'block';

    this.renderPracticeQuestion();
  }

  removeBookmark(qId) {
    const bkIdx = this.userData.bookmarks.indexOf(qId);
    if (bkIdx > -1) {
      this.userData.bookmarks.splice(bkIdx, 1);
      this.saveUserData();
      this.renderBookmarks();
    }
  }

  // ================= ANALYTICS GRAPHS =================

  renderAnalytics() {
    const total = this.userData.history.length;
    const correct = this.userData.history.filter(h => h.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    // Render global accuracy dial (SVG)
    document.getElementById('analytics-accuracy-val').textContent = `${accuracy}%`;
    document.getElementById('analytics-ratio-text').textContent = `${correct} of ${total} practice responses correct`;

    const circleFill = document.getElementById('analytics-accuracy-fill');
    if (circleFill) {
      // Circumference = 2 * PI * 90 = 565.48
      const circumference = 565.48;
      const offset = circumference - (circumference * (accuracy / 100));
      circleFill.style.strokeDashoffset = offset;
    }

    // Group stats by subject
    const subjectStats = {};
    QUESTIONS.forEach(q => {
      if (!subjectStats[q.subject]) {
        subjectStats[q.subject] = { correct: 0, total: 0 };
      }
    });

    this.userData.history.forEach(h => {
      if (subjectStats[h.subject]) {
        subjectStats[h.subject].total++;
        if (h.isCorrect) subjectStats[h.subject].correct++;
      }
    });

    // Render bar list
    const barsContainer = document.getElementById('analytics-subject-bars');
    if (!barsContainer) return;
    barsContainer.innerHTML = '';

    const sortedSubjects = Object.keys(subjectStats).sort();
    
    let hasStats = false;

    sortedSubjects.forEach(sub => {
      const stats = subjectStats[sub];
      if (stats.total === 0) return; // Only display subjects they have attempted
      hasStats = true;

      const subAccuracy = Math.round((stats.correct / stats.total) * 100);
      const row = document.createElement('div');
      row.className = 'subject-bar-row';
      
      row.innerHTML = `
        <div class="subject-bar-header">
          <span class="subject-bar-name">${sub} (${stats.total} attempted)</span>
          <span class="subject-bar-val">${subAccuracy}%</span>
        </div>
        <div class="subject-bar-outer">
          <div class="subject-bar-inner" style="width: ${subAccuracy}%"></div>
        </div>
      `;
      barsContainer.appendChild(row);
    });

    if (!hasStats) {
      barsContainer.innerHTML = `
        <div class="no-data-placeholder" style="padding: 2rem;">
          <i data-lucide="bar-chart-2"></i>
          <p>No subject details available. Complete quizzes to see subject-specific accuracy charts.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  }
}

// Instantiate and expose globally
const app = new PulsePrepApp();
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
