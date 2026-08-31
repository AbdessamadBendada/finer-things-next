import { ProjectsPage } from '@/features/projects';
import { ROUTES } from '@/shared/config/routes';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = {
  ...buildMetadata({
    title: 'Projects, editorial version | Luxury Motion Study',
    description: 'The editorial projects index, superseded by the gallery at /projects.',
    path: ROUTES.projectsEditorial,
  }),
  // Superseded, and kept only for comparison: it should never be indexed or
  // reached from search.
  robots: { index: false, follow: false },
};

/**
 * The editorial index that /projects used to be.
 *
 * Retained so the two treatments can be put side by side without checking out
 * an older commit. Not in the menu, not in the sitemap, not indexed.
 */
export default function ProjectsEditorialRoute() {
  return <ProjectsPage />;
}
