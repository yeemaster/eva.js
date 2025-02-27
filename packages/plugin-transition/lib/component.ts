import Animation from './animation';
import { Component } from '@eva/eva.js';
import { Group } from '@tweenjs/tween.js';

interface AnimationStruct {
  name: string;
  component: Component;
  values: {
    time: number;
    value: number;
    tween?: string;
  }[];
}

export default class Transition extends Component {
  static componentName: string = 'Transition';

  private animations: Record<string, Animation> = {};

  tweenGroup: Group;
  group: Record<string, AnimationStruct[]> = {};

  init({ group } = { group: {} }) {
    this.group = group;
    this.tweenGroup = new Group();
  }

  awake() {
    for (const name in this.group) {
      this.newAnimation(name);
    }
  }

  play(name: string, iteration: number) {
    if (!name) {
      name = Object.keys(this.group)[0];
    }
    if (name && !this.animations[name] && this.group[name]) {
      this.newAnimation(name);
    }
    if (name && this.animations[name]) {
      this.animations[name].play(iteration);
    }
  }

  stop(name) {
    if (!name) {
      for (const key in this.animations) {
        this.animations[key].stop();
      }
    } else {
      this.animations[name].stop();
    }
  }

  onPause() {
    for (const key in this.animations) {
      this.animations[key].pause();
    }
  }

  onResume() {
    for (const key in this.animations) {
      this.animations[key].resume();
    }
  }

  onDestroy() {
    for (const key in this.animations) {
      this.animations[key].destroy();
    }
    this.tweenGroup.removeAll();
    this.tweenGroup = null;
    this.group = null;
    this.animations = null;
    this.removeAllListeners();
  }

  update() {
    this.tweenGroup.update();
  }

  newAnimation(name) {
    const animation = new Animation(this.group[name], this.tweenGroup);
    animation.on('finish', () => this.emit('finish', name));
    this.animations[name] = animation;
  }
}
