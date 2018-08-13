#FAQ

### Why another library for forms

### Inspirations
1. Redux form
2. Angular 2 reactive forms
3. Pain

### How form submition is happening. 
When you call `submit` function form `props` passed to your form - submition is started. Your `submit` function (those you have passed into `onSubmit` parameter) will be called inside of promise(so it may be async). If your `submit` function returns a `resolved Promise` - `form.reset` will be called to drop form state to initial one. If your `submit` function returns `rejectedPromise` than `form.submitionError` flag is raised and form keeps its state untouched.

### I have an `input type="hidden"` and want to set its value after form was initialized. 
The best solution I see here is use native Mobx capabilities. As Mobx is extremely good at deriving things from state.

Lets assume we have Control in our form

```javascript
<Control type="hidden" name="computedProperty" component="input" />
```

You can either update field value manually
```javascript
someOtherFieldOnBlur(event) {
    const value = event.target.value.trim();

    const form = this.props.formStore.getForm('myForm');
    const computedPropertyField = form.findField('computedProperty');
    computedPropertyField.onChange(value);
}
```

Or use `reaction` method from `mobx`

```javascript
componentWillMount() {
        this.disposer = reaction(
            () => this.props.myOtherStore.someComputedValue, // or value may arrive from server
            (someComputedValue) => {
                const form = this.props.formStore.getForm('myForm');
                const computedPropertyField = form.findField('computedProperty');
                computedPropertyField.onChange(someComputedValue);
            },
        );
    }
   // Do not forget to call this.disposer() in componentWillUnmount
```
