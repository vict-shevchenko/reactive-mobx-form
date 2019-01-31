## ReactiveForm

Or any way you name it. Your decorated form that is produced via applying `reactiveMobxForm` HOC over your React From Component (calling `reactiveMobxForm` function).


```javascript
// form.jsx
class Form extends React.Component {
  render() { 
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
       <ReactiveForm 
        onSubmit={yourOnSummitFunction}
        schema={{ fieldName:'fieldInitialValue' }}
        keepState={true}
      />
      </div>
    );
  }
}

```

`ReactiveForm` can accept any amount of properties, that will be transparently passed to your form component. Except this properties:
- onSubmit
- schema

### onSubmit
A function that will be called when form is submitted. Is called with first parameter `form.values` object. And rest parameters that may be optionally passed to `props.submit` function inside your form. This callback is executed **asynchronously** as a part of `reactiveMobXForm` submission mechanism. `form.isSubmitting` flag is raised.

And can return:
- value, meaning submission is successful
- Promise for asynchronous submit. Reject - raises `form.submitError` flag.

### schema [optional] 
The place where you can define fields initial values and validation rules during render stage.
Please see [reactiveMobxForm() page](/reactive-mobx-form/#/api/reactiveMobxForm) page for syntax.

### keepState [optional] 
Parameter defines if form should be removed from formStore when it was unmounted. This may be useful if you want to preserve form state when routing of application changes.
Note: form is fetched from store in same state as it was before `Form` Component was unmounted. Any changes to Form parameters like `onSubmit` or `schema` will be ignored.
Defaults to `false` - meaning form are removed from store when they are unmounted. *Do not forget to manually call `destroy` function from form component, if you do not need a form any more. For example after submission*



