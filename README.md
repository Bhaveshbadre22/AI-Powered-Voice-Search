# AI-Powered Voice Search

A React + Vite app that lets you **speak or type** a product query. It sends your full product catalog and query to Claude (Anthropic), which ranks and returns the best matches with a one-sentence reason per item.

---

## How It Works — Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          App Start                                  │
│               src/main.jsx  →  src/App.jsx                          │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Load Product Catalog                           │
│   productsAPI.js fetches from Fake Store API                        │
│   → dispatches fetchProducts → stored in Redux (productsSlice)      │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                ▼                               ▼
  ┌─────────────────────────┐     ┌─────────────────────────────┐
  │      Typed Search       │     │       Voice Search          │
  │  SearchBar.jsx          │     │  VoiceZone.jsx              │
  │  (text input + history) │     │  useSpeechRecognition.js    │
  └───────────┬─────────────┘     └──────────────┬──────────────┘
              └───────────────┬───────────────────┘
                              │  query string
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     useProductSearch.js                             │
│                                                                     │
│  1. Calls searchWithClaudeAPI(products, query)                      │
│     → POST https://api.anthropic.com/v1/messages                    │
│     → Claude returns: [{ id, reason }, ...]                         │
│                                                                     │
│  2. extractPriceConstraint(query)                                   │
│     → parses "under $80" / "over $50" from the raw query            │
│     → filters Claude results by min / max price                     │
└───────────────────────────────┬─────────────────────────────────────┘
                                │  filtered product list
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Redux Store Update                             │
│              setFilteredProducts → productsSlice                    │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         UI Render                                   │
│   ProductGrid.jsx  →  ProductCard.jsx                               │
│   Each card shows: image, title, price, category, AI reason badge   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Features

| Feature | Description | Key File |
|---|---|---|
| Voice search | Tap-to-speak mic with live transcript | [VoiceZone.jsx](src/components/SearchBar/VoiceZone.jsx) |
| Typed search | Text input with suggestions and recent history | [SearchBar.jsx](src/components/SearchBar/SearchBar.jsx) |
| AI ranking | Claude scores and explains each match | [claudeAPI.js](src/features/search/claudeAPI.js) |
| Price filters | Parses `under $80`, `over $50` from natural language | [useProductSearch.js](src/hooks/useProductSearch.js) |
| Search history | Saves and replays recent queries | [SearchHistory.jsx](src/components/SearchBar/SearchHistory.jsx) |
| Language selector | Switch voice recognition language | [LanguageSelector.jsx](src/components/SearchBar/LanguageSelector.jsx) |
| Keyboard shortcuts | Power-user keys (see table below) | [useKeyboardShortcuts.js](src/hooks/useKeyboardShortcuts.js) |

---

## Tech Stack

| Layer | Tool | Config / Entry |
|---|---|---|
| UI framework | React 18 | [src/main.jsx](src/main.jsx) |
| State management | Redux Toolkit | [src/app/store.js](src/app/store.js) |
| Build & dev server | Vite 5 | [vite.config.js](vite.config.js) |
| Styling | Tailwind CSS + custom animations | [tailwind.config.js](tailwind.config.js), [src/index.css](src/index.css) |
| AI | Anthropic Claude (`claude-sonnet-4-6`) | [claudeAPI.js](src/features/search/claudeAPI.js) |
| Product data | Fake Store API | [productsAPI.js](src/features/products/productsAPI.js) |
| Voice input | Browser Web Speech API | [useSpeechRecognition.js](src/hooks/useSpeechRecognition.js) |

---

## Project Structure

```
src/
├── app/
│   ├── store.js               Redux store (products + search slices)
│   └── hooks.js               Typed useAppDispatch / useAppSelector
├── components/
│   ├── SearchBar/
│   │   ├── SearchBar.jsx       Main text input + suggestion dropdown
│   │   ├── VoiceZone.jsx       Mic button + live transcript display
│   │   ├── MicButton.jsx       Animated record button
│   │   ├── SearchHistory.jsx   Recent query chips
│   │   ├── SearchSuggestions.jsx  Dropdown autocomplete list
│   │   ├── SuggestedChips.jsx  Pre-built example query chips
│   │   ├── LanguageSelector.jsx   Voice language dropdown
│   │   ├── TrySaying.jsx       Idle prompt suggestions
│   │   └── TypingIndicator.jsx Loading dots while Claude processes
│   ├── ProductGrid/
│   │   ├── ProductGrid.jsx     Grid layout + loading / empty states
│   │   ├── ProductCard.jsx     Individual product card with AI reason
│   │   ├── EmptyState.jsx      No-results UI
│   │   └── ErrorState.jsx      Fetch-error UI with retry button
│   └── ui/
│       ├── Badge.jsx           Reusable badge component
│       └── Loader.jsx          Spinner
├── features/
│   ├── products/
│   │   ├── productsSlice.js    Redux slice: all products + filtered list
│   │   └── productsAPI.js      Fetches catalog from Fake Store API
│   └── search/
│       ├── searchSlice.js      Redux slice: query, status, history, language
│       └── claudeAPI.js        Calls Anthropic API, parses JSON response
└── hooks/
    ├── useProductSearch.js     Orchestrates Claude call + price filtering
    ├── useSpeechRecognition.js Wraps Web Speech API with start/stop/transcript
    ├── useKeyboardShortcuts.js Global keyboard bindings
    └── useSoundEffects.js      Optional mic start/stop audio cues
```

---

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Set up your API key

Copy the example env file:

```sh
cp .env.example .env
```

Open `.env` and paste your Anthropic API key:

```env
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...
```

> Get your key from [console.anthropic.com](https://console.anthropic.com/).
> `.env` is listed in `.gitignore` — it will never be committed. Only `.env.example` (no real key) should be committed.

### 3. Start the dev server

```sh
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_ANTHROPIC_API_KEY` | Yes | Your Anthropic API key. Must be prefixed with `VITE_` for Vite to expose it to browser code. |

> **Security warning:** Because this app calls the Anthropic API directly from the browser, the API key is visible in the network tab and bundled JS. This is acceptable for local development only. For any public deployment, proxy the API call through a backend server and keep the key server-side.

---

## Claude API Integration

| Detail | Value |
|---|---|
| Endpoint | `https://api.anthropic.com/v1/messages` |
| Model | `claude-sonnet-4-6` |
| Input | Full product list (id, title, price, category) + user query |
| Output | `[{ "id": number, "reason": "one sentence" }, ...]` |
| Max tokens | `1000` |
| Browser header | `anthropic-dangerous-direct-browser-access: true` |

Claude is instructed via a system prompt to return **only a valid JSON array** — no markdown, no explanation. The response is extracted with a regex (`/\[[\s\S]*\]/`) to handle any stray text, then `JSON.parse`d.

---

## Price Filter Logic

Natural language price constraints are parsed from the raw query string before Claude results are filtered:

| Query phrase | Parsed as |
|---|---|
| `under $80`, `below $80`, `less than $80`, `cheaper than $80`, `no more than $80`, `at most $80` | `maxPrice = 80` |
| `over $50`, `above $50`, `more than $50`, `at least $50` | `minPrice = 50` |

Products returned by Claude that fall outside the price range are removed client-side before being stored in Redux.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl / ⌘ K` | Focus the search input |
| `Space` | Toggle mic (only when not focused inside an input) |
| `Ctrl / ⌘ Enter` | Run search |
| `Esc` | Clear search and blur |
| `Ctrl / ⌘ Backspace` | Clear search |

---

## Voice Support

Voice input uses the browser's built-in [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) — no external service or extra cost.

| Browser | Support |
|---|---|
| Chrome / Edge (desktop) | Full support |
| Safari (macOS / iOS) | Supported |
| Firefox | Not supported |

The voice language can be changed from the dropdown in the UI. The selection is saved to Redux (`searchSlice → language`) and persists across searches.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server at `http://localhost:3000` |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Mic button not visible | Browser doesn't support Web Speech API | Use Chrome or Edge |
| `401 Unauthorized` from Claude | API key missing or wrong | Check `VITE_ANTHROPIC_API_KEY` in `.env` |
| `JSON parse error` | Claude returned unexpected text | Check browser console for raw response; usually a model error |
| No products load | Fake Store API is down | Click retry in the error state, or wait and refresh |
| Search returns nothing | Query too vague or no catalog match | Try a broader term, e.g. `men's clothing` |
