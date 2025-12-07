export const themes = {
    charcoal: {
        name: "Charcoal",
        bg: "#050509",
        cardBg: "rgba(10,10,28,0.96)",
        accent: "#5ef2ff",
        accentSoft: "rgba(94,242,255,0.14)",
        danger: "#ff5263",
        muted: "#9a9ab5"
    },
    terminal: {
        name: "Terminal",
        bg: "#020302",
        cardBg: "rgba(6,12,8,0.96)",
        accent: "#37ff6b",
        accentSoft: "rgba(55,255,107,0.2)",
        danger: "#ffb347",
        muted: "#8bb58d"
    },
    newspaper: {
        name: "Newspaper",
        bg: "#f2f0ea",
        cardBg: "rgba(252,252,248,0.96)",
        accent: "#0f4aad",
        accentSoft: "rgba(15,74,173,0.12)",
        danger: "#d7263d",
        muted: "#4b4b56"
    },
    blueprint: {
        name: "Blueprint",
        bg: "#021532",
        cardBg: "rgba(4,24,65,0.96)",
        accent: "#7fb5ff",
        accentSoft: "rgba(127,181,255,0.22)",
        danger: "#ffc857",
        muted: "#a6c8ff"
    },
    dusk: {
        name: "Dusk",
        bg: "#150925",
        cardBg: "rgba(26,13,54,0.96)",
        accent: "#ff9de1",
        accentSoft: "rgba(255,157,225,0.2)",
        danger: "#ff7b72",
        muted: "#d4b5ff"
    },
    forest: {
        name: "Forest",
        bg: "#020f0b",
        cardBg: "rgba(5,32,23,0.96)",
        accent: "#60ffb2",
        accentSoft: "rgba(96,255,178,0.2)",
        danger: "#ff6678",
        muted: "#9fd5be"
    }
};

export function applyTheme(key) {
    const t = themes[key];
    if (!t) return;
    document.documentElement.style.setProperty("--bg", t.bg);
    document.documentElement.style.setProperty("--accent", t.accent);
    document.documentElement.style.setProperty("--accent-soft", t.accentSoft);
    document.documentElement.style.setProperty("--danger", t.danger);
    document.documentElement.style.setProperty("--muted", t.muted);
}
