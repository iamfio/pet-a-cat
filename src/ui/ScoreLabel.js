import { formatText } from "../utils/formatText";
import LabelContainer from "./LabelContainer";

export default class ScoreLabel extends LabelContainer {
  constructor(scene, x, y, labelText, score, style) {
    super(scene, x, y, formatText(labelText, score), style);

    this.labelText = labelText;
    this.score = score;
  }

  toString() {
    return formatText(this.labelText, this.score)
  }
}