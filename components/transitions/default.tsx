import { Collapse } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { useSpring, animated } from 'react-spring';

export default function TransitionComponent(
  props: TransitionProps,
): JSX.Element {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}
