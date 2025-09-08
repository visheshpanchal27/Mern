import { useAllProductsQuery } from "../redux/api/productApiSlice";
import { useState, useEffect, useMemo } from "react";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/productCarousel";

const Header = ({ refreshKey = 0 }) => {
  const { data: allProductsData, isLoading, error } = useAllProductsQuery();
  const [displayProducts, setDisplayProducts] = useState([]);
  
  // Shuffle and select 4 random products
  useEffect(() => {
    if (allProductsData?.products?.length) {
      const shuffled = [...allProductsData.products].sort(() => Math.random() - 0.5);
      setDisplayProducts(shuffled.slice(0, 4));
    }
  }, [allProductsData, refreshKey]);

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <>
      <div className="flex justify-around">
        <div className="xl:block lg:hidden md:hidden sm:hidden">
          <div className="grid grid-cols-2 pl-5">
            {isLoading
              ? Array(4)
                  .fill(0)
                  .map((_, idx) => <SmallProduct key={idx} isLoading={true} refreshKey={refreshKey} />)
              : displayProducts?.map((product, idx) => (
                  <SmallProduct key={`${product._id}-${refreshKey}`} product={product} refreshKey={refreshKey} />
                ))}
          </div>
        </div>

        <ProductCarousel />
      </div>
    </>
  );
};

export default Header;
