const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gold mx-auto mb-4"></div>
        <p className="text-title-medium text-grey-700">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;

