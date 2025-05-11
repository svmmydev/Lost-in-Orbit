import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class GameComponent implements OnInit, OnDestroy {
    game!: Phaser.Game;

    ngOnInit() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: width,
            height: height,
            parent: 'game',
            backgroundColor: '#000',
            scene: [ Menu, Battle, Pause, Score],
            scale: {
                mode: Phaser.Scale.NONE,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            input: {
                activePointers: 3,
                touch: {
                target: window,
                }
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x:0, y: 0 },
                    debug: false
                }
            },
            render: {
                pixelArt: true,
                antialias: true,
                roundPixels: false,
                clearBeforeRender: true
            },
            dom: {
                createContainer: true
            }
        };

        this.game = new Phaser.Game(config);
    }

    ngOnDestroy() {
        if (this.game) {
            this.game.destroy(true);
        }
    }
}
