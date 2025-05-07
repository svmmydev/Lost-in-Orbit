import { Component, OnInit } from '@angular/core';
import { Menu } from './scenes/Menu';
import { Battle } from './scenes/Battle';
import { Score } from './scenes/Score';
import { Pause } from './scenes/Pause';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  standalone: true,
})
export class GameComponent  implements OnInit {
  game!: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      width: innerWidth,
      height: innerHeight,
      parent: 'game',
      scene: [Battle, Menu, Score, Pause],
      dom: {
        createContainer: true
      },
      physics: {
      default: 'arcade',
      arcade: { gravity: { x: 0, y: 0 }, debug: false }
      }
    }
  }

  ngOnInit() {
    if (!this.game) {
      this.game = new Phaser.Game(this.config);
    }
  }

  ngOnDestroy() {
    if (this.game) {
      this.game.destroy(true);
    }
  }
}
