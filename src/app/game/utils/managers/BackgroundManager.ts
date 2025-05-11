import * as Phaser from 'phaser';

/**
 * Creates a tileable background that fills the entire scene.
 * Automatically scales to match scene width.
 * 
 * @param scene The Phaser scene where the background is added.
 * @param key The texture key for the background image (default is 'background').
 * @returns A tile sprite that can be scrolled.
 */
export function createBackground(scene: Phaser.Scene, key = 'background') {
    const texture = scene.textures.get(key);

    const bg = scene.add.tileSprite(
        0,
        0,
        scene.scale.width,
        scene.scale.height,
        key
    ).setOrigin(0);

    if (texture && texture.key !== '__MISSING') {
        const imgWidth = texture.getSourceImage().width;
        const scaleX = scene.scale.width / imgWidth;
        bg.tileScaleX = scaleX;
    }

    return bg;
}

/**
 * Scrolls the tileable background vertically.
 * 
 * @param bg The tile sprite to scroll.
 * @param speed The amount of vertical scroll per frame (default is 1).
 */
export function scrollBackground(bg: Phaser.GameObjects.TileSprite, speed = 1) {
    bg.tilePositionY -= speed;
}