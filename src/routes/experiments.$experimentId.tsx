import { createFileRoute, notFound, Link } from '@tanstack/react-router';
import { experiments, pageMeta } from '@/lib/portal-data';
import { LabPage } from '@/components/portal/LabPage';
import { Button } from '@/components/ui/button';
export const Route = createFileRoute('/experiments/$experimentId')({
  loader: ({ params }) => { const experiment = experiments.find(e => e.id === params.experimentId); if (!experiment) throw notFound(); return experiment; },
  head: ({ loaderData }) => pageMeta(loaderData ? `${loaderData.title} — MBU Data Science Lab` : 'Experiment not found — MBU', loaderData?.aim ?? 'The requested MBU Data Science experiment is unavailable.'),
  component: ExperimentRoute,
  notFoundComponent: () => <div className="portal-container py-24"><h1 className="text-3xl">Experiment not found</h1><Button asChild className="mt-6"><Link to="/" hash="experiments">All experiments</Link></Button></div>,
});
function ExperimentRoute() { return <LabPage experiment={Route.useLoaderData()} />; }
