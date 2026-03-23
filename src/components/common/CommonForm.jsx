import { Form, Input, Button, Col, Row } from "antd";

export default function CommonForm({ fields, form, onSubmit, disabled }) {
  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Row gutter={16}>
        {fields.map((field) => (
          <Col span={field.col || 8}>
            <Form.Item key={field.name} name={field.name} label={field.label}>
              <Input disabled={disabled} />
            </Form.Item>
          </Col>
        ))}
      </Row>
    </Form>
  );
}
