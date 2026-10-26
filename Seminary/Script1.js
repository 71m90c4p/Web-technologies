// JavaScript source code
const clockElement = document.getElementById('clock');
const openModalBtn = document.getElementById('open-modal-btn');
const modalOverlay = document.getElementById('modal-overlay');
const closeModalBtn = document.getElementById('close-modal-btn');
const startTimerBtn = document.getElementById('start-timer-btn');
const secondsInput = document.getElementById('seconds-input');
const countdownDisplay = document.getElementById('countdown-display');

let clockInterval;
let timerInterval;

function updateClock() {
    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');

    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

updateClock();
clockInterval = setInterval(updateClock, 1000);

openModalBtn.addEventListener('click', () => {
    modalOverlay.classList.add('show');
    secondsInput.focus();
});

closeModalBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('show');
});

modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
        modalOverlay.classList.remove('show');
    }
});

startTimerBtn.addEventListener('click', () => {
    let secondsLeft = parseInt(secondsInput.value);

    if (isNaN(secondsLeft) || secondsLeft < 0 || secondsLeft > 9999) {
        alert("Bведите число от 0 до 9999");
        return;
    }

    modalOverlay.classList.remove('show');

    openModalBtn.style.display = 'none';
    countdownDisplay.style.display = 'block';

    clearInterval(timerInterval);

    function formatTime(totalSecs) {
        let h = Math.floor(totalSecs / 3600);
        let m = Math.floor((totalSecs % 3600) / 60);
        let s = totalSecs % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    countdownDisplay.textContent = formatTime(secondsLeft);

    timerInterval = setInterval(() => {
        secondsLeft--;

        countdownDisplay.textContent = formatTime(secondsLeft);

        if (secondsLeft < 0) {
            clearInterval(timerInterval);

            alert("Таймер завершён");

            countdownDisplay.style.display = 'none';
            openModalBtn.style.display = 'block';
            secondsInput.value = ''; 
        }
    }, 1000);
});