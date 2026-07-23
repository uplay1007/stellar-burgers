import { RootState } from '../store';

export const selectOrderDetails = (state: RootState) =>
  state.orderDetails.order;
