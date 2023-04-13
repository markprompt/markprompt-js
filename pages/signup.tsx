import Head from 'next/head';

import AuthPage from '@/components/user/AuthPage';

const Signup = () => {
  return (
    <>
      <Head>
        <title>Sign up | Markprompt</title>
      </Head>
      <AuthPage type="signup" />
    </>
  );
};

export default Signup;
