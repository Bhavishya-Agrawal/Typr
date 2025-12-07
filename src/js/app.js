import { themes, applyTheme } from "./themes.js";
import { snippets } from "./snippets.js";

const modeBtns = document.querySelectorAll(".mode-btn");
const langBtns = document.querySelectorAll(".lang-btn");
const optionsBar = document.getElementById("optionsBar");
const codeDisplay = document.getElementById("codeDisplay");
const codeHeaderTitle = document.getElementById("codeHeaderTitle");

const wpmMetric = document.getElementById("wpmMetric");
const accMetric = document.getElementById("accMetric");
const timeMetric = document.getElementById("timeMetric");

const restartBtn = document.getElementById("restartBtn");
const nextBtn = document.getElementById("nextBtn");

const resultsView = document.getElementById("resultsView");
const finalWPM = document.getElementById("finalWPM");
const finalAcc = document.getElementById("finalAcc");
const finalTime = document.getElementById("finalTime");
const resultsNextBtn = document.getElementById("resultsNextBtn");
const resultsRetryBtn = document.getElementById("resultsRetryBtn");

const themeDrawer = document.getElementById("themeDrawer");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeCloseBtn = document.getElementById("themeCloseBtn");
const themeGrid = document.getElementById("themeGrid");

let currentLang = "python";
let currentMode = "snippet"; // snippet | time | words
let timeLimit = 30;
let wordLimit = 50;

let currentSnippet = "";
let userInput = "";
let idx = 0;
let startTime = null;
let timerId = null;

function pickSnippet(lang, bucket) {
    const list = snippets[lang][bucket];
    if (!list || list.length === 0) return "";
    const i = Math.floor(Math.random() * list.length);
    return list[i];
}

function buildSnippetForMode() {
    if (currentMode === "snippet") {
        return pickSnippet(currentLang, "words50") || pickSnippet(currentLang, "words30");
    }
    if (currentMode === "words") {
        if (wordLimit === 30) return pickSnippet(currentLang, "words30");
        if (wordLimit === 50) return pickSnippet(currentLang, "words50");
        return pickSnippet(currentLang, "words100");
    }
    if (currentMode === "time") {
        const parts = [];
        const targetWords = timeLimit === 15 ? 60 : timeLimit === 30 ? 120 : 200;
        let count = 0;
        while (count < targetWords) {
            const s = pickSnippet(currentLang, "words50") || pickSnippet(currentLang, "words30");
            if (!s) break;
            const words = s.split(/\s+/).length;
            parts.push(s);
            count += words;
        }
        return parts.join("\n\n");
    }
    return "";
}

function setHeaderLabel() {
    codeHeaderTitle.textContent = currentLang + " · " + currentMode;
}

function updateOptions() {
    optionsBar.innerHTML = "";
    if (currentMode === "time") {
        [15, 30, 60].forEach(t => {
            const btn = document.createElement("button");
            btn.className = "pill-btn";
            btn.textContent = t + "s";
            if (t === timeLimit) btn.classList.add("active");
            btn.onclick = () => {
                timeLimit = t;
                updateOptions();
                resetSession(true);
            };
            optionsBar.appendChild(btn);
        });
    } else if (currentMode === "words") {
        [30, 50, 100].forEach(w => {
            const btn = document.createElement("button");
            btn.className = "pill-btn";
            btn.textContent = w + " words";
            if (w === wordLimit) btn.classList.add("active");
            btn.onclick = () => {
                wordLimit = w;
                updateOptions();
                resetSession(true);
            };
            optionsBar.appendChild(btn);
        });
    }
}

function renderCode() {
    codeDisplay.innerHTML = "";
    for (let i = 0; i < currentSnippet.length; i++) {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = currentSnippet[i];
        if (i < idx) {
            if (userInput[i] === currentSnippet[i]) span.classList.add("correct");
            else span.classList.add("incorrect");
        } else if (i === idx) {
            span.classList.add("current");
        }
        codeDisplay.appendChild(span);
    }
}

function calcMetrics() {
    if (!startTime) {
        wpmMetric.textContent = "0";
        accMetric.textContent = "100%";
        timeMetric.textContent = "0s";
        return;
    }
    const elapsed = (Date.now() - startTime) / 1000;
    const minutes = elapsed / 60;
    let correct = 0;
    for (let i = 0; i < idx; i++) {
        if (userInput[i] === currentSnippet[i]) correct++;
    }
    const wpm = minutes > 0 ? Math.round((correct / 5) / minutes) : 0;
    const acc = idx > 0 ? Math.round((correct / idx) * 100) : 100;

    let timeLabel;
    if (currentMode === "time") {
        const remaining = Math.max(0, timeLimit - Math.floor(elapsed));
        timeLabel = remaining + "s";
    } else {
        timeLabel = Math.floor(elapsed) + "s";
    }

    wpmMetric.textContent = String(wpm);
    accMetric.textContent = acc + "%";
    timeMetric.textContent = timeLabel;
}

function isDone() {
    if (!startTime) return false;

    if (currentMode === "snippet") {
        if (idx >= currentSnippet.length) return true;
    } else if (currentMode === "time") {
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= timeLimit) return true;
    } else if (currentMode === "words") {
        const words = userInput.trim().split(/\s+/).filter(Boolean).length;
        if (words >= wordLimit) return true;
    }
    return false;
}

function showResults() {
    if (!startTime) return;
    if (timerId) clearInterval(timerId);

    const elapsed = (Date.now() - startTime) / 1000;
    const minutes = elapsed / 60;
    let correct = 0;
    for (let i = 0; i < idx; i++) {
        if (userInput[i] === currentSnippet[i]) correct++;
    }
    const wpm = minutes > 0 ? Math.round((correct / 5) / minutes) : 0;
    const acc = idx > 0 ? Math.round((correct / idx) * 100) : 100;

    finalWPM.textContent = String(wpm);
    finalAcc.textContent = acc + "%";
    finalTime.textContent = Math.floor(elapsed) + "s";

    resultsView.classList.add("active");
}

function resetSession(reloadSnippet) {
    if (timerId) clearInterval(timerId);
    idx = 0;
    userInput = "";
    startTime = null;
    if (reloadSnippet) {
        currentSnippet = buildSnippetForMode();
    }
    setHeaderLabel();
    renderCode();
    calcMetrics();
    resultsView.classList.remove("active");
}

function startTimerIfNeeded() {
    if (startTime) return;
    startTime = Date.now();
    timerId = setInterval(() => {
        calcMetrics();
        if (isDone()) {
            showResults();
        }
    }, 120);
}

document.addEventListener("keydown", e => {
    if (resultsView.classList.contains("active")) return;
    if (themeDrawer.style.display === "flex") return;

    if (e.key === "Backspace") {
        e.preventDefault();
        if (idx > 0) {
            userInput = userInput.slice(0, -1);
            idx--;
            renderCode();
            calcMetrics();
        }
        return;
    }

    if (e.key.length === 1 || e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        startTimerIfNeeded();

        if (currentMode === "time" && isDone()) return;

        if (e.key === "Enter") {
            let lineStart = userInput.lastIndexOf("\n") + 1;
            if (lineStart < 0) lineStart = 0;
            const currentLine = userInput.slice(lineStart);
            let indent = "";
            const m = currentLine.match(/^[ \t]*/);
            if (m) indent = m[0];
            const trimmed = currentLine.trimEnd();
            if (trimmed.endsWith(":") || trimmed.endsWith("{")) {
                indent += "    ";
            }
            userInput += "\n" + indent;
            idx += 1 + indent.length;
        } else if (e.key === "Tab") {
            userInput += "    ";
            idx += 4;
        } else {
            userInput += e.key;
            idx++;
        }

        renderCode();
        calcMetrics();
        if (isDone()) showResults();
    }
});

modeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        modeBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentMode = btn.dataset.mode;
        updateOptions();
        resetSession(true);
    });
});

langBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        langBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentLang = btn.dataset.lang;
        resetSession(true);
    });
});

restartBtn.addEventListener("click", () => {
    resetSession(true);
});

nextBtn.addEventListener("click", () => {
    resetSession(true);
});

resultsNextBtn.addEventListener("click", () => {
    resetSession(true);
});

resultsRetryBtn.addEventListener("click", () => {
    resetSession(false);
});

function openThemeDrawer() {
    themeDrawer.style.display = "flex";
}

function closeThemeDrawer() {
    themeDrawer.style.display = "none";
}

themeToggleBtn.addEventListener("click", () => {
    openThemeDrawer();
});

themeCloseBtn.addEventListener("click", () => {
    closeThemeDrawer();
});

themeDrawer.addEventListener("click", e => {
    if (e.target === themeDrawer) closeThemeDrawer();
});

function buildThemeGrid() {
    themeGrid.innerHTML = "";
    Object.entries(themes).forEach(([key, t]) => {
        const card = document.createElement("button");
        card.className = "theme-card";
        const name = document.createElement("div");
        name.className = "theme-card-name";
        name.textContent = t.name;
        const sw = document.createElement("div");
        sw.className = "theme-card-swatches";

        const s1 = document.createElement("div");
        s1.className = "theme-swatch";
        s1.style.background = t.bg;

        const s2 = document.createElement("div");
        s2.className = "theme-swatch";
        s2.style.background = t.cardBg;

        const s3 = document.createElement("div");
        s3.className = "theme-swatch";
        s3.style.background = t.accent;

        sw.appendChild(s1);
        sw.appendChild(s2);
        sw.appendChild(s3);

        card.appendChild(name);
        card.appendChild(sw);

        card.addEventListener("click", () => {
            applyTheme(key);
            closeThemeDrawer();
        });

        themeGrid.appendChild(card);
    });
}

function initTheme() {
    applyTheme("charcoal");
    buildThemeGrid();
}

function initApp() {
    initTheme();
    updateOptions();
    currentSnippet = buildSnippetForMode();
    setHeaderLabel();
    renderCode();
    calcMetrics();
}

initApp();
