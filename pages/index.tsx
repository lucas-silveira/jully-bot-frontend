import { CircularProgress } from '@material-ui/core';
import { Backdrop } from '@styles/components/backdrop.style';

export default function Home(): JSX.Element {
  return (
    <Backdrop open>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
