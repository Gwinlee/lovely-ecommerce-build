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

## Interaction presentation
- Keep storefront motion in the shared CSS interaction layer and reuse the existing Button and icon components; this preserves business logic and avoids extra runtime dependencies.
- Gate hover/tilt effects to fine pointers and suppress motion under prefers-reduced-motion; this keeps touch and accessibility behavior predictable.
