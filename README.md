# reactive-mobx-form  [![npm version](https://badge.fury.io/js/reactive-mobx-form.svg)](https://badge.fury.io/js/reactive-mobx-form)
Simple ans scalable form management library for React+MobX application. Under the hood it uses efficient MobX observable mechanizm, that allows tracking changes in form fields and rerender only things that have changed. This gives developer a feeling of working with 2-way data binding and reduces much boilerplate code needed to handle input events in 1-way data flow environment. 

One of main features is "template based" approach - so you maintain your JSX structure only. This brings you to a situation that what is in your DOM is in your form values. 

The library is inspired by [Angular Reactive Forms](https://angular.io/guide/reactive-forms) and [Redux Form](http://redux-form.com). It has similar syntax to Redux Form, because of concept that are natural to React world. So if you previously had experience with it, it will be easy for you to start using `reactive-mobx-form`. But still syntax is aimed to be clear for everyone.

## Documentation
[Examples](https://vict-shevchenko.github.io/reactive-mobx-form) can be found here.

## Installation

```
npm install reactive-mobx-form
```

## Usage

### Step 1
Create and expose to all your application a `formStore` via [Provider](https://github.com/mobxjs/mobx-react#provider-and-inject) from `mobx-react`

```javascript
import { Provider } from 'mobx-react';
import { FormStore } from 'reactive-mobx-form';

const formStore = new FormStore();

render(
  <Provider appStore={appStore} formStore={formStore}> // appStore - is any other store in your application
    <App />
  </Provider>,
  document.getElementById('root')
);
```

### Step 2
Create a form, look no more `onChange` handlers on form fields. Just use `Control`! 

```javascript
import { reactiveMobxForm, Control } from 'reactive-mobx-form';

class ContactForm extends React.Component {
  render() {
    const { submit } = this.props;
    
    return (
      <form onSubmit={submit}>
        <div>
          <label htmlFor="name">Name</label>
          <Control name="name" component="input" type="text" />
        </div>
        <div>
          <label htmlFor="age">Age</label>
          <Control name="age" component="input" type="number"/>
        </div>
        <button type="submit">Submit</button>
      </form>
    );
  }
}

const ContactFormReactive = reactiveMobxForm('contacts' [, formDefinition])(ContactForm); // 2nd parameter (formDefinition) is optional. 

export default ContactFormReactive;
```

Detailed explanation of [formDefinition](https://vict-shevchenko.github.io/reactive-mobx-form/#/api/reactiveMobxForm()) object

### Step 3
Use your form and enjoy, just don't forget to pass `onSubmit` to it

```javascript
import ContactFormReactive from './ContactForm';

export default Page extends React.Component {
  handleSubmit(form) {
    console.log(form)
  }

  render() {
    <div>
      <ContactFormReactive onSubmit={this.handleSubmit.bind(this)} />
    </div>
  }
}
```

This is how you may turn a simple form into a Reactive Mobx Form one. But `reactive-mobx-form` gives you much more...

## Capabilities
Its now possible: 
1. Render forms and submit them
2. Validate fields, with powerful **validatorjs** library
3. Render multi-level fields with `ControlSection` Component. Great for Component reuse.
4. Render filed, that contains array of data. Both singe item array, or array of objects with `ControlArray`.
5. Manage multi step forms, aka Wizard.
6. Use `ComputedControl` component to render fields, which values are computed base of other form values
7. Localize your form/field names/error messages


## Language Support
By default error messages are in English. But you can change them. `reactive-mobx-form` provides you with interface for this. Under the hood it uses [Validatorjs Language Support](https://github.com/skaterdav85/validatorjs#language-support)

### Change language
In the `index.js` or other entry point of your app.

```javascript
import { configureValidator } from 'reactive-mobx-form';

configureValidator({
  language: 'ru'
});
```

You can use MobX autorun function in order to execute this code each time app language change. Be careful as changing the language happens on `Validator` class and effects all forms, even created before language switch.

### Custom attribute names
When display error messages, you may want to modify how field name is displayed in error message. For example if field name is 'user.name' and this field is required. You'd like to see it in error message like 'The user name field is required.'. This may be done via setting custom attribute names(locally) or attribute names formatter function(globally). Same as language support, the functionality relays on [Validatorjs Custom attribute names](https://github.com/skaterdav85/validatorjs#custom-attribute-names).

### Change custom attribute names globally
In the `index.js` or other entry point of your app.

```javascript
import { configureValidator } from 'reactive-mobx-form';

configureValidator({
  setAttributeFormatter: (attribute) => attribute.replace(/\./g, ' ')
});
```

`setAttributeFormatter` property should be a function, that accepts 1 parameter field name, processes and returns it. In this example if we had a field name like 'user.name' it will be 'user name' in error message.

### Change custom attribute names per form instance
Here we will benefit from other optional parameter to `reactiveMobxForm` creation function called `validator` .In place where you initialize form

```javascript
const ContactFormReactive = reactiveMobxForm('contacts', {
    validator: {
      attributeNames: { // this option is available per form only
        'users.name' : 'User Name'
      }
      // local setAttributeFormatter is not implemented yet
    }
  })(ContactForm)
```

`attributeNames` is an object that maps field name to attribute in error message. So if we had a field name like 'user.name' it will be 'User NAme' in error message.

## Custom Error Messages
With custom error messages it is possible to completely modify error message for some rule or combination of rule and field

```javascript
const ContactFormReactive = reactiveMobxForm('contacts', {
    validator: {
      errorMessages: {
        'required': 'You forgot to give a :attribute' // this format will be userd for all required fields
        'required.email': 'Without an :attribute we can\'t reach you!' // format for required email field
      }
    }
  })(ContactForm)
```

## Note on versions
- 0.7.5 - is a stable version for usage in environments with any version of React but MobX < 4. ([Map in MobX](https://github.com/mobxjs/mobx/blob/e17c47833d1812eee6d77914be890aa41e4b7908/CHANGELOG.md#breaking-changes-1))
- 0.9.0 - is a stable version for React > 16.3, and MobX > 4(5) (mobx-react > 5.2.0). [See changelog for updates](https://github.com/vict-shevchenko/reactive-mobx-form/blob/master/CHANGELOG.md). This version will be mainly developed. 

#### Migration to 0.9.x
For most users migration will be just updating a version in `package.json`. Make sure you are running React > 16.3.0. Also you can check [commit](https://github.com/vict-shevchenko/reactive-mobx-form/commit/e7fcdeeaf7173de0ef3974c12d10fb1de3a1f31a) for migration for docs site of `reactive-mobx-form`

#### Migration to 0.12.x
Remove `destroyControlStateOnUnmount` parameter from form initialization. If you relied on a logic that control are brought back to form with initial values check [here](https://github.com/vict-shevchenko/reactive-mobx-form/blob/master/docs/FAQ.md)

#### Migration to 0.13.x
* Remove `destroyFormStateOnUnmount` parameter from form initialization.
* If you relaid on mechanism that form state is preserved between full form unmounts - please use `keepState` property on your `Form` component.  
* You will have to rewrite your multi step forms via [new API](https://vict-shevchenko.github.io/reactive-mobx-form/#/examples/multi-step/MultiStep)


## Motivation
 Working with forms was always a pain in web development. This library is an attempt to solve it for MobX and React users.
 
Goals:
1. Zero configuration (I will not lie, you will still need some for not standard cases)
2. Easy to learn and start with
3. Preferable over own solutions (I hope it to be)

## Dependency
reactive-mobx-forms depends directly on:
1. [validatorjs](https://github.com/skaterdav85/validatorjs) library for validation. It is small, effective and scalable. 

reactive-mobx-forms peer dependencies are:
1. [react](https://github.com/facebook/react)
2. [mobx](https://github.com/mobxjs/mobx)
3. [mobx-react](https://github.com/mobxjs/mobx-react)

## Know Issues
1. When replacing `<A />` with `<B />`, `B.componentWillMount` now always happens before `A.componentWillUnmount`. Previously, `A.componentWillUnmount` could fire first in some cases. - Based on this. If you replace one `reactiveMobXForm` with another **having the same name**. This will cause new form extend previous, and then form destroy. So just give your forms different names.

## [FAQ](https://github.com/vict-shevchenko/reactive-mobx-form/blob/master/docs/FAQ.md)
