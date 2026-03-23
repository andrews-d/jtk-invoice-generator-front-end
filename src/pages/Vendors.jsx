import CrudPage from "../modules/CrudPage";

export default function Vendors() {
  const vendorConfig = {
    title: "Vendor Management",
    name: "Vendor",

    api: "/api/vendors",

    searchField: "vendorName",

    columns: [
      { title: "Vendor Name", dataIndex: "vendorName" },
      { title: "GSTIN", dataIndex: "gstin" },
      { title: "State", dataIndex: "state" },
      { dataIndex: "address1", title: "Address 1" },
      { dataIndex: "address2", title: "Address 2" },
      { dataIndex: "address3", title: "Address 3" },
    ],

    fields: [
      { name: "vendorName", label: "Vendor Name", col: 8 },
      { name: "gstin", label: "GSTIN", col: 8 },
      { name: "state", label: "State", col: 8 },
      { name: "address1", label: "Address 1", col: 8 },
      { name: "address2", label: "Address 2", col: 8 },
      { name: "address3", label: "Address 3", col: 8 },
    ],
  };

  return <CrudPage config={vendorConfig} />;
}
