## props

List of **`props`** that **`reactive-mobx-prom`** passes in to your form component.

```javascript
// form.jsx
class Form extends React.Component {
  render() {

	// this.props 
	
    return (
		<form onSubmit={this.props.submit}>
		  {this.props.submitting ? 'Please wait, form is submitting' : ''}
		  {this.props.submitError ? this.props.submitError.message : ''} 
		 ...
		  <button type="button" onClick={this.props.reset}>Clear Form</button>
		  <button type="submit" disabled={this.props.valid && this.props.dirty}>Submit Form</button>
      </form>
    );
  }
}

const ReactiveForm = reactiveMobxForm('myForm')(Form); 

export default ReactiveForm;
```

**`submit(Event[, parameters])` : function**
Function to execute when form needs to be submitted. Will asynchronously call **`onSubmit`** passed to **`ReactiveForm`** component.
Accept 1 obligatory parameter `Event`. That is automatically passed as React Synthetic Event when you call it form `form` `onSubmit` method, like `<form onSubmit={this.props.submit}>`;
In case you have your custom `onSubmit` handler - follow such pattern
```javascript
class ContactForm extends Component {
    myCustomSubmit(event) {
        // event is bypassed
        this.props.submit(event, {p: 'My additional parameter to submit function'}).then(
          (result) => {
            console.log(`Result: ${result}`);
            this.form.reset();
          }, 
          (error) => console.log(`Error: ${error}`));
        );
    }

    render() {
        const { submit, reset, submitting, submitError, valid, dirty } = this.props;
        return (
            <form onSubmit={this.myCustomSubmit.bind(this)}>
...
```

Optional parameters that you pass to submit function after event will be transparently passed to you submit callback.

**`reset` : function**
Function to return form to initial state. Input fields are returned to their initial values. Control Arrays are returned to initial amount if were added.

**`destroy` : function**
Function to manually unregister form in `formStore`.

**`submitting` : boolean**
Flag that is raised when form is submitting, useful if your submission function is async

**`submitError` : any**
If your `onSubmit` function returned an rejected promise, the value with what it was rejected will be pushed to `submitError` property

**`valid` : boolean**
Flag that represents the validity of the form. **`true`** if all field are valid, **`false`** if any field is invalid

**`dirty` : boolean**
**`true`** when any field of form was changed, so its value is different from its initial value

**`step` : number, `next` : function, `previous`: function**
Properties to work with multi step forms, see [examples](https://vict-shevchenko.github.io/reactive-mobx-form/#/examples/multi-step/MultiStep) for more details

Any other optional properties that you pass to your ReactiveMobxForm will be transparently passed into Form Component
