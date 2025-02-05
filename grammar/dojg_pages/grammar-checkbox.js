// grammar-checkbox.js
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
                localStorage.setItem(checkboxId, e.target.checked);
            });
        }
    } catch (error) {
        console.error('Error initializing grammar checkbox:', error);
    }
})();