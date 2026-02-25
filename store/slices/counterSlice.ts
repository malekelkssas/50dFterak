import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
    value: number;
    previousValue: number | null;
}

const initialState: CounterState = {
    value: 0,
    previousValue: null,
};

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload;
        },
        reset: (state) => {
            state.previousValue = state.value;
            state.value = 0;
        },
        restore: (state) => {
            if (state.previousValue !== null) {
                state.value = state.previousValue;
                state.previousValue = null;
            }
        },
    },
});

export const { increment, decrement, incrementByAmount, reset, restore } = counterSlice.actions;

export default counterSlice.reducer;
