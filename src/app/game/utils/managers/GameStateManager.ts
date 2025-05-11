import { Scene } from 'phaser';
import { Battle } from '../../scenes/Battle';

export class SceneHelpers {
    /**
     * Stops the battle scene and its music.
     * Calls its `shutdown` method if defined.
     * 
     * @param scene The current scene from which to access and stop the battle.
     */
    static shutdownBattle(scene: Scene): void {
        const battleScene = scene.scene.get('battle') as Battle;
        battleScene.shutdown?.();
        scene.scene.stop('battle');
        battleScene.music?.stop();
    }

    /**
     * Restarts the battle scene with the same player name.
     * Stops the current battle scene cleanly and starts a new instance.
     * 
     * @param scene The current scene requesting a restart.
     */
    static restartBattle(scene: Scene): void {
        const battleScene = scene.scene.get('battle') as Battle;
        const playerName = battleScene.playerName;
        this.shutdownBattle(scene);
        scene.scene.start('battle', { playerName });
    }
    
    /**
     * Stops the current battle and navigates back to the main menu scene.
     * 
     * @param scene The current scene requesting the transition to menu.
     */
    static stopToMenu(scene: Scene): void {
        this.shutdownBattle(scene);
        scene.scene.start('menu');
    }
}
