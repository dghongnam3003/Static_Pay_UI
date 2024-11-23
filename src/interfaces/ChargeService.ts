import { ChargeResponse } from "../components/OrderSummary";

// src/interfaces/ChargeService.ts
export interface ChargeService {
  get_charge: (id: string) => Promise<ChargeResponse>;
  // Nếu có thêm phương thức khác, hãy thêm vào đây
}