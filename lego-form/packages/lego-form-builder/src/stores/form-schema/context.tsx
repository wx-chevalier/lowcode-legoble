import * as React from 'react';

import { reducer, initialState } from './index';

export const FormSchemaContext = React.createContext([] as any);

export const FormSchemaProvider = ({ children }: { children: any }) => {
  const contextValue = React.useReducer(reducer, initialState);
  return <FormSchemaContext.Provider value={contextValue}>{children}</FormSchemaContext.Provider>;
};

export const useFormSchema = () => {
  return React.useContext(FormSchemaContext);
};
