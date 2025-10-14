import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { ProjectDetail } from './sections/project-detail/project-detail';  

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'projects/:id', component: ProjectDetail }
];
