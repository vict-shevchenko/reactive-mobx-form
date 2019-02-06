# Multi Step Form (Wizard)

One of very popular type of form are multiple step forms, where user fills in several fields and then clicks "Next" in order to fill in another set of fields.

Before `v 0.13` this has to be implemented with `destroyFormStateOnUnmount` config parameter, but this functionality was deeply redesigned in v 0.13.0 and `destroyFormStateOnUnmount` config parameter was deprecated. Instead now instance of ReactiveMobxForm receives additional props that allows building multi step forms.

They are:

**`step` : number**
Indicates on what step in multi step form you currently are. Starts from `1` and increases automatically when you move forward

**`next` : function**
Function that is used to tell form that editing of fields on current step are done and we need to move forward. By calling it - 2 main things happen:
- value of `step` property is increased by 1 (you may relay on this parameter in order to display fields from next step).
- fields that were populated on previous step will be saved as a part of form values (Even despite they will be unmounted).

> *Note: If moving step forward without calling a `next` function - fields from previous step will be unmounted and absent from form.values*

**`previous` : function**
Function that is used to tell form that we would like to move step back. It accepts one optional parameter `step : number` that should be a negative value indicating how many steps we want to go back (similarly like `window.history.back(-2)`). Default is `-1`. By calling this function `step` property will be decreased by 1 or by value you have passed into the function.

In order to be safe always use `next`, `previous` and `step` in order to manipulate multi step form.

A little confused? Below example should make everything clear.
