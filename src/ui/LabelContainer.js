import { formatText } from "../utils/formatText";
import Phaser from "phaser";
// import GameTextLabel from "./GameTextLabel";


export default class LabelContainer extends Phaser.GameObjects.Text {
  constructor(scene, x, y, labelText, value, style) {
    super(scene, x, y, formatText(labelText, value), style);

    this.labelText = labelText
    this.value = value;
  }

  setScore(score) {
    this.value = score;
    this.#updateScoreText()
  }

  add(points) {
    this.setScore(this.value + points)
  }

  #updateScoreText() {
    this.setText(formatText(this.labelText, this.value))
  }
}
