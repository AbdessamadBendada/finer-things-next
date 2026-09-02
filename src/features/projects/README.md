# projects

The `/projects` index and the two project stories.

The index is the gallery: a wall of photographs driven by
`content/wall.content.ts`, with `ProjectsShell` as its client boundary for the
scroll reveal. The editorial index it replaced was deleted once the gallery was
approved; it is in git history if it is ever wanted back.

The stories are one template with different art direction — 54 of 63 CSS rules
were identical — so `styles/project-story.module.css` holds the template and
each story's module holds its own rhythm. `useProjectStoryMotion` takes the
drift constants that differ between Dubai and Osaka.

`model/project.registry.ts` maps a slug to its component plus route metadata,
so adding a project is one entry and one component; the route file never
changes.
