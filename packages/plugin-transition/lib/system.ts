import {System, UpdateParams} from '@eva/eva.js';
import TWEEN from '@tweenjs/tween.js';

export default class TransitionSystem extends System {
  static systemName = 'transition';
  readonly name = 'transition';

  update(e: UpdateParams) {
    console.log(e.currentTime)
    TWEEN.update(e.currentTime);
  }
  // onPause(){

  // }
  // remove all active tweens
  onDestroy() {
    TWEEN.removeAll();
  }
}
