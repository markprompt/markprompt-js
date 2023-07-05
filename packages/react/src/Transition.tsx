import { animated, useSpring } from '@react-spring/web';
import React, { useState, type ReactElement, type ReactNode } from 'react';

type TransitionProps = {
  isVisible: boolean;
  isFlipped?: boolean;
  children: ReactNode;
};
export const Transition = (props: TransitionProps): ReactElement => {
  const { isVisible, isFlipped, children } = props;

  const [display, setDisplay] = useState(isVisible ? 'block' : 'none');

  const styles = useSpring({
    opacity: isVisible ? 1 : 0,
    x: isVisible ? '0%' : isFlipped ? '100%' : '-100%',
    config: {
      tension: 800,
      friction: 60,
    },
    onStart: () => {
      if (!isVisible) return;
      setDisplay('block');
    },
    onRest: () => {
      if (isVisible) return;
      setDisplay('none');
    },
  });

  return (
    <animated.div
      style={{
        position: 'absolute',
        inset: 0,
        display,
        ...styles,
      }}
    >
      {children}
    </animated.div>
  );
};
