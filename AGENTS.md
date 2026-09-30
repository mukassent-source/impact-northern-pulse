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

- Public homepage shows only the full-viewport hero (user request); every portfolio section is its own route (/about, /leadership, /media-development, /youth-empowerment, /projects, /impact, /insights, /gallery, /partnerships, /contact) with achievements rendered on /about; only project detail and admin stay additionally separate.
- Store editable portfolio records in `content_entries` with a `kind` discriminator and separate `user_roles`; public records must be published and editing must be role-gated by database policies.
- Keep contact submissions in a separate private table and validate submissions on both sides because visitors must not read each other's messages.
