import { Modal } from "antd";

export default function CommonModal({
  title,
  open,
  onCancel,
  children,
  width = 500,
  footer,
}) {
  return (
    <Modal
      width={width}
      title={<span style={{ color: "#fff" }}>{title}</span>}
      open={open}
      onCancel={onCancel}
      footer={footer}
    >
      {children}
    </Modal>
  );
}
