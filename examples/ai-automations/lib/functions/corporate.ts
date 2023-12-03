import { toast } from 'sonner';

import { timeout } from '../utils';

/**
 * An interface to represent corporate information.
 * Define any other required properties for corporate info.
 */
interface CorporateInfo {
  id: string;
  name: string;
  //...
}

/**
 * An interface to represent a corporate plan.
 * Define any other required properties for corporate plans.
 */
interface CorporatePlan {
  id: string;
  corporateInfo: CorporateInfo;
  planOptions: string[];
  //...
}

/**
 * Retrieve the corporate plan options from your Internal Help Center.
 * @param {string} corporateName - The corporate name.
 * @returns {Promise<CorporatePlan | null>} - Promise object represents the corporate plan options
 */
async function getCorporatePlanOptions(
  corporateName: string,
): Promise<CorporatePlan | null> {
  // Implementation logic to fetch corporate plan options goes here.
  return {
    id: crypto.randomUUID(),
    corporateInfo: {
      id: crypto.randomUUID(),
      name: corporateName,
    },
    planOptions: ['Basic', 'Premium'],
  };
}

/**
 * Activate the corporate plan for the user.
 * @param {string} userId - The unique identifier of the user.
 * @param {CorporatePlan} corporatePlan - The corporate plan to be activated.
 * @returns {Promise<boolean>} - Promise object represents if the corporate plan activation was successful.
 */
async function activateCorporatePlan(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  corporatePlan: CorporatePlan,
): Promise<boolean> {
  // Implementation logic to activate the corporate plan goes here.
  return true;
}

/**
 * Process a corporate plan activation request.
 * @param {string} userId - The unique identifier for the user.
 * @param {string} corporateName - The corporate name.
 * @returns {Promise<string>} - Promise object represents a message indicating if the corporate plan activation was successful
 */
export async function processCorporatePlanActivation({
  userId,
  corporateName,
}: {
  userId: string;
  corporateName: string;
}): Promise<string> {
  toast.loading(`Fetching plan options for ${corporateName}.`);
  const corporatePlanOptions = await getCorporatePlanOptions(corporateName);

  if (!corporatePlanOptions) {
    return `We're sorry, we could not find the corporate plan for ${corporateName}.`;
  }

  await timeout(2000);

  toast.loading(`Activating ${corporateName} plan for user id ${userId}.`);

  const isPlanActivated = await activateCorporatePlan(
    userId,
    corporatePlanOptions,
  );

  if (!isPlanActivated) {
    return `We're sorry, we could not activate the corporate plan for ${corporateName}. Please contact customer service for further assistance.`;
  }

  await timeout(2000);
  toast.success(`Plan ${corporateName} activated for user id ${userId}.`);

  return `Your corporate plan with ${corporateName} has been successfully activated.`;
}
