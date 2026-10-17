# Project Guidelines: Angular Native Calculator

This repository is an Angular Native mobile application targeting iOS and Android using [Angular Native](https://ng-native.com) on top of React Native's Fabric renderer and Expo.

---

## 1. Project Overview & Tech Stack

- **Framework**: [Angular Native](https://ng-native.com) (`@ng-native/components`, `@ng-native/device`, `@ng-native/fabric`, `@ng-native/metro`, `@ng-native/platform`) v0.15.0
- **Angular Core**: Angular v22 (`@angular/core`, `@angular/common`, `@angular/compiler-cli`)
- **Native Runtime**: React Native 0.86.3 (Fabric renderer), React 19.2.3, Expo 57.0.26 (`expo`, `expo-status-bar`, `expo-system-ui`, `react-native-safe-area-context`)
- **Language & Runtime**: TypeScript 6.0.3, Bun 1.4.3
- **Testing**: Vitest v5 (`@ng-native/testing` in Node against a mock native layer — no simulator required)
- **Bundler**: Metro (`metro.config.js`)
- **Formatting & Style**: Prettier 3.9.10 (`.prettierrc`, `.prettierignore`) and EditorConfig (`.editorconfig`) configured with tabs, tab width 4, and max line length 120

---

## 2. Essential Commands

All commands should prefer `bun`:

| Command                | Description                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| `bun run start`        | Start Metro bundler; press `i` for iOS simulator, `a` for Android emulator, or scan QR with Expo Go |
| `bun run ios`          | Launch iOS simulator                                                                                |
| `bun run android`      | Launch Android emulator                                                                             |
| `bun run test`         | Run Vitest component and unit test suite                                                            |
| `bun run typecheck`    | Run Metro config check and Angular compiler typecheck (`ngc --noEmit`)                              |
| `bun run format`       | Format codebase with Prettier                                                                       |
| `bun run format:check` | Verify code formatting with Prettier without making changes                                         |

---

## 3. Directory Structure

```text
├── .vscode/                 # VS Code workspace settings (Prettier, EditorConfig, rulers) & extensions
├── assets/                  # Mobile icons, splash screen, and graphic assets
├── src/
│   ├── app/
│   │   ├── app.ts           # Root Angular Native component
│   │   └── app.test.ts      # Component test using @ng-native/testing and Vitest
│   └── main.ts              # Native bootstrap mounting Angular on Fabric
├── .editorconfig            # EditorConfig rules (tabs, 4 spaces width, 120 max line length)
├── .gitignore               # Git ignored patterns
├── .prettierignore          # Prettier ignore paths
├── .prettierrc              # Prettier config (useTabs: true, tabWidth: 4, printWidth: 120)
├── AGENTS.md                # Angular Native upstream specification and rules
├── app.json                 # Expo app manifest and configuration
├── bun.lock                 # Bun lockfile
├── metro.config.js          # Metro configuration integrating @ng-native/metro
├── package.json             # Manifest, dependencies, and npm/bun scripts
├── tsconfig.json            # TypeScript configuration
└── vitest.config.mts        # Vitest configuration for Node testing environment
```

---

## 4. Angular Native Architecture & Development Rules

### There is No DOM and No JSX

- This is **not a web app** and **not React**: there is no `document`, `window`, `<button>`, `<div>`, `<span>`, `<a>`, or `<img>`.
- No `@angular/platform-browser` or `@angular/animations`.

### Lowercase Native Elements Only

- All native primitives must be lowercase and explicitly imported from `@ng-native/components`:
  `<view>`, `<text>`, `<pressable>`, `<scroll-view>`, `<text-input>`, `<image>`, `<switch>`, `<safe-area-view>`, `<virtual-list>`, `<modal>`.
- Example:
    ```typescript
    import { Pressable, Text, View } from '@ng-native/components';

    @Component({
    	imports: [Pressable, Text, View],
    	...
    })
    ```
- **Never** use uppercase names like `<View>` (fails the build or renders as unknown empty view).
- Text must be placed inside `<text>` (or `<text pressable (press)="...">`). Text placed directly into a view creates isolated individual paragraphs that do not flow inline.

### Host Layout & Flexbox

- Every Angular component host commits as a native view with **no flex by default**.
- Components that need to expand or fill their parent container must specify `:host { flex: 1; }` or `host: { style: 'flex: 1' }`.
- Layout is flexbox with `flex-direction: column` by default.

### Events & Data Binding

- Use native events:
    - `(press)` on `<pressable>` (never `(click)`).
    - `[(value)]` or `(changeText)` on `<text-input>`.
    - `(scroll)`, `(layout)`.
- **No backticks inside inline templates**: they terminate the template string and produce misleading Angular parser errors.

### Signals, Zoneless & Modern Angular

- State management uses Angular signals (`signal()`, `computed()`, `linkedSignal()`).
- Application runs in zoneless mode (`provideZonelessChangeDetection()` / native engine without `zone.js`).
- Signal forms (`@angular/forms/signals`) are used for inputs: `[formField]` on `<text-input>` and `<switch>`.
- HTTP requests must use `provideNativeHttpClient()` from `@ng-native/platform/http`.
- Routing uses `provideNativeRouter()` from `@ng-native/router` with `<native-stack-outlet />`.

### Styling

- Real CSS in `styles` is compiled at build time.
- Standard React Native style objects work via `[style]="{ padding: 16, backgroundColor: '#fff' }"`.
- Unsupported CSS features (`grid`, `float`, `::before`/`::after`, `:hover`, `:focus-visible`) are dropped with build warnings — lay out with flexbox.

### Testing

- Tests run in Node with Vitest and `@ng-native/testing`:
    - `render(Component)`
    - Query elements via `screen.getByRole`, `screen.getByText`, or `screen.getByTestId`
    - Trigger user interactions via `userEvent.setup().press(...)` or `.type(...)`
- Always verify with `bun run test` and `bun run typecheck`.

---

## 5. Skills & Evidence Policy

- Consult relevant skills in `~/.gemini/config/skills/`:
    - `versioned-code-research/SKILL.md`: for internals, AST, compilers, APIs, and exact version comparisons backed by code.
    - `source-grounded-research/SKILL.md`: for factual research, documentation, and external claims.
    - `evidence-output-audit/SKILL.md`: for auditing outputs, review feedback, or technical explanations against empirical evidence.
- Always verify exact installed versions and run actual checks (`bun run test`, `bun run typecheck`, `bun run format:check`) before asserting correctness.
