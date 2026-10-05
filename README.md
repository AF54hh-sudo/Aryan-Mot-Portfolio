# Aryan Mot — Data & AI Portfolio

A personal portfolio showcasing practical work in data analytics, machine learning, and applied AI. Built with HTML, CSS, and vanilla JavaScript, it runs locally without a build step, API key, or external font service.

## Featured projects

- **[Sentinel](https://github.com/AF54hh-sudo/Sentinel)** — Business research workflows combining Python and SQL analytics, LangGraph routing, and document retrieval.
- **[Customer Churn Intelligence Platform](https://github.com/AF54hh-sudo/customer-churn-intelligence-platform)** — Customer churn risk scoring with SHAP explanations.
- **[AI Resume Screener](https://github.com/AF54hh-sudo/ai-resume-screener)** — Semantic resume matching and candidate–job comparisons.
- **[Walmart Sales Analysis](https://github.com/AF54hh-sudo/walmart)** — Weekly sales analysis across **45 stores**, covering seasonality, holidays, and store performance, with a SARIMAX forecasting workflow for **Store 1**.

This repository contains the portfolio website. The analytical applications and their implementation details live in the linked project repositories.

## Features

- Interactive project case studies and direct GitHub links.
- A browser for 34 skill topics across five professional categories.
- Character illustrations, canvas studies, and pointer-responsive card highlights.
- A shared animation clock, reduced-motion support, and a Pause motion control.
- Responsive layouts, keyboard-accessible interactions, and a skip link.
- Experience, education, contact links, and a downloadable resume.
- Bundled artwork and local DM Sans and Space Grotesk fonts.

Canvas studies are illustrative animations, not live model training or external AI requests. External project, social, and map links require internet access.

## Run locally

Download or clone the repository, keep its files together, and open `index.html` in Chrome or Edge. On Windows, `OPEN-PORTFOLIO.cmd` opens the page for you.

If your browser restricts local files, start a local server from this folder with Python 3:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:8000`. Stop the server with `Ctrl+C`.

## Source guide

| File or folder | Purpose |
| --- | --- |
| `index.html` | Main page structure and content |
| `app.js` | Project dialogs, navigation, and architecture controls |
| `skills.js` | Skill browser, Walmart case study, and repository links |
| `motion.js`, `attention.js` | Animation clock and motion helpers |
| `studio.js`, `scenes.js`, `presentation.js` | Pointer effects, activity cards, and section indicators |
| `ai-lab.js` | Illustrative canvas studies and mascot rendering |
| `*.css` | Layout, typography, visual themes, and responsive styles |
| `fonts/` | Local fonts and their license notices |
| `lab-assets/`, `idle-*.webp` | Mascot and character artwork |
| `Aryan-Mot-Resume.pdf` | Downloadable resume |

## Contact

**Aryan Mot** · Jaipur, India  
[GitHub](https://github.com/AF54hh-sudo) · [LinkedIn](https://www.linkedin.com/in/aryanmot2001/) · [Email](mailto:aryanmot288@gmail.com)

## Font licenses

Bundled DM Sans and Space Grotesk fonts include their SIL Open Font License notices in `fonts/`.
