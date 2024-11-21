"use client";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "@/components/ui/spinner";
import { UserAxiosInstance } from "@/utils/Instance";
import AddProductDialog from "@/components/add-product";
import ProductCard from "@/components/product-card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type ProductType = "own" | "received" | "sent";
type SortOrder = "1" | "-1";
type ProductStatus = "active" | "inactive" | "all";

type Product = {
  product_details: object;
  sender_details: object;
  receiver_details: object;
};

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [limit] = useState<number>(40);
  const [page, setPage] = useState<number>(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [productType, setProductType] = useState<any>("own");
  const [sortOrder, setSortOrder] = useState<any>("-1");
  const [status, setStatus] = useState<ProductStatus>("all");
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>("");

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (searchText) params.set("search", searchText);
    if (productType) params.set("type", productType);
    if (sortOrder) params.set("sort", sortOrder);
    if (status) params.set("status", status);

    window.history.pushState({}, "", `?${params.toString()}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchText(params.get("search") || "");
    setProductType((params.get("type") as ProductType) || "own");
    setSortOrder((params.get("sort") as SortOrder) || "-1");
    setStatus((params.get("status") as ProductStatus) || "all");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchText(searchText), 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const response = await UserAxiosInstance.get(
        `/products/all-products?page=${page}&limit=${limit}&search=${debouncedSearchText}&type=${productType}&sort=${sortOrder}&status=${status}`
      );
      if (response?.data?.payload) {
        const { payload, pagination } = response.data;
        setProducts((prev) => [...prev, ...payload]);
        setTotalProducts(pagination?.TotalDataLength || 0);
        setHasMore(
          payload.length + products.length < pagination?.TotalDataLength
        );
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    updateSearchParams(); // Update the URL whenever filters change
    fetchProducts();
  }, [debouncedSearchText, productType, sortOrder, status]);

  useEffect(() => {
    if (page > 1) fetchProducts();
  }, [page]);

  const router = useRouter();
  const fetchMoreData = () => {
    if (!loading && hasMore) setPage((prev) => prev + 1);
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <Input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Type to Search"
        />
        <AddProductDialog
          set_data={setProducts}
          setPage={setPage}
          updateSearchParams={updateSearchParams}
          fetchProducts={fetchProducts}
        />
      </div>

      <div className="py-4 flex flex-col lg:flex-row justify-between flex-wrap gap-4">
        <Select value={productType} onValueChange={setProductType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Product Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="own">Own Products</SelectItem>
            <SelectItem value="received">Received Products</SelectItem>
            <SelectItem value="sent">Sent Products</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex flex-col gap-4 lg:flex-row w-full items-center">
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Ascending</SelectItem>
              <SelectItem value="-1">Descending</SelectItem>
            </SelectContent>
          </Select>
          <div className="lg:w-40 w-full">
            <Button
              size={"sm"}
              className="w-full"
              onClick={() => {
                router.push("/products/recieve-product");
              }}
            >
              Request Product
            </Button>
          </div>
        </div>
      </div>

      <div>
        {loading && products.length === 0 ? (
          <Spinner />
        ) : (
          <InfiniteScroll
            dataLength={products.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<Spinner />}
          >
            <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
              {products.map((item, index) => (
                <ProductCard
                  key={index}
                  product={item.product_details}
                  sender={item.sender_details}
                  receiver={item.receiver_details}
                  set_data={setProducts}
                />
              ))}
            </div>
          </InfiniteScroll>
        )}
        {!loading && products.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  );
}
