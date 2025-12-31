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
    marginBottom: 16,
  },

  company: {
    width: "60%",
  },

  logo: {
    width: 110,
    marginBottom: 6,
  },

  companyName: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
  },

  reportInfo: {
    width: "40%",
    alignItems: "flex-end",
  },

  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    textTransform: "capitalize",
  },

  dateRange: {
    fontSize: 9,
    color: "#555",
  },

  divider: {
    borderBottom: "1 solid #000",
    marginVertical: 12,
  },

  /* ================= TABLE ================= */

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderTop: "1 solid #000",
    borderBottom: "1 solid #000",
    paddingVertical: 6,
    fontWeight: "bold",
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottom: "0.5 solid #ccc",
  },

  colOrder: {
    width: "18%",
    paddingRight: 6,
  },

  colClient: {
    width: "32%",
    paddingRight: 6,
  },

  colDate: {
    width: "20%",
    paddingRight: 6,
  },

  colTotal: {
    width: "15%",
    textAlign: "right",
    paddingRight: 6,
  },

  colStatus: {
    width: "15%",
    textAlign: "center",
  },

  footer: {
    marginTop: 20,
    fontSize: 9,
    textAlign: "right",
    color: "#666",
  },
});

/* ================= PDF ================= */

export default function SalesByCategoryReportPdf({
  category,
  data,
  fromDate,
  toDate,
}: {
  category: string;
  data: any[];
  fromDate?: string | null;
  toDate?: string | null;
}) {
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

          {/* ================= REPORT INFO ================= */}
          <View style={styles.reportInfo}>
            <Text style={styles.title}>
              {category.replace(/-/g, " ")} Report
            </Text>

            {(fromDate || toDate) && (
              <Text style={styles.dateRange}>
                Period: {fromDate || "—"} → {toDate || "—"}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        {/* ================= TABLE HEADER ================= */}
        <View style={styles.tableHeader}>
          <Text style={styles.colOrder}>Order No</Text>
          <Text style={styles.colClient}>Client</Text>
          <Text style={styles.colDate}>Date</Text>
          <Text style={styles.colTotal}>Total</Text>
          <Text style={styles.colStatus}>Status</Text>
        </View>

        {/* ================= TABLE ROWS ================= */}
        {data.map((o) => (
          <View key={o._id} style={styles.tableRow}>
            <Text style={styles.colOrder}>{o.number}</Text>

            <Text style={styles.colClient}>
              {o.clientInfo?.company || o.client?.company || "-"}
            </Text>

            <Text style={styles.colDate}>
              {new Date(o.date).toDateString()}
            </Text>

            <Text style={styles.colTotal}>
              {o.total.toFixed(2)}
            </Text>

            <Text style={styles.colStatus}>{o.status}</Text>
          </View>
        ))}

        {/* ================= FOOTER ================= */}
        <Text style={styles.footer}>
          Generated on {new Date().toDateString()}
        </Text>

      </Page>
    </Document>
  );
}