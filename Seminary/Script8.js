// JavaScript source code
const companies = [
    { ticker: 'MTSS', name: 'МТС', cap: '463.5 млрд ₽' },
    { ticker: 'CHMF', name: 'Северсталь', cap: '571.2 млрд ₽' },
    { ticker: 'NLMK', name: 'НЛМК', cap: '454.5 млрд ₽' },
    { ticker: 'MAGN', name: 'ММК', cap: '253.1 млрд ₽' },
    { ticker: 'PHOR', name: 'ФосАгро', cap: '747.6 млрд ₽' }
];

let myChart = null;
const companiesList = document.getElementById('companies-list');

companies.forEach(company => {
    const btn = document.createElement('button');
    btn.className = 'company-btn';
    btn.dataset.ticker = company.ticker;
    btn.innerHTML = `
        <div class="company-icon">${company.ticker[0]}</div>
        <div class="company-info">
            <span class="company-name">${company.name}</span>
            <span class="company-cap">${company.ticker} • ${company.cap}</span>
        </div>
    `;

    btn.addEventListener('click', () => loadChartData(company.ticker, company.name));
    companiesList.appendChild(btn);
});
async function loadChartData(ticker, companyName) {
    document.querySelectorAll('.company-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.company-btn[data-ticker="${ticker}"]`).classList.add('active');
    document.getElementById('chart-title').textContent = `${companyName} (${ticker}) — цена за месяц`;
    const till = new Date();
    const from = new Date();
    from.setMonth(till.getMonth() - 1);

    const formatDate = (d) => d.toLocaleDateString('en-CA');
    const fromDate = formatDate(from);
    const tillDate = formatDate(till);
    const url = `https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities/${ticker}/candles.json?from=${fromDate}&till=${tillDate}&interval=24&iss.meta=off`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Ошибка сети');

        const data = await response.json();
        const block = data.candles;

        if (!block || !block.data || block.data.length === 0) {
            alert('Нет данных за указанный период. Возможно, торги не проводились.');
            return;
        }

        const closeIndex = block.columns.indexOf('close');
        const beginIndex = block.columns.indexOf('begin');

        const labels = block.data.map(row => row[beginIndex].slice(0, 10));
        const prices = block.data.map(row => row[closeIndex]);

        renderChart(labels, prices, ticker);

    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('chart-title').textContent = 'Ошибка загрузки данных';
    }
}

function renderChart(labels, prices, ticker) {
    const ctx = document.getElementById('stockChart').getContext('2d');

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${ticker} — цена закрытия, ₽`,
                data: prices,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: '#3b82f6',
                fill: true,
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: { display: true, text: 'Цена, ₽' }
                },
                x: {
                    title: { display: true, text: 'Дата' },
                    ticks: { maxRotation: 45, minRotation: 45 }
                }
            }
        }
    });
}
loadChartData(companies[0].ticker, companies[0].name);