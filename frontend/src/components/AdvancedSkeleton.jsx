import React from 'react';

const ShimmerEffect = ({ className = "" }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
  </div>
);

const PulsingDots = ({ count = 3, className = "" }) => (
  <div className={`flex gap-1 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="w-2 h-2 bg-pink-500/50 rounded-full animate-pulse"
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </div>
);

const FloatingElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${i * 0.5}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        }}
      />
    ))}
  </div>
);

const EnhancedHomeSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#0F0F0F] relative">
      <FloatingElements />
      
      <div className="h-16 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-b border-gray-700/30 relative">
        <ShimmerEffect className="absolute inset-0" />
        <div className="flex items-center justify-between px-4 h-full relative z-10">
          <div className="h-8 bg-gray-600 rounded w-32 animate-pulse"></div>
          <div className="flex gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-8 w-8 bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="relative mt-16 px-4 md:px-20 py-16 mx-4 md:mx-8 mb-12">
        <div className="bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-blue-900/20 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/30 rounded-3xl"></div>
          <FloatingElements />
          
          <div className="relative z-10">
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <div className="h-16 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-2xl w-full max-w-4xl mx-auto animate-pulse"></div>
                  <ShimmerEffect className="absolute inset-0 rounded-2xl" />
                </div>
                <div className="h-8 bg-gray-300/20 rounded-xl w-3/4 mx-auto animate-pulse"></div>
              </div>
              
              <div className="max-w-lg mx-auto">
                <div className="relative h-14 bg-[#1A1A1A]/60 border border-pink-600/20 rounded-full">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-600/10 to-purple-600/10 animate-glow"></div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-pink-600/50 to-purple-600/50 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="space-y-4 mt-12">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 bg-yellow-400/30 rounded-full animate-spin-slow"></div>
                  <div className="h-10 bg-gradient-to-r from-pink-400/30 to-blue-400/30 rounded-xl w-80 animate-pulse"></div>
                  <div className="w-6 h-6 bg-yellow-400/30 rounded-full animate-spin-slow" style={{ animationDelay: '0.5s' }}></div>
                </div>
                
                <PulsingDots count={5} className="justify-center" />
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
                  <div className="relative h-12 bg-gradient-to-r from-pink-600/40 to-purple-600/40 rounded-full w-52">
                    <ShimmerEffect className="absolute inset-0 rounded-full" />
                  </div>
                  <div className="h-12 bg-gray-700/40 rounded-full w-40 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="group relative">
              <div className="bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800 shadow-xl hover:shadow-pink-500/10 transition-all duration-500">
                <div className="relative h-72 bg-gradient-to-br from-gray-700 to-gray-600 overflow-hidden">
                  <ShimmerEffect className="absolute inset-0" />
                  
                  <div className="absolute top-3 left-3 space-y-1">
                    <div className="h-6 bg-orange-500/30 rounded-full w-16 animate-pulse"></div>
                    {i % 3 === 0 && (
                      <div className="h-6 bg-green-500/30 rounded-full w-12 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    )}
                  </div>
                  
                  <div className="absolute top-3 right-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}></div>
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-gray-500/30 border-t-pink-500/50 rounded-full animate-spin"></div>
                      <div className="absolute inset-2 border-2 border-gray-600/20 border-b-purple-500/30 rounded-full animate-spin-reverse"></div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {[1,2,3].map(dot => (
                      <div 
                        key={dot} 
                        className="w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse" 
                        style={{ animationDelay: `${dot * 0.2}s` }}
                      ></div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 space-y-3 relative">
                  <div className="h-6 bg-gray-600 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-600 rounded w-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(star => (
                          <div 
                            key={star} 
                            className="w-3 h-3 bg-yellow-400/30 rounded-sm animate-pulse" 
                            style={{ animationDelay: `${star * 0.1}s` }}
                          ></div>
                        ))}
                      </div>
                      <div className="h-3 bg-gray-600 rounded w-8 animate-pulse"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-4 bg-green-400/30 rounded w-12 animate-pulse"></div>
                      <div className="h-4 bg-blue-400/30 rounded w-8 animate-pulse"></div>
                    </div>
                  </div>
                  
                  {i % 4 === 0 && (
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2 animate-pulse">
                      <div className="h-4 bg-orange-400/30 rounded w-24 mx-auto"></div>
                    </div>
                  )}
                  
                  {i % 5 === 0 && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 animate-pulse">
                      <div className="h-4 bg-blue-400/30 rounded w-32 mx-auto"></div>
                    </div>
                  )}
                  
                  <div className="flex items-end justify-between pt-2 border-t border-gray-700/50">
                    <div className="space-y-1">
                      <div className="relative h-6 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded w-16">
                        <ShimmerEffect className="absolute inset-0 rounded" />
                      </div>
                      <div className="h-3 bg-green-400/30 rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="flex gap-1">
                      <div className="h-8 bg-gradient-to-r from-pink-600/30 to-purple-600/30 rounded-lg w-12 animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-700/50 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="relative h-12 bg-gradient-to-r from-pink-600/30 to-purple-600/30 rounded-full w-32 mx-auto">
            <ShimmerEffect className="absolute inset-0 rounded-full" />
            <PulsingDots count={3} className="absolute inset-0 justify-center items-center" />
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-16 bg-gradient-to-r from-gray-900/20 to-gray-800/20 relative">
        <FloatingElements />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-600 rounded w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-600 rounded w-64 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center space-y-3 p-6 bg-[#1A1A1A]/50 rounded-xl border border-gray-700/30 relative overflow-hidden">
                <ShimmerEffect className="absolute inset-0" />
                <div className="relative z-10">
                  <div className="h-12 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-xl w-16 mx-auto animate-pulse"></div>
                  <div className="h-6 bg-gray-600 rounded w-20 mx-auto animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="h-4 bg-gray-600 rounded w-16 mx-auto animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 mb-8 px-4">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-gray-700/50 rounded-2xl p-8 mx-4 md:mx-8 relative overflow-hidden">
          <ShimmerEffect className="absolute inset-0" />
          <div className="text-center space-y-6 relative z-10">
            <div className="h-8 bg-gray-600 rounded w-96 mx-auto animate-pulse"></div>
            <div className="space-y-2 max-w-2xl mx-auto">
              <div className="h-4 bg-gray-600 rounded w-3/4 mx-auto animate-pulse"></div>
              <div className="h-4 bg-gray-600 rounded w-1/2 mx-auto animate-pulse"></div>
            </div>
            <div className="relative h-12 bg-gradient-to-r from-pink-600/40 to-purple-600/40 rounded-full w-48 mx-auto">
              <ShimmerEffect className="absolute inset-0 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHomeSkeleton;