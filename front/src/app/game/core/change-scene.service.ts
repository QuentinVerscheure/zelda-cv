import { Injectable, Injector } from '@angular/core';

import { LandingCoordinates } from '../../models/landingCoordinates.model';
import { Router, NavigationEnd } from '@angular/router';
import { distinctUntilChanged, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChangeSceneService {
  private readonly urlToSceneMap: { [key: string]: string } = {
    cv: 'sceneCV',
    portfolio: 'scenePortfolio1',
    link: 'sceneLink',
    contact: 'sceneContact',
    guestbook: 'sceneGuestBook2',
    various: 'sceneVarious',
    credit: 'sceneCredit',
    world: 'sceneWorld',
  };

  constructor(private router: Router) {}

  // change scene from a transition collision box inside a scene and not url change because I need coordinate data to land the
  // player at the right position and I don't want to use url because user will try to offband the game (silly user :)
  changeSceneFromCollisionBox(
    scenePlugin: Phaser.Scenes.ScenePlugin,
    sceneToLoad: string = 'sceneWorld',
    data?: LandingCoordinates
  ): void {
    scenePlugin.start(sceneToLoad, data);
  }

  registerSceneRoutingListener(sceneManager: Phaser.Scenes.SceneManager): void {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map((e) => e.urlAfterRedirects || e.url),
        filter((url) => url.startsWith('/game')),
        map((url) => {
          const parts = url.split('/').filter(Boolean); // ["game", "cv"]
          const sceneKeyFromUrl = parts.length > 1 ? parts[1] : 'world';
          return this.urlToSceneMap[sceneKeyFromUrl] || 'sceneWorld';
        }),
        distinctUntilChanged() // only proceed if the scene to load has changed
      )
      .subscribe(() => {
        this.changeScene(sceneManager);
      });
  }

  changeScene(sceneManager: Phaser.Scenes.SceneManager): void {
    const url = this.router.url;

    // extract the scene key from the URL
    const parts = url.split('/').filter(Boolean);
    const sceneKey = parts.length > 1 ? parts[1] : 'world';
    const sceneToLoad = this.urlToSceneMap[sceneKey] || 'sceneWorld';

    // Stop all active scenes
    sceneManager.getScenes(true).forEach((scene: Phaser.Scene) => {
      const key = scene.sys.settings.key;
      sceneManager.stop(key);
    });
    sceneManager.start(sceneToLoad);
  }
}
