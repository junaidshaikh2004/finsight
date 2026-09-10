import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

export default function ExpenseFilters({ categories, month, onMonthChange, categoryId, onCategoryChange, search, onSearchChange }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <Input
        id="filter-month"
        label="Month"
        type="month"
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
        className="sm:w-44"
      />
      <Select
        id="filter-category"
        label="Category"
        value={categoryId}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="sm:w-44"
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </Select>
      <Input
        id="filter-search"
        label="Search"
        type="text"
        placeholder="Search descriptions…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="sm:flex-1"
      />
    </div>
  );
}
