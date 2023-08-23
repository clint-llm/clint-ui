# Clint UI

This is the web UI for the [Clint LLM project](https://github.com/clint-llm).
Check out the [live project](https://clint-llm.github.io).

The UI is written in TypeScript and uses React and tailwindcss.

## Development

### Environment

- You will need node and npm for package management
  - <https://github.com/nvm-sh/nvm>
  - `nvm install node`

### Package structure

- The various configurations in the root are managed by Vite and tailwind.
- `main.tsx` defines the root React component.
- `index.css` imports the tailwindcss styles and defines a few standard styles.
  - The CSS sources are processed by the tailwindcss plugin during building
- `App.tsx` contains the single page application view.
- The components used in app are stored alongside `App.tsx`.
- Each component module also exports an interface for the component props.
- The entire component tree is built in `App` using the properties interfaces.

### Initial build setup

The project was initialized with the following commands (included for documentation):

- Vite for building the project: 
  - <https://www.npmjs.com/package/vite-plugin-wasm>
  - `npm create vite@latest clint-ui -- --template react-ts`
- tailwindcss framework for styling the UI:
  - <https://tailwindcss.com/docs/guides/vite>
  - `npm install -D tailwindcss postcss autoprefixer`
  - `npx tailwindcss init -p`

### Commands

To build the app: `npm run build`.

To run the local development server: `npm run dev`.
Then go to <http://localhost:5173>.

To format the source code: `npm run fmt`.
