import { Form, Row, Col, Input, DatePicker, AutoComplete } from "antd";
import { useEffect, useState } from "react";
import { getAll } from "../../api/apiService";
import InvoiceItemsTable from "./InvoiceItemsTable";

export default function InvoiceForm({
  form,
  onSubmit,
  vendors,
  setVendors,
  disabled,
}) {
  useEffect(() => {
    getAll("vendors")
      .then(setVendors)
      .catch((err) => {
        console.error("Failed to fetch vendors:", err);
      });
  }, []);

  return (
    <Form layout="vertical" form={form} onFinish={onSubmit}>
      <h3>Invoice Details</h3>

      <Row gutter={16}>
        <Col span={4}>
          <Form.Item name="invoiceNo" label="Invoice No">
            <Input disabled={disabled} />
          </Form.Item>
        </Col>

        <Col span={4}>
          <Form.Item name="date" label="Date">
            <DatePicker disabled={disabled} style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={4}>
          <Form.Item name="dateOfSupply" label="Date Of Supply">
            <DatePicker disabled={disabled} style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={4}>
          <Form.Item name="vehicleNumber" label="Vehicle Number">
            <Input disabled={disabled} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="containerNo" label="Container No">
            <Input disabled={disabled} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="placeOfSupply" label="Place Of Supply">
            <Input disabled={disabled} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="bookingDetails" label="Booking Details">
            <Input disabled={disabled} />
          </Form.Item>
        </Col>
      </Row>

      <h3>Bill To</h3>

      <Row gutter={16}>
        {/* 🔥 AutoComplete instead of Select */}
        <Col span={8}>
          <Form.Item name="vendorName" label="Vendor Name">
            <AutoComplete
              options={vendors.map((c) => ({
                value: c.vendorName,
                label: c.vendorName,
                data: c,
              }))}
              onSelect={(value, option) => {
                const vendor = option.data;

                form.setFieldsValue({
                  vendorName: vendor.vendorName,
                  gstin: vendor.gstin,
                  state: vendor.state,
                  address1: vendor.address1,
                  address2: vendor.address2,
                  address3: vendor.address3,
                  pinCode: vendor.pinCode,
                });
              }}
              filterOption={(inputValue, option) =>
                option?.value?.toLowerCase()?.includes(inputValue.toLowerCase())
              }
              disabled={disabled}
            >
              <Input disabled={disabled} placeholder="Type or select vendor" />
            </AutoComplete>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="gstin" label="GSTIN">
            <Input disabled={disabled} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="state" label="State">
            <Input disabled={disabled} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="address1" label="Address 1">
            <Input disabled={disabled} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="address2" label="Address 2">
            <Input disabled={disabled} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="address3" label="Address 3">
            <Input disabled={disabled} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="pinCode" label="Pin Code">
            <Input type={"number"} disabled={disabled} />
          </Form.Item>
        </Col>
      </Row>

      <h3>Amount Details</h3>

      <InvoiceItemsTable form={form} disabled={disabled} />
    </Form>
  );
}
