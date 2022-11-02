import { formatText } from "../utils/formatText";
import Phaser from "phaser";

export default class LabelContainer extends Phaser.GameObjects.Text {
  constructor(scene, x, y, labelText, value, style) {
    super(scene, x, y, formatText(labelText, value), style);

    this.labelText = labelText
    this.value = value;
  }

  setTextValue(textValue) {
    this.value = textValue;
    this.#updateTextValue()
  }
  
  add(points) {
    this.setTextValue(this.value + points)
  }

  #updateTextValue() {
    this.setText(formatText(this.labelText, this.value))
  }
}
