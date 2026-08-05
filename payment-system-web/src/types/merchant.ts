export interface Merchant {
  merchantId: number;
  merchantCode: string;
  merchantName: string;
  merchantCategoryCode: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateMerchantRequest {
  merchantName: string;
  merchantCategoryCode: string;
}