/* Doctory — shared Tailwind (Play CDN) config.
 * Tokens come from the Stitch design system "Clinical Clarity & Intelligent Trust".
 * Loaded right after https://cdn.tailwindcss.com in views/partials/head.ejs so every page
 * shares one source of truth instead of repeating the config inline. */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#004ac6", "on-primary": "#ffffff",
        "primary-container": "#2563eb", "on-primary-container": "#eeefff",
        "primary-fixed": "#dbe1ff", "primary-fixed-dim": "#b4c5ff",
        "on-primary-fixed": "#00174b", "on-primary-fixed-variant": "#003ea8",
        "inverse-primary": "#b4c5ff", "surface-tint": "#0053db",
        "secondary": "#006b5f", "on-secondary": "#ffffff",
        "secondary-container": "#6df5e1", "on-secondary-container": "#006f64",
        "secondary-fixed": "#71f8e4", "secondary-fixed-dim": "#4fdbc8",
        "on-secondary-fixed": "#00201c", "on-secondary-fixed-variant": "#005048",
        "tertiary": "#4d556b", "on-tertiary": "#ffffff",
        "tertiary-container": "#656d84", "on-tertiary-container": "#eef0ff",
        "tertiary-fixed": "#dae2fd", "tertiary-fixed-dim": "#bec6e0",
        "on-tertiary-fixed": "#131b2e", "on-tertiary-fixed-variant": "#3f465c",
        "error": "#ba1a1a", "on-error": "#ffffff",
        "error-container": "#ffdad6", "on-error-container": "#93000a",
        "background": "#f7f9fb", "on-background": "#191c1e",
        "surface": "#f7f9fb", "surface-bright": "#f7f9fb", "surface-dim": "#d8dadc",
        "surface-variant": "#e0e3e5", "on-surface": "#191c1e", "on-surface-variant": "#434655",
        "surface-container-lowest": "#ffffff", "surface-container-low": "#f2f4f6",
        "surface-container": "#eceef0", "surface-container-high": "#e6e8ea",
        "surface-container-highest": "#e0e3e5",
        "inverse-surface": "#2d3133", "inverse-on-surface": "#eff1f3",
        "outline": "#737686", "outline-variant": "#c3c6d7",
        "navy": "#0f172a", "warning": "#f59e0b", "success": "#10b981"
      },
      borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", "2xl": "1rem", "3xl": "1.5rem", full: "9999px" },
      spacing: {
        "space-xs": "0.25rem", "space-sm": "0.5rem", "space-md": "1rem", "space-lg": "1.5rem",
        "space-xl": "2.25rem", "space-2xl": "3.5rem", "gutter": "1.25rem", "gutter-desktop": "1.75rem",
        "margin": "1rem", "margin-desktop": "2.5rem"
      },
      fontFamily: {
        sans: ["Cairo", "Inter", "system-ui", "sans-serif"],
        "display-xl": ["Cairo", "Plus Jakarta Sans"], "display-xl-mobile": ["Cairo", "Plus Jakarta Sans"],
        "headline-lg": ["Cairo", "Plus Jakarta Sans"], "headline-lg-mobile": ["Cairo", "Plus Jakarta Sans"],
        "headline-md": ["Cairo", "Plus Jakarta Sans"], "headline-sm": ["Cairo", "Plus Jakarta Sans"],
        "queue-counter": ["Plus Jakarta Sans", "Cairo"],
        "title-md": ["Cairo", "Inter"], "body-lg": ["Cairo", "Inter"], "body-md": ["Cairo", "Inter"],
        "label-md": ["Cairo", "Inter"], "label-sm": ["Cairo", "Inter"]
      },
      fontSize: {
        "display-xl": ["56px", { lineHeight: "72px", fontWeight: "800" }],
        "display-xl-mobile": ["36px", { lineHeight: "50px", fontWeight: "800" }],
        "headline-lg": ["32px", { lineHeight: "46px", fontWeight: "700" }],
        "headline-lg-mobile": ["26px", { lineHeight: "38px", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "36px", fontWeight: "600" }],
        "headline-sm": ["20px", { lineHeight: "30px", fontWeight: "600" }],
        "queue-counter": ["48px", { lineHeight: "52px", fontWeight: "800" }],
        "title-md": ["18px", { lineHeight: "28px", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "24px", fontWeight: "400" }],
        "label-md": ["13px", { lineHeight: "20px", fontWeight: "500" }],
        "label-sm": ["11px", { lineHeight: "18px", fontWeight: "600" }]
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(15,23,42,.04), 0 1px 2px -1px rgba(15,23,42,.02)",
        lift: "0 10px 15px -3px rgba(37,99,235,.07), 0 4px 6px -4px rgba(15,23,42,.03)",
        modal: "0 25px 50px -12px rgba(15,23,42,.3)"
      }
    }
  }
};
