# Product Picker Dialog Component

This project contains a React-based **Product Picker Dialog** that allows users to select products and their variants from a searchable list, and reorder selected products and variants using drag-and-drop.

## ✨ Features

* 📦 Dialog UI using `@radix-ui/react-dialog`
* 🔍 Live product search with infinite scroll
* ✅ Product & variant selection with checkbox toggle
* 🧹 Drag-and-drop reordering of product rows and variants using `@dnd-kit`
* 💰 Optional discount inputs per product
* 📚 Modular, reusable component structure

---

## 📁 File Structure

```
components/
│
├── ProductPickerDialog.jsx    # Main dialog component
├── ProductListItem.jsx        # Individual product item with variant selection
├── ProductRow.jsx             # Draggable product row used in final selected list
```

---

## 🚀 Setup & Usage

1. **Install dependencies**:

```bash
npm install @radix-ui/react-dialog @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities react-icons
```

2. \*\*Use \*\*\`\` in your app:

```jsx
<ProductPickerDialog
  open={isDialogOpen}
  onOpenChange={setDialogOpen}
  onSelect={(selectedProducts) => {
    console.log("Selected:", selectedProducts);
  }}
/>
```

3. **Expected **\`\`** hook**:

The dialog expects a custom hook called `useInfiniteProducts` that returns:

```ts
{
  products: Array<Product>,
  fetchProducts: () => void,
  resetSearch: (query: string) => void,
  hasMore: boolean,
  loading: boolean
}
```

Make sure your implementation handles pagination and search.

---

## 🧠 Notes

### Drag-and-Drop Behavior

* Product rows are draggable via a **specific handle** (`⋮⋮`) to avoid interfering with buttons like Edit, Delete, or "Add Discount".
* Variants within a product are also sortable individually using `@dnd-kit/sortable`.

### UX Improvements

* Disable drag on interactive controls (`Edit`, `Delete`, `Input`) to prevent needing multiple clicks.
* Use `stopPropagation()` or move `listeners` to a drag handle.

---

## 📦 Dependencies

| Package                  | Purpose                            |
| ------------------------ | ---------------------------------- |
| `@radix-ui/react-dialog` | Dialog UI with accessibility       |
| `@dnd-kit/core`          | Drag-and-drop core                 |
| `@dnd-kit/sortable`      | Sortable behavior for DnD          |
| `@dnd-kit/utilities`     | Utilities for handling transforms  |
| `react-icons`            | Icon library (`FaEdit`, `FaTimes`) |

---

## 🥪 Todo / Improvements

* Add keyboard accessibility for variant toggling
* Style search results better (loading indicators, empty state)
* Optionally limit number of products selected
* Add validation for discount inputs

---

## 📸 UI Preview

![Product Picker Dialog Screenshot](/src/assets/images/main%20section.png)

---

## 📟 License

MIT — free to use and modify for personal and commercial projects.
