import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      <Link 
        to="/" 
        className="flex items-center text-gray-400 hover:text-pink-400 transition-colors"
      >
        <FaHome className="mr-1" />
        Home
      </Link>
      
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        return (
          <div key={name} className="flex items-center">
            <FaChevronRight className="text-gray-600 mx-2" size={12} />
            {isLast ? (
              <span className="text-pink-400 font-medium capitalize">{name}</span>
            ) : (
              <Link 
                to={routeTo} 
                className="text-gray-400 hover:text-pink-400 transition-colors capitalize"
              >
                {name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;