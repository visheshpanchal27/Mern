import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/productCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <>
      <div className="flex justify-around">
        <div className="xl:block lg:hidden md:hidden sm:hidden">
          <div className="grid grid-cols-2 pl-5">
            {isLoading
              ? // Render 4 skeleton loaders while loading
                Array(4)
                  .fill(0)
                  .map((_, idx) => <SmallProduct key={idx} isLoading={true} />)
              : // Render products once data is loaded
                data?.map((product) => (
                  <SmallProduct key={product._id} product={product} />
                ))}
          </div>
        </div>

        <ProductCarousel />
      </div>
    </>
  );
};

export default Header;
