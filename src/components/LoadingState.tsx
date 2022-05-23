import { Spinner } from './Spinner';

export const LoadingState = () => {
  return (
    <div className="w-full py-64">
      <Spinner size="lg" variant="primary" className="my-10 mx-auto" />
    </div>
  );
};
