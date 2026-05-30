# Portfolio Roadmap

## Project Hub
- Create a dedicated project subdomain with a blog-like grid of expandable project cards.
- Add a real `View more` destination from the homepage carousel to that project hub.
- Attach per-project writeups with screenshots, stack notes, outcomes, and architecture details.

## Chatbot
- Add a lightweight portfolio chatbot that can answer questions about projects, experience, and stack.
- Decide whether answers should be static/embedded or backed by a real API.
- Add safety rails so it never invents experience or project details.

## Hidden Counters
- If the rickroll counter needs to be shared across visitors, move it off local storage and into a durable backend such as Redis, Postgres, or a hosted KV.
- Keep the homepage behavior the same: only reveal the count after the click.

## Placeholder Pages
- Design an `under construction` page.
- Design an `under maintenance` page.
- Design error states for `404`, `500`, and generic fallback UI.
- Keep these pages visually consistent with the main portfolio palette and motion language.

## Loader and Cold Start UX
- Revisit the first-load multi-step loader once deployment behavior is known.
- Only keep it if cold starts are real in production.
- Add a more deployment-aware loading check if the host platform actually needs it.

## Project Card Follow-up
- Add real repository links for each card instead of the current GitHub-profile fallback.
- Replace SVG preview art with polished screenshots or device mockups.
- Consider tags and filters once the project hub exists.
