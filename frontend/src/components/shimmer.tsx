export default function Shimmer() {
  return (
    <div
      role="status"
      className="box-slidder animate-pulse flex flex-col gap-2 items-centers"
    >
      <div className="h-7 w-26 bg-gray-200 rounded-lg"></div>
      <div className="h-15  bg-gray-200 rounded-lg"></div>
      <div className="h-19  bg-gray-200 rounded-lg"></div>

      <span className="sr-only">Loading...</span>
    </div>
  );
}
