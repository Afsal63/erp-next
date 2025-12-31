import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#000",
  },

  /* ================= HEADER ================= */

  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start", // ✅ key for vertical alignment
    justifyContent: "space-between",
    marginBottom: 20,
  },

  /* ===== COLUMN WIDTHS (TOTAL = 100%) ===== */

  company: {
    width: "32%",
  },

  clientBlock: {
    width: "38%", // ⬅️ increased
  },

  executiveBlock: {
    width: "30%", // ⬅️ pushed right
  },

  logo: {
    width: 120,
    marginBottom: 8,
  },

  companyName: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
  },

  blockTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
  },

  /* ================= ROW ALIGNMENT ================= */

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },

  label: {
    width: 70, // ⬅️ reduced from 90
    color: "#6b7280",
  },

  value: {
    flex: 1,
    fontWeight: "bold",
    // lineHeight: 1,
  },

  execValue: {
    flex: 1,
    fontWeight: "bold",
    // lineHeight: 1.3,
  },

  /* 🔴 CHANGE START — INVOICE BLOCK */
  invoiceBlock: {
    marginBottom: 8,
    paddingBottom: 6,
    borderBottom: "0.5 solid #000",
  },

  invoiceNumber: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  /* 🔴 CHANGE END */

  /* ===== Executive slightly compact text ===== */

  execRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
    fontSize: 9,
  },

  execLabel: {
    width: 65,
    color: "#6b7280",
  },

  /* ================= DIVIDER ================= */

  divider: {
    borderBottom: "1 solid #000",
    marginVertical: 14,
  },

  /* ================= TABLE ================= */

  tableHeader: {
    flexDirection: "row",
    borderBottom: "1 solid #000",
    paddingBottom: 6,
    fontWeight: "bold",
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottom: "0.5 solid #000",
  },

  colItem: { width: "30%" },
  colBarcode: { width: "25%" },
  colPrice: { width: "15%", textAlign: "right" },
  colQty: { width: "10%", textAlign: "center" },
  colTotal: { width: "20%", textAlign: "right" },

  /* ================= TOTALS ================= */

  totalsWrapper: {
    marginTop: 20,
    alignSelf: "flex-end",
    width: "45%",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  discount: {
    color: "red",
    fontWeight: "bold",
  },

  grandTotal: {
    borderTop: "1 solid #000",
    paddingTop: 8,
    fontSize: 12,
    fontWeight: "bold",
  },

  /* ================= FOOTER ================= */

  footer: {
    position: "absolute",
    bottom: 32,
    left: 32,
    right: 32,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  footerBlock: {
    width: "40%",
  },

  footerTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 30,
  },

  footerLine: {
    borderTop: "1 solid #000",
    paddingTop: 6,
    fontSize: 9,
  },
});

/* ================= PDF ================= */

export default function InvoicePdf({ order }: { order: any }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ================= HEADER ================= */}
        <View style={styles.headerRow}>
          {/* ===== COMPANY ===== */}
          <View style={styles.company}>
            <Image src="/images/logo/logo.png" style={styles.logo} />
            <Text style={styles.companyName}>
              MUSFIRA SALTED PRESERVED FISH & SEAFOOD TRADING CO.L.L.C
            </Text>
            <Image src="/images/logo/logo1.png" style={styles.logo} />
            <Text>+971 52 972 4362 / 058 877 3535</Text>
            <Text>Deira, Dubai - UAE</Text>
            <Text>musfiradryfishdubai@gmail.com</Text>
            <Text>TRN: 100614900700003</Text>
          </View>

          {/* ===== CLIENT ===== */}
          <View style={styles.clientBlock}>
            <Text style={styles.blockTitle}>Client</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Company :</Text>
              <Text style={styles.value}>{order.client?.company}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Address :</Text>
              <Text style={styles.value}>{order.client?.address}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Phone :</Text>
              <Text style={styles.value}>{order.client?.phone}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Client TRN :</Text>
              <Text style={styles.value}>{order.client?.clientTrnNumber}</Text>
            </View>
          </View>

          {/* ===== Invoice block ===== */}

          {/* ===== EXECUTIVE ===== */}
          <View style={styles.executiveBlock}>
            {/* 🔴 CHANGE START */}
            <View style={styles.invoiceBlock}>
              <Text style={styles.invoiceNumber}>
                INVOICE : {order.number || "—"}
              </Text>
            </View>
            {/* 🔴 CHANGE END */}
            <Text style={styles.blockTitle}>Executive</Text>

            <View style={styles.execRow}>
              <Text style={styles.execLabel}>Date :</Text>
              <Text style={styles.execValue}>
                {new Date(order.date).toDateString()}
              </Text>
            </View>

            <View style={styles.execRow}>
              <Text style={styles.execLabel}>Name :</Text>
              <Text style={styles.execValue}>
                {order.executive?.name} {order.executive?.surname}
              </Text>
            </View>

            <View style={styles.execRow}>
              <Text style={styles.execLabel}>Phone :</Text>
              <Text style={styles.execValue}>
                {order.executive?.phonePrefix} {order.executive?.phone}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ================= TABLE ================= */}
        <View style={styles.tableHeader}>
          <Text style={styles.colItem}>Item</Text>
          <Text style={styles.colBarcode}>Barcode</Text>
          <Text style={styles.colPrice}>Price</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colTotal}>Total</Text>
        </View>

        {order.items.map((i: any) => (
          <View key={i._id} style={styles.tableRow}>
            <Text style={styles.colItem}>{i.itemName}</Text>
            <Text style={styles.colBarcode}>{i.barCode}</Text>
            <Text style={styles.colPrice}>{i.price.toFixed(2)}</Text>
            <Text style={styles.colQty}>{i.quantity}</Text>
            <Text style={styles.colTotal}>{i.total.toFixed(2)}</Text>
          </View>
        ))}

        {/* ================= TOTALS ================= */}
        <View style={styles.totalsWrapper}>
          <View style={styles.totalRow}>
            <Text>Sub Total :</Text>
            <Text>{order.subTotal.toFixed(2)}</Text>
          </View>

          {Number(order.discountPercent) > 0 && (
            <View style={styles.totalRow}>
              <Text>Customer Discount ({order.discountPercent}%)</Text>
              <Text style={styles.discount}>
                -{order.discountAmount.toFixed(2)}
              </Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text>VAT ({order.taxRate}%) :</Text>
            <Text>{order.taxTotal.toFixed(2)}</Text>
          </View>

          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text>Grand Total :</Text>
            <Text>{order.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* ================= FOOTER ================= */}
        <View style={styles.footer} fixed>
          <View style={styles.footerBlock}>
            <Text style={styles.footerTitle}>Delivered By</Text>
            <View style={styles.footerLine}>
              <Text>Name / Signature</Text>
            </View>
          </View>

          <View style={styles.footerBlock}>
            <Text style={styles.footerTitle}>Received By</Text>
            <View style={styles.footerLine}>
              <Text>Name / Signature</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
