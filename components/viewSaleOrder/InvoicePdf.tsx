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
    justifyContent: "space-between",
    marginBottom: 20,
  },

  company: {
    width: "32%",
  },

  logo: {
    width: 120,
    marginBottom: 8,
  },

  companyName: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
  },

  arabic: {
    fontSize: 10,
    textAlign: "right",
    direction: "rtl",
    lineHeight: 1.4,
    marginBottom: 6,
  },

  block: {
    width: "34%",
  },

  blockTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
  },

  /* ================= FIXED ROW (IMPORTANT) ================= */

  rowFixed: {
    flexDirection: "row",
    marginBottom: 4,
  },

  labelCol: {
    width: 90,                 // 🔒 fixed width
    color: "#6b7280",
  },

  valueCol: {
    flex: 1,                   // 🔄 flexible
    fontWeight: "bold",
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
});

/* ================= PDF ================= */

export default function InvoicePdf({ order }: { order: any }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ================= HEADER ================= */}
        <View style={styles.headerRow}>

          {/* ================= COMPANY ================= */}
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

          {/* ================= CLIENT ================= */}
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Client</Text>

            <View style={styles.rowFixed}>
              <Text style={styles.labelCol}>Company :</Text>
              <Text style={styles.valueCol}>{order.client?.company}</Text>
            </View>

            <View style={styles.rowFixed}>
              <Text style={styles.labelCol}>Address :</Text>
              <Text style={styles.valueCol}>{order.client?.address}</Text>
            </View>

            <View style={styles.rowFixed}>
              <Text style={styles.labelCol}>Phone :</Text>
              <Text style={styles.valueCol}>{order.client?.phone}</Text>
            </View>

            <View style={styles.rowFixed}>
              <Text style={styles.labelCol}>Client TRN :</Text>
              <Text style={styles.valueCol}>
                {order.client?.clientTrnNumber}
              </Text>
            </View>
          </View>

          {/* ================= EXECUTIVE ================= */}
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Executive</Text>

            <View style={styles.rowFixed}>
              <Text style={styles.labelCol}>Date :</Text>
              <Text style={styles.valueCol}>
                {new Date(order.date).toDateString()}
              </Text>
            </View>

            <View style={styles.rowFixed}>
              <Text style={styles.labelCol}>Name :</Text>
              <Text style={styles.valueCol}>
                {order.executive?.name} {order.executive?.surname}
              </Text>
            </View>

            <View style={styles.rowFixed}>
              <Text style={styles.labelCol}>Phone :</Text>
              <Text style={styles.valueCol}>
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

      </Page>
    </Document>
  );
}