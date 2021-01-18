import { enqueueSetState } from './setState';

export class Component {
  constuctor(props = {}) {
    this.state = {};
    this.props = props;
  }

  setState(stateChange) {
    enqueueSetState(stateChange, this);
  }

  forceUpdate() {
    renderComponent(this, true)
  }
}

export default Component;
