document.addEventListener('DOMContentLoaded', () => {
    loadPujaDetails();
});


async function loadPujaDetails() {

    const container = document.getElementById('puja-details');

    if (!container) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const pujaId = params.get('id');

    if (!pujaId) {

        container.innerHTML = `
            <p class="error-message">
                No Puja was specified.
            </p>
        `;

        return;
    }


    try {

        const response = await fetch(
            `/api/pujas/details.php?id=${encodeURIComponent(pujaId)}`
        );

        if (!response.ok) {
            throw new Error('Failed to load Puja details.');
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(
                result.message || 'Unable to load Puja details.'
            );
        }

        displayPujaDetails(result.data);

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <p class="error-message">
                Unable to load Puja information.
            </p>
        `;
    }
}


function displayPujaDetails(data) {

    const container = document.getElementById('puja-details');

    const puja = data.puja;
    const dates = data.dates;
    const rituals = data.rituals;
    const mappings = data.ritual_date_mappings;
    const sources = data.sources;


    container.innerHTML = `

        <section class="puja-hero">

            <p class="puja-bengali-name">
                ${escapeHtml(puja.bengali_name)}
            </p>

            <h1>
                ${escapeHtml(puja.name)}
            </h1>

            <p>
                ${escapeHtml(puja.short_description)}
            </p>

            <p>
                <strong>Deity:</strong>
                ${escapeHtml(puja.deity)}
            </p>

        </section>


        <section class="puja-section">

            <h2>About the Puja</h2>

            <p>
                ${escapeHtml(puja.description)}
            </p>

        </section>


        <section class="puja-section">

            <h2>2026 Puja Dates</h2>

            <div class="date-list">

                ${dates.map(date => `

                    <article class="puja-date-card">

                        <h3>
                            ${escapeHtml(date.observance)}
                        </h3>

                        <p>
                            <strong>
                                ${escapeHtml(date.tithi)}
                            </strong>
                        </p>

                        <p>
                            ${formatDate(date.gregorian_date)}
                        </p>

                        <p>
                            ${escapeHtml(date.bengali_date)}
                            ${escapeHtml(date.bengali_month)}
                            ${escapeHtml(date.bengali_year)}
                        </p>

                        <p>
                            ${escapeHtml(date.location)}
                        </p>

                    </article>

                `).join('')}

            </div>

        </section>


        <section class="puja-section">

            <h2>Rituals</h2>

            <div class="ritual-list">

                ${rituals.map(ritual => {

                    const linkedDates = mappings
                        .filter(mapping =>
                            Number(mapping.ritual_id) === Number(ritual.id)
                        )
                        .map(mapping =>
                            dates.find(date =>
                                Number(date.id) === Number(mapping.puja_date_id)
                            )
                        )
                        .filter(Boolean);

                    let dateText = '';

                    if (linkedDates.length > 0) {

                        dateText = linkedDates
                            .map(date =>
                                `${escapeHtml(date.tithi)}`
                            )
                            .join(' → ');

                    } else if (ritual.puja_date_id) {

                        const date = dates.find(
                            item =>
                                Number(item.id) ===
                                Number(ritual.puja_date_id)
                        );

                        if (date) {
                            dateText = escapeHtml(date.tithi);
                        }
                    }

                    return `

                        <article class="ritual-card">

                            <p class="ritual-bengali-name">
                                ${escapeHtml(ritual.bengali_name)}
                            </p>

                            <h3>
                                ${escapeHtml(ritual.name)}
                            </h3>

                            <p>
                                ${escapeHtml(ritual.description)}
                            </p>

                            ${
                                dateText
                                ? `
                                    <p>
                                        <strong>Associated tithi:</strong>
                                        ${dateText}
                                    </p>
                                  `
                                : ''
                            }

                        </article>

                    `;

                }).join('')}

            </div>

        </section>


        <section class="puja-section">

            <h2>Sources</h2>

            <div class="source-list">

                ${sources.map(source => `

                    <article class="source-card">

                        <h3>
                            ${escapeHtml(source.title)}
                        </h3>

                        <p>
                            <strong>Type:</strong>
                            ${escapeHtml(source.source_type)}
                        </p>

                        ${
                            source.author
                            ? `
                                <p>
                                    <strong>Author:</strong>
                                    ${escapeHtml(source.author)}
                                </p>
                              `
                            : ''
                        }

                        ${
                            source.url
                            ? `
                                <p>
                                    <a
                                        href="${escapeAttribute(source.url)}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View source
                                    </a>
                                </p>
                              `
                            : ''
                        }

                    </article>

                `).join('')}

            </div>

        </section>

    `;
}


function formatDate(dateString) {

    if (!dateString) {
        return '';
    }

    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}


function escapeHtml(value) {

    const div = document.createElement('div');

    div.textContent = value ?? '';

    return div.innerHTML;
}


function escapeAttribute(value) {

    return escapeHtml(value);
}