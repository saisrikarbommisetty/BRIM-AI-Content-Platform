# BRIM — AI Content Writing Platform

BRIM is a production-quality, full-stack AI-powered social media content planning and strategy architecture. Designed for agencies and marketing teams, BRIM translates raw business collateral—brochures, catalogues, product sheets, images, and text briefs—into highly tailored, industry-specific social media calendars.

This application is built with **Next.js (App Router), React, TypeScript, Tailwind CSS**, and the **Gemini API** with schema-constrained JSON outputs.

---

## Key Features

1. **Explicit Industry Intelligence Layer**: Custom guardrails for 4 distinct sectors: Real Estate, Jewellery, Perfume, and FMCG Food. The AI adapts its target audience, tone curves, vocabulary constraints, and strategic distribution pillars accordingly.
2. **Factual Document Context Pipeline**: Extracts text from PDFs, Word docs (DOCX), Excel sheets (XLSX), PowerPoint slides (PPTX), and TXT files, grounding AI generation in real facts (configurations, locations, notes, ingredients) to eliminate hallucinations.
3. **Multimodal Vision Context**: Feeds uploaded images (PNG, JPG) directly to the Gemini Vision API to extract visual cues and descriptions for marketing strategy.
4. **Structured JSON Calendering**: Avoids fragile regex parsing by requesting schema-constrained outputs directly from Gemini, returning a complete calendar containing publication-ready captions, visual instructions for designers, and targeted hashtags.
5. **Interactive Calendar Grid**: Displays posts in a beautiful calendar UI with search tags, collapsible details, one-click clipboard copying, inline edits, and individual card regenerations.
6. **Double-Engine Mode (Live vs. Demo)**: Automatically falls back to a deterministic, dynamic simulation engine if no `GEMINI_API_KEY` is configured, allowing instant evaluations without setup friction.
7. **Pre-loaded Industry briefs**: Access fictional reference data (e.g., real estate brochure, perfume sheet) with a single click in both Live and Demo modes.

---

## System Architecture

```text
       +--------------------------------------------------------+
       |                  BRIM Frontend (React)                 |
       |  - Config Panel (Industry, Plan Duration)              |
       |  - Ingestion Zone (Drag-and-Drop files)                |
       |  - Calendar Grid (Post Editing, Copy, Regeneration)    |
       +-----------------------------------+--------------------+
                                           |
                                 FormData  |  JSON Config
                                 & Upload  |  & Ingestion
                                           v
       +-----------------------------------+--------------------+
       |                  Next.js App Router API                |
       |  - /api/upload     : Parses file formats to text       |
       |  - /api/generate   : Builds prompts, calls LLM         |
       |  - /api/regenerate : Handles individual card updates   |
       +-----------------------------------+--------------------+
                                           |
                              Context      |  Structured
                              Payload      |  JSON Schema
                                           v
       +-----------------------------------+--------------------+
       |                 Gemini LLM Service Layer               |
       |  - Ingests System Persona & Industry Strategy          |
       |  - Enforces strict factual reference compliance        |
       |  - Returns verified JSON array matching schema         |
       +--------------------------------------------------------+
```

---

## File Ingestion Strategy

BRIM supports real-time text extraction on the server:
- **PDF**: Uses `pdf-parse` to convert layout buffers to clean strings.
- **DOCX**: Uses `mammoth` to extract document body text.
- **XLSX**: Uses `xlsx` (SheetJS) to convert grids and cells to comma-delimited strings sheet-by-sheet.
- **PPTX**: Uses `adm-zip` to extract slide XML files natively and compiles slide texts sequentially.
- **Images (PNG, JPG, JPEG)**: Encodes image buffers as inline base64 and maps them directly to Gemini's multimodal API for real-time visual context.
- **TXT**: Reads file buffers directly.

---

## AI Prompt Architecture

The model receives a layered prompt composed of:
1. **System Persona**: Directs Gemini to act as a premium Social Media Director.
2. **Industry Guardrails**: Injects tone, key vocabulary words, target audience, specific content pillars, and a list of forbidden approaches (e.g., "avoid making scientific claims for food; keep it relatable").
3. **Factual Constraints**: Injects text extracted from files and instructs the AI *never* to invent pricing, specifications, or location details.
4. **Structured Schema**: Restricts response strictly to a schema-validated JSON format containing caption, visual instructions, date, and hashtags, eliminating formatting wrappers.

---

## Tech Stack

- **Core**: Next.js 14+ (App Router), React 18+, TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons, Glassmorphism utilities
- **API Client**: Native Server Fetch with Gemini REST API (model: `gemini-1.5-flash` or `gemini-2.5-flash`)
- **Parsers**: `pdf-parse`, `mammoth`, `xlsx`, `adm-zip`

---

## Environment Variables

BRIM uses server-side environment variables. Copy `.env.example` to `.env`:

```env
# Gemini API Key (optional - defaults to Demo Mode if left blank)
GEMINI_API_KEY=AIzaSy...
```

If `GEMINI_API_KEY` is not present, the system defaults to **Demo Mode**, generating template-grounded dynamic posts that still respond to your configuration selections.

---

## Installation & Setup

1. **Clone or Enter the Repository**:
   ```bash
   cd BRIM-Assignment
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure API Key (Optional)**:
   Create a `.env` file and insert your `GEMINI_API_KEY`.

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```
   Run production build:
   ```bash
   npm run start
   ```

---

## Design Decisions & Verification

- **Pure JavaScript Parsers**: We avoided native dependencies (like python wrappers or C bindings) for parsing documents, ensuring that `npm install` runs smoothly on Windows, Mac, and Linux without build toolchain requirements.
- **Card-Level Regeneration**: When regenerating a post, only the target card shows a loading state. The rest of the calendar remains interactive, providing a fast and polished user experience.
- **Demo Mode Grounding**: Rather than showing completely static strings in Demo Mode, the generator parses the filename and key headers from uploaded text files to insert names dynamically, demonstrating the pipeline's reactive logic.
