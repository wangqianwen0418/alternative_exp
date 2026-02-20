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

```bash
# Runs the application in development mode
npm start

# Runs ESLint to check for code quality and style issues
npm run lint

# Runs Prettier to automatically format the codebase
npm run format
```

## Project Structure

```
src/
│
├── app/                   # Application entry and experiment orchestration
│
├── components/            # React UI and visualization components
│   ├── charts/            # D3-based attribution visualizations and shared chart utilities
│   ├── interpretation/    # Insight workflow and response collection components
│   ├── tutorial/          # Guided onboarding and instructional components
│   └── ui/                # Reusable interface components (forms, layouts, etc.)
│
├── data/                  # Static datasets used for experimentation and demos
│
└── lib/                   # Shared utilities and research infrastructure
    ├── llm/               # LLM integration for structured insight extraction
    ├── utility/           # Cookies, logging, UUID, storage, and networking helpers
    └── research/          # Research-specific logic and experiment configuration
        └── questions/     # Structured experiment questions and study definitions
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

## AI Usage Notice

Portions of this codebase were developed with the assistance of AI-based programming tools.

AI tools were used to:

- Provide high-level documentation comments for files
- Assist in generating helper functions
- Assist in speeding up development

All architectural decisions, research design, visualization logic, and system behavior were determined and validated by the authors. AI-generated suggestions were reviewed, verified, and modified as necessary to ensure correctness and alignment with the research objectives.
