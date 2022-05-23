import clsx from 'clsx';

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24'
};

const variants = {
  light: 'text-white',
  primary: 'text-indigo-500'
};

export type SpinnerProps = {
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
  className?: string;
};

export const Spinner = ({
  size = 'md',
  variant = 'primary',
  className = ''
}: SpinnerProps) => {
  return (
    <>
      <svg
        className={clsx(
          'animate-spin opacity-20',
          sizes[size],
          variants[variant],
          className
        )}
        viewBox="0 0 16 16"
      >
        <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
      </svg>
    </>
  );
};
