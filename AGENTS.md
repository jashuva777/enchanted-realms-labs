<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the portal home as a single scrolling route and experiments as dedicated dynamic lab routes, because sections belong to one learning portal while labs need shareable URLs.
- Load the React Three Fiber scene lazily on the client and read scene colours from CSS tokens, because WebGL must not run during SSR and visual theming must remain centralized.
- Execute Python in a terminable browser worker using Pyodide, because student code must not freeze the page or require a server.
- Prepare each lab run in an isolated browser filesystem with supplied assets and capture plots through Matplotlib's Agg backend, because edited file operations and charts must work without server execution.
- Keep syllabus topic content in a shared data module and serve PDF notes through asset pointers, because the page reader and downloadable resources need consistent module mappings.
- Keep document-based experiment variants in browser-safe catalog modules with self-contained prerequisites, because selecting a part or rerunning edited code must not depend on a previous run's filesystem.
