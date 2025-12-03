import { Routes } from '@angular/router';
import { CoreComponent } from './game/core/core.component';

export const routes: Routes = [
  { path: '', redirectTo: 'game/world', pathMatch: 'full' },
  { path: 'game/:scene', component: CoreComponent, data: { scene: 'sceneWorld' } },
  { path: '**', redirectTo: 'game' },
];

export class AppRoutingModule {}
