import { Modal } from "../custom";
import PropTypes from "prop-types";

export default function CalendarDetailPage({
  open,
  setOpen,
  data = [],
  selectedDate,
}) {
  const selectedDay = new Date(selectedDate).toDateString();

  const filteredData = data.filter((item) => {
    return new Date(item?.start).toDateString() === selectedDay;
  });

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      title={
        <div className=''>
          <h1>Schedule Detail</h1>
          <h3 className='text-sm font-normal'>
            All Schedule At <span className='font-semibold'>{selectedDay}</span>
          </h3>
        </div>
      }
      size='xl'>
      {filteredData?.map((item, index) => (
        <div
          key={index}
          className='bg-white border rounded-lg p-2 shadow-sm hover:shadow-md transition my-3 
          '>
          <div className='flex justify-between items-center'>
            <div>
              <p className='font-semibold text-gray-800'>{item.teacher}</p>
              <p className='font-semibold text-blue-600'>{item.examsubject}</p>
            </div>

            <div className='flex-col flex items-center '>
              <span className='bg-gray-400 text-white text-xs px-3 py-1 rounded-sm'>
                Start Time : {formatTime(item.start)}
              </span>

              <div className='w-full flex items-center justify-center'>
                <h2 className='text-sm font-semibold'>
                  {item?.repeatvalue || "No-Repetation"}
                </h2>
              </div>
            </div>
          </div>
        </div>
      ))}

      {filteredData.length == 0 && <h2>No Schedule</h2>}
    </Modal>
  );
}

CalendarDetailPage.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.array,
  selectedDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
};
