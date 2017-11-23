## configureValidator()

Other function that is exported by `reactive-mobx-form` package. It allows you to specify 2 global setting of Forms:
- language for error messages
- global pattern for displaying field name attribute

### Usage

```javascript
import { configureValidator } from 'reactive-mobx-form';
```

### Setting language

```javascript
configureValidator({
  language: 'ru'
});
```

You can use MobX autorun funtion in order to execute this code each time app language change. Be carefull as changing the language happens on Validator class and effects all forms, even created before language switch.


### Setting attibute names globally

```javascript
configureValidator({
  setAttributeFormatter: (attribute) => attribute.replace(/\./g, ' ')
});
```

`setAttributeFormatter` property should be a function, that accepts 1 parmenter field name, processes and returns it. In this example if we had a field name like 'user.name' it will be 'user name' inside error message.

More information on usage can be found in [examples](/reactive-mobx-form/#/examples).