import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Modal } from "../custom";
import { useClassScheduleDetail } from "@/hooks/useClassScheduleDetail";

const AttendanceQRCodeModal = ({
  open,
  setOpen,
  link,
  subjectName,
  teacherName,
  classschhdid,
  classStartDateTime,
}) => {
  const [classStarted, setClassStarted] = useState();
  const [urlToken, setUrlToken] = useState();

  const {
    startClassSession,
    fetchClassScheduleDetail,
    openClassSession,
    classScheduleDetail,
  } = useClassScheduleDetail();

  useEffect(() => {
    const fetchData = async () => {
      let result;
      if (open) {
        console.log("cek1");
        result = await openClassSession(classschhdid);
        setClassStarted(result.token ? true : false);
        setUrlToken(`${CHECKIN_URL}/checkin/?token=${result.token}`);
      }
    };

    fetchData();
  }, [openClassSession, classschhdid]);

  const CHECKIN_URL = import.meta.env.VITE_STUDENT_PORTAL;

  const handleStartClass = async () => {
    const result = await startClassSession({ classschhdid });
    setUrlToken(`${CHECKIN_URL}/checkin/?token=${result.token}`);
    setClassStarted(true);
  };

  const handleClose = () => {
    setClassStarted(false); // reset when modal closed
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose} size='xl'>
      {!classStarted ? (
        <div className='flex justify-center'>
          <div className='bg-white rounded-sm shadow-sm border w-full max-w-md p-6 text-center'>
            <h2 className='text-lg font-semibold text-gray-800'>
              Start Class Session?
            </h2>

            <p className='text-sm text-gray-500 mt-2'>
              Once started, students will be able to scan the QR code to mark
              their attendance.
            </p>

            <div className='flex justify-center gap-3 mt-6'>
              <button
                type='button'
                className='px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-50'
                onClick={handleClose}>
                Cancel
              </button>

              <button
                type='button'
                className='px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700'
                onClick={handleStartClass}>
                Start Class
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex justify-center'>
          <div className='bg-white rounded-sm shadow-sm border w-full max-w-md overflow-hidden'>
            {/* Header */}
            <div className='bg-gray-50 border-b px-6 py-4'>
              <h2 className='text-lg font-semibold text-gray-800 text-center'>
                Student Attendance QR Code
              </h2>
              <p className='text-sm text-gray-500 text-center'>
                Scan this QR code to mark your attendance
              </p>
            </div>

            {/* Content */}
            <div className='px-6 py-5'>
              {/* Class Info */}
              <div className='text-center mb-4'>
                <p className='text-base font-medium text-gray-800'>
                  {subjectName}
                </p>
                <p className='text-sm text-gray-600'>
                  Teacher: <span className='font-medium'>{teacherName}</span>
                </p>
              </div>

              {/* QR Code */}
              <div className='flex justify-center'>
                <div className='p-4 border rounded-xl bg-gray-50'>
                  <QRCodeCanvas value={String(urlToken)} size={200} />
                </div>
              </div>

              {/* Note */}
              <p className='text-xs text-gray-400 text-center mt-4'>
                This QR code is only valid for the current class session
              </p>

              {/* End Class */}
              <div className='flex justify-center mt-6'>
                <button
                  type='button'
                  className='px-4 py-2 rounded-md border text-red-600 hover:bg-red-50'
                  onClick={handleClose}>
                  End Class
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AttendanceQRCodeModal;
