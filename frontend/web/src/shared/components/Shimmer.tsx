import clsx from 'clsx';

interface ShimmerProps {
  className?: string;
  variant?: 'light' | 'dark';
}

const Shimmer = ({ className, variant = 'light' }: ShimmerProps) => {
  return (
    <div
      className={clsx(
        'animate-shimmer bg-gradient-to-r',
        variant === 'light'
          ? 'from-grey-200 via-grey-100 to-grey-200'
          : 'from-grey-300 via-grey-200 to-grey-300',
        'bg-[length:200%_100%]',
        className
      )}
      style={{
        backgroundSize: '200% 100%',
      }}
    />
  );
};

export default Shimmer;

