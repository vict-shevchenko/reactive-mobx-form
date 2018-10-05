// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>

/*~ This is the module template file. You should rename it to index.d.ts
 *~ and place it in a folder with the same name as the module.
 *~ For example, if you were writing a file for "super-greeter", this
 *~ file should be 'super-greeter/index.d.ts'
 */

/*~ If this module is a UMD module that exposes a global variable 'myLib' when
 *~ loaded outside a module loader environment, declare that global here.
 *~ Otherwise, delete this declaration.
 */
// export as namespace myLib;

/*~ If this module has methods, declare them as functions like so.
 */
import * as React from "react";
import { ObservableMap } from "mobx";

import { IFormDefinition, IFormSchema, IValidatorjsConfiguration } from "./lib/interfaces/Form";
export { ControlWithContext as Control } from "./lib/ui/Control";
export { ControlArrayWithContext as ControlArray } from "./lib/ui/ControlArray";
export { ControlSectionWithContext as ControlSection } from "./lib/ui/ControlSection";
export { FormStore } from "./lib/Store";

type IReactComponent<P = any> =
    | React.StatelessComponent<P>
    | React.ComponentClass<P>
    | React.ClassicComponentClass<P>;

/* export function reactiveMobxForm(formName: string, formDefinition?: IFormDefinition):
    (wrappedForm: IReactComponent) => React.ClassicComponentClass<{onSubmit?: any, schema?: IFormSchema }>
; 
 */

interface IFormProps {
    onSubmit: any;
    schema?: IFormSchema;
}

export function reactiveMobxForm(formName: string, formDefinition?: IFormDefinition): (wrappedForm: IReactComponent) => IReactComponent<IFormProps>

// todo: Think over this
//declare function reactiveMobxForm(formName: string, formDefinition?: IFormDefinition): <T extends IReactComponent>(wrappedForm: T) => T & {onSubmit: any, schema?: IFormSchema }

export function configureValidator(configParameters: IValidatorjsConfiguration): void;
