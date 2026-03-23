import { Input } from "antd";

export default function SearchBar({ value, onChange }) {
  return (
    <Input
      placeholder="Search..."
      value={value}
      onChange={onChange}
      style={{ width: 250 }}
    />
  );
}
