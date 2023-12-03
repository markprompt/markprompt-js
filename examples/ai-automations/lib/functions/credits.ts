import { toast } from 'sonner';

import { timeout } from '../utils';

/**
 * An interface to represent class information.
 * Define any other required properties for classes.
 */
interface ClassInfo {
  id: string;
  name: string;
  //...
}

/**
 * An interface to represent class credits.
 * Define any other required properties for class credits.
 */
interface ClassCredit {
  id: string;
  classInfo: ClassInfo;
  credits: number;
  //...
}

/**
 * Retrieve class information from your Admin/CRM system or website.
 * @param {string} className - The name of a class.
 * @returns {Promise<ClassInfo | null>} - Promise object represents the class information or null if the class doesn't exist.
 */
async function getClassInfo(className: string): Promise<ClassInfo | null> {
  // Implementation logic to fetch class information goes here.
  return {
    id: crypto.randomUUID(),
    name: className,
  };
}

/**
 * Retrieve class credit information from your Admin/CRM system or website.
 * @param {ClassInfo} classInfo - The class information.
 * @returns {Promise<ClassCredit | null>} - Promise object represents the class credit information or null if the class doesn't exist.
 */
async function getClassCredits(
  classInfo: ClassInfo,
): Promise<ClassCredit | null> {
  // Implementation logic to fetch class credit information goes here.
  return {
    id: crypto.randomUUID(),
    classInfo: classInfo,
    credits: 3,
  };
}

/**
 * Process a class credit inquiry.
 * @param {string} className - The name of the class.
 * @returns {Promise<string>} - Promise object represents a message indicating how many credits the specified class would be.
 */
export async function processClassCreditInquiry({
  className,
}: {
  className: string;
}): Promise<string> {
  toast.loading(`Retrieving class info for ${className}.`);
  const classInfo = await getClassInfo(className);

  // Move on to trigger OpenAI call, but also delay showing dialog.
  timeout(3000).then(() => {
    toast.success(`Info for class ${className} retrieved.`);
  });

  if (!classInfo) {
    return `We're sorry, we could not find a class by the name ${className}.`;
  }

  const classCredit = await getClassCredits(classInfo);

  if (!classCredit) {
    return `We're sorry, we could not find credit information for the class ${className}.`;
  }

  return `Yoga at ${classInfo.name} would be ${classCredit.credits} credits.`;
}
