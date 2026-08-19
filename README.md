# Insight Weaver

"Design an adaptive, multi-scale analytics UI component system that acts as an embeddable component library (similar to Clerk.com for analytics). The interface must adapt across domains (healthcare, engineering, government) AND across scale levels (micro individual records vs. macro system operations).

Core Problem & Real-World Use Case: In a hospital setting, a doctor during consultation needs a Micro Entity View to inspect an individual patient's medical history, vital sign trends (blood pressure, heart rate), and AI-generated pattern highlights (e.g., 'Elevated cardiovascular risk trend over 6 months — flagged for double-check'). The AI must NEVER make diagnostic decisions; it acts purely as a double-check and pattern-highlighting assistant. Simultaneously, a department head needs a Macro System View of ward bed occupancy, sepsis trends, and CT scan turnaround times.

Required UI Surfaces & Components:

Multi-Scale Canvas (Micro Entity vs. Macro System): A layout system that seamlessly shifts between an individual record focus (patient timeline, vital sign trend lines, risk-highlight badges) and a macro system dashboard (ward KPIs, aggregate trends).

Information Fidelity & Risk Overlays: Non-intrusive visual badges and trend callouts that highlight patterns (e.g., infection risk markers, anomalous vital readings) for double-checking, while clearly separating raw patient data from AI observational highlights.

Embedded Conversational Analyst Widget: A natural language prompt box that adapts to entity context ('Show Patient #4092's BP trend since July') or macro context ('Which ward has the highest sepsis rate?').

Lineage & Audit Inspector Drawer: An expandable drawer showing raw source records, timestamps, and confidence scores so practitioners can double-check every highlight.

Privacy & Isolation Status Badges: Visual indicators verifying tenant and record-level HIPAA/PHI data isolation.*"

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fb462cff-ba52-4035-ab94-1d89bec2fae4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
