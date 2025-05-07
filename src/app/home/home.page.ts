import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import * as Phaser from 'phaser';
import { Menu } from './scenes/Menu';
import { Battle } from './scenes/Battle';
import { Score } from './scenes/Score';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent],
})
export class HomePage {
  game?: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      width: innerWidth,
      height: innerHeight,
      parent: 'game',
      scene: [Menu, Battle, Score],
      dom: {
        createContainer: true
      },
    }
  }

  ngOnInit() {
    this.game = new Phaser.Game(this.config);
  }
}
