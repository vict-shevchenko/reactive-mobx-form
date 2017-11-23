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

**`submit` : function**
Function to execute when form needs to be submitted. Will call **`onSubmit`** passed to **`ReactiveForm`** component.

**`reset` : function**
Function to return form to initial state. Input fiels are returned to their initial values. Control Arrays are returned to initial amount if were added.

**`submitting` : boolean**
Flag that is raised when form is submitting, useful if your submission function is async

**`submitError` : any**
If your `onSumit` function returned an rejected promise, the value with what it was rejected will be pushed to `submitError` property

**`valid` : boolean**
Flag that represents the validity of the form. **`true`** if all field are valid, **`false`** if any field is invalid

**`dirty` : boolean**
**`true`** when any field of form was changed, so its value is different from its initial value
