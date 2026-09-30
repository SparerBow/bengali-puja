document.addEventListener('DOMContentLoaded', () => {
    loadPujas();
});

async function loadPujas() {
    const container = document.getElementById('puja-list');

    if (!container) {
        return;
    }

    try {
        const response = await fetch('/api/pujas/list.php');

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Unable to load Puja data.');
        }

        displayPujas(result.data);

    } catch (error) {
        console.error('Puja loading error:', error);

        container.innerHTML = `
            <p class="error-message">
                Unable to load Puja information.
            </p>
        `;
    }
}

function displayPujas(pujas) {
    const container = document.getElementById('puja-list');

    container.innerHTML = '';

    pujas.forEach(puja => {

        const card = document.createElement('article');

        card.className = 'puja-card';

        card.innerHTML = `
            <h2>${escapeHtml(puja.bengali_name)}</h2>

            <h3>${escapeHtml(puja.name)}</h3>

            <p>${escapeHtml(puja.short_description)}</p>

            <p>
                <strong>Deity:</strong>
                ${escapeHtml(puja.deity)}
            </p>

            <p>
                <strong>Duration:</strong>
                ${puja.duration_days} day(s)
            </p>
        `;

        container.appendChild(card);
    });
}

function escapeHtml(value) {
    const div = document.createElement('div');

    div.textContent = value ?? '';

    return div.innerHTML;
}