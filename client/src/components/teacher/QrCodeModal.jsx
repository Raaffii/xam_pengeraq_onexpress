import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Modal } from "../custom";
import { useClassScheduleDetail } from "@/hooks/useClassScheduleDetail";
import CountDown from "./CountDown";
import PropTypes from "prop-types";
import { RefreshCcw } from "lucide-react";

const AttendanceQRCodeModal = ({
  open,
  setOpen,
  subjectName,
  teacherName,
  classschhdid,
}) => {
  const [classStarted, setClassStarted] = useState();
  const [urlToken, setUrlToken] = useState();

  const { startClassSession, openClassSession } = useClassScheduleDetail();
  const [startDateTime, setStartDateTime] = useState();

  useEffect(() => {
    const fetchData = async () => {
      let result;
      if (open) {
        result = await openClassSession(classschhdid);

        setStartDateTime(result.startDateTime);
        setClassStarted(result.token ? true : false);
        setUrlToken(`${CHECKIN_URL}/checkin/?token=${result.token}`);
      }
    };

    fetchData();
  }, [openClassSession, classschhdid, open]);

  const CHECKIN_URL = import.meta.env.VITE_STUDENT_PORTAL;

  const handleStartClass = async () => {
    const result = await startClassSession(classschhdid);
    setStartDateTime(result.startDateTime);

    setUrlToken(`${CHECKIN_URL}/checkin/?token=${result.token}`);
    setClassStarted(true);
  };

  const handleClose = () => {
    setClassStarted(false); // reset when modal closed
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose} size='xl' title={"Qr Code"}>
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
              <CountDown startDateTime={startDateTime} />

              <div className='flex justify-center'>
                <div className='p-4 border rounded-xl bg-gray-50'>
                  <QRCodeCanvas value={String(urlToken)} size={200} />
                </div>
              </div>

              <p className='text-xs text-gray-400 text-center mt-4'>
                This QR code is only valid for the current class session
              </p>

              <div className='flex justify-center mt-6 gap-2'>
                <button
                  type='button'
                  className='px-4 py-2 rounded-sm bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2'
                  onClick={handleStartClass}>
                  <RefreshCcw width={15} />
                  Renew
                </button>
                <button
                  type='button'
                  className='px-4 py-2 rounded-md border text-red-600 hover:bg-red-50'
                  onClick={handleClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

AttendanceQRCodeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  subjectName: PropTypes.string,
  teacherName: PropTypes.string,
  classschhdid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default AttendanceQRCodeModal;
