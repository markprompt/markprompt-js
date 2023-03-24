import AuthPage from '@/components/user/AuthPage';
import Head from 'next/head';

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
