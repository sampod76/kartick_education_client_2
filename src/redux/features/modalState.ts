import { createSlice } from '@reduxjs/toolkit';
// import { PayloadAction } from '@reduxjs/toolkit';

const initialState: Record<string, boolean> = {}; //{"lessonid112233":false}

const modalSlice = createSlice({
  name: 'modalState',
  initialState: initialState,
  reducers: {
    toggleModal: (state, action: { payload: { field: string; value: boolean } }) => {
      state[action?.payload?.field] = action?.payload?.value;
    },
  },
});

export const { toggleModal } = modalSlice.actions;

export default modalSlice.reducer;
