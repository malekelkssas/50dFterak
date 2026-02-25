import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { increment, decrement, reset, restore, incrementByAmount } from '@/store/slices/counterSlice';

/**
 * Custom hook to encapsulate the counter slice.
 * Components should use this instead of accessing the slice/store directly.
 */
export function useCounterSlice() {
    const dispatch = useAppDispatch();
    const count = useAppSelector((state) => state.counter.value);

    return {
        count,
        increment: () => dispatch(increment()),
        decrement: () => dispatch(decrement()),
        reset: () => dispatch(reset()),
        restore: () => dispatch(restore()),
        incrementByAmount: (amount: number) => dispatch(incrementByAmount(amount)),
    };
}
