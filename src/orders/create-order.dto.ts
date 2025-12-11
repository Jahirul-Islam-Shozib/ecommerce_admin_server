export class CreateOrderDto {
  orderId: string;

  employeeInfo: {
    employeeId: string;
    name: string;
    company?: string;
    designation?: string;
    department?: string;
    phone?: string;
    email?: string;
  };

  deliveryOption: {
    pickupPoint: string;
    deliveryDay: string;
    paymentMethod: 'Cash';
    deliveryNote?: string;
  };

  orderSummary: {
    items: {
      productId: string;
      productName: string;
      weightValue: number;
      weightUnit: string;
      quantity: number;
      pricePerUnit: number;
      totalPrice: number;
      brand: string;
      image: string;
    }[];
    subtotal: number;
    tax: number;
    discount: number;
    totalPrice: number;
  };
  createdAt: string;
  status?: OrderStatus; // default Pending
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Delivered' | 'Cancel';
