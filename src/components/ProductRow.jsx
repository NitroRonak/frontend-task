import { useState } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export default function ProductRow({
  id,
  index,
  data,
  onEditClick,
  onRemove,
  onDiscountChange,
  onToggleVariantVisibility,
  onVariantReorder,
  isOnlyRow,
}) {
  const [showDiscount, setShowDiscount] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleVariantDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = data.variants.findIndex((v) => v.id === active.id);
    const newIndex = data.variants.findIndex((v) => v.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const updatedVariants = [...data.variants];
      const [moved] = updatedVariants.splice(oldIndex, 1);
      updatedVariants.splice(newIndex, 0, moved);

      onVariantReorder(index, updatedVariants);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 mb-3 rounded shadow-md bg-white"
    >
      <div className="flex items-center justify-between gap-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-400"
          title="Drag to reorder"
        >
          ⋮⋮
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-400">
            {data.product?.title || "Select Product"}
          </p>
        </div>

        <button
          onClick={() => onEditClick(index)}
          className="text-blue-500 cursor-pointer"
        >
          <FaEdit />
        </button>

        {!isOnlyRow && (
          <button
            onClick={() => onRemove(index)}
            className="text-red-500 cursor-pointer"
          >
            <FaTimes />
          </button>
        )}

        <div className="mt-2 flex items-center gap-3">
          {!showDiscount && (
            <button
              className="text-sm bg-green-800 py-4 px-15 text-white cursor-pointer rounded-md"
              onClick={() => setShowDiscount(true)}
            >
              Add Discount
            </button>
          )}
        </div>
        {showDiscount && (
          <div className="mt-2 flex gap-3">
            <input
              type="text"
              placeholder="Discount"
              className="border px-2 py-1 w-28 rounded"
              value={data.discountValue}
              onChange={(e) =>
                onDiscountChange(
                  index,
                  Number(e.target.value),
                  data.discountType
                )
              }
            />
            <select
              className="border px-2 py-1 w-28 rounded"
              value={data.discountType}
              onChange={(e) =>
                onDiscountChange(index, data.discountValue, e.target.value)
              }
            >
              <option value="%">%</option>
              <option value="flat">Flat Off</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end">
        <div className="w-fit">
          {data.variants?.length > 0 && (
            <button
              className="text-sm text-blue-600 cursor-pointer underline"
              onClick={() => onToggleVariantVisibility(index)}
            >
              {data.showVariants ? "Hide Variants" : "Show Variants"}
            </button>
          )}
        </div>
      </div>

      {data.showVariants && (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleVariantDragEnd}
        >
          <SortableContext
            items={data.variants.map((v) => v.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="mt-3 ml-4 space-y-1">
              {data.variants.map((variant) => (
                <SortableVariantItem key={variant.id} variant={variant} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function SortableVariantItem({ variant }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: variant.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex px-2 py-1 bg-gray-50 rounded border cursor-move"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-gray-400 w-5"
        title="Drag to reorder"
      >
        ⋮⋮
      </div>
      <div className="flex items-center justify-between w-full">
        <span>{variant.title}</span>
      <span>${variant.price}</span>
      </div>
    </li>
  );
}
