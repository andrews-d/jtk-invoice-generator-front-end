import { Form, Row, Col, Input, DatePicker, Button, Switch } from "antd";
import dayjs from "dayjs";
import { defaultSearchValues } from "../../helpers/invoice-helper";

export default function InvoiceSearch({
  searchValues,
  setSearchValues,
  fetchInvoices,
}) {
  return (
    <Form layout="vertical">
      <Row gutter={10}>
        {/* Invoice No / Name */}
        <Col span={6}>
          <Form.Item label="Invoice No / Vendor Name">
            <Input
              placeholder="Enter Invoice No or Vendor Name"
              value={searchValues?.invoiceNoOrName}
              onChange={(e) =>
                setSearchValues({
                  ...searchValues,
                  invoiceNoOrName: e.target.value,
                })
              }
            />
          </Form.Item>
        </Col>

        {/* Invoice Year */}
        <Col span={6}>
          <Form.Item label="Invoice Year">
            <DatePicker
              picker="year"
              style={{ width: "100%" }}
              value={
                searchValues?.invoiceYear
                  ? dayjs(searchValues.invoiceYear, "YYYY")
                  : null
              }
              onChange={(date) =>
                setSearchValues({
                  ...searchValues,
                  invoiceYear: date ? date.format("YYYY") : "",
                })
              }
            />
          </Form.Item>
        </Col>

        {/* Active Switch */}
        <Col span={6}>
          <Form.Item label={searchValues?.active ? "Active" : "Inactive"}>
            <Switch
              checked={searchValues?.active}
              onChange={(v) => setSearchValues({ ...searchValues, active: v })}
            />
          </Form.Item>
        </Col>

        {/* Buttons */}
        <Col span={6}>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              gap: 10,
              width: "100%",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Button
              onClick={() => {
                setSearchValues(defaultSearchValues);
                fetchInvoices(defaultSearchValues);
              }}
            >
              Reset
            </Button>

            <Button
              className="primary-btn"
              onClick={() => fetchInvoices(searchValues)}
            >
              Search
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
}
