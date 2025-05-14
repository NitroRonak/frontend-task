import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
import useInfiniteProducts from "../hooks/useInfiniteProducts";
import ProductListItem from "./ProductListItem";
import { Loader2, SearchIcon } from "lucide-react";

export default function ProductPickerDialog({ open, onOpenChange, onSelect }) {
  const { products, fetchProducts, resetSearch, hasMore, loading } =
    useInfiniteProducts();

  const [search, setSearch] = useState("");
  const [selectedMap, setSelectedMap] = useState({}); // id -> { product, variant? }
  const containerRef = useRef(null);

  useEffect(() => {
    if (open) fetchProducts();
  }, [open]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50 && hasMore) {
        fetchProducts();
      }
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    resetSearch(e.target.value);
  };

  const handleToggle = (
    id,
    type,
    product,
    variant = null,
    forceCheck = null
  ) => {
    setSelectedMap((prev) => {
      const newMap = { ...prev };

      if (type === "product") {
        const isChecked = forceCheck ?? !newMap[id];
        if (isChecked) {
          newMap[id] = { product };
        } else {
          delete newMap[id];
        }
      } else if (type === "variant") {
        const isChecked = forceCheck ?? !newMap[id];
        if (isChecked) {
          newMap[id] = { product, variant };
        } else {
          delete newMap[id];
        }
      }

      return newMap;
    });
  };

  const handleSubmit = () => {
    const grouped = {};

    Object.values(selectedMap).forEach(({ product, variant }) => {
      if (!grouped[product.id]) {
        grouped[product.id] = { ...product, variants: [] };
      }

      if (variant) {
        // Only include selected variants
        if (!grouped[product.id].variants.find((v) => v.id === variant.id)) {
          grouped[product.id].variants.push(variant);
        }
      }
    });

    // Filter out products with no selected variants
    const result = Object.values(grouped).filter((p) => p.variants.length > 0);

    onSelect(result);
    setSelectedMap({});
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white rounded-md shadow-lg z-50 p-6 overflow-hidden flex flex-col">
          <Dialog.Title className="text-lg font-bold mb-4">
            Select Products
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-4">
            Choose one or more products and variants from the list below.
          </Dialog.Description>

          <div className="relative w-full mb-5">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          <div
            ref={containerRef}
            className="overflow-auto flex-1 bg-gray-50 gap-2 flex flex-col"
          >
            {products.map((p) => (
              <ProductListItem
                key={p.id}
                product={p}
                selectedIds={Object.keys(selectedMap).map(Number)}
                onToggle={handleToggle}
              />
            ))}

            {loading && (
              <p className="py-4 flex items-center justify-center">
                <Loader2 className="animate-spin w-12 h-12 text-blue-400" />
              </p>
            )}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Dialog.Close className="px-8 py-2 rounded border cursor-pointer">
              Cancel
            </Dialog.Close>
            <button
              onClick={handleSubmit}
              className="bg-green-800 text-white px-10 py-2 rounded cursor-pointer"
            >
              Add
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
