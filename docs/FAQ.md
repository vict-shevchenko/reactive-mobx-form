#FAQ

### Why another library for forms

### Inspirations
1. Redux form
2. Angular 2 reactive forms
3. Pain

### How form submition is happening. 
When you call `submit` function form `props` passed to your form - submition is started. Your `submit` function (those you have passed into `onSubmit` parameter) will be called inside of promise(so it may be async). If your `submit` function returns a `resolved Promise` - `form.reset` will be called to drop form state to initial one. If your `submit` function returns `rejectedPromise` than `form.submitionError` flag is raised and form keeps its state untouched.

### I have an `input type="hidden"` and want to set its value after form was initialized. 
You should probably use a `ComputedControl` component. Check it example [here](/reactive-mobx-form/#/examples/computed-control/ComputedControl)

### I need my controls to have initial values when they appear back in DOM.
Reactive Mobx Form main idea is that what is in DOM is in form values. In real life there are situations where some part of form appear or disappear based on certain circumstances. To handle such cases and not to loose data, control state is kept for all controls in form, so in scenarios like appear -> change -> disappear -> appear control will have its last changed value (not initial one). If you need to reset control state to have initial value on each appear you may consider writing such HOC:

```javascript
function resetOnDidMount(Component) {
  return class ResetControlOnDidMount extends React.Component {
    componentDidMount() {
      this.props.meta.reset();
    }

    render() {
      return (typeof Component === 'function') ? <Component {...this.props} /> : <Component {...this.props.input} />
    }
  }
}

const InputWithReset = resetOnDidMount('input');
// or
const MyControlWithReset = resetOnDidMount(MyControl)

// and use it like:
<Control type="text" component={InputWithReset} name="name"/>
```

## How form submission is happening. 
When you call `props.submit` function that is passed into your form - submission is started. Inside it calls your `submit` function (those you have passed into `onSubmit` parameter) inside of promise(so it may be async).
props.submit` is also async function, that returns a promise, so you can add any required callbacks in `.then` and `.catch` methods.
If your `onSubmit` function returns a `resolved Promise` - `result will be passed to `props.submit.then` method. 
If your `onSubmit` function returns `rejectedPromise` than `form.submitionError` flag is raised and error will be passed to `props.submit.catch` method. 
