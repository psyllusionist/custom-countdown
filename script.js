const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdown-form');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');
const countdownElInfo = document.getElementById('countdown-info');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeElBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate= '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Date Input Min with Todays Date
let today =  new Date();
let localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
dateEl.setAttribute('min', localToday);

// Populate Countdown / Complete UI
const updateDOM = () => {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;
        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);

        // Hide Input 
        inputContainer.hidden = true;

        // If the countdown has ended, show complete
        if(distance < 0) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${weekday[countdownValue.getDay()]},
            ${month[countdownValue.getMonth()]} ${countdownValue.getDate()}, ${countdownValue.getFullYear()}`;
            completeEl.hidden = false;
        } else {
            // Show the countdown in progress
            // Populate Countdown
            countdownElTitle.textContent = `${countdownTitle}`;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;
            countdownElInfo.textContent = `Time until ${weekday[countdownValue.getDay()]}, ${month[countdownValue.getMonth()]} ${countdownValue.getDate()}, ${countdownValue.getFullYear()}`;
            countdownEl.hidden = false;
            completeEl.hidden = true;
        }        
    }, second);
}

// Take Values from Form Input
const updateCountdown = (e) => {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    if(countdownDate === '') {
        alert('Please select a date for the countdown')
    } else {
        // Get number version of current Date, update DOM        
        // /* Set countdownDate hours to local time zone with getTimezoneOffset()
        // countdownValue.setMinutes(countdownValue.getMinutes() + countdownValue.getTimezoneOffset());
        // countdownValue = countdownValue.getTime()*/
        countdownValue =  new Date(`${countdownDate} 00:00:00`);
        updateDOM();
    }
}

const restorePreviousCountdown = () => {
    // Get countdown from localStorage if available
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;        
        countdownValue =  new Date(`${countdownDate} 00:00:00`);
        updateDOM();
    }
}

// Reset All Values
const reset = () => {
    // Hide Countdowns and Complete show Input
    inputContainer.hidden = false;
    countdownEl.hidden = true;
    completeEl.hidden = true;
    //Stop the countdown
    clearInterval(countdownActive);
    // Reset values
    countdownTitle = '';
    countdownDate= '';
    dateEl.value = "";
    localStorage.removeItem('countdown');
}

// Event Listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeElBtn.addEventListener('click', reset);

// On Load check localStorage
restorePreviousCountdown();