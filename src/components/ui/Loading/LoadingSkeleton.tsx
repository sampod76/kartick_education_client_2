import { Skeleton } from 'antd';
const LoadingSkeleton = ({
  number,
  sectionNumber = 5,
}: {
  number?: number;
  sectionNumber?: number;
}) => (
  <div className="container mx-auto">
    {Array.from({ length: sectionNumber }, (_, index) => index + 1).map(
      (currentNumber) => {
        return (
          <Skeleton
            key={currentNumber}
            avatar
            style={{ marginTop: '1rem' }}
            paragraph={{
              rows: number || 4,
            }}
          />
        );
      },
    )}
  </div>
);
export default LoadingSkeleton;
