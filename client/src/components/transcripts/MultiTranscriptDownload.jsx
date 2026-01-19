import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { TranscriptPDF } from "./TranscriptPDF";
import { AttendancePDF } from "./AttendancePDF";
import { DownloadModal } from "./DownloadModal";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

export const MultiTranscriptDownload = ({
  selectedStudents,
  pdfDataMap,
  selectedSeries,
  setup,
}) => {
  // console.log("all data", pdfDataMap);
  // console.log("selected student: ", selectedStudents);
  // console.log("selected series: ", selectedSeries);
  // console.log("setup", setup);
  const [downloading, setDownloading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const downloadAll = async (selectedDocs) => {
    if (!selectedDocs.transcript && !selectedDocs.attendance) return;

    setDownloading(true);
    setIsModalOpen(false);

    for (const studentId of selectedStudents) {
      const pdfData = pdfDataMap.find(
        (student) => student.studentId === studentId,
      );

      if (pdfData) {
        const studentIdNo = pdfData.studentIdNo;

        try {
          // Generate and download transcript PDF if selected
          if (selectedDocs.transcript) {
            const transcriptBlob = await pdf(
              <TranscriptPDF
                setup={setup}
                data={pdfData}
                overallGPA={pdfData.summary.overallGrade}
                achievement={pdfData.summary.gradeResult}
                selectedSeries={selectedSeries}
              />,
            ).toBlob();

            const transcriptLink = document.createElement("a");
            transcriptLink.href = URL.createObjectURL(transcriptBlob);
            transcriptLink.download = `transcript-${studentIdNo}-${selectedSeries.seriesDesc}.pdf`;
            transcriptLink.click();
            URL.revokeObjectURL(transcriptLink.href);
          }

          if (selectedDocs.attendance) {
            const totalCredits = pdfData.results.reduce(
              (sum, result) => sum + (result.subjCredit || 0),
              0,
            );

            const attendanceBlob = await pdf(
              <AttendancePDF
                data={pdfData}
                achievement={pdfData.summary.gradeResult}
                selectedSeries={selectedSeries}
                credits={totalCredits}
                setup={setup}
              />,
            ).toBlob();

            const attendanceLink = document.createElement("a");
            attendanceLink.href = URL.createObjectURL(attendanceBlob);
            attendanceLink.download = `attendance-${studentIdNo}-${selectedSeries.seriesDesc}.pdf`;
            attendanceLink.click();
            URL.revokeObjectURL(attendanceLink.href);
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(
            `Error generating PDFs for student ${studentIdNo}:`,
            error,
          );
        }
      }
    }

    setDownloading(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        disabled={downloading}
        className="w-full"
      >
        <Download className="w-5 h-5 mr-2" />
        {downloading ?
          "Preparing Downloads..."
        : `Print Selected (${selectedStudents.length})`}
      </Button>

      <DownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={downloadAll}
        selectedCount={selectedStudents.length}
      />
    </>
  );
};
