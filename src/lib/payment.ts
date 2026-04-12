export type PaymentType = "prepaid" | "cod";
export type PaymentStatus = "pending" | "paid" | "failed";
export type PaymentMethod = "cash" | "paystack" | "transfer";

interface PaymentInit {
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  deliveryLocked: boolean;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentReference: string;
}

/**
 * Initialize payment fields when creating a shipment.
 * - prepaid → paid, unlocked
 * - cod → pending, locked
 */
export function initializePayment(
  paymentType: PaymentType,
  amount: number,
  paymentMethod: PaymentMethod = "cash",
  paymentReference: string = ""
): PaymentInit {
  if (paymentType === "prepaid") {
    return {
      paymentType,
      paymentStatus: "paid",
      deliveryLocked: false,
      amount,
      paymentMethod,
      paymentReference,
    };
  }

  // COD
  return {
    paymentType,
    paymentStatus: "pending",
    deliveryLocked: true,
    amount,
    paymentMethod,
    paymentReference,
  };
}

/**
 * Compute the fields to update when marking a shipment as paid.
 * Returns the Prisma update data for payment fields.
 */
export function markPaidFields(paymentReference?: string) {
  return {
    paymentStatus: "paid" as const,
    deliveryLocked: false,
    ...(paymentReference !== undefined && { paymentReference }),
  };
}

/**
 * Check whether delivery should remain locked.
 * COD shipments stay locked until paid.
 */
export function isDeliveryLocked(
  paymentType: PaymentType,
  paymentStatus: PaymentStatus
): boolean {
  if (paymentType === "cod" && paymentStatus !== "paid") {
    return true;
  }
  return false;
}
