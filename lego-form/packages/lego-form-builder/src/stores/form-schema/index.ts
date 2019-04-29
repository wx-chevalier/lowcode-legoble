export interface FormSchema {
  editorMode: 'pc' | 'mobile';
}
export interface FormSchemaAction {
  type: 'changeEditorMode';
  value: any;
}

export const initialState: FormSchema = {
  editorMode: 'pc'
};

export const reducer = (state: FormSchema, action: FormSchemaAction): FormSchema => {
  switch (action.type) {
    case 'changeEditorMode':
      return { ...state, editorMode: action.value };
    default:
      throw new Error('Unexpected action');
  }
};
