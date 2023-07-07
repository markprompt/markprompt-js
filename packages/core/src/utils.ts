export const getErrorMessage = async (res: Response): Promise<string> => {
  const res2 = res.clone();
  try {
    return (await res.json())?.error;
  } catch {
    return res2.text();
  }
};
