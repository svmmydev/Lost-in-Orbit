import * as Phaser from 'phaser';

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

export function scrollBackground(bg: Phaser.GameObjects.TileSprite, speed = 1) {
  bg.tilePositionY -= speed;
}