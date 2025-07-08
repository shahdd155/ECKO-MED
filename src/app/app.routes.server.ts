import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'scans/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'labtests/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'prescriptions/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
