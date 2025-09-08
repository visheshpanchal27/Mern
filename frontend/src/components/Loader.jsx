const Loader = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex gap-2">
                {[1,2,3,4,5].map(i => (
                    <div 
                        key={i}
                        className="w-2 h-8 bg-gray-600 rounded-full animate-wave"
                        style={{ animationDelay: `${i * 0.1}s` }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default Loader;
