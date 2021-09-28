import { makeObservable, observable } from 'mobx';

export default class AppState {
    @observable timer = 0;
    @observable showStreet = true;
    @observable simpleRules = true;

    constructor() {
        makeObservable(this);
        // setInterval(() => {
        //     this.timer += 1;
        // }, 5000);
    }
}