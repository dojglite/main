// DOM Elements (Cached for performance)
const progressBar = document.getElementById('progressBar');
const completedCount = document.getElementById('completed');
const totalCount = document.getElementById('total');
const progressCounter = document.getElementById('progress-counter');
const searchModal = document.getElementById('searchModal');
const searchInput = document.getElementById('searchInput');
const searchInputContainer = document.getElementById('searchInputContainer');
const searchResults = document.getElementById('searchResults');
const confirmationModal = document.getElementById('confirmationModal');
const confirmYesBtn = confirmationModal.querySelector('.confirm-yes');
const confirmNoBtn = confirmationModal.querySelector('.confirm-no');
const helpModal = document.getElementById('helpModal');
const helpCloseBtn = helpModal.querySelector('.help-close-btn');
let selectedResultIndex = -1;
let isArrowKeyHeld = false;
let arrowKeyHoldTimeout;
let isMouseMoving = false;
let mouseTimeout;
let romajiToJapaneseMap = {};
const CONFIG = {
    ANIMATION: {
        DURATION: 900,
        HIGHLIGHT_TIMEOUT: 7000,
        CIRCLE_CIRCUMFERENCE: 62.83
    },
    SEARCH: {
        DEBOUNCE_MS: 100
    }
};

// Utility functions for handling modal open/close
function lockBodyScroll() {
    document.body.classList.add('modal-open');
}

function unlockBodyScroll() {
    document.body.classList.remove('modal-open');
}

fetch('./romaji-to-japanese-map.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load romaji map');
        }
        return response.json();
    })
    .then(data => {
        romajiToJapaneseMap = data.romajiToJapaneseMap;
        console.log(`Loaded ${data.metadata.totalEntries} romaji entries`);
    })
    .catch(error => {
        console.error('Error loading romaji map:', error);
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.placeholder = 'Error loading romaji data...';
            searchInput.disabled = true;
        }
    });

// --- Progress Bar and Counter Functions ---
function animateProgressBar(progress) {
    progressBar.style.width = `${progress}%`;
    progressBar.classList.toggle('complete', progress === 100);
    if (progress === 100) {
        progressBar.style.transform = 'scaleY(1.15)';
        setTimeout(() => progressBar.style.transform = 'scaleY(1)', CONFIG.ANIMATION.DURATION);
    }
}

function updateProgressText(checkedCount, total) {
    completedCount.textContent = checkedCount;
    totalCount.textContent = total;
}

function calculateProgress() {
    // Instead of querying all checkboxes again, collect from column caches
    const allCheckboxes = Array.from(document.querySelectorAll('.column'))
        .flatMap(column => column.checkboxCache);
    let checkedCount = 0;
    const total = allCheckboxes.length;

    for (let i = 0; i < total; i++) {
        if (allCheckboxes[i].checked) {
            checkedCount++;
        }
    }

    const progress = (total === 0) ? 0 : (checkedCount / total) * 100; // Prevent division by zero if no checkboxes
    return { checkedCount, total, progress };
}

function updateProgressBar() {
    const { checkedCount, total, progress } = calculateProgress();
    animateProgressBar(progress);
    updateProgressText(checkedCount, total);

    const percentage = document.getElementById('progressPercentage');
    if (percentage) { 
        percentage.textContent = `${checkedCount === total ? 100 : Math.floor(progress)}%`;
    }

    
}
// --- Smooth Scroll Function ---
function smoothScrollToAnchor(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
}

// --- Checkbox State Management Functions ---
function saveCheckboxState(checkbox) {
    localStorage.setItem(checkbox.id, checkbox.checked);
}

function loadCheckboxState(checkbox) {
    checkbox.checked = localStorage.getItem(checkbox.id) === 'true';
}

function updateCheckAllButtonState(column) {
    if (!column) return;
    const checkboxesInColumn = column.checkboxCache; // Use the cached checkboxes
    const checkAllBtn = column.querySelector('.check-all-btn');
    const progressCircle = checkAllBtn.querySelector('.progress-circle');
    const allCheckedInColumn = checkboxesInColumn.every(cb => cb.checked); // Use the cached array

    if (allCheckedInColumn) {
        checkAllBtn.classList.add('checked');
        checkAllBtn.classList.remove('unchecked');
    } else {
        checkAllBtn.classList.remove('checked');
        checkAllBtn.classList.add('unchecked');
        progressCircle.style.strokeDashoffset = CONFIG.ANIMATION.CIRCLE_CIRCUMFERENCE;
    }
}

function handleCheckboxChange(checkbox) {
    saveCheckboxState(checkbox);
    updateProgressBar();
    const column = checkbox.closest('.column');
    updateCheckAllButtonState(column);
}

// --- Check All Button Functions ---
function startCheckingAnimation(checkAllBtn) {
    const column = checkAllBtn.closest('.column');
    checkAllBtn.classList.add('checking');
    checkAllBtn.classList.remove('checked', 'unchecked', 'pop', 'reverse-pop');
    const progressCircle = checkAllBtn.querySelector('.progress-circle');
    progressCircle.style.transition = 'none';
    progressCircle.style.strokeDashoffset = CONFIG.ANIMATION.CIRCLE_CIRCUMFERENCE;
    void progressCircle.offsetWidth;
    progressCircle.style.transition = 'stroke-dashoffset 0.04s linear';

    checkAllBtn.animationStartTime = performance.now();
    checkAllBtn.progressPerMs = 1 / CONFIG.ANIMATION.DURATION; // Calculate progress per millisecond
    animateCheckAllProgress(checkAllBtn);
}

function animateCheckAllProgress(checkAllBtn) {
    if (!checkAllBtn.classList.contains('checking')) return;

    const elapsedTime = performance.now() - checkAllBtn.animationStartTime;
    let progress = elapsedTime * checkAllBtn.progressPerMs; // Calculate progress based on elapsed time and progressPerMs

    if (progress > 1) {
        progress = 1;
    }

    const progressCircle = checkAllBtn.querySelector('.progress-circle');
    const initialOffset = CONFIG.ANIMATION.CIRCLE_CIRCUMFERENCE;
    const newOffset = initialOffset * (1 - progress);
    progressCircle.style.strokeDashoffset = newOffset;

    if (progress < 1) {
        requestAnimationFrame(() => animateCheckAllProgress(checkAllBtn));
    } else {
        completeCheckingAnimation(checkAllBtn);
    }
}

function updateCheckboxesAndState(column, shouldCheck) {
    const checkboxes = column.checkboxCache; // Use cached checkboxes
    const updates = [];
    checkboxes.forEach(checkbox => {
        if (checkbox.checked !== shouldCheck) { // Only update if state needs to change
            checkbox.checked = shouldCheck;
            updates.push({ checkboxId: checkbox.id, checked: shouldCheck });
        }
    });

    requestAnimationFrame(() => {
        updates.forEach(update => {
            saveCheckboxState({ id: update.checkboxId, checked: update.checked });
        });
        updateProgressBar();
        updateCheckAllButtonState(column);
    });
    localStorage.setItem(`checkAllState-${column.id}`, shouldCheck ? 'checked' : 'unchecked');
}

function completeCheckingAnimation(checkAllBtn) {
    checkAllBtn.classList.remove('checking');
    checkAllBtn.classList.add('checked', 'pop');
    const column = checkAllBtn.closest('.column');
    updateCheckboxesAndState(column, true); // Call common function to CHECK checkboxes
    // localStorage.setItem(`checkAllState-${column.id}`, 'checked'); // Now handled in updateCheckboxesAndState
}

function cancelCheckingAnimation(checkAllBtn) {
    checkAllBtn.classList.remove('checking');
    const progressCircle = checkAllBtn.querySelector('.progress-circle');
    progressCircle.style.transition = 'none';
    progressCircle.style.strokeDashoffset = CONFIG.ANIMATION.CIRCLE_CIRCUMFERENCE;
    void progressCircle.offsetWidth;
    progressCircle.style.transition = '';

    // Don't update checkbox states if it was a hold attempt
    if (!checkAllBtn.isHolding) {
        const column = checkAllBtn.closest('.column');
        updateCheckboxesAndState(column, false);
    }
}

// --- Scroll Progress Indicator Function ---
function updateScrollProgressIndicator() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (window.scrollY / scrollHeight) * 100;
    document.body.style.setProperty('--scroll-width', `${scrollPercent}%`);
}


// --- Page Transition Function ---
function navigateWithTransition(event) {
    event.preventDefault();
    const targetUrl = event.currentTarget.href;
    
    // Create transition elements
    const transitionContainer = document.createElement('div');
    transitionContainer.className = 'transition-container';
    document.body.appendChild(transitionContainer);

    // Add overlay
    const overlay = document.createElement('div');
    overlay.className = 'transition-overlay';
    document.body.appendChild(overlay);

    // Add exit animations to columns
    const columns = document.querySelectorAll('.column');
    let animationsCompleted = 0;
    const totalAnimations = columns.length;

    // Function to check if all animations are done
    const checkAnimationsComplete = () => {
        animationsCompleted++;
        if (animationsCompleted >= totalAnimations) {
            // All animations complete, now fade in overlay and navigate
            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
                
                // Wait for overlay fade to complete before navigation
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 30); 
            });
        }
    };

    // Add animation end listeners to each column
    columns.forEach((column, index) => {
        const animationClass = index === 0 ? 'exit-left' :
                             index === 1 ? 'exit-middle' : 'exit-right';
        
        // Clone the column to prevent animation interruption
        const clonedColumn = column.cloneNode(true);
        column.parentNode.replaceChild(clonedColumn, column);
        
        clonedColumn.classList.add(animationClass);
        
        // Listen for both animation end events
        const handleAnimationEnd = (e) => {
            if (e.animationName === 'columnExit' || e.animationName === 'columnFade') {
                checkAnimationsComplete();
                clonedColumn.removeEventListener('animationend', handleAnimationEnd);
            }
        };
        
        clonedColumn.addEventListener('animationend', handleAnimationEnd);
    });

    // Backup timeout in case animations fail
    setTimeout(() => {
        if (animationsCompleted < totalAnimations) {
            window.location.href = targetUrl;
        }
    }, 1000); // Fallback timeout
}

// --- Shift+Click Range Selection Function ---
function handleShiftClickSelection(event, checkbox, lastChecked) {
    if (!event.shiftKey || !lastChecked || checkbox === lastChecked) return;

    const labels = Array.from(document.querySelectorAll('.cell label'));
    const startLabel = checkbox.closest('.cell').querySelector('label');
    const endLabel = lastChecked.closest('.cell').querySelector('label');

    let startIndex = labels.indexOf(startLabel);
    let endIndex = labels.indexOf(endLabel);
    if (startIndex > endIndex) [startIndex, endIndex] = [endIndex, startIndex];

    const labelsToToggle = labels.slice(startIndex, endIndex + 1);
    labelsToToggle.forEach(label => {
        const cb = label.querySelector('input[type="checkbox"]');
        cb.checked = lastChecked.checked;
        saveCheckboxState(cb);
    });
    updateProgressBar();


    const affectedColumns = new Set(); // Use a Set to store unique columns
    labelsToToggle.forEach(label => {
        const column = label.closest('.column');
        if (column) {
            affectedColumns.add(column);
        }
    });

    affectedColumns.forEach(column => {
        updateCheckAllButtonState(column); // Update check-all for each affected column
    });
}


// --- Search Functions ---

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Create debounced version of search
const debouncedSearch = debounce(() => {
    performSearch();
}, CONFIG.SEARCH.DEBOUNCE_MS);


function toHalfWidth(str) {
    return str.replace(/[Ａ-Ｚａ-ｚ]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
}

function splitTerm(term) {
    let japanesePart = '';
    let romajiPart = '';
    let inRomaji = false;
    for (const c of term) {
        if (/[ぁ-んァ-ン一-龯]/.test(c)) { japanesePart += c; inRomaji = false; }
        else if (/[a-z]/.test(c)) { romajiPart += c; inRomaji = true; }
        else { if (inRomaji) romajiPart += c; else japanesePart += c; }
    }
    return { japanesePart, romajiPart };
}

function performRomajiSearch(searchTerm) {
    const { japanesePart, romajiPart } = splitTerm(searchTerm);
    if (!romajiPart) return [];

    let romajiSearchResults = [];
    for (const romajiKey in romajiToJapaneseMap) {
        if (romajiKey.includes(romajiPart)) {
            romajiSearchResults.push(romajiToJapaneseMap[romajiKey]);
        }
    }

    const results = [];
    if (romajiSearchResults.length > 0) {
        const allLinks = document.querySelectorAll('.cell a');
        romajiSearchResults.forEach(jpTitle => {
            if (jpTitle.toLowerCase().includes(japanesePart.toLowerCase())) {
                allLinks.forEach(link => {
                    if (link.textContent.toLowerCase().includes(jpTitle.toLowerCase())) {
                        results.push(link);
                    }
                });
            }
        });
    }
    return results;
}

function performJapaneseSearch(searchTerm) {
    const results = [];
    const allLinks = document.querySelectorAll('.cell a');
    allLinks.forEach(link => {
        const linkText = link.textContent.toLowerCase();
        let matched = true;
        let lastIndex = 0;
        for (const char of searchTerm.split('')) {
            const index = linkText.indexOf(char, lastIndex);
            if (index === -1) { matched = false; break; }
            lastIndex = index + 1;
        }
        if (matched) results.push(link);
    });
    return results;
}


function performSearch() {
    const searchTerm = toHalfWidth(searchInput.value.trim().toLowerCase());
    searchResults.innerHTML = '';
    selectedResultIndex = -1;

    const romajiResults = performRomajiSearch(searchTerm);
    const japaneseResults = performJapaneseSearch(searchTerm);
    const combinedResults = [...new Set([...romajiResults, ...japaneseResults])]; // Deduplicate

    if (combinedResults.length > 0) {
        combinedResults.forEach(addSearchResultItem);
    } else {
        const noResults = document.createElement('p');
        noResults.textContent = 'No results found.';
        noResults.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
        searchResults.appendChild(noResults);
    }
    searchModal.classList.add('active');
}

function addSearchResultItem(link, index) {
    const resultContainer = document.createElement('div');
    resultContainer.className = 'search-result-item';
    resultContainer.dataset.index = index;
    const resultLink = document.createElement('a');
    resultLink.href = link.href;
    resultLink.textContent = link.textContent;
    resultContainer.appendChild(resultLink);
    searchResults.appendChild(resultContainer);

    // Existing left-click behavior
    resultLink.addEventListener('click', function(e) {
        e.preventDefault();
        highlightAndScrollToCell(link);
        closeSearchModal();
    });

    // Add right-click behavior - mimic left-click
    resultLink.addEventListener('contextmenu', function(e) {
        e.preventDefault(); // Prevent default context menu on the link
        highlightAndScrollToCell(link);
        closeSearchModal();
    });

    resultContainer.addEventListener('mouseenter', () => {
        if (isMouseMoving) {  // Only update selection if mouse is actually moving
            selectedResultIndex = index;
            updateResultSelection();
        }
    });
}


function updateResultSelection(isHeld = false) { // Set default value for isHeld to false
    const items = searchResults.querySelectorAll('.search-result-item');
    items.forEach((item, index) => {
        item.classList.toggle('selected', index === selectedResultIndex);
    });

    const selectedItem = items[selectedResultIndex];
    if (selectedItem) {
        // Get the container's scroll position info
        const container = searchResults;
        const containerRect = container.getBoundingClientRect();
        const selectedRect = selectedItem.getBoundingClientRect();

        // Check if selected item is outside visible area
        const isAbove = selectedRect.top < containerRect.top;
        const isBelow = selectedRect.bottom > containerRect.bottom;

        if (isAbove || isBelow) {
            selectedItem.scrollIntoView({
                behavior: isHeld ? 'auto' : 'smooth', // Use isHeld to determine behavior
                block: isAbove ? 'start' : 'end'
            });
        }
    }
}

function highlightAndScrollToCell(link) {
    const targetCell = link.closest('.cell');
    if (!targetCell) return;

    const previouslyHighlighted = document.querySelector('.cell.highlighted');
    if (previouslyHighlighted) {
        previouslyHighlighted.classList.remove('highlighted');
        clearTimeout(previouslyHighlighted.highlightTimeout);
    }
    targetCell.classList.add('highlighted');
    targetCell.highlightTimeout = setTimeout(() => targetCell.classList.remove('highlighted'), CONFIG.ANIMATION.HIGHLIGHT_TIMEOUT);

    const headerOffset = document.querySelector('.progress-container').offsetHeight + 20;
    const targetRect = targetCell.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const targetPosition = targetRect.top + window.scrollY - (windowHeight / 2) + (targetRect.height / 2) - headerOffset + 100;

    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
}


// --- Modal Functions ---
function openSearchModal(initialValue = '') {
    
    searchModal.classList.add('active');
    
    if (initialValue) {
        searchInput.value = initialValue;
        searchInput.dispatchEvent(new Event('input'));
    }
    
    searchInput.focus();
    searchModal.setAttribute('aria-hidden', 'false');
    document.getElementById('main-content').setAttribute('aria-hidden', 'true');
    searchModal.addEventListener('keydown', trapTabKey);
}

  function trapTabKey(e) {
    if (e.key === 'Tab') {
      const focusable = searchModal.querySelectorAll('button, [href], input, .search-result-item a');
      if (focusable.length === 0) return;
      
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      
      if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      } else if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    }
  }

function closeSearchModal() {
    searchModal.classList.remove('active');
    setTimeout(() => searchResults.innerHTML = '', 400);
    searchInput.value = '';
}


// --- Bookmark Functions ---
function initializeBookmarks() {
    const hrefToCheckboxIdMap = new Map();
    document.querySelectorAll('.cell a').forEach(link => {
        const href = link.href;
        const label = link.closest('label');
        if (label) {
            const checkboxId = label.getAttribute('for');
            if (checkboxId) {
                hrefToCheckboxIdMap.set(href, checkboxId);
            }
        }
    });
    localStorage.setItem('hrefToCheckboxIdMap', JSON.stringify([...hrefToCheckboxIdMap]));

    // Apply bookmarks from localStorage
    document.querySelectorAll('.cell label').forEach(label => {
        const checkbox = label.querySelector('input[type="checkbox"]');
        if (checkbox) {
            const isBookmarked = localStorage.getItem(`bookmark-${checkbox.id}`) === 'true';
            if (isBookmarked) {
                label.setAttribute('data-bookmarked', '');
            } else {
                label.removeAttribute('data-bookmarked');
            }
        }
        label.addEventListener('contextmenu', handleBookmarkContextMenu);
    });
}

function handleBookmarkContextMenu(e) {
    e.preventDefault();
    const label = e.currentTarget;
    const checkbox = label.closest('.cell').querySelector('input[type="checkbox"]');
    const wasBookmarked = label.hasAttribute('data-bookmarked');
    label.toggleAttribute('data-bookmarked');
    if (checkbox) {
        localStorage.setItem(`bookmark-${checkbox.id}`, !wasBookmarked); // Force override
    }
}

document.querySelectorAll('.column').forEach(column => {
    const checkboxesInColumn = column.querySelectorAll('input[type="checkbox"]');
    column.checkboxCache = Array.from(checkboxesInColumn); // Store as an array on the column element
    updateCheckAllButtonState(column); // Initial update
});

// Function to show the confirmation modal
function showConfirmationModal(onConfirm, onCancel) {
    confirmationModal.classList.add('active');
    lockBodyScroll();
    
    // Handle button clicks
    const handleYes = () => {
        onConfirm();
        hideConfirmationModal();
        cleanup();
    };
    
    const handleNo = () => {
        onCancel();
        hideConfirmationModal();
        cleanup();
    };
    
    const handleOutsideClick = (e) => {
        if (e.target === confirmationModal) {
            handleNo();
        }
    };
    
    // Attach event listeners
    confirmYesBtn.addEventListener('click', handleYes);
    confirmNoBtn.addEventListener('click', handleNo);
    confirmationModal.addEventListener('click', handleOutsideClick);
    
    // Cleanup function to remove event listeners
    const cleanup = () => {
        confirmYesBtn.removeEventListener('click', handleYes);
        confirmNoBtn.removeEventListener('click', handleNo);
        confirmationModal.removeEventListener('click', handleOutsideClick);
    };
}

// Function to hide the confirmation modal
function hideConfirmationModal() {
    confirmationModal.classList.remove('active');
    unlockBodyScroll();
}

// Modify the existing handleCheckAllButtonClick function
function handleCheckAllButtonClick(checkAllBtn) {
    const column = checkAllBtn.closest('.column');
    const checkboxes = column.checkboxCache;
    const allChecked = checkboxes.every(cb => cb.checked);
    const anyChecked = checkboxes.some(cb => cb.checked);

    // Only handle click behavior if it's not a hold
    if (!checkAllBtn.isHolding) {
        if (allChecked) {
            showConfirmationModal(
                () => {
                    // Only make changes after user confirms
                    checkAllBtn.classList.remove('checked', 'pop');
                    checkAllBtn.classList.add('unchecked', 'reverse-pop');
                    updateCheckboxesAndState(column, false);
                },
                () => {
                    // Do nothing, keep checkmarks
                }
            );
        } else if (anyChecked) {
            showConfirmationModal(
                () => {
                    // Only make changes after user confirms
                    updateCheckboxesAndState(column, false);
                },
                () => {
                    // Do nothing, keep checkmarks
                }
            );
        } else {
            startCheckingAnimation(checkAllBtn);
        }
    } else {
        // For hold behavior, just animate
        startCheckingAnimation(checkAllBtn);
    }
}

function showHelpModal() {
    helpModal.classList.add('active');
    helpModal.focus();
    lockBodyScroll();
}

// Function to hide help modal
function hideHelpModal() {
    helpModal.classList.remove('active');
    unlockBodyScroll();
}

// --- Settings Functions ---
function initSettingsSystem() {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const settingsCloseBtn = settingsModal.querySelector('.settings-close-btn');
    const exportDataBtn = document.getElementById('exportDataBtn');
    const importDataInput = document.getElementById('importDataInput');

    // Show/hide settings modal
    function showSettingsModal() {
        settingsModal.classList.add('active');
        lockBodyScroll();
    }

    function hideSettingsModal() {
        settingsModal.classList.remove('active');
        unlockBodyScroll();
    }

    // Export progress data
    function exportProgressData() {
        try {
            // Collect all localStorage data related to our app
            const exportData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                data: {}
            };
            
            // Get checkbox states
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                // Only export our app's data (avoid exporting other site data)
                if (key === 'hrefToCheckboxIdMap' || 
                    key.startsWith('grammar') || 
                    key.startsWith('bookmark-') ||
                    key === STUDY_SESSION_KEY) {
                    exportData.data[key] = localStorage.getItem(key);
                }
            }
            
            // Create and download the JSON file
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = 'dojg-progress-' + new Date().toISOString().split('T')[0] + '.json';
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export data: ' + error.message);
        }
    }

    // Import and merge progress data
    function importProgressData(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importData = JSON.parse(e.target.result);
                
                // Validate the data structure
                if (!importData.version || !importData.data) {
                    throw new Error('Invalid data format');
                }
                
                // Confirmation before merging
                if (confirm('Your current progress will be merged with the imported data. Continue?')) {
                    // Track statistics for user feedback
                    let stats = {
                        totalItems: 0,
                        newlyCompleted: 0,
                        newlyBookmarked: 0,
                        unchanged: 0
                    };
                    
                    // Merge the data into localStorage
                    const data = importData.data;
                    
                    // First, handle the mapping data (special case)
                    if (data['hrefToCheckboxIdMap']) {
                        try {
                            const importedMap = new Map(JSON.parse(data['hrefToCheckboxIdMap']));
                            const existingMap = new Map(JSON.parse(localStorage.getItem('hrefToCheckboxIdMap') || '[]'));
                            
                            // Merge maps, preferring existing entries in case of conflict
                            const mergedMap = new Map([...importedMap, ...existingMap]);
                            localStorage.setItem('hrefToCheckboxIdMap', JSON.stringify([...mergedMap]));
                        } catch (err) {
                            console.error('Error merging URL mapping:', err);
                        }
                    }
                    
                    // Then process all other items
                    for (const key in data) {
                        if (key === 'hrefToCheckboxIdMap') continue; // Already handled
                        
                        stats.totalItems++;
                        
                        // Handle grammar checkboxes (completed state)
                        if (key.match(/^grammar\d+$/)) {
                            const existingValue = localStorage.getItem(key);
                            const importedValue = data[key];
                            
                            // If either the existing or imported state is 'true', set to 'true'
                            // (completed state wins)
                            if (importedValue === 'true' && existingValue !== 'true') {
                                localStorage.setItem(key, 'true');
                                stats.newlyCompleted++;
                            } else if (existingValue === importedValue) {
                                stats.unchanged++;
                            }
                        }
                        // Handle bookmarks
                        else if (key.startsWith('bookmark-')) {
                            const existingValue = localStorage.getItem(key);
                            const importedValue = data[key];
                            
                            // If either the existing or imported state is 'true', set to 'true'
                            // (bookmarked state wins)
                            if (importedValue === 'true' && existingValue !== 'true') {
                                localStorage.setItem(key, 'true');
                                stats.newlyBookmarked++;
                            } else if (existingValue === importedValue) {
                                stats.unchanged++;
                            }
                        }
                        // Handle study session
                        else if (key === STUDY_SESSION_KEY) {
                            // Only import if there's no active session or user confirms
                            if (!localStorage.getItem(STUDY_SESSION_KEY) || 
                                confirm('Active study session detected. Import the session from the backup instead?')) {
                                localStorage.setItem(key, data[key]);
                            }
                        }
                        // Handle other app settings
                        else {
                            // For general settings, imported data wins if it exists
                            localStorage.setItem(key, data[key]);
                        }
                    }
                    
                    // Show success message with stats
                    alert(
                        `Data merged successfully!\n\n` +
                        `Total items processed: ${stats.totalItems}\n` +
                        `Newly completed items: ${stats.newlyCompleted}\n` +
                        `Newly bookmarked items: ${stats.newlyBookmarked}\n` +
                        `Unchanged items: ${stats.unchanged}\n\n` +
                        `The page will now refresh to apply changes.`
                    );
                    
                    // Reload the page to apply changes
                    try {
                        location.reload();
                    } catch (reloadErr) {
                        console.error('Error reloading page:', reloadErr);
                        alert('Please refresh the page manually to see the changes.');
                    }
                }
            } catch (error) {
                console.error('Error importing data:', error);
                alert('Error importing data: ' + error.message);
            }
        };
        
        reader.onerror = function(error) {
            console.error('File reading error:', error);
            alert('Failed to read the file. Please try again.');
        };
        
        reader.readAsText(file);
        
        // Reset the input
        event.target.value = '';
    }

    // Event Listeners
    settingsBtn.addEventListener('click', function() {
        // Make sure the toggle is correctly set when opening the modal
        const hideEnglishToggle = document.getElementById('hideEnglishToggle');
        if (hideEnglishToggle) {
            hideEnglishToggle.checked = localStorage.getItem('hideEnglishTranslations') === 'true';
        }
        showSettingsModal();
    });
    settingsCloseBtn.addEventListener('click', hideSettingsModal);
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) hideSettingsModal();
    });
    exportDataBtn.addEventListener('click', exportProgressData);
    importDataInput.addEventListener('change', importProgressData);

    // Handle English translations visibility
    const hideEnglishToggle = document.getElementById('hideEnglishToggle');

    // Initialize toggle state from localStorage - ensure we use string comparison
    if (hideEnglishToggle) {
        hideEnglishToggle.checked = localStorage.getItem('hideEnglishTranslations') === 'true';
        
        // Toggle event handler - ensure we store strings, not boolean objects
        hideEnglishToggle.addEventListener('change', function() {
            localStorage.setItem('hideEnglishTranslations', this.checked ? 'true' : 'false');
            
            // If we're on a grammar page, apply the change immediately
            if (window.location.href.includes('/grammar/dojg_pages/')) {
                applyEnglishTranslationSetting();
            }
        });
    }

    // Add this function to handle spoiler clicks - we need this globally
    window.revealSpoiler = function(element) {
        if (localStorage.getItem('hideEnglishTranslations') === 'true') {
            element.classList.toggle('revealed');
        }
    };

    // Close settings modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && settingsModal.classList.contains('active')) {
            hideSettingsModal();
        }
    });
}

// Function to apply English translation setting on grammar pages
function applyEnglishTranslationSetting() {
    if (window.location.href.includes('/grammar/dojg_pages/')) {
        const hideTranslations = localStorage.getItem('hideEnglishTranslations') === 'true';
        const spoilers = document.querySelectorAll('.english-spoiler');
        
        spoilers.forEach(spoiler => {
            if (hideTranslations) {
                spoiler.classList.remove('revealed');
            } else {
                spoiler.classList.add('revealed');
            }
        });
    }
}

// --- Study Session Functions ---
const STUDY_SESSION_KEY = 'dojg_study_session';

// Initialize study session functionality
function initStudySession() {
    // Add button click listener
    const studySessionBtn = document.getElementById('studySessionBtn');
    if (studySessionBtn) {
        studySessionBtn.addEventListener('click', openStudySessionModal);
    }

    // Add modal controls
    const studySessionModal = document.getElementById('studySessionModal');
    if (studySessionModal) {
        const closeBtn = studySessionModal.querySelector('.settings-close-btn');
        closeBtn.addEventListener('click', closeStudySessionModal);
        
        // Close on click outside
        studySessionModal.addEventListener('click', (e) => {
            if (e.target === studySessionModal) {
                closeStudySessionModal();
            }
        });

        // Start button
        const startBtn = document.getElementById('startStudySessionBtn');
        startBtn.addEventListener('click', startStudySession);
    }

    // Check if there's an active session
    checkActiveSession();
}

function openStudySessionModal() {
    const studySessionModal = document.getElementById('studySessionModal');
    studySessionModal.classList.add('active');
    lockBodyScroll();
}

function closeStudySessionModal() {
    const studySessionModal = document.getElementById('studySessionModal');
    studySessionModal.classList.remove('active');
    unlockBodyScroll();
}

function checkActiveSession() {
    const sessionData = localStorage.getItem(STUDY_SESSION_KEY);
    if (sessionData) {
        // There's an active session - add an indicator
        const session = JSON.parse(sessionData);
        
        const statusIndicator = document.createElement('div');
        statusIndicator.className = 'session-status';
        statusIndicator.innerHTML = `
            <span>Active Study Session: ${session.currentIndex + 1}/${session.totalItems}</span>
            <button id="resumeSessionBtn">Resume</button>
        `;
        document.body.appendChild(statusIndicator);
        
        document.getElementById('resumeSessionBtn').addEventListener('click', () => {
            window.location.href = session.items[session.currentIndex].url;
        });
    }
}

function startStudySession() {
    // Get session configuration
    const mode = document.getElementById('studyMode').value;
    const count = parseInt(document.getElementById('studyItemCount').value);
    const includeBasic = document.getElementById('studyBasic').checked;
    const includeIntermediate = document.getElementById('studyIntermediate').checked;
    const includeAdvanced = document.getElementById('studyAdvanced').checked;
    
    // Validate selection
    if (!includeBasic && !includeIntermediate && !includeAdvanced) {
        alert('Please select at least one difficulty level.');
        return;
    }
    
    if (count < 1 || count > 50) {
        alert('Please select between 1 and 50 items.');
        return;
    }
    
    // Collect grammar points based on criteria
    const grammarPoints = selectGrammarPoints(mode, count, includeBasic, includeIntermediate, includeAdvanced);
    
    if (grammarPoints.length === 0) {
        alert('No grammar points match your criteria. Please adjust your settings.');
        return;
    }
    
    // Create and store session
    const session = {
        items: grammarPoints,
        currentIndex: 0,
        totalItems: grammarPoints.length,
        mode: mode,
        startTime: Date.now(),
        completed: 0,
        newChecked: 0
    };
    
    localStorage.setItem(STUDY_SESSION_KEY, JSON.stringify(session));
    
    // Navigate to first item
    closeStudySessionModal();
    window.location.href = grammarPoints[0].url;
}

function selectGrammarPoints(mode, count, includeBasic, includeIntermediate, includeAdvanced) {
    // Get all grammar point links from the page
    const allGrammarPoints = [];
    
    if (includeBasic) {
        document.querySelectorAll('#basic .cell a').forEach(link => {
            const checkboxId = link.closest('label').querySelector('input[type="checkbox"]').id;
            allGrammarPoints.push({
                id: checkboxId,
                url: link.href,
                text: link.textContent,
                level: 'basic',
                checked: localStorage.getItem(checkboxId) === 'true',
                bookmarked: localStorage.getItem(`bookmark-${checkboxId}`) === 'true'
            });
        });
    }
    
    if (includeIntermediate) {
        document.querySelectorAll('#intermediate .cell a').forEach(link => {
            const checkboxId = link.closest('label').querySelector('input[type="checkbox"]').id;
            allGrammarPoints.push({
                id: checkboxId,
                url: link.href,
                text: link.textContent,
                level: 'intermediate',
                checked: localStorage.getItem(checkboxId) === 'true',
                bookmarked: localStorage.getItem(`bookmark-${checkboxId}`) === 'true'
            });
        });
    }
    
    if (includeAdvanced) {
        document.querySelectorAll('#advanced .cell a').forEach(link => {
            const checkboxId = link.closest('label').querySelector('input[type="checkbox"]').id;
            allGrammarPoints.push({
                id: checkboxId,
                url: link.href,
                text: link.textContent,
                level: 'advanced',
                checked: localStorage.getItem(checkboxId) === 'true',
                bookmarked: localStorage.getItem(`bookmark-${checkboxId}`) === 'true'
            });
        });
    }
    
    // Filter based on mode
    let filteredPoints = [];
    switch (mode) {
        case 'new':
            filteredPoints = allGrammarPoints.filter(point => !point.checked && !point.bookmarked);
            break;
        case 'viewed':
            filteredPoints = allGrammarPoints.filter(point => point.bookmarked && !point.checked);
            break;
        case 'checked':
            filteredPoints = allGrammarPoints.filter(point => point.checked);
            break;
        case 'random':
            filteredPoints = allGrammarPoints;
            break;
    }
    
    // Randomize and limit to count
    filteredPoints = shuffleArray(filteredPoints).slice(0, count);
    
    return filteredPoints;
}

function shuffleArray(array) {
    // Fisher-Yates shuffle
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function showSessionResults(session) {
    // Calculate session stats
    const duration = Math.floor((Date.now() - session.startTime) / 1000); // in seconds
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    
    // Create results modal
    const resultsModal = document.createElement('div');
    resultsModal.className = 'settings-modal active';
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
                    <button id="newSessionBtn" class="settings-action-btn">
                        <svg viewBox="0 0 24 24" width="18" height="18" style="margin-right: 6px;">
                            <path d="M8 5v14l11-7z" fill="currentColor"/>
                        </svg>
                        Start New Session
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(resultsModal);
    
    // Add event listeners
    const closeBtn = resultsModal.querySelector('.settings-close-btn');
    closeBtn.addEventListener('click', () => {
        resultsModal.remove();
    });
    
    const newSessionBtn = document.getElementById('newSessionBtn');
    newSessionBtn.addEventListener('click', () => {
        resultsModal.remove();
        openStudySessionModal();
    });
}

// --- Event Listeners and Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize progress counter visibility with delay
    setTimeout(() => progressCounter.classList.add('visible'), 500);

    // Call the settings initialization
    initSettingsSystem();

    // Initialize checkboxes from localStorage
    document.querySelectorAll('input[type="checkbox"]').forEach(loadCheckboxState);
    updateProgressBar();

    // Initialize Check All Buttons based on actual checkbox states
    document.querySelectorAll('.column').forEach(column => {
        updateCheckAllButtonState(column);
    });

    // Initialize Bookmarks from localStorage and attach context menu listener
    initializeBookmarks();

    initStudySession();

    // Attach smooth scroll to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(smoothScrollToAnchor);

    // Observe scroll elements for visibility
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0, rootMargin: '50px' });
    document.querySelectorAll('[data-scroll]').forEach(element => observer.observe(element));

    // Add wheel event handler for modal scrolling
    document.addEventListener('wheel', (e) => {
        // Search Modal handling
        if (searchModal.classList.contains('active')) {
            const scrollContainer = searchResults;
            const isInScrollArea = scrollContainer.contains(e.target) ||
                                  e.target === scrollContainer;
            const hasScrollSpace = scrollContainer.scrollHeight > scrollContainer.clientHeight;
            const atTop = scrollContainer.scrollTop === 0;
            const atBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight;
    
            if (isInScrollArea && hasScrollSpace) {
                if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
                    e.preventDefault();
                }
            } else if (searchModal.contains(e.target)) {
                e.preventDefault();
            }
        }
    
        // Help Modal handling
        if (helpModal.classList.contains('active')) {
        const helpContent = helpModal.querySelector('.help-content'); // Add this class to your scrollable content
        const isInHelpContent = helpContent.contains(e.target) || e.target === helpContent;
    
        if (!isInHelpContent) {
        e.preventDefault(); // Prevent background scroll only when not in content area
    } else {
        // Allow scrolling if we're at the boundaries
        const atTop = helpContent.scrollTop === 0;
        const atBottom = helpContent.scrollTop + helpContent.clientHeight >= helpContent.scrollHeight;
        
        if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
            e.preventDefault();
        }
    }
}
    }, { passive: false });

// Checkbox Event Listeners
let lastCheckedCheckbox;
document.querySelectorAll('.cell input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => handleCheckboxChange(checkbox));
    checkbox.addEventListener('click', (event) => {
        handleShiftClickSelection(event, checkbox, lastCheckedCheckbox);
        lastCheckedCheckbox = checkbox; // Update lastChecked always
    });
}); 

applyEnglishTranslationSetting();

// Check All Button Event Listeners
document.querySelectorAll('.column').forEach(column => {
    const checkAllBtn = column.querySelector('.check-all-btn');
    let mouseDownTime;
    let mouseDownOnCheckedBtn = false;
    let wasHoldCompleted = false;
    
    checkAllBtn.addEventListener('mousedown', () => {
        const checkboxes = column.checkboxCache;
        const allChecked = checkboxes.every(cb => cb.checked);
        mouseDownTime = Date.now();
        wasHoldCompleted = false;

        if (allChecked) {
            // Just record that mousedown started on a checked button
            mouseDownOnCheckedBtn = true;
            return; // Don't start any animation
        }

        // Start the animation regardless of whether it's a click or hold
        checkAllBtn.isHolding = true;
        startCheckingAnimation(checkAllBtn);
    });

    checkAllBtn.addEventListener('mouseleave', () => {
        if (mouseDownOnCheckedBtn) {
            mouseDownOnCheckedBtn = false;
            return;
        }

        if (checkAllBtn.classList.contains('checking')) {
            checkAllBtn.classList.remove('checking');
            const progressCircle = checkAllBtn.querySelector('.progress-circle');
            progressCircle.style.transition = 'none';
            progressCircle.style.strokeDashoffset = CONFIG.ANIMATION.CIRCLE_CIRCUMFERENCE;
            void progressCircle.offsetWidth;
            progressCircle.style.transition = '';
        }
        checkAllBtn.isHolding = false;
    });

    checkAllBtn.addEventListener('mouseup', (e) => {
        const timeDiff = Date.now() - mouseDownTime;
        const checkboxes = column.checkboxCache;
        const anyChecked = checkboxes.some(cb => cb.checked);

        // For checked button behavior
        if (mouseDownOnCheckedBtn) {
            // Only show confirmation modal if mouse is still over the button
            if (e.target.closest('.check-all-btn')) {
                handleCheckAllButtonClick(checkAllBtn);
            }
            mouseDownOnCheckedBtn = false;
            return;
        }

        // If hold animation completed, just finish normally without confirmation
        if (wasHoldCompleted) {
            wasHoldCompleted = false;
            return;
        }

        // For unchecked button with some checked boxes - handle as click
        if (!checkAllBtn.classList.contains('checked') && anyChecked && timeDiff < 200) {
            checkAllBtn.isHolding = false;
            handleCheckAllButtonClick(checkAllBtn);
        } 
        // For all other cases, just clean up the animation if needed
        else if (checkAllBtn.classList.contains('checking')) {
            checkAllBtn.classList.remove('checking');
            const progressCircle = checkAllBtn.querySelector('.progress-circle');
            progressCircle.style.transition = 'none';
            progressCircle.style.strokeDashoffset = CONFIG.ANIMATION.CIRCLE_CIRCUMFERENCE;
            void progressCircle.offsetWidth;
            progressCircle.style.transition = '';
        }
        checkAllBtn.isHolding = false;
    });

    // Add this to track when hold animation completes
    function completeCheckingAnimation(checkAllBtn) {
        checkAllBtn.classList.remove('checking');
        checkAllBtn.classList.add('checked', 'pop');
        wasHoldCompleted = true;
        const column = checkAllBtn.closest('.column');
        updateCheckboxesAndState(column, true);
    }
});

// Scroll Event Listener for Progress Indicator
let tickingScroll = false;
window.addEventListener('scroll', () => {
    if (!tickingScroll) {
        requestAnimationFrame(() => { updateScrollProgressIndicator(); tickingScroll = false; });
        tickingScroll = true;
    }
});

// Page Transition Event Listeners
document.querySelectorAll('a').forEach(link => link.addEventListener('click', navigateWithTransition));

// Search Event Listeners
searchInput.addEventListener('input', function() {
    selectedResultIndex = -1; // Reset selection on input change
    debouncedSearch();  // Use the debounced version
});

document.addEventListener('mousemove', () => {
    isMouseMoving = true;
    clearTimeout(mouseTimeout);
    mouseTimeout = setTimeout(() => {
        isMouseMoving = false;
    }, 10);
});

document.addEventListener('keydown', (event) => {
    // Don't process search-related keyboard events if help modal is active
    if (helpModal.classList.contains('active')) {
        return;
    }

    const results = searchResults.querySelectorAll('.search-result-item');
    const hasResults = results.length > 0;

    if (searchModal.classList.contains('active')) {
        switch(event.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                if (!isArrowKeyHeld) {
                    isArrowKeyHeld = true;
                }
                clearTimeout(arrowKeyHoldTimeout);
                
                event.preventDefault();
                if (selectedResultIndex === -1) {
                    selectedResultIndex = 0;
                } else {
                    if (event.key === 'ArrowDown') {
                        selectedResultIndex = selectedResultIndex === results.length - 1 ? 0 : selectedResultIndex + 1;
                    } else {
                        selectedResultIndex = selectedResultIndex === 0 ? results.length - 1 : selectedResultIndex - 1;
                    }
                }
                updateResultSelection(isArrowKeyHeld);
                break;

            case 'Enter':
                if (selectedResultIndex > -1 && results[selectedResultIndex]) {
                    results[selectedResultIndex].querySelector('a').click();
                }
                break;
        }
    }

    if (event.ctrlKey && event.key === 'f') { 
        event.preventDefault(); 
        openSearchModal(); 
    }
    else if (event.key.length === 1 && 
        !event.ctrlKey && 
        !event.metaKey && 
        !event.altKey && 
        !event.target.closest('input, textarea, [contenteditable]') && 
        !searchModal.classList.contains('active')) {
     
         event.preventDefault();
         openSearchModal(event.key.toLowerCase());
    }
    else if (event.key === 'Escape') {
        closeSearchModal();
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        isArrowKeyHeld = false;
        arrowKeyHoldTimeout = setTimeout(() => {
            isArrowKeyHeld = false;
        }, 150);
    }
});

document.addEventListener('click', (event) => {
    if (searchModal.classList.contains('active') && event.target === searchModal) {
        closeSearchModal();
    }
});

document.addEventListener('contextmenu', (event) => {
    if (searchModal.classList.contains('active')) {
        // Check if the right-click target is inside the searchResults container
        if (!searchResults.contains(event.target)) {
            closeSearchModal();
        }
        event.preventDefault(); // Prevent default context menu if modal is active (important!)
        return false;
    }
});

// Keydown handler to block keyboard input when help modal is open
document.addEventListener('keydown', (e) => {
    if (helpModal.classList.contains('active')) {
        // Only allow Escape and F1 when help modal is open
        if (e.key === 'Escape' || e.key === 'F1' || e.key === 'Help') {
            e.preventDefault();
            hideHelpModal();
        }
        e.preventDefault(); // Block all other keyboard input
        return;
    }

    // F1 handler
    if (e.key === 'F1' || e.key === 'Help') {
        e.preventDefault();
        showHelpModal();
    }
});

helpCloseBtn.addEventListener('click', hideHelpModal);

helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) {
        hideHelpModal();
    }
});

// Prevent context menu on modal
helpModal.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    });

searchInput.addEventListener('input', function() {
        selectedResultIndex = -1;
        debouncedSearch();
    });
});

(function handleBackNavigation() {
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            setTimeout(() => {
                location.reload();
            }, 100); // Slightly longer delay
        }
    });

    window.onunload = function() { console.log("unload event triggered"); }; // Keep unload log for now

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
})();
