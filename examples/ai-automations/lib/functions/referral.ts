/* eslint-disable @typescript-eslint/no-unused-vars */
import { toast } from 'sonner';

import { timeout } from '../utils';

/**
 * An interface to represent the referral information.
 * Define any other required properties for referral info.
 */
interface ReferralInfo {
  id: string;
  refererId: string;
  referredId: string;
}

/**
 * Retrieve the referral information from LookrBot.
 * @param {string} userEmail - Id of the person who referred a friend.
 * @param {string} referredEmail - The email of the referred friend.
 * @returns {Promise<ReferralInfo | null>} - Promise object represents the referral information or null if no referral exists.
 */
async function getReferralInfo(
  userEmail: string,
  referredEmail: string,
): Promise<ReferralInfo | null> {
  // Implementation logic to fetch referral information from LookrBot goes here.
  return {
    id: crypto.randomUUID(),
    refererId: userEmail,
    referredId: crypto.randomUUID(),
  };
}

/**
 * Award referral credits to the user.
 * @param {ReferralInfo} referralInfo - The referral information.
 * @returns {Promise<boolean>} - Promise object represents if the referral credits were successfully awarded.
 */
async function awardReferralCredits(
  referralInfo: ReferralInfo,
): Promise<boolean> {
  // Implementation logic to award referral credits through Admin/CRM goes here.
  return true;
}

/**
 * Process a referral verification request.
 * @param {string} userEmail - The unique identifier for the user who referred a friend.
 * @param {string} friendEmail - The email of the referred friend.
 * @returns {Promise<string>} - Promise object represents a message indicating if the referral was successful.
 */
export async function processReferralVerification({
  userEmail,
  friendEmail,
}: {
  userEmail: string;
  friendEmail: string;
}): Promise<string> {
  toast.loading(`Looking up referral info for ${friendEmail}.`);
  const referralInfo = await getReferralInfo(userEmail, friendEmail);
  await timeout(2000);

  if (!referralInfo) {
    return `We're sorry, we could not find any referral information for the email address: ${friendEmail}.`;
  }

  toast.loading(
    `Awarding credits to ${userEmail} for the referral of ${friendEmail}.`,
  );
  const areCreditsAwarded = await awardReferralCredits(referralInfo);
  await timeout(3000);

  if (!areCreditsAwarded) {
    return `We're sorry, we couldn't award the referral credits. Please contact customer service for further assistance.`;
  }

  toast.success(`Referral credits awarded to ${userEmail}.`);

  return `Your referral was successful. Referral credits have been awarded to your account.`;
}
