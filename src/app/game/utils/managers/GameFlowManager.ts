import Phaser from 'phaser';
import { Player } from '../../models/player/player';
import { ExplosionManager } from './ExplosionManager';

/**
 * Configuration options required to handle end-of-game logic.
 */
type EndGameOptions = {
    player: Player;
    music: Phaser.Sound.BaseSound;
    scene: Phaser.Scene;
    explosionManager: ExplosionManager;
    pauseButton: Phaser.GameObjects.DOMElement;
    hideTouchUI: () => void;
    getScore: () => number;
    playerName: string;
};

export class GameFlowManager {
    private options: EndGameOptions;

    /**
     * Creates a new GameFlowManager instance.
     * @param options Configuration needed to control game over flow.
     */
    constructor(options: EndGameOptions) {
        this.options = options;
    }

    /**
     * Ends the current game session.
     * Stops music, plays explosion effects, hides UI,
     * and transitions to the score scene after a short delay.
     */
    endGame() {
        const {
            player,
            music,
            scene,
            explosionManager,
            pauseButton,
            hideTouchUI,
            getScore,
            playerName
        } = this.options;

        player.setVelocityY(-45);
        player.setAngularVelocity(10);
        music.stop();
        explosionManager.spawnRafagas();
        pauseButton.setVisible(false);
        hideTouchUI();

        scene.time.delayedCall(3600, () => {
            music.stop();
            scene.scene.stop();
            scene.scene.start('score', {
                score: getScore(),
                playerName
            });
        });
    }
}
