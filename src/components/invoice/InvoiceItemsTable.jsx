import { Table, Input, InputNumber, Button } from "antd";
import { useEffect, useState, useMemo } from "react";

export default function InvoiceItemsTable({ form, disabled }) {
  const [data, setData] = useState([]);

  // 🧠 Convert number to words
  const numberToWords = (num) => {
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const inWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + " " + a[n % 10];
      if (n < 1000)
        return a[Math.floor(n / 100)] + " Hundred " + inWords(n % 100);
      if (n < 100000)
        return inWords(Math.floor(n / 1000)) + " Thousand " + inWords(n % 1000);
      if (n < 10000000)
        return inWords(Math.floor(n / 100000)) + " Lakh " + inWords(n % 100000);
      return (
        inWords(Math.floor(n / 10000000)) + " Crore " + inWords(n % 10000000)
      );
    };

    return "Rupees " + inWords(num).trim() + " Only";
  };

  // 🔥 TOTAL CALCULATION
  const totalAmount = useMemo(() => {
    return data.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [data]);

  const handleAdd = () => {
    const newRow = {
      key: Date.now(),
      particular: "",
      qty: 0,
      rate: 0,
      amount: 0,
    };

    const updated = [...data, newRow];
    setData(updated);
    form.setFieldsValue({ items: updated });
  };

  const handleDelete = (key) => {
    const updated = data.filter((item) => item.key !== key);
    setData(updated);
    form.setFieldsValue({ items: updated });
  };

  useEffect(() => {
    const items = form.getFieldValue("items");
    setData(items);
  }, [form]);

  const handleChange = (key, field, value) => {
    const updated = data.map((item) => {
      if (item.key === key) {
        const updatedItem = {
          ...item,
          [field]: value,
        };

        updatedItem.amount = (updatedItem.qty || 0) * (updatedItem.rate || 0);

        return updatedItem;
      }
      return item;
    });

    setData(updated);
    form.setFieldsValue({ items: updated });
  };
  const columns = [
    {
      title: "#",
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Particular",
      dataIndex: "particular",
      render: (_, record) => (
        <Input
          disabled={disabled}
          value={record.particular}
          onChange={(e) =>
            handleChange(record.key, "particular", e.target.value)
          }
        />
      ),
    },
    {
      title: "Qty",
      width: 100,
      render: (_, record) => (
        <InputNumber
          disabled={disabled}
          value={record.qty}
          onChange={(val) => handleChange(record.key, "qty", val)}
        />
      ),
    },
    {
      title: "Rate",
      width: 120,
      render: (_, record) => (
        <InputNumber
          disabled={disabled}
          value={record.rate}
          onChange={(val) => handleChange(record.key, "rate", val)}
        />
      ),
    },
    {
      title: "Amount",
      width: 150,
      render: (_, record) => <InputNumber value={record.amount} disabled />,
    },

    // ✅ CONDITIONAL COLUMN
    ...(!disabled
      ? [
          {
            title: "Action",
            width: 80,
            render: (_, record) => (
              <Button
                size="small"
                danger
                onClick={() => handleDelete(record.key)}
              >
                Delete
              </Button>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <Table
        rowKey="key"
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
      />

      {/* 🔥 TOTAL + WORDS ROW */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          border: "1px solid #f0f0f0",
          borderTop: "none",
          padding: "10px",
        }}
      >
        {/* LEFT - WORDS */}
        <div style={{ width: "60%" }}>
          <b>Amount in Words:</b>
          <div>{numberToWords(totalAmount)}</div>
        </div>

        {/* RIGHT - TOTAL */}
        <div style={{ textAlign: "right", width: "40%" }}>
          <b>Total: ₹ {totalAmount.toLocaleString("en-IN")}</b>
        </div>
      </div>

      {/* 🔥 RECEIVED FIELD */}
      <div
        style={{
          display: "flex",
          justifyContent: !disabled ? "space-between" : "flex-end",
          marginTop: 15,
          gap: 20,
        }}
      >
        {!disabled && (
          <Button type="dashed" onClick={handleAdd} style={{ marginTop: 10 }}>
            + Add Row
          </Button>
        )}
        <div>
          <label>Received</label>
          <InputNumber
            disabled={disabled}
            value={form.getFieldValue("received") || 0}
            onChange={(val) => form.setFieldValue("received", val)}
          />
        </div>
      </div>

      {/* ADD ROW BUTTON */}
    </>
  );
}
