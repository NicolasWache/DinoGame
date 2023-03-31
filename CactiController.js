import Cactus from "./Cactus.js";

export default class CactiController {

  // Intervalle d'apparition des cactus (compris entre 200ms et 500ms)
  CACTUS_INTERVAL_MIN = 500;
  CACTUS_INTERVAL_MAX = 2000;

  nextCactusInterval = null;
  cacti = [];

  /* Constructeur qui va servir à faire défiler les cactus à l'écran.*/
  constructor(ctx, cactiImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.cactiImages = cactiImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextCactusTime();
  }

  setNextCactusTime() {
    const num = this.getRandomNumber(
      this.CACTUS_INTERVAL_MIN,
      this.CACTUS_INTERVAL_MAX
    );/* Fonction qui génère un random entre les deux valeurs indiquées par les constantes min/max */

    this.nextCactusInterval = num;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createCactus() {// fonction qui va générer un cactus aléatoirement à l'écran (avec un délai aléatoire)
    const index = this.getRandomNumber(0, this.cactiImages.length - 1);
    const cactusImage = this.cactiImages[index];
    const x = this.canvas.width * 1.5;//Les cactus seront générés avant leur apparition à l'écran (ils apparaissent à droite)
    const y = this.canvas.height - cactusImage.height;// dimension de l'écran - taille de l'image de cactus
    const cactus = new Cactus(
      this.ctx,
      x,
      y,
      cactusImage.width,
      cactusImage.height,
      cactusImage.image
    );

    this.cacti.push(cactus);
  }

  update(gameSpeed, frameTimeDelta) {
    if (this.nextCactusInterval <= 0) {
      this.createCactus();
      this.setNextCactusTime();
    }
    this.nextCactusInterval -= frameTimeDelta;

    this.cacti.forEach((cactus) => {
      cactus.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
    });

    //test pour voir si des cactus sont bien générés.
    this.cacti = this.cacti.filter((cactus) => cactus.x > -cactus.width);
  }

  //choix du cactus qui va apparaître
  draw() {
    this.cacti.forEach((cactus) => cactus.draw());
  }

  collideWith(sprite) {
    return this.cacti.some((cactus) => cactus.collideWith(sprite));
  }

  reset() {
    this.cacti = [];
  }
}
