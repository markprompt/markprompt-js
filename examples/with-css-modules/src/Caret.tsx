import styles from './markprompt.module.css';

type AsProp<C extends React.ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

// This is the first reusable type utility we built
type PolymorphicComponentProp<
  C extends React.ElementType,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Props = {},
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

const Caret = () => {
  return <span className={styles.caret} />;
};

type WithCaretProps<C extends React.ElementType> = PolymorphicComponentProp<
  C,
  { children?: React.ReactNode }
>;

export const WithCaret = <C extends React.ElementType = 'div'>(
  props: WithCaretProps<C>,
) => {
  // eslint-disable-next-line prefer-const
  let { as: Component = 'div', children, inline, ...rest } = props;

  if (Component === 'code' && inline) {
    rest = {
      ...rest,
      inline: 'true',
    };
  }

  return (
    <Component {...rest}>
      {children}
      <Caret />
    </Component>
  );
};
