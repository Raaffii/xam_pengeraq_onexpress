import { formatPeriod } from "@/utils";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

const cmToPoints = (cm) => cm * 28.346;

Font.register({
  family: "Calibri",
  src: "/fonts/calibri.ttf",
});

Font.register({
  family: "Lucida",
  src: "/fonts/lucida.ttf",
});

Font.register({
  family: "Century",
  fonts: [
    { src: "/fonts/century.ttf" },
    { src: "/fonts/century-bold.ttf", fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    fontFamily: "Calibri",
    fontSize: 11,
    alignItems: "center",
  },
  headerContainer: {
    marginBottom: 10,
    alignItems: "center",
  },
  logoContainer: {
    width: cmToPoints(4.6),
  },
  logo: {
    width: cmToPoints(4.6),
    height: cmToPoints(3.6),
  },
  bismillah: {
    width: cmToPoints(8.5),
    height: cmToPoints(2.35),
  },
  orgName: {
    fontSize: 16,
    fontFamily: "Century",
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  serialNumber: {
    fontSize: 12,
    fontFamily: "Century",
    marginBottom: 10,
    textAlign: "center",
  },
  certificateTitle: {
    fontSize: 32,
    fontFamily: "Lucida",
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFC000",
    textAlign: "center",
  },
  periodText: {
    fontSize: 14,
    fontFamily: "Century",
    marginBottom: 10,
    textAlign: "center",
  },
  moduleInfo: {
    fontSize: 14,
    fontFamily: "Century",
    marginBottom: 15,
    textAlign: "center",
  },
  certificationText: {
    fontSize: 14,
    fontFamily: "Century",
    marginBottom: 20,
    textAlign: "center",
  },
  studentName: {
    fontSize: 20,
    fontFamily: "Century",
    marginBottom: 5,
    textAlign: "center",
  },
  studentId: {
    fontSize: 20,
    fontFamily: "Century",
    marginBottom: 10,
    textAlign: "center",
  },
  achievementText: {
    fontSize: 14,
    fontFamily: "Century",
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 1.5,
  },
  achievement: {
    fontSize: 18,
    fontFamily: "Century",
    fontWeight: "bold",
    marginBottom: 60,
    textAlign: "center",
  },
  signature: {
    marginTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  signatureBlock: {
    width: "45%",
    alignItems: "center",
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
  watermark: {
    position: "absolute",
    width: "80%",
    height: "80%",
    opacity: 0.1,
    objectFit: "contain",
  },
});

export const AttendancePDF = ({
  data,
  credits,
  achievement,
  selectedSeries,
  setup,
}) => {
  const result = data?.results;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image src="/images/pergeraq-logo.png" style={styles.logo} />
          </View>
          <Text style={styles.orgName}>Persatuan Guru-Guru Al-Quran</Text>
          <Text style={styles.serialNumber}>IECP Serial No. 17030132</Text>
          <Image src="/images/bismillah.png" style={styles.bismillah} />
        </View>

        <Text style={styles.certificateTitle}>SIJIL PENINGKATAN</Text>
        <Text style={styles.certificateTitle}>GURU AL-QURAN</Text>

        <Text style={styles.periodText}>
          {formatPeriod(
            selectedSeries.seriesStartDate,
            selectedSeries.seriesEndDate,
          )}
        </Text>

        <Text style={styles.moduleInfo}>
          {result.length || 10} Modul ({credits ? credits : "N/A"} jam
          pertemuan)
        </Text>

        <Text style={styles.certificationText}>Dengan ini disahkan bahawa</Text>
        <Text style={styles.studentName}>{data.studentName || ""}</Text>
        <Text style={styles.studentId}>{data.studentIdNo || ""}</Text>

        <Text style={styles.achievementText}>
          Telah lulus peperiksaan serta memenuhi segala{"\n"}
          syarat program dengan memperolehi pangkat
        </Text>
        <Text style={styles.achievement}>{achievement || "BAIK"}</Text>

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
