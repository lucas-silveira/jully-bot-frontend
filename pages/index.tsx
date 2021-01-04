import { GetStaticProps } from 'next';

export default function Home(): React.ReactNode {
  return <></>;
}

export const getStaticProps: GetStaticProps<any> = async () => {
  const isAuthenticated = false;

  return {
    redirect: {
      destination: isAuthenticated ? '/dashboard' : '/login',
      permanent: false,
    },
  };
};
