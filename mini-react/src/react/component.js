import { renderComponent } from '../utils/render';

export class Component {
  constuctor(props = {}) {
    this.isReactComponent = true;

    this.state = {};
    this.props = props;
  }

  setState(stateChange) {
    Object.assign(this.state, stateChange);
    renderComponent(this);
  }
}

export default Component;
