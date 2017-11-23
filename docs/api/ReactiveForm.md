## ReactiveForm

Or any way you name it. Your decorated form that is produced via calling `reactiveMobxForm` function.


```javascript
// form.jsx
class Form extends React.Component {
  render() {

	// this.props.someMyProp  - defined here
    
    return (
      <form onSubmit={submit}>
       ...
      </form>
    );
  }
}

const ReactiveForm = reactiveMobxForm('myForm')(Form); 

export default ReactiveForm;
```

```javascript
// page.jsx

import ReactiveForm from './form.jsx'

class Page extends React.Component {
  render() {
    
    return (
      <div>
       <ReactiveForm someMyProp={someMyValue}/>
      </div>
    );
  }
}

```

`ReactiveForm` can accept any amount of properties, that will be transparently passed to your form component. Except two properties:
- onSubmit
- schema

### onSubmit
A function that will be called when form is submitted. Is called with one parameter `form.values` object. This callback is executed **asynchronously** as a part of `reactiveMobXForm` submission mechanism. `form.isSubmitting` flag is raised.

And can return:
- value, meaning submissin is successfull
- Promise. Resolve cases reset of Form(drop all fiels to initial values). Reject - raises `form.submitError` flag and no reset of Form happens.

### schema
The place where you can define fields initial values and validation rules during render stage.
Please see [reactiveMobxForm() page](/reactive-mobx-form/#/api/reactiveMobxForm) page for syntax.