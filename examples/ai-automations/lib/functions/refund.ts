/* eslint-disable @typescript-eslint/no-unused-vars */
import { toast } from 'sonner';

import { UserInfo } from '@/pages';

import { timeout } from '../utils';

/**
 * User information interface.
 * Define any other required properties for user information.
 */
// interface UserInfo {
//   id: string;
//   firstName: string;
//   email: string;
//   username: string;
//   accountType: "enterprise-platinum";
// }

/**
 * Retrieve user information from your Admin/CRM system.
 * @param {string} userId - The unique identifier of a user.
 * @returns {Promise<UserInfo | null>} - Promise object represents the user information or null if the user doesn't exist.
 */
// async function getUserInfo(userId: string): Promise<UserInfo | null> {
//   // Implementation logic to fetch user information goes here.
//   return {
//     id: userId,
//     firstName: "Alexa",
//     email: "alexa.kendricks@acme.com",
//     username: "alexakendricks",
//     accountType: "enterprise-platinum",
//   };
// }

/**
 * Check the user's eligibility for a refund using your decision tree available in the CX.
 * @param {UserInfo} userInfo - The user's information.
 * @returns {Promise<boolean>} - Promise object represents if user is eligible or not for a refund.
 */
async function checkRefundEligibility(userInfo: UserInfo): Promise<boolean> {
  // Implementation logic to check refund eligibility goes here.
  return true;
}

/**
 * Process the refund through Stripe payment system.
 * @param {UserInfo} userInfo - The user information.
 * @param {Date} billingCycleEnd - The end date of the billing cycle.
 * @returns {Promise<boolean>} - Promise object represents if the refund was successfully processed.
 */
async function processRefundThroughStripe(
  userInfo: UserInfo,
  billingCycleEnd: string,
): Promise<boolean> {
  // Implementation logic to process refund through Stripe goes here.
  return true;
}

/**
 * Process a refund request for a user.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} billingCycleEnd - The end date of the billing cycle.
 * @returns {Promise<string>} - Promise object represents a message indicating if the refund request was approved or denied.
 */
export const processRefund =
  (userInfo: UserInfo) =>
  async ({
    userId,
    billingCycleEnd,
  }: {
    userId: string;
    billingCycleEnd: string;
  }): Promise<string> => {
    toast.loading(`Retrieving user info for ${userInfo.username}.`);
    await timeout(2000);

    toast.loading(`Checking refund eligibility for ${userInfo.username}.`);
    const refundEligibility = await checkRefundEligibility(userInfo);

    await timeout(2000);

    toast.success(`${userInfo.username} is elligible for a refund.`);

    await timeout(2000);

    if (refundEligibility) {
      toast.loading(
        `Processing refund on Stripe for the billing cycle ending at ${billingCycleEnd}.`,
      );
      const isRefundProcessed = await processRefundThroughStripe(
        userInfo,
        billingCycleEnd,
      );
      await timeout(3000);

      toast.success('Done processing refund.');
      if (isRefundProcessed) {
        return 'Refund request approved. The refund will be credited back to your original payment method.';
      } else {
        return 'Refund request denied. Please contact customer support for further assistance.';
      }
    }

    return 'Refund request denied. You are not eligible for a refund.';
  };
