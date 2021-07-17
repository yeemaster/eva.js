import EventEmitter from 'eventemitter3';
import GameObject from './GameObject';

/** frame info pass to `Component.update` method */
export interface UpdateParams {
  /** delta time from last frame */
  deltaTime: number;

  /** frame count since game begining */
  frameCount: number;

  /** current timestamp */
  time: number;

  /** fps at current frame */
  fps: number;

  /** current time from game start */
  currentTime: number;
}

/** type of Component is function */
export type ComponentType = typeof Component;

/**
 * Get component name from component instance or Component class
 * @param component - component instance or Component class
 * @returns component' name
 * @example
 * ```typescript
 * import { Transform } from 'eva.js'
 *
 * assert(getComponentName(Transform) === 'Transform')
 * assert(getComponentName(new Transform()) === 'Transform')
 * ```
 */
export function getComponentName(
  component
): string {
  if (component instanceof Component) {
    return component.name;
  } else if (component instanceof Function) {
    return component.componentName;
  }
}

/**
 * Component contain raw data apply to gameObject and how it interacts with the world
 * @public
 */
class Component<Type> extends EventEmitter {
  /** Name of this component */
  static componentName: string;

  /** Name of this component */
  public readonly name: string;

  /**
   * Represents the status of the component, If component has started, the value is true
   * @defaultValue false
   */
  started: boolean = false;

  /**
   * gameObject which this component had added on
   * @remarks
   * Component can only be added on one gameObject, otherwise an error will be thrown,
   * see {@link https://eva.js.org/#/tutorials/gameObject} for more details
   */
  gameObject: GameObject;

  /** Default paramaters for this component */
  __componentDefaultParams: Type;

  constructor(params?: Type) {
    super();
    // @ts-ignore
    this.name = this.constructor.componentName;
    this.__componentDefaultParams = params;
  }

  /**
   * Called during component construction
   * @param params - optional initial parameters
   * @override
   */
  init?(params?: Type): void;

  /**
   * Called when component is added to a gameObject
   * @override
   */
  awake?(): void;

  /**
   * Called after all component's `awake` method has been called
   * @override
   */
  start?(): void;

  /**
   * Called in every tick, change self property or other component property
   * @param frame - frame info about this tick
   * @override
   */
  update?(frame: UpdateParams): void;

  /**
   * Called after all gameObject's `update` method has been called
   * @param frame - frame info about this tick
   * @override
   */
  lateUpdate?(frame: UpdateParams): void;

  /**
   * Called before game runing or every time game paused
   * @virtual
   * @override
   */
  onResume?(): void;

  /**
   * Called while the game paused.
   * @override
   */
  onPause?(): void;

  /**
   * Called while component be destroyed.
   * @override
   */
  onDestroy?(): void;
}

export default Component;
