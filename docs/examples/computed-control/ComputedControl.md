# ComputedControl Component

When developing a complex form it is sometimes useful to have fields on form which values are updated based on some other data in form or outside it. Starting from `v 0.9.7` `reactive-mobx-form` exposes special Control type for it - called `ComputedControl`. It is build with with a help of Component composition pattern, that allows rendering a simple Control inside but wrap it with more functionality outside. So it accepts the same properties that simple `Control` does. Plus one additional.

**`component` : string | function**
String like `input` or `select` or your React Component for rendering a form Control

**`name` : string**
Name for your field in form

**`type` : string**
input type that is used for current field. Omit this for `select` and `textarea` components

**`compute` : function**
This function accepts 2 parameters. First - current shapshot of `form.values` and second - properties that you have passed in to `ComputedControl`. It should return a new value (number, string or boolean) for field based on input parameters.
