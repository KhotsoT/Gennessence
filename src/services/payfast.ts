// Payfast Integration Service (Scaffold)
// See: https://developers.payfast.co.za/docs#introduction
// NOTE: Never expose secret keys or merchant credentials in frontend code!

/**
 * Create a Payfast payment request (redirect method)
 * @param amount - The amount to charge
 * @param itemName - The product or cart description
 * @param returnUrl - URL to redirect after payment success
 * @param cancelUrl - URL to redirect if payment is cancelled
 * @param notifyUrl - URL for Payfast server-to-server notification
 * @returns The Payfast payment URL for redirect
 */
export function createPayfastRedirectUrl({
  amount,
  itemName,
  returnUrl,
  cancelUrl,
  notifyUrl,
}: {
  amount: number;
  itemName: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
}): string {
  // TODO: In production, generate signature and params on a secure backend!
  // This is a placeholder for demo/testing only.
  const base = 'https://www.payfast.co.za/eng/process';
  const params = new URLSearchParams({
    merchant_id: 'YOUR_MERCHANT_ID', // NEVER expose real merchant_id in frontend
    merchant_key: 'YOUR_MERCHANT_KEY', // NEVER expose real merchant_key in frontend
    amount: amount.toFixed(2),
    item_name: itemName,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: notifyUrl,
    // signature: 'GENERATED_SIGNATURE', // Must be generated server-side
  });
  return `${base}?${params.toString()}`;
}

/**
 * Handle Payfast payment notification (to be implemented on backend)
 * @param data - Payfast notify POST data
 */
export function handlePayfastNotify(data: any) {
  // TODO: Implement on a secure backend (Node, Python, etc.)
  // 1. Validate signature
  // 2. Validate source IP
  // 3. Update order/payment status
}

/**
 * Handle payment success/cancel (frontend can use return/cancel URLs)
 */
export function handlePayfastReturn() {
  // TODO: Show success message, update UI, etc.
}
export function handlePayfastCancel() {
  // TODO: Show cancel message, allow retry, etc.
}

// NEXT STEPS:
// 1. Implement a secure backend endpoint to generate Payfast signatures and handle notify_url POSTs.
// 2. Use createPayfastRedirectUrl() to generate the payment link (with backend-generated signature).
// 3. On checkout, redirect user to Payfast using the generated URL.
// 4. Handle return/cancel in the frontend, and notify in the backend. 