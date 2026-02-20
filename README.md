# Enhancing XAI Interpretation through a Reverse Mapping from Insights to Visualizations

This repository contains the research prototype presented in:

[**Enhancing XAI Interpretation through a Reverse Mapping from Insights to Visualizations**](https://arxiv.org/abs/2508.18640)

## Project Overview

This application is an interactive web-based research prototype for studying how users interpret explainable AI (XAI) visualizations.

The system enables users to:

- Explore attribution-based explanation visualizations (e.g., SHAP-style charts)
- Enter free-form interpretations of model behavior
- Automatically structure those interpretations into formal insight representations
- Enhance the original visualization through annotations and coordinated multi-view visualizations

The goal of the system is to support verification and refinement of user interpretations by mapping insights back to visual explanations (Reverse Mapping) .

## Running the Project Locally

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Server

```bash
npm start
```

The application will run at:

```
http://localhost:3000/alternative_exp
```

## Available Scripts

### Start Development Server

```bash
npm start
```

Runs the app in development mode.

### Lint the Codebase

```bash
npm run lint
```

Runs ESLint to check code quality and style consistency.

### Format the Codebase

```bash
npm run format
```

Runs Prettier to automatically format project files.

## Project Structure

```
src/
│
├── app/              # Application entry and high-level orchestration
├── components/       # React components and visualization modules
│   ├── charts/       # D3-based attribution visualizations
│   ├── interpretation/
│   └── ui/
│
└── lib/              # Shared utilities and core logic
    ├── utility/      # Cookies, logging, UUID, networking helpers
    ├── llm/          # Structured insight generation and parsing
    └── config.ts
```

## Contact

For research inquiries or collaboration:

| Name           | Affiliation                         | Email                  |
| -------------- | ----------------------------------- | ---------------------- |
| Nicholas Hinds | University of Minnesota             | hinds084@umn.edu       |
| Zhanna Kaufman | University of Massachusetts Amherst | zhannakaufma@umass.edu |
| Qianwen Wang   | University of Minnesota             | qianwen@umn.edu        |

## How to Cite

If you use this system or build upon this work, please cite:

```bibtex
@inproceedings{enhancingxai2025,
  title={Enhancing XAI Interpretation through a Reverse Mapping from Insights to Visualizations},
  author={Nuthalapati, Aniket and Hinds, Nicholas and Lim, Brian Y. and Wang, Qianwen},
  booktitle={Proceedings of IEEE VIS 2025 (Short Paper)},
  year={2025}
}
```
