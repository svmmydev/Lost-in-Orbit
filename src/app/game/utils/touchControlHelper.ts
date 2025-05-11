
export function createTouchButton(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    imageKey: string,
    imageOptions: {
        scale: number,
        origin: [number, number],
        offsetX?: number,
        offsetY?: number,
        alpha: number,
        flipX?: boolean,
        rotation?: number,
    },
    onDown: () => void,
    onUp: () => void
) {
    const btn = scene.add.rectangle(x, y, width, height)
        .setScrollFactor(0)
        .setInteractive()
        .setAlpha(0.1)
        .setOrigin(imageOptions.origin[0], imageOptions.origin[1]);

    const img = scene.add.image(x - (imageOptions.offsetX ?? 0), y - (imageOptions.offsetY ?? 0), imageKey)
        .setScrollFactor(0)
        .setAlpha(imageOptions.alpha)
        .setOrigin(imageOptions.origin[0], imageOptions.origin[1])
        .setScale(imageOptions.scale);

    if (imageOptions.flipX) img.setFlipX(true);
    if (imageOptions.rotation !== undefined) img.setRotation(imageOptions.rotation);

    btn.on('pointerdown', onDown);
    btn.on('pointerup', onUp);
    btn.on('pointerout', onUp);

    return img;
}