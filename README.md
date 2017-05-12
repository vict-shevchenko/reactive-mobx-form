# reactive-mobx-forms
Forms library for React+MobX application. Under the hood it uses efficient MobX observable mechanizm, that allows tracking changes in form fields and rerender only things that have changed. This makes developer a feeling of working with 2-way databinding and reduces much boilerplate code needed to handle input events in 1-way data flow environment. 

## Important notice
Library is on its initial development stage, is unstable and may contain bugs. Most of all API will change.

If considering a software development as next steps:
1. Make it work <-- we are here
2. Make it right
3. Make it fast

## Motivation
 Working with forms was always a pain in web development. This library is an attempt to solve it for MobX and React users.
 
 Goals:
 1. Minimal configuration
 2. Easy to learn and start with
 3. Preferable over own solutions(I hope it to be)

 ## Capabilities
 Its now possible: 
 1. Reder simple one level forms
 2. Validate fields, see **validatorjs** docs
 3. Submit a form
 
 ## Dependancy
 reactive-mobx-forms depends directly on [validatorjs](https://github.com/skaterdav85/validatorjs) library. It is small, effective and scalable. 
 
 reactive-mobx-forms peer dependencies are **mobx** and **mobx-react**
 
 ## Installation
 
 ```
 npm install reactive-mobx-form --save
 ```
 
## Usage

### Step 1
Create and expose to all your application a `formStore` via [Provider](https://github.com/mobxjs/mobx-react#provider-and-inject) from `mobx-react`

```javascript
import { Provider } from 'mobx-react';
import { FormStore } from 'reactive-mobx-form';

const formStore = new FormStore();

render(
    <Provider appStore={appStore} formStore={formStore}> //appStore - is any other store in your application
        <App />
    </Provider>,
    document.getElementById('root')
);
```

### Step 2
Create a form

```javascript
import {reactivMobxForm, Field} from 'reactive-mobx-form';

class ContactForm extends Component {
    render() {
        const { submit } = this.props;
        
        return (
            <form onSubmit={submit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <Field name="name" component="input" type="text" />
                </div>
                <div>
                    <label htmlFor="age">Age</label>
                    <Field name="age" component="input" type="number"/>
                </div>
        );
    }
}

const ContactFormReactive = reactiveMobxForm('contacts', formSchema)(ContactForm); // 2nd parameter (formSchema) is optional. 

// Use 2nd parameter to specify predefined initial values and validation rules, see format below.
// If you get initial values from server, better pass them as 'schema' paramter to Form in parent component

export default ContactFormReactive;
```

### Step 3
Use your form and enjoy

```javascript
import ContactForm from './ContactForm';

export default Page extends Component {
    onSubmit(form) {
        console.log(form)
    }
    
    render() {
        <div>
            <ContactForm handleSubmit={this.onSubmit.bind(this)} /> // schema={{fieldName: [initialValue, rules]}} optional parameter
        </div>
    }
}
```

### formSchema
`formSchema` is an object with a configuration for form fields, allowing to specify their initialValues and validation rules.

Syntax is next:

Wihtout validation:
`{firstName: 'Vikor'}` is same as `{firstName: ['Viktor']}` and same as `{firstName: ['Viktor', '']}` 

With validation:
`{firstName: ['Viktor', 'required|string']}` uses **validatorjs** syntax.