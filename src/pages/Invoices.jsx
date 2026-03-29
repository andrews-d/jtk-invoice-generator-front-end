import { useState, useEffect, useRef, act } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button, Space, Form, Card } from "antd";
import dayjs from "dayjs";
import { message } from "antd";
import {
  createItem,
  deleteItem,
  getAll,
  patchItem,
  updateItem,
} from "../api/apiService";
import CommonTable from "../components/common/CommonTable";
import CommonModal from "../components/common/CommonModal";
import InvoiceForm from "../components/invoice/InvoiceForm";
import {
  defaultInvoiceItems,
  defaultSearchValues,
  formatDate,
  formatDateTable,
  formatINR,
  getNextInvoiceNumber,
} from "../helpers/invoice-helper";
import InvoicePreview from "../components/invoice/InvoicePreview";
import InvoiceSearch from "../components/invoice/InvoiceSearch";

export default function Invoices() {
  const [data, setData] = useState([]);
  const [openPrivew, setOpenPreview] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});
  const [vendors, setVendors] = useState([]);
  const [editId, setEditId] = useState(null);
  const [mode, setMode] = useState("add");

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchValues, setSearchValues] = useState(defaultSearchValues);

  const previewRef = useRef();

  const rowSelection = {
    type: "radio",
    onChange: (_, selectedRows) => {
      setSelectedRow(selectedRows[0]);
    },
  };

  const [form] = Form.useForm();

  useEffect(() => {
    fetchInvoices(searchValues);
  }, []);

  const fetchInvoices = async (params) => {
    const res = await getAll(
      `invoices?page=${params?.page}&limit=${params?.limit}&invoiceYear=${params?.invoiceYear}&search=${params?.invoiceNoOrName}&isActive=${params?.active}`,
    );

    setData(res.data);
  };

  const handleClose = () => {
    setOpenPreview(false);
    setOpen(false);
    setMode("add");
    setEditId(null);
  };

  const openGenerate = () => {
    form.resetFields();

    const nextInvoiceNo = getNextInvoiceNumber(data);
    form.setFieldsValue({
      invoiceNo: nextInvoiceNo,
      items: defaultInvoiceItems, // 🔥 important
    });

    setOpen(true);
  };
  const openCloneInvoice = () => {
    if (!selectedRow) {
      message.warning("Please select an invoice to clone");
      return;
    }

    const nextInvoiceNo = getNextInvoiceNumber(data);

    const { _id, createdAt, updatedAt, ...rest } = selectedRow;

    form.setFieldsValue({
      ...rest,

      // ✅ FIX DATE ISSUE
      date: rest.date ? dayjs(rest.date) : null,
      dateOfSupply: rest.dateOfSupply ? dayjs(rest.dateOfSupply) : null,

      invoiceNo: nextInvoiceNo,

      items:
        rest.items && rest.items.length > 0 ? rest.items : defaultInvoiceItems,
    });

    setOpen(true);
  };

  const columns = [
    { title: "Invoice No", dataIndex: "invoiceNo" },

    {
      title: "Date",
      dataIndex: "date",
      render: (date) => formatDateTable(date),
    },

    {
      title: "Date of Supply",
      dataIndex: "dateOfSupply",
      render: (date) => formatDateTable(date),
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      align: "right",
      render: (totalAmount) => formatINR(totalAmount),
    },
    {
      title: "Received",
      dataIndex: "received",
      align: "right",
      render: (received) => formatINR(received),
    },
    { title: "Vehicle", dataIndex: "vehicleNumber" },

    { title: "Place of Supply", dataIndex: "placeOfSupply" },

    { title: "Vendor", dataIndex: "vendorName" },

    { title: "Container No", dataIndex: "containerNo" },

    { title: "Booking Details", dataIndex: "bookingDetails" },
  ];

  const handleSubmit = async () => {
    try {
      // ✅ Validate form
      const values = {
        ...invoiceData,
        date: formatDate(invoiceData.date),
        dateOfSupply: formatDate(invoiceData.dateOfSupply),
      };
      const existingVendor = vendors.find(
        (c) => c.vendorName.toLowerCase() === values.vendorName.toLowerCase(),
      );

      let vendorId = existingVendor?._id;

      // 🚀 If NOT found → create new vendor
      if (!existingVendor) {
        const newVendor = await createItem("vendors", {
          vendorName: values.vendorName,
          gstin: values.gstin,
          state: values.state,
          address1: values.address1,
          address2: values.address2,
          address3: values.address3,
          pinCode: values.pinCode,
        });

        vendorId = newVendor._id;
      }
      if (editId) {
        // ✅ Update invoice
        await updateItem("invoices", editId, {
          ...values,
          vendorId,
        });
      } else {
        // ✅ Create invoice
        await createItem("invoices", {
          ...values,
          vendorId,
        });
      }
      handleDownload(invoiceData);
      fetchInvoices(searchValues);
      // setOpenPreview(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const handlePreview = async () => {
    const values = form.getFieldsValue();

    const items = form.getFieldValue("items") || [];

    let total = 0;

    const formattedItems = items.map((item) => {
      const amount = (item.qty || 0) * (item.rate || 0);
      total += amount;

      return {
        ...item,
        amount,
      };
    });

    const received = form.getFieldValue("received") || 0;

    // ✅ convert dayjs → string
    const formattedValues = {
      ...values,
      date: values.date ? values.date.format("DD-MM-YYYY") : "",
      dateOfSupply: values.dateOfSupply
        ? values.dateOfSupply.format("DD-MM-YYYY")
        : "",
    };

    setInvoiceData({
      ...formattedValues,
      items: formattedItems,
      totalAmount: total,
      received,
    });

    setOpenPreview(true);
  };

  const footer = openPrivew ? (
    <>
      <Button onClick={() => setOpenPreview(false)}>Back</Button>
      <Button className="primary-btn" onClick={handleSubmit}>
        Save Invoice
      </Button>
    </>
  ) : mode === "view" ? (
    <>
      <Button onClick={() => setOpen(false)}>Cancel</Button>
    </>
  ) : (
    <>
      <Button onClick={() => setOpen(false)}>Cancel</Button>
      <Button className="primary-btn" onClick={handlePreview}>
        Preview
      </Button>
    </>
  );

  /* VIEW */
  const openView = (row) => {
    const { _id, createdAt, updatedAt, ...rest } = row;

    form.setFieldsValue({
      ...rest,

      // ✅ FIX DATE ISSUE
      date: rest.date ? dayjs(rest.date) : null,
      dateOfSupply: rest.dateOfSupply ? dayjs(rest.dateOfSupply) : null,
      items:
        rest.items && rest.items.length > 0 ? rest.items : defaultInvoiceItems,
    });
    setEditId(row._id);
    setMode("view");
    setOpen(true);
  };

  /* EDIT */
  const openEdit = (row) => {
    const { _id, createdAt, updatedAt, ...rest } = row;

    form.setFieldsValue({
      ...rest,

      // ✅ FIX DATE ISSUE
      date: rest.date ? dayjs(rest.date) : null,
      dateOfSupply: rest.dateOfSupply ? dayjs(rest.dateOfSupply) : null,

      items:
        rest.items && rest.items.length > 0 ? rest.items : defaultInvoiceItems,
    });
    setEditId(row._id);
    setMode("edit");
    setOpen(true);
  };

  /* DELETE */
  const handleDelete = async (row) => {
    await patchItem("invoices", row._id, row?.isActive ? "delete" : "restore");
    fetchInvoices(searchValues);
  };

  const handleDownload = async (row) => {
    setInvoiceData(row);

    setTimeout(async () => {
      const canvas = await html2canvas(previewRef.current, { scale: 2 });
      const img = canvas.toDataURL("image/jpeg", 0.9);

      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 5;

      const pdfWidth = pageWidth - margin * 2;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(img, "JPEG", margin, margin, pdfWidth, pdfHeight);

      const blob = pdf.output("blob");

      // Ask user where to save
      const handle = await window.showSaveFilePicker({
        suggestedName: `invoice_${row.invoiceNo}.pdf`,
        types: [
          {
            description: "PDF file",
            accept: { "application/pdf": [".pdf"] },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();

      handleClose();
    }, 300);
  };
  return (
    <div>
      <h2 className="page-title">Invoices</h2>
      <Card
        variant="borderless"
        style={{ width: "100%", marginBottom: "10px" }}
      >
        <InvoiceSearch
          searchValues={searchValues}
          setSearchValues={setSearchValues}
          fetchInvoices={fetchInvoices}
        />
      </Card>
      <Card variant="borderless" style={{ width: "100%" }}>
        <Space
          style={{
            marginBottom: 20,
            display: "flex",
            justifyContent: "end",
          }}
        >
          <div>
            <Button
              className="primary-btn"
              onClick={openCloneInvoice}
              disabled={!selectedRow}
              style={{ marginRight: 10 }}
            >
              Clone Invoice
            </Button>
            <Button className="primary-btn" onClick={openGenerate}>
              Generate Invoice
            </Button>
          </div>
        </Space>

        <CommonTable
          columns={columns}
          data={data}
          rowSelection={rowSelection}
          onView={openView}
          onEdit={openEdit}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />

        <CommonModal
          width={1400}
          title="Generate Invoice"
          open={open}
          onCancel={() => {
            handleClose();
            setInvoiceData({});
          }}
          footer={footer}
        >
          {openPrivew ? (
            <InvoicePreview data={invoiceData} />
          ) : (
            <InvoiceForm
              form={form}
              onSubmit={handlePreview}
              vendors={vendors}
              setVendors={setVendors}
              disabled={mode === "view"}
            />
          )}
        </CommonModal>
      </Card>
      <div
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
        }}
      >
        <div ref={previewRef}>
          <InvoicePreview data={invoiceData} />
        </div>
      </div>
    </div>
  );
}
