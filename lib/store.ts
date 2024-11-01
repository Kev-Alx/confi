import { create } from "zustand";

interface usePaymentMethod {
  payment: string;
  setMethod: (payment: string) => void;
}

export const usePaymentMethod = create<usePaymentMethod>((set) => ({
  payment: "ShopeePay",
  setMethod: (payment: string) => set({ payment: payment }),
}));

interface useTotalSum {
  sum: number;
  setSum: (payment: number) => void;
}

export const useTotalSum = create<useTotalSum>((set) => ({
  sum: 0,
  setSum: (payment: number) => set({ sum: payment }),
}));
