import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { formatPeriod } from "@/utils";

// Register fonts
Font.register({
  family: "Calibri",
  fonts: [
    {
      src: "/fonts/calibri.ttf",
    },
    {
      src: "/fonts/calibri-bold.ttf",
      fontWeight: "bold",
    },
  ],
});
Font.register({
  family: "Century",
  fonts: [
    {
      src: "/fonts/century.ttf",
    },
    {
      src: "/fonts/century-bold.ttf",
      fontWeight: "bold",
    },
  ],
});

Font.register({
  family: "Tahoma",
  fonts: [
    {
      src: "/fonts/tahoma.ttf",
    },
    {
      src: "/fonts/tahoma-bold.ttf",
      fontWeight: "bold",
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 68, // 2.4 cm
    paddingBottom: 72, // 2.54 cm
    paddingLeft: 72, // 2.54 cm
    paddingRight: 72, // 2.54 cm
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  watermark: {
    position: "absolute",
    top: 50,
    left: 50,
    right: 50,
    bottom: 0,
    opacity: 0.1,
    objectFit: "contain",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
    // gap: 5,
  },
  logoContainer: {
    width: 95,
    height: 85,
    // marginRight: 15,
  },
  logo: {
    width: 95,
    height: 65,
  },
  header: {
    flex: 1,
    textAlign: "center",
  },
  headerTitle: {
    fontSize: 10,
    fontFamily: "Tahoma",
    fontWeight: "bold",
  },
  headerText: {
    fontSize: 10,
    fontFamily: "Tahoma",
    // marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontFamily: "Calibri",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#FF0000",
    transform: "translateY(-50%)",
  },
  studentInfo: {
    marginBottom: 20,
    transform: "translateY(-80%)",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: 120,
    fontFamily: "Calibri",
    fontSize: 13,
  },
  value: {
    flex: 1,
    fontFamily: "Calibri",
    fontSize: 13,
  },
  courseTable: {
    // marginBottom: 10,
    position: "relative",
    transform: "translateY(-80%)",
  },
  tableContent: {
    position: "relative",
    zIndex: 1,
  },
  tableHeader: {
    flexDirection: "row",
    paddingBottom: 5,
    marginBottom: 5,
    fontFamily: "Calibri",
    fontWeight: "bold",
    fontSize: 13,
    textAlign: "center",
  },
  codeColumn: {
    width: "15%",
  },
  nameColumn: {
    width: "45%",
  },
  creditColumn: {
    width: "15%",
    textAlign: "center",
  },
  gradeColumn: {
    width: "12.5%",
    textAlign: "center",
  },
  gpaColumn: {
    width: "12.5%",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 5,
    fontSize: 13,
    fontFamily: "Calibri",
  },
  tableSummaryRow: {
    flexDirection: "row",
    paddingTop: 5,
    // marginTop: 20,
    fontSize: 13,
    fontFamily: "Calibri",
    transform: "translateY(-100%)",
  },
  summaryLeftColumn: {
    width: "75%",
    textAlign: "left",
    paddingLeft: 50,
  },
  summaryRightColumn: {
    width: "75%",
    textAlign: "right",
    paddingRight: 50,
  },
  signature: {
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: "Century",
    fontSize: 11,
  },
  signatureBlock: {
    width: "45%",
    alignItems: "center",
    marginTop: 30,
  },
  signatureLine: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#000",
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 11,
    fontFamily: "Century",
    textAlign: "center",
  },
});

export const TranscriptPDF = ({
  setup,
  data,
  overallGPA,
  achievement,
  selectedSeries,
}) => {
  const studentResult = data?.results;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src="/images/pergeraq-logo.png" style={styles.watermark} />

        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image src="/images/pergeraq-logo.png" style={styles.logo} />
          </View>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{setup.coyName}</Text>
            <Text style={styles.headerText}>{setup.addr1}</Text>
            <Text style={styles.headerText}>{setup.addr2}</Text>
            <Text style={styles.headerText}>{setup.addr3}</Text>
          </View>
        </View>
        <Text style={styles.title}>TRANSKRIP AKADEMIK</Text>
        <View style={styles.studentInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>NAMA</Text>
            <Text style={styles.value}>: {data.studentName || ""}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>ID PELAJAR</Text>
            <Text style={styles.value}>: {data.studentIdNo || ""}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>PROGRAM</Text>
            <Text style={styles.value}>
              : {data.programName || "SIJIL PENINGKATAN GURU AL-QURAN"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>SESI AKADEMIK</Text>
            <Text style={styles.value}>
              : {selectedSeries.seriesDesc || ""} (
              {formatPeriod(
                selectedSeries.seriesStartDate,
                selectedSeries.seriesEndDate,
              )}
              )
            </Text>
          </View>
        </View>
        <View style={styles.courseTable}>
          <View style={styles.tableContent}>
            <View style={styles.tableHeader}>
              <Text style={styles.codeColumn}>Kod</Text>
              <Text style={styles.nameColumn}>Modul</Text>
              <Text style={styles.creditColumn}>Jam Kredit</Text>
              <Text style={styles.gradeColumn}>Gred</Text>
              <Text style={styles.gpaColumn}>GPA</Text>
            </View>
            {studentResult.map((course, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.codeColumn}>{course.subjCode || "-"}</Text>
                <Text style={styles.nameColumn}>{course.subjDesc || "-"}</Text>
                <Text style={styles.creditColumn}>
                  {course.subjCredit || "-"}
                </Text>
                <Text style={styles.gradeColumn}>
                  {course.subjGrade || "-"}
                </Text>
                <Text style={styles.gpaColumn}>
                  {Number(course.subjGpa).toFixed(2) || "-"}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.tableSummaryRow}>
          <Text style={styles.summaryLeftColumn}>
            GPA KESELURUHAN: {Number(overallGPA).toFixed(2)}
          </Text>
          <Text style={styles.summaryRightColumn}>
            PENCAPAIAN: {achievement}
          </Text>
        </View>
        <View style={styles.signature}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>{setup.signatureName1}</Text>
            <Text style={styles.signatureText}>({setup.titleName1})</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>{setup.signatureName2}</Text>
            <Text style={styles.signatureText}>({setup.titleName2})</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
