# udemy-pro
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
} from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: { flexDirection: "column", padding: 20 },
  section: { marginBottom: 10 },
  text: { fontSize: 16 },
});

// Function to Generate PDF Document
const generatePDF = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.text}>Hello, this is a dynamically generated PDF!</Text>
        </View>
      </Page>
    </Document>
  );
};

// Component to trigger PDF download
const MyPDFComponent = () => {
  return (
    <div>
      {/* Button to trigger PDF download */}
      <PDFDownloadLink document={generatePDF()} fileName="sample.pdf">
        {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
      </PDFDownloadLink>

      {/* Optional: Preview the PDF in-browser */}
      <PDFViewer width="100%" height="500px">{generatePDF()}</PDFViewer>
    </div>
  );
};

export default MyPDFComponent;
