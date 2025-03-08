// grammar-checkbox.js
function lockBodyScroll() {
    document.body.classList.add('modal-open');
}

function unlockBodyScroll() {
    document.body.classList.remove('modal-open');
}

(() => {
    // Create and inject CSS
    const style = document.createElement('style');
    style.textContent = `
        .structure {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.grammar-checkbox {
    width: 60px;
    height: 60px;
    margin-right: 1rem;
    appearance: none;
    border: 2px solid transparent;
    border-radius: 12px;
    position: relative;
    cursor: pointer;
    background: 
        linear-gradient(rgba(18, 18, 18, 0.95), rgba(18, 18, 18, 0.95)),
        linear-gradient(45deg, rgba(164, 130, 234, 0.64), rgba(94, 59, 190, 0.54));
    background-origin: border-box;
    background-clip: padding-box, border-box;
}

.grammar-checkbox:hover {
    background: 
        linear-gradient(rgba(18, 18, 18, 0.9), rgba(18, 18, 18, 0.9)),
        linear-gradient(45deg, rgba(124, 77, 255, 0.5), rgba(124, 77, 255, 0.66));
    background-origin: border-box;
    background-clip: padding-box, border-box;
}

.grammar-checkbox:checked {
    background: var(--primary, #6B46E5);
    border-color: var(--primary, #6B46E5);
    transform: scale(1.1);
    animation: checkAnim 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 12px;
}

.grammar-checkbox:checked::after {
    content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"><path d="M5 12l5 5L20 7"/></svg>');
    transform: translate(-50%, -50%) scale(0.9);
    color: white;
    position: absolute;
    left: 50%;
    top: 56%;
    font-size: 42px;
    font-weight: 900;
    line-height: 1;
}

@keyframes checkAnim {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1.1); }
}
    `;
    document.head.appendChild(style);

    // Find the structure div
    const structureDiv = document.querySelector('.structure');
    if (!structureDiv) return;

    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'grammar-checkbox';

    // Add to page
    structureDiv.appendChild(checkbox);

    // Initialize state from localStorage
    try {
        const hrefToCheckboxIdMap = new Map(JSON.parse(localStorage.getItem('hrefToCheckboxIdMap') || '[]'));
        const currentHref = window.location.href;
        const checkboxId = hrefToCheckboxIdMap.get(currentHref);
        
        if (checkboxId) {
            checkbox.checked = localStorage.getItem(checkboxId) === 'true';
            checkbox.addEventListener('change', (e) => {
                localStorage.setItem(checkboxId, e.target.checked ? 'true' : 'false');
            });
        }
    } catch (error) {
        console.error('Error initializing grammar checkbox:', error);
    }
})();

// Function to reveal spoilers
function revealSpoiler(element) {
    // Only toggle if hiding translations is enabled
    if (localStorage.getItem('hideEnglishTranslations') === 'true') {
        element.classList.toggle('revealed');
    }
}

// Apply the spoiler setting on page load
document.addEventListener('DOMContentLoaded', function() {
    // Get the setting from localStorage
    const hideTranslations = localStorage.getItem('hideEnglishTranslations') === 'true';
    
    // Find all spoiler elements
    const spoilers = document.querySelectorAll('.english-spoiler');
    
    // Apply the setting
    spoilers.forEach(spoiler => {
        if (hideTranslations) {
            // If hiding is enabled, start with hidden text
            spoiler.classList.remove('revealed');
        } else {
            // If hiding is disabled, always show text
            spoiler.classList.add('revealed');
        }
    });
});

// Add this to grammar-checkbox.js to implement study session controls on grammar pages

// Study Session Navigation for Grammar Pages
(() => {
    const STUDY_SESSION_KEY = 'dojg_study_session';
    
    // Check if we're in a study session
    const sessionData = localStorage.getItem(STUDY_SESSION_KEY);
    if (!sessionData) return;
    
    const session = JSON.parse(sessionData);
    const currentUrl = window.location.href;
    
    // Get the checkbox to track changes
    const checkbox = document.querySelector('.grammar-checkbox');
    let wasChecked = checkbox ? checkbox.checked : false;
    
    // Find current item index
    let currentIndex = session.currentIndex;
    for (let i = 0; i < session.items.length; i++) {
        if (session.items[i].url === currentUrl) {
            currentIndex = i;
            session.currentIndex = i;
            session.completed = Math.max(session.completed, i + 1);
            localStorage.setItem(STUDY_SESSION_KEY, JSON.stringify(session));
            break;
        }
    }
    
    // Track checkbox changes to count newly checked items
    if (checkbox) {
        checkbox.addEventListener('change', () => {
            if (!wasChecked && checkbox.checked) {
                session.newChecked++;
                localStorage.setItem(STUDY_SESSION_KEY, JSON.stringify(session));
            }
            wasChecked = checkbox.checked;
        });
    }
    
    // Create navigation bar
    const navBar = document.createElement('div');
    navBar.className = 'study-session-nav';
    navBar.innerHTML = `
        <div class="session-progress">
            <span>${currentIndex + 1}/${session.totalItems}</span>
        </div>
        <div class="session-controls">
            ${currentIndex > 0 ? `<button class="session-prev">Previous</button>` : `<button class="session-prev" disabled>Previous</button>`}
            ${currentIndex < session.totalItems - 1 ? `<button class="session-next">Next</button>` : `<button class="session-finish">Finish</button>`}
        </div>
        <button class="session-exit">Exit Session</button>
    `;
    
    document.body.appendChild(navBar);
    
    // Add event listeners
    if (currentIndex > 0) {
        navBar.querySelector('.session-prev').addEventListener('click', () => {
            window.location.href = session.items[currentIndex - 1].url;
        });
    }
    
    if (currentIndex < session.totalItems - 1) {
        navBar.querySelector('.session-next').addEventListener('click', () => {
            window.location.href = session.items[currentIndex + 1].url;
        });
    } else {
        navBar.querySelector('.session-finish').addEventListener('click', () => {
            showSessionResults();
        });
    }
    
    navBar.querySelector('.session-exit').addEventListener('click', () => {
        const confirmationModal = document.createElement('div');
        confirmationModal.className = 'confirmation-modal active';
        confirmationModal.innerHTML = `
            <div class="confirmation-modal-content">
                <div class="confirmation-modal-header">
                    <div class="confirmation-icon">
                        <svg viewBox="0 0 24 24" width="32" height="32">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
                        </svg>
                    </div>
                    <h3>Exit study session?</h3>
                </div>
                <div class="confirmation-modal-body">
                    Your progress will be saved.
                </div>
                <div class="confirmation-modal-footer">
                    <button class="confirm-btn confirm-no">Cancel</button>
                    <button class="confirm-btn confirm-yes">OK</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(confirmationModal);
        
        confirmationModal.querySelector('.confirm-yes').addEventListener('click', () => {
            localStorage.removeItem(STUDY_SESSION_KEY);
            window.location.href = '../../index.html';
        });
        
        confirmationModal.querySelector('.confirm-no').addEventListener('click', () => {
            confirmationModal.remove();
        });
        
        confirmationModal.addEventListener('click', (e) => {
            if (e.target === confirmationModal) {
                confirmationModal.remove();
            }
        });
    });
    
    // Function to show results and clear session
    function showSessionResults() {
        const resultsModal = document.createElement('div');
        resultsModal.className = 'settings-modal active';
        lockBodyScroll();
        
        // Calculate session stats
        const duration = Math.floor((Date.now() - session.startTime) / 1000); // in seconds
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        
        resultsModal.innerHTML = `
            <div class="settings-modal-content">
                <div class="settings-modal-header">
                    <div class="settings-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
                        </svg>
                    </div>
                    <h3>Session Complete!</h3>
                    <button class="settings-close-btn">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
                <div class="settings-modal-body">
                    <div class="session-results">
                        <h5>Session Statistics</h5>
                        <div class="session-stat">
                            <span class="session-stat-label">Total Items:</span>
                            <span class="session-stat-value">${session.totalItems}</span>
                        </div>
                        <div class="session-stat">
                            <span class="session-stat-label">Completed:</span>
                            <span class="session-stat-value">${session.completed}</span>
                        </div>
                        <div class="session-stat">
                            <span class="session-stat-label">New Items Checked:</span>
                            <span class="session-stat-value">${session.newChecked}</span>
                        </div>
                        <div class="session-stat">
                            <span class="session-stat-label">Time Spent:</span>
                            <span class="session-stat-value">${minutes}m ${seconds}s</span>
                        </div>
                    </div>
                    <div class="settings-row" style="margin-top: 1.5rem;">
                        <button class="home-btn settings-action-btn">
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(resultsModal);
        
        // Add event listeners
        resultsModal.querySelector('.settings-close-btn').addEventListener('click', () => {
            localStorage.removeItem(STUDY_SESSION_KEY);
            resultsModal.remove();
            unlockBodyScroll();
            window.location.href = '../../index.html';
        });
        
        resultsModal.querySelector('.home-btn').addEventListener('click', () => {
            localStorage.removeItem(STUDY_SESSION_KEY);
            unlockBodyScroll();
            window.location.href = '../../index.html';
        });
    }
})();