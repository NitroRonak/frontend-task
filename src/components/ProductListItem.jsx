import { useEffect, useState } from "react";

export default function ProductListItem({ product, onToggle, selectedIds }) {
  const isProductSelected = selectedIds.includes(product.id);

  const handleToggleProduct = () => {
    onToggle(product.id, "product", product);
    product.variants.forEach((variant) =>
      onToggle(variant.id, "variant", product, variant, !isProductSelected)
    );
  };

  const handleToggleVariant = (variant) => {
    onToggle(variant.id, "variant", product, variant);
  };

  return (
    <div className="rounded-md p-3 bg-white border">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          className="w-6 h-6"
          checked={isProductSelected}
          onChange={handleToggleProduct}
        />
        <img
          src={product.image.src}
          alt={"product"}
          className="w-12 h-12"
        />
        {product.title}
      </label>

      <ul className="mt-5 ml-6 space-y-1">
        {product.variants.map((variant) => (
          <li key={variant.id} >
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-6 h-6"
                checked={selectedIds.includes(variant.id)}
                onChange={() => handleToggleVariant(variant)}
              />
              {variant.title} - ${variant.price}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
