import { observable } from 'mobx';

class AppState {
  @observable timer = 0;
  @observable showStreet = true;
  @observable simpleRules = true;

  constructor() {
    setInterval(() => {
      this.timer += 1;
    }, 5000);
  }

  resetTimer() {
    this.timer = 0;
  }
}

export default AppState;
