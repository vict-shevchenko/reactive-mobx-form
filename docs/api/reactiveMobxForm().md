## reactiveMobxForm(name: string [, formDefinition: Object])

High Order Component that is used to create reactiveMobXForm, set its form parameters and register form in FormStore

### Retunrs: 

`function` that accepts one parameter, Form Component - that you would like to decorate with `reactiveMobxForm`

## Usage
```javascript
    import  {reactiveMobxForm } from 'reactive-mobx-form';
	 
	 ...

	 export reactiveMobxForm('myForm')(MyFormComponent);
```


## Parmeters

`reactiveMobxForm` accepts 2 parameters string `name` and `formDefiniton` object.
### Required

`name : String` - The name of your form, which will be used as a key to store your form data in `FormStore`

### Optional

`formDefiniton : Object` object with additonal form paramters. Shape looks like

```javascript
{
  validator: {
    errorMessages: {},
    attributeNames: {}
  },
  schema: {},
}
```
#### `validator`

Property is responsible to set up how form validation will be performed, and is represented by 2 properties. Both are applied per form instance.

- *attributeNames* - used to map a field name like `first-name` to a human readable form like `First Name`, used mostly to be displayed in error messages
- *errorMessages* - used to completely modify error message text

You can find usege in [examples](/reactive-mobx-form/#/examples).
#### `schema`

An object with a configuration for form fields, allowing to specify their initialValues and validation rules on a form creation stage. (you can also do this on form rendering sate by passing `schema` parameter to your `ReactiveForm` component).

```javascript
// this three forms of schema definition are equal, 
// saying that the value for a field named 'firstName' should be Viktor
{firstName: 'Vikor'}
{firstName: ['Viktor']}
{firstName: ['Viktor', '']}

// Here we also add validation (uses validatorjs syntax). 
// This field and form will be invalid if field value is emplty or not string
{firstName: ['Viktor', 'required|string']}
```

#### `unregisterOnUnmount : boolean` 

Should or should not the form state be cleaned form `formStore` when form component is unmounted