/**
 * Shared In-Memory status storage for VeloraPay Webhooks and Polling
 */

interface PaymentRecord {
  orderId: string;
  transactionId?: string;
  status: "PENDING" | "PAID" | "FAILED";
  amount?: number;
  paidAt?: string;
  updatedAt: string;
}

// Global declaration to survive Next.js dev reloads
const globalStore = global as unknown as {
  __veloraPayments?: Map<string, PaymentRecord>;
};

if (!globalStore.__veloraPayments) {
  globalStore.__veloraPayments = new Map<string, PaymentRecord>();
}

export const orderStore = {
  set(orderId: string, record: Partial<PaymentRecord>) {
    const existing = globalStore.__veloraPayments!.get(orderId) || {
      orderId,
      status: "PENDING",
      updatedAt: new Date().toISOString(),
    };
    const updated: PaymentRecord = {
      ...existing,
      ...record,
      updatedAt: new Date().toISOString(),
    };
    globalStore.__veloraPayments!.set(orderId, updated);
    if (updated.transactionId) {
      globalStore.__veloraPayments!.set(updated.transactionId, updated);
    }
    return updated;
  },

  get(id: string): PaymentRecord | undefined {
    return globalStore.__veloraPayments!.get(id);
  },

  markPaid(orderOrTxId: string, details?: { amount?: number }) {
    const existing = globalStore.__veloraPayments!.get(orderOrTxId) || {
      orderId: orderOrTxId,
      status: "PAID",
      updatedAt: new Date().toISOString(),
    };
    existing.status = "PAID";
    existing.paidAt = new Date().toISOString();
    existing.updatedAt = new Date().toISOString();
    if (details?.amount) existing.amount = details.amount;

    globalStore.__veloraPayments!.set(orderOrTxId, existing);
    if (existing.orderId && existing.orderId !== orderOrTxId) {
      globalStore.__veloraPayments!.set(existing.orderId, existing);
    }
    if (existing.transactionId && existing.transactionId !== orderOrTxId) {
      globalStore.__veloraPayments!.set(existing.transactionId, existing);
    }
    return existing;
  },
};

