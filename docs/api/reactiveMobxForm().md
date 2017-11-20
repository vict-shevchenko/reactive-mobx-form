## reactiveMobxForm(name: string, [, formDefinition: Object])

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

Property is responsible to set up how form validation will be performed, and is represented by 2 properties


#### `schema`

An object with a configuration for form fields, allowing to specify their initialValues and validation rules