import * as React from 'react';
import {useState} from 'react';
import { FormStoreContext } from '../Context';
import { FormStore } from '../Store';

export default function Provider({children}: React.PropsWithChildren<{}>) {
  const [formStore] = useState(new FormStore());

  return (
    <FormStoreContext.Provider value={formStore}>
      {children}
    </FormStoreContext.Provider>
  )
}
