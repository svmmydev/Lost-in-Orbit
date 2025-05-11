import { Scene } from 'phaser';
import { Battle } from '../scenes/Battle';

export class SceneHelpers {
    static shutdownBattle(scene: Scene): void {
        const battleScene = scene.scene.get('battle') as Battle;
        battleScene.shutdown?.();
        scene.scene.stop('battle');
        battleScene.music?.stop();
    }

    static restartBattle(scene: Scene): void {
        const battleScene = scene.scene.get('battle') as Battle;
        const playerName = battleScene.playerName;
        this.shutdownBattle(scene);
        scene.scene.start('battle', { playerName });
    }
    
    static stopToMenu(scene: Scene): void {
        this.shutdownBattle(scene);
        scene.scene.start('menu');
    }
}
