import { reaction, IObservableArray } from 'mobx';

function swap(arr: any[], from: number, to: number) {
  arr.splice(from, 1, arr.splice(to, 1, arr[from])[0]);
}

export default class ProxyFieldArray {
	public forEach: any;
	public clear: any;
	private insertionCounter: number = 0;

	constructor(public observableArray: IObservableArray<string>, public fieldArraySubFields: any) {
		Object.setPrototypeOf(this, ProxyFieldArray.prototype);

		this.add     = this.add.bind(this);
		this.insert  = this.insert.bind(this);
		this.remove  = this.remove.bind(this);
		this.forEach = this.observableArray.forEach.bind(this.observableArray);
		this.clear   = this.observableArray.clear.bind(this.observableArray);

		reaction(() => (this.fieldArraySubFields.length === 0), data => {
			// in case fieldArray.subfields became empty (form reset, or all items were removed)
			if (data === true) {
				if (this.observableArray.length !== 0) { // fieldProxy items exist -> form was resetted, clean up ui
					this.observableArray.clear();
				}
			}
		});
	}

	public add(): void {
		this.observableArray.push(this.insertionCounter.toString());
		this.insertionCounter = this.insertionCounter + 1;
	}

	public insert(index: number): void {
		this.fieldArraySubFields.splice(index, 0, undefined); // prepare a gap for inserting
		this.observableArray.splice(index, 0, this.insertionCounter.toString());
		this.insertionCounter = this.insertionCounter + 1;
	}

	public remove(index: number): void {
		this.observableArray.splice(index, 1);
	}

	public swap(fromIndex: number, toIndex: number): void {
		// tslint:disable-next-line:max-line-length
		swap(this.fieldArraySubFields, fromIndex, toIndex);
		swap(this.observableArray, fromIndex, toIndex);
	}

	public map(callback) {
		return this.observableArray.map((item, index) =>
			callback(item, index, this)
		);
	}
}
