class Timer {
  constructor(minutes, seconds) {
    this.totalSeconds = minutes * 60 + seconds;
    this.onTick = null;
    this.onComplete = null;
    this.interval = null;
  }

  start() {
    this.interval = setInterval(() => {
      if (this.totalSeconds > 0) {
        this.totalSeconds--;
        if (this.onTick) {
          this.onTick(this.minutes, this.seconds);
        } else {
          this.stop();
          if (this.onComplete) {
            this.onComplete();
          }
        }
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.interval);
  }

  reset(minutes, seconds) {
    this.stop();
    this.totalSeconds = minutes * 60 + seconds;
    if (this.onTick) {
      this.onTick(this.minutes, this.seconds);
    }
  }

  get minutes() {
    return Math.floor(this.totalSeconds / 60);
  }

  get seconds() {
    return this.totalSeconds % 60;
  }
}

class PomodoroTimer {
  constructor() {
    this.timer = new Timer(25, 0);
    this.mode = "pomodoro";
    this.isRuning = false;
    this.settings = {
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
    };

    this.minutesElement = document.getElementById("minutes");
    this.secondsElement = document.getElementById("seconds");
    this.startPauseBtn = document.getElementById("startPauseBtn");
    this.resetBtn = document.getElementById("resetBtn");
    this.settingsBtn = document.getElementById("settingsBtn");
    this.pomodoroBtn = document.getElementById("pomodoroBtn");
    this.shortBreakBtn = document.getElementById("shortBreakBtn");
    this.longBreakBtn = document.getElementById("longBreakBtn");
    this.saveSettingsBtn = document.getElementById("saveSettingsBtn");
    this.closeSettingsBtn = document.getElementById("closeSettingsBtn");
    this.settingsPopup = document.getElementById("settingsPopup");
    this.notificationSound = document.getElementById("notificationSound");
    this.progressRing = document.querySelector(".progress-ring__circle");
    this.progressRingLength = this.progressRing.getTotalLength();
    this.progressRing.style.strokeDasharray = `${this.progressRingLength} ${this.progressRingLength}`;
    this.initEventListeners();
    this.initTimer();
  }

  initEventListeners() {
    this.startPauseBtn.addEventListener("click", () => this.toggleStartPause());
    this.resetBtn.addEventListener("click", () => this.reset());
    this.settingsBtn.addEventListener("click", () => this.openSettings());
    this.pomodoroBtn.addEventListener("click", () => this.setMode("pomodoro"));
    this.shortBreakBtn.addEventListener("click", () =>
      this.setMode("shortBreak")
    );
    this.longBreakBtn.addEventListener("click", () =>
      this.setMode("longBreak")
    );
    this.saveSettingsBtn.addEventListener("click", () => this.saveSettings());
    this.closeSettingsBtn.addEventListener("click", () => this.closeSettings());
  }

  initTimer() {
    this.timer.onTick = (minutes, seconds) => {
      this.updateDisplay(minutes, seconds);
      const totalSeconds = this.settings[this.mode] * 60;
      const remainingSeconds = minutes * 60 + seconds;
      this.updateProgressRing(remainingSeconds, totalSeconds);
    };
    this.timer.onComplete = () => this.handleTimerComplete();
  }

  toggleStartPause() {
    if (this.isRuning) {
      this.pause();
    } else {
      this.start();
    }
  }

  start() {
    this.timer.start();
    this.isRuning = true;
    this.updateStartPauseBtn();
  }

  pause() {
    this.timer.stop();
    this.isRuning = false;
    this.updateStartPauseBtn();
  }

  reset() {
    this.setMode(this.mode);
  }
  setMode(mode) {
    this.mode = mode;
    this.timer.reset(this.settings[mode], 0);
    this.isRuning = false;
    this.updateStartPauseBtn();
    this.updateModeButtons();
    this.updateProgressRing(this.settings[mode] * 60, this.settings[mode] * 60);
  }

  updateDisplay(minutes, seconds) {
    this.minutesElement.textContent = ("" + minutes).padStart(2, "0");
    this.secondsElement.textContent = ("" + seconds).padStart(2, "0");
  }

  updateStartPauseBtn() {
    const icon = this.startPauseBtn.querySelector("i");
    icon.className = this.isRuning ? "fa-pause fa-solid" : "fa-play fa-solid";
  }

  updateModeButtons() {
    [this.pomodoroBtn, this.shortBreakBtn, this.longBreakBtn].forEach((btn) => {
      btn.classList.remove("active");
    });
    switch (this.mode) {
      case "shorBreak":
        this.shortBreakBtn.classList.add("active");
        break;
      case "longBreak":
        this.longBreakBtn.classList.add("active");
        break;
      default:
        this.pomodoroBtn.classList.add("active");
    }
  }

  handleTimerComplete() {
    this.isRuning = false;
    this.updateStartPauseBtn();
    this.playNotificationSound();
    this.updateProgressRing(0, 1);
  }

  playNotificationSound() {
    const audio = new Audio("alarm.mp3");
    console.log("aaaa");
    audio.play();
  }
  openSettings() {
    this.settingsPopup.style.display = "block";
  }

  closeSettings() {
    this.settingsPopup.style.display = "none";
  }

  saveSettings() {
    this.settings.pomodoro = parseInt(
      document.getElementById("pomodoroTime").value,
      10
    );
    this.settings.shortBreak = parseInt(
      document.getElementById("shortBreakTime").value,
      10
    );
    this.settings.longBreak = parseInt(
      document.getElementById("longBreakTime").value,
      10
    );
    this.reset();
    this.closeSettings();
  }
  updateProgressRing(remainingSeconds, totalSeconds) {
    const progress = remainingSeconds / totalSeconds;
    const dashoffset = this.progressRingLength * progress;
    this.progressRing.style.strokeDashoffset = dashoffset;
  }
}

const pomodoroTimer = new PomodoroTimer();
