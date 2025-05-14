import { useState } from "react";
import ProductRow from "./components/ProductRow";
import ProductPickerDialog from "./components/ProductPickerDialog";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

function App() {
  const [rows, setRows] = useState([
    {
      id: uuidv4(),
      product: null,
      variants: [],
      discountValue: "",
      discountType: "%",
      showVariants: false,
    },
  ]);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [editRowIndex, setEditRowIndex] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: uuidv4(),
        product: null,
        variants: [],
        discountValue: "",
        discountType: "%",
        showVariants: false,
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditClick = (index) => {
    setEditRowIndex(index);
    setPickerOpen(true);
  };

  const handleProductSelect = (selectedProducts) => {
    const updatedRows = [...rows];
    updatedRows.splice(
      editRowIndex,
      1,
      ...selectedProducts.map((p) => ({
        id: uuidv4(),
        product: {
          id: p.id,
          title: p.title,
          image: p.image?.src || "",
        },
        variants: p.variants,
        discountValue: "",
        discountType: "%",
        showVariants: false,
      }))
    );
    setRows(updatedRows);
  };

  const handleDiscountChange = (index, value, type) => {
    const updatedRows = [...rows];
    updatedRows[index].discountValue = value;
    updatedRows[index].discountType = type;
    setRows(updatedRows);
  };

  const toggleVariants = (index) => {
    const updatedRows = [...rows];
    updatedRows[index].showVariants = !updatedRows[index].showVariants;
    setRows(updatedRows);
  };

  const handleSubmit = () => {
    const result = rows.map((row) => ({
      product_id: row.product?.id,
      discount_value: row.discountValue,
      discount_type: row.discountType,
      variants: row.variants.map((v) => ({
        id: v.id,
        title: v.title,
        price: v.price,
      })),
    }));
    console.log("SUBMIT:", result);
    toast.success("Products added successfully! 🎉 You can check the console");
  };

  const handleRemoveVariant = (rowIndex, variantId) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].variants = updatedRows[rowIndex].variants.filter(
      (v) => v.id !== variantId
    );
    setRows(updatedRows);
  };

  const handleVariantReorder = (rowIndex, newVariantOrder) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].variants = newVariantOrder;
    setRows(updatedRows);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = rows.findIndex((r) => r.id === active.id);
      const newIndex = rows.findIndex((r) => r.id === over?.id);
      setRows((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div className="w-[100vw] h-screen p-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Add Products</h1>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={rows.map((r) => r.id)}
            strategy={verticalListSortingStrategy}
          >
            {rows.map((row, index) => (
              <ProductRow
                key={row.id}
                id={row.id}
                index={index}
                data={row}
                isOnlyRow={rows.length === 1}
                onEditClick={handleEditClick}
                onRemove={handleRemoveRow}
                onDiscountChange={handleDiscountChange}
                onToggleVariantVisibility={toggleVariants}
                onVariantReorder={handleVariantReorder}
                onRemoveVariant={handleRemoveVariant}
              />
            ))}
          </SortableContext>
        </DndContext>

        <div className="w-full flex justify-end ">
          <button
            onClick={handleAddRow}
            className="mt-4 bg-transparent text-black border px-10 py-2 rounded cursor-pointer"
          >
            Add Product
          </button>
        </div>

        <div className="w-full flex justify-end ">
          <button
            onClick={handleSubmit}
            className="mt-4 ml-3 bg-green-800 text-white px-4 py-2 rounded cursor-pointer"
          >
            Next
          </button>
        </div>

        <ProductPickerDialog
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          onSelect={handleProductSelect}
        />
      </div>
    </div>
  );
}

export default App;
