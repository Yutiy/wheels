import { watchEffect } from './reactivity/index.js';
import { mountElement, diff } from './renderer.js';

export function createApp(rootComponent) {
  const app = {
    mount(rootContainer) {
      const setupResult = rootComponent.setup();
      let isMount = false;
      let prevSubTree;

      watchEffect(() => {
        if (!isMount) {
          isMount = true;
          const subTree = rootComponent.render(setupResult);
          prevSubTree = subTree;
          mountElement(subTree, rootContainer);
        } else {
          const subTree = rootComponent.render(setupResult);
          diff(prevSubTree, subTree);
          prevSubTree = subTree;
        }
      })
    }
  }

  return app;
}