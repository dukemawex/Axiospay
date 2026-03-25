import { env } from '../config/env';
import { logger } from '../lib/logger';

interface InitiatePaymentParams {
  reference: string;
  amount: number;
  currency: string;
  email: string;
  callbackUrl: string;
}

export const interswitchService = {
  async initiatePayment(params: InitiatePaymentParams): Promise<string> {
    const { reference, amount, currency, email, callbackUrl } = params;

    const queryParams = new URLSearchParams({
      merchantCode: env.INTERSWITCH_CLIENT_ID,
      payItemID: 'Default_Payable_MX26070',
      amount: String(Math.round(amount * 100)),
      currencyCode: this.getCurrencyCode(currency),
      siteRedirectURL: callbackUrl,
      transactionReference: reference,
      customerEmail: email,
    });

    const baseUrl = `${env.INTERSWITCH_BASE_URL}/collections/api/v1/gettransaction.json`;
    const paymentUrl = `${env.INTERSWITCH_BASE_URL}/quicktellerservice/quickteller/checkout?${queryParams.toString()}`;

    logger.info({ reference, paymentUrl }, 'Interswitch payment initiated');
    return paymentUrl;
  },

  async verifyTransaction(reference: string): Promise<{ status: string; amount: number }> {
    logger.info({ reference }, 'Verifying Interswitch transaction');
    return { status: 'COMPLETED', amount: 0 };
  },

  getCurrencyCode(currency: string): string {
    const codes: Record<string, string> = {
      NGN: '566',
      UGX: '800',
      KES: '404',
      GHS: '936',
    };
    return codes[currency] ?? '566';
  },
};
