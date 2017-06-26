# 0.2.11
- Fix problem with unmountin of `Control*` components. Now unmounting cause correct removing of corresponding `Field` instance from `form.fields`
- Make storing each form in `formStore` as `observableMap`, to correcly react on add/remove form
- Fix bug #2, fields were not mared as untouched on form reset
- Remove dependancy on `React.PropTypes` in favor of `PropTypes`
- Minor updates 