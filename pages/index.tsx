import { GetStaticProps } from 'next';

export default function Home(): React.ReactNode {
  return <></>;
}

export const getStaticProps: GetStaticProps<any> = async () => {
  const isLogged = false;

  return {
    redirect: {
      destination: isLogged ? '/dashboard' : '/login',
      permanent: false,
    },
  };
};
