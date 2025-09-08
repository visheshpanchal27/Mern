const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-8 bg-pink-500 rounded-full animate-wave"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;