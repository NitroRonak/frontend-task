import { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "72njgfa948d9aS7gs5"; // Replace this before testing

export default function useInfiniteProducts(search = "") {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (searchTerm = search, pageNum = page) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await axios.get(
        `https://stageapi.monkcommerce.app/task/products/search`,
        {
          params: {
            search: searchTerm,
            page: pageNum,
            limit: 10,
          },
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );

      const newProducts = response.data;
      setProducts((prev) =>
        pageNum === 0 ? newProducts : [...prev, ...newProducts]
      );
      setHasMore(newProducts.length === 10);
      setPage(pageNum + 1);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = (term) => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
    fetchProducts(term, 0);
  };

  return {
    products,
    fetchProducts,
    resetSearch,
    loading,
    hasMore,
  };
}
