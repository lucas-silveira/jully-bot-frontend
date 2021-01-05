import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home(): JSX.Element {
  const router = useRouter();
  const [isAuthenticated] = useState(false);

  useEffect(() => {
    router.push(isAuthenticated ? 'dashboard' : 'login');
  }, [router, isAuthenticated]);

  return <p>Redirecionando...</p>;
}
