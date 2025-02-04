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
        DURATION: 200,
        HIGHLIGHT_TIMEOUT: 7000,
        PROGRESS_STEP: 0.006,
        CIRCLE_CIRCUMFERENCE: 62.83
    },
    SEARCH: {
        DEBOUNCE_MS: 100
    }
};

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

// Reset overlay animations
function resetPageState() {
    // Remove transition elements
    const existingContainer = document.querySelector('.transition-container');
    const existingOverlay = document.querySelector('.transition-overlay');
    
    if (existingContainer) existingContainer.remove();
    if (existingOverlay) existingOverlay.remove();

    // Reset column states
    document.querySelectorAll('.column').forEach(column => {
        // Store original data
        const id = column.id;
        const category = column.getAttribute('data-category');
        const originalContent = column.innerHTML;
        
        // Create fresh column
        const freshColumn = document.createElement('div');
        freshColumn.className = 'column';
        freshColumn.id = id;
        if (category) freshColumn.setAttribute('data-category', category);
        freshColumn.innerHTML = originalContent;
        
        // Replace old column with fresh one
        column.parentNode.replaceChild(freshColumn, column);
        
        // Initialize checkbox cache
        const checkboxesInColumn = freshColumn.querySelectorAll('input[type="checkbox"]');
        freshColumn.checkboxCache = Array.from(checkboxesInColumn);
        
        // Reinitialize check-all button
        const checkAllBtn = freshColumn.querySelector('.check-all-btn');
        if (checkAllBtn) {
            let mouseDownTime;
            let mouseDownOnCheckedBtn = false;
            let wasHoldCompleted = false;

            // Reset initial state
            checkAllBtn.classList.remove('checking', 'checked', 'pop', 'reverse-pop');
            const progressCircle = checkAllBtn.querySelector('.progress-circle');
            if (progressCircle) {
                progressCircle.style.strokeDashoffset = CONFIG.ANIMATION.CIRCLE_CIRCUMFERENCE;
            }

            // Reattach event listeners
            checkAllBtn.addEventListener('mousedown', () => {
                const allChecked = freshColumn.checkboxCache.every(cb => cb.checked);
                mouseDownTime = Date.now();
                wasHoldCompleted = false;

                if (allChecked) {
                    mouseDownOnCheckedBtn = true;
                    return;
                }

                checkAllBtn.isHolding = true;
                startCheckingAnimation(checkAllBtn);
            });

            checkAllBtn.addEventListener('mouseleave', () => {
                if (mouseDownOnCheckedBtn) {
                    mouseDownOnCheckedBtn = false;
                    return;
                }

                if (checkAllBtn.classList.contains('checking')) {
                    cancelCheckingAnimation(checkAllBtn);
                }
                checkAllBtn.isHolding = false;
            });

            checkAllBtn.addEventListener('mouseup', (e) => {
                const timeDiff = Date.now() - mouseDownTime;
                const anyChecked = freshColumn.checkboxCache.some(cb => cb.checked);

                if (mouseDownOnCheckedBtn) {
                    if (e.target.closest('.check-all-btn')) {
                        handleCheckAllButtonClick(checkAllBtn);
                    }
                    mouseDownOnCheckedBtn = false;
                    return;
                }

                if (wasHoldCompleted) {
                    wasHoldCompleted = false;
                    return;
                }

                if (!checkAllBtn.classList.contains('checked') && anyChecked && timeDiff < 200) {
                    checkAllBtn.isHolding = false;
                    handleCheckAllButtonClick(checkAllBtn);
                }
                else if (checkAllBtn.classList.contains('checking')) {
                    cancelCheckingAnimation(checkAllBtn);
                }
                checkAllBtn.isHolding = false;
            });
        }

        // Reapply bookmarks
        freshColumn.querySelectorAll('.cell label').forEach(label => {
            if (label.closest('.cell').hasAttribute('data-scroll')) {
                label.closest('.cell').setAttribute('data-scroll', '');
            }
            
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

        updateCheckAllButtonState(freshColumn);
    });

    // Reset and reapply scroll animations
    document.querySelectorAll('[data-scroll]').forEach(element => {
        // Remove the visibility class but keep the data-scroll attribute
        element.classList.remove('is-visible');
        element.style.opacity = '';
        element.style.transform = '';
        // Force a reflow
        void element.offsetHeight;
    });

    // Re-initialize the intersection observer for scroll animations
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0, rootMargin: '50px' });

    // Re-observe all scroll elements
    document.querySelectorAll('[data-scroll]').forEach(element => {
        observer.observe(element);
    });

    const pageTransitionContainer = document.querySelector('.page-transition-container');
    if (pageTransitionContainer) {
        pageTransitionContainer.classList.remove('transitioning');
        pageTransitionContainer.style.animation = '';
        pageTransitionContainer.style.transform = '';
        pageTransitionContainer.style.opacity = '';
    }

    // Ensure container is visible and properly styled
    const container = document.querySelector('.container');
    if (container) {
        container.style.opacity = '';
        container.style.transform = '';
        container.style.visibility = 'visible';
        container.style.display = '';
        // Force grid layout refresh
        container.style.display = 'grid';
    }

    // Force a reflow of the entire page
    void document.documentElement.offsetHeight;
}


function handlePageLoad(event) {
    // Always clean up if we're coming from a navigation
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === 'back_forward') {
        resetPageState();
        
        // Double-check cleanup
        setTimeout(() => {
            document.querySelectorAll('.column').forEach(column => {
                if (column.classList.contains('exit-left') || 
                    column.classList.contains('exit-middle') || 
                    column.classList.contains('exit-right')) {
                    resetPageState();
                }
            });
        }, 50);
    }
    
    sessionStorage.removeItem('isNavigating');
}

window.onpageshow = handlePageLoad;
window.onpopstate = handlePageLoad;

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
    void progressCircle.offsetWidth; // Force reflow
    progressCircle.style.transition = 'stroke-dashoffset 0.04s linear';
    animateCheckAllProgress(checkAllBtn, 0);
}

function animateCheckAllProgress(checkAllBtn, progress) {
    if (!checkAllBtn.classList.contains('checking')) return;
    const progressCircle = checkAllBtn.querySelector('.progress-circle');
    const initialOffset = CONFIG.ANIMATION.CIRCLE_CIRCUMFERENCE;
    const newOffset = initialOffset * (1 - progress);
    progressCircle.style.strokeDashoffset = newOffset;

    if (progress < 1) {
        requestAnimationFrame(() => animateCheckAllProgress(checkAllBtn, progress + CONFIG.ANIMATION.PROGRESS_STEP)); 
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
    
    // Reset any existing transition states first
    resetPageState();
    
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
            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
                
                setTimeout(() => {
                    // Store transition state in session storage
                    sessionStorage.setItem('isNavigating', 'true');
                    window.location.href = targetUrl;
                }, 300);
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
            sessionStorage.setItem('isNavigating', 'true');
            window.location.href = targetUrl;
        }
    }, 1000);
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
    // Prevent background scroll while keeping the modal scrollable
    document.querySelector('.page-transition-container').style.overflow = 'hidden';
    document.querySelector('.container').style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
}

function hideHelpModal() {
    helpModal.classList.remove('active');
    // Restore normal scroll behavior
    document.querySelector('.page-transition-container').style.overflow = '';
    document.querySelector('.container').style.overflow = '';
    document.body.style.overflow = '';
}


// --- Event Listeners and Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize progress counter visibility with delay
    setTimeout(() => progressCounter.classList.add('visible'), 500);

    // Initialize checkboxes from localStorage
    document.querySelectorAll('input[type="checkbox"]').forEach(loadCheckboxState);
    updateProgressBar();

    // Initialize Check All Buttons based on actual checkbox states
    document.querySelectorAll('.column').forEach(column => {
        updateCheckAllButtonState(column);
    });

    // Initialize Bookmarks from localStorage and attach context menu listener
    initializeBookmarks();

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
            const helpModalBody = helpModal.querySelector('.help-modal-body');
            
            // Only prevent default if clicking outside the scrollable area
            if (!helpModalBody.contains(e.target)) {
                e.preventDefault();
            } else {
                // Allow natural scrolling within the modal body
                const atTop = helpModalBody.scrollTop === 0;
                const atBottom = helpModalBody.scrollTop + helpModalBody.clientHeight >= helpModalBody.scrollHeight;
                
                // Only prevent default at boundaries to prevent scroll bleed
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

// Main keydown handler
document.addEventListener('keydown', (event) => {
    // First check if help modal is active
    if (helpModal.classList.contains('active')) {
        // Only handle Escape and F1 for closing
        if (event.key === 'Escape' || event.key === 'F1' || event.key === 'Help') {
            event.preventDefault();
            hideHelpModal();
        }
        // Don't prevent all keyboard events - only prevent the ones that would trigger search
        if (event.key.length === 1 || event.key === 'Enter' || 
            (event.ctrlKey && event.key === 'f')) {
            event.preventDefault();
        }
        return;
    }

    // Rest of the keyboard handling for search modal
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

    // Handle search modal triggers
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
    if (helpModal.classList.contains('active') && event.target === helpModal) {
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

    if (sessionStorage.getItem('isNavigating') === 'true') {
        resetPageState();
        sessionStorage.removeItem('isNavigating');
    }
});