import { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import jtkLogoWithoutName from "../../assets/jtk-logo.jpeg";
import jtkCompanyName from "../../assets/jtk-company-name.jpeg";
import { formatINR, getFinancialYear } from "../../helpers/invoice-helper";

export default function InvoicePreview({ data }) {
  const previewRef = useRef();

  const numberToWords = (num) => {
    num = Number(num);

    if (!num || num === 0) return "Rupees Zero Only"; // ✅ FIX

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
      if (n === 0) return ""; // ✅ VERY IMPORTANT

      if (n < 20) return a[n];

      if (n < 100)
        return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");

      if (n < 1000)
        return (
          a[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 ? " " + inWords(n % 100) : "")
        );

      if (n < 100000)
        return (
          inWords(Math.floor(n / 1000)) +
          " Thousand" +
          (n % 1000 ? " " + inWords(n % 1000) : "")
        );

      if (n < 10000000)
        return (
          inWords(Math.floor(n / 100000)) +
          " Lakh" +
          (n % 100000 ? " " + inWords(n % 100000) : "")
        );

      return (
        inWords(Math.floor(n / 10000000)) +
        " Crore" +
        (n % 10000000 ? " " + inWords(n % 10000000) : "")
      );
    };

    return "Rupees " + inWords(num).trim() + " Only";
  };

  return (
    <div className="preview" ref={previewRef} style={{ display: "block" }}>
      <table id="previewTable">
        <tbody>
          {/* HEADER */}
          <tr key={"header"}>
            <td colSpan="8" style={{ padding: "30px", paddingBottom: "5px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <img src={jtkLogoWithoutName} className="invoice-logo" alt="" />

                <div>
                  <img
                    src={jtkCompanyName}
                    className="invoice-logo-name"
                    alt=""
                  />
                  <p style={{ color: "#010c3d", fontWeight: "bold" }}>
                    <i>No : 4/318/5 Upstairs, Housing Board,</i>
                  </p>
                  <p style={{ color: "#010c3d", fontWeight: "bold" }}>
                    <i>Ettaiyapuram Road, Tuticorin - 628002</i>
                  </p>
                  <p style={{ color: "#010c3d", fontWeight: "bold" }}>
                    <i>Mobile No : +91 999 444 2811</i>
                  </p>
                  <p style={{ color: "#010c3d", fontWeight: "bold" }}>
                    <i>e-Mail : jtktranstuty@gmail.com</i>
                  </p>
                </div>
              </div>

              <h3 style={{ textAlign: "center", marginBottom: "0px" }}>
                INVOICE
              </h3>
            </td>
          </tr>

          {/* BILL TO + DETAILS */}
          <tr key={"billTo"}>
            <td colSpan="4" rowSpan="4" style={{ verticalAlign: "top" }}>
              <h4 style={{ fontWeight: 200 }}>Bill To</h4>
              <h3>{data.vendorName}</h3>
              <p>{data.address1}</p>
              <p>{data.address2}</p>
              <p>{data.address3}</p>
              <p>{data.state}</p>
              <p>{data.pinCode}</p>
              <p>GSTIN : {data.gstin}</p>
            </td>

            <td colSpan="2">
              Invoice No
              <br />
              <b>
                {data.invoiceNo}/{getFinancialYear(data.date)}
              </b>
            </td>

            <td colSpan="2">
              Date
              <br />
              <b>{data.date}</b>
            </td>
          </tr>

          <tr key={"supplyAndVehicle"}>
            <td colSpan="2">
              Place of Supply
              <br />
              <b>{data.placeOfSupply}</b>
            </td>
            <td colSpan="2">
              Vehicle Number
              <br />
              <b>{data.vehicleNumber}</b>
            </td>
          </tr>

          <tr key={"supplyAndContainer"}>
            <td colSpan="2">
              Date of Supply
              <br />
              <b>{data.dateOfSupply}</b>
            </td>
            <td colSpan="2">
              {data.containerNo && (
                <>
                  Container No
                  <br />
                  <b>{data.containerNo}</b>
                </>
              )}
            </td>
          </tr>

          <tr key={"bookingDetails"}>
            <td colSpan="4">
              {data.bookingDetails && (
                <>
                  <b>Booking Details</b>
                  <br />
                  <b>{data.bookingDetails}</b>
                </>
              )}
            </td>
          </tr>

          {/* TABLE HEADER */}
          <tr key={"tableHeader"}>
            <td style={{ width: "2%", fontWeight: "bold" }}>#</td>
            <td colSpan="5" style={{ widows: "68%", fontWeight: "bold" }}>
              Particulars
            </td>
            <td style={{ textAlign: "end", width: "10%", fontWeight: "bold" }}>
              Qty
            </td>
            <td style={{ textAlign: "end", width: "20%", fontWeight: "bold" }}>
              Amount
            </td>
          </tr>

          {/* ITEMS */}
          {data.items?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td colSpan="5">{item.particular}</td>
              <td style={{ textAlign: "end" }}>{item.qty}</td>
              <td style={{ textAlign: "end" }}>₹ {formatINR(item.amount)}</td>
            </tr>
          ))}

          {/* TOTAL SECTION */}
          <tr key={"total"}>
            <td colSpan="4" rowSpan="2">
              <b>Invoice Amount In Words</b>
              <br />
              {numberToWords(data.totalAmount)}
            </td>

            <td colSpan="4">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>Total</p>
                <h4>₹ {formatINR(data.totalAmount)}</h4>
              </div>
            </td>
          </tr>

          <tr key={"received"}>
            <td colSpan="4">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>Received</p>
                <h4>₹ {formatINR(data.received)}</h4>
              </div>
            </td>
          </tr>

          {/* BANK + SIGNATURE */}
          <tr key={"bankAndSignature"}>
            <td colSpan="4">
              <h3>Bank Account Details</h3>
              <p>
                Bank Name : <b>KARUR VYSYA BANK</b>
              </p>
              <p>
                Account Name : <b>JTK TRANS</b>
              </p>
              <p>
                Account No. : <b>1202115000011314</b>
              </p>
              <p>
                IFSC : <b>KVBL0001202</b>
              </p>
              <p>
                Branch : <b>TUTICORIN</b>
              </p>
              <p>
                PAN : <b>BLKPK5258G</b>
              </p>
            </td>

            <td colSpan="4">
              <div style={{ height: 200, textAlign: "center" }}>
                <h3>For JTK TRANS</h3>
                <p style={{ marginTop: 100 }}>Authorized Signatory</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* FOOTER */}
      <h3>Terms and conditions</h3>
      <p>*All cheques/DDs to be drawn in favour of "JTK Trans"</p>
      <p>*GST should be paid by Consignee/Consignor</p>

      <p style={{ textAlign: "center", marginTop: 50 }}>
        **This is a computer generated invoice, signature and seal is not
        required**
      </p>
    </div>
  );
}
