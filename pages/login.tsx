import Head from 'next/head';

import AuthPage from '@/components/user/AuthPage';

const Login = () => {
  return (
    <>
      <Head>
        <title>Sign in | Markprompt</title>
      </Head>
      <AuthPage type="signin" />
    </>
  );
};

export default Login;
