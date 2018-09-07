# 0.9.7
- add ComputedControl functionality

# 0.9.6
- fix bug that blocked passing of any additional props to RactiveForm. `<MyCustomForm onSubmit={} schema={} anyProp={}>`. `props.anyProp` will be accessible inside MyCustomForm component

# 0.9.5
- add public method `form.findField` to make a field look up in all form hierarchy. 

# 0.9.3
- all type errors fixed
- handle export of proper typings to be used by consumer projects
- docs updates

# 0.9.2
- type errors fixes

# 0.9.1
- removed componentWillMount from FormUI component
- mostly docs update

# 0.9.0 [Breaking Changes MobX > 4 and React > 16.3]
- Support for MobX > 4 and React > 16.3
- Relay and use of new React context API (*v < 0.9.0 will fail with React < 16.3*)
- Deprecate componentWillMount, componentWillReceiveProps lifecycle hooks
- fix number of small errors
- code refactoring
- some errors from typescript still can appear, but do not affect functionality and will be fixed soon

# 0.7.5
- Extend form parameters (schema, errorMessages, attributeNames) when form with same name is mounted. Useful for adding default values and rules for dynamically inserted forms(form parts, wizard type forms). 

# 0.7.4
- Update of dependencies versions

# 0.7.2
- Fix for setTouched method that marks field as 'touched'

# 0.7.1
- Control type checkbox support `value` attribute. That is passed to `field.value` when checkbox is checked
- Fix bug 'className should extend rmf class names #7'
- Minor fixes

# 0.7.0  [Breaking Changes]
- Mark all fields as 'touched' when form submit button is clicked
- No reset form happens in case of successful submission. Developer needs to manually reset form, if required.

# 0.6.2
- Fix reset form on submit promise resolve. And keep form state in case of rejection

# 0.6.1
- `submit` function inside a form can accept additional parameters, that will be transparently passed to your submit callback (onSubmit) after form values.

# 0.6.0 [Breaking Changes]
- Support for wizzard type forms, that allows form state to be preserved when form element is unmounted, and field state to be preserved when Control is unmounted
- Introduced `formStore.getForm('formName')` - to get form instance
- Introduced `form.getField('fieldName')` - to get field instance on form

# 0.5.4
- Possibility to have several components with fields for one form. Use `unregisterOnUnmount: false` in order to dynamically add components with new Controls for existing form. 

# 0.5.3
- All code TSLinted

# 0.5.2
- Add typings

# 0.5.1
- Fix bug with form failing to initialize without parameters
- Fix bug with form that has validation, failed to initilaize without `validator.attributeNames` parameter;

# 0.5.0
- Changed a way how validatorjs parameters are passed to `reactiveMobXForm` creation function.
- Changed a way how control names are build. from `person.0.firstName` to `person[0].firstname`
- Introduced a `BaseControl` class to keep all logic shared between all types of Controls

# 0.4.0
- Possibility to globally / locally(per form) to set up language of error messages, and how the field name inside error messages is formated.
- Validation of form configuration parameters
- Possibility to set custom error message per rule or rule + field name

# 0.3.3
- Fix Bug, that `Form.reset` did not removed ControlArray children from ui
- Allow `ControlArray` to be the nested child of other `ControlArray`

# 0.3.2 
- `isDirty` property now is computed correctly

# 0.3.1 
- Pass `submitError` property to Form component

# 0.3.0 [Breaking Change]
- Improved logic of working with `fields` array passed into `ControlArray`'s component [Breacking Change].
- No more separate methods for `fields`
- All methods for manipulatin are in `fields.prototype`
- They are: `map, add, insert, remove, swap`

# 0.2.11
- Fix problem with unmountin of `Control*` components. Now unmounting cause correct removing of corresponding `Field` instance from `form.fields`
- Make storing each form in `formStore` as `observableMap`, to correcly react on add/remove form
- Fix bug #2, fields were not mared as untouched on form reset
- Remove dependancy on `React.PropTypes` in favor of `PropTypes`
- Minor updates 
