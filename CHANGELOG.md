# 0.3.0 [Breacking Change]
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