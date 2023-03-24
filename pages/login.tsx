import AuthPage from '@/components/user/AuthPage';
import Head from 'next/head';

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
