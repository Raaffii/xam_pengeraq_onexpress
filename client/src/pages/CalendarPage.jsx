import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import PageHeader from "@/components/common/PageHeader";
import { useNavigate } from "react-router-dom";
import { monthsAndYear } from "@/utils/monthsYear";
import { useState } from "react";

import { useClassScheduleDetail } from "@/hooks/useClassScheduleDetail";
import { useEffect } from "react";

export default function CalendarPage() {
  const locales = {
    "en-US": enUS,
  };
  const navigate = useNavigate();
  const [calendarShow, setCalendarShow] = useState(0);
  const [view, setView] = useState(Views.MONTH);
  const [events, setEvents] = useState();

  const { fetchClassScheduleDetail } = useClassScheduleDetail();

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchClassScheduleDetail({
        date: new Date().setMonth(new Date().getMonth() + calendarShow),
      });
      await handleEvent(result.data);
    };

    fetchData();
  }, [fetchClassScheduleDetail]);

  const actions = [
    {
      label: "table",
      onClick: () => navigate("/schedule"),
    },
    {
      label: "calendar",
      onClick: () => navigate("/schedule/calendar"),
    },
  ];

  const components = {
    event: ({ event }) => {
      if (event?.appointment) {
        return (
          <div
            className={`flex gap-1 p-0.5 rounded-sm text-black ${
              event.repeatvalue === "daily"
                ? "bg-red-300"
                : event.repeatvalue === "weekly"
                ? "bg-yellow-300"
                : event.repeatvalue === "monthly"
                ? "bg-green-300"
                : ""
            }`}>
            <div className='flex items-center gap-1'>
              {/* <UserIcon className='w-4' /> */}
              <h2>{event?.teacher} </h2>
            </div>
            {view === "agenda" && (
              <>
                <h2>
                  {" "}
                  <span className='font-semibold'>Series :</span>
                  {event?.examseries}
                </h2>
                <h2>
                  {" "}
                  <span className='font-semibold'>Subject:</span>
                  {event?.examsubject}
                </h2>
              </>
            )}
          </div>
        );
      }
      if (event?.data?.blockout) {
        return <h1>Cek</h1>;
      }
      return null;
    },
    dateCellWrapper: ({ value }) => {
      const today = new Date();
      const isToday = value.toDateString() === today.toDateString();

      return (
        <div
          className={`relative w-full h-full border border-gray-200/60 cursor-pointer transition-all duration-200 hover:bg-purple-50/40 ${
            isToday
              ? "bg-gradient-to-br from-purple-100 to-purple-50 border-purple-400 shadow-inner"
              : ""
          }`}>
          {isToday && (
            <span className='absolute top-1 left-1 text-[10px] font-bold text-purple-700 px-2 py-0.5 rounded-md shadow-sm'>
              Today
            </span>
          )}
        </div>
      );
    },
  };

  const handleEvent = async (data) => {
    console.log("datadata", data);
    const mappedEvents = data.map((item) => ({
      start: new Date(item.classDateTime),
      end: new Date(new Date(item.classDateTime).getTime() + 40 * 60 * 1000),
      appointment: true,
      teacher: item.teacherName,
      examseries: item.examSeriesDescription,
      examsubject: item.subjDesc,
      repeatvalue: item.repeatValue,
    }));

    setEvents(mappedEvents);
  };

  const handleChangeCalendar = async (con) => {
    if (con == "next") {
      const resultOri = await fetchClassScheduleDetail({
        date: new Date().setMonth(new Date().getMonth() + calendarShow + 1),
      });

      console.log("result ori", resultOri);

      await handleEvent(resultOri.data);
      setCalendarShow(calendarShow + 1);
    } else if (con == "prev") {
      const resultOri = await fetchClassScheduleDetail({
        date: new Date().setMonth(new Date().getMonth() + calendarShow - 1),
      });

      await handleEvent(resultOri.data);
      setCalendarShow(calendarShow - 1);
    } else {
      setCalendarShow(0);
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const monthYear = monthsAndYear(calendarShow);

  return (
    <div>
      <PageHeader
        title='Schedule'
        subtitle='Manage student records and exam series assignments'
        showSearch={true}
        searchPlaceholder='Search by name'
        searchMaxLength={50}
        actions2={actions}
      />
      <div className='flex justify-between m-2'>
        <div className='flex gap-3 items-center'>
          <h1 className='text-black font-semibold'>
            {monthYear.nowMonth} {monthYear.nowYear}
          </h1>

          <button
            // variant='outline'
            size='sm'
            onClick={() => handleChangeCalendar("now")}
            className='p-1.5 bg-blue-600 rounded-md transition-colors text-white'>
            Now
          </button>
          <button
            onClick={() => handleChangeCalendar("prev")}
            className='p-1.5  text-black rounded-md transition-colors'>
            Prev
          </button>
          <button
            onClick={() => handleChangeCalendar("next")}
            className='p-1.5 text-black rounded-md transition-colors'>
            next
          </button>
        </div>

        <div className='flex gap-3 items-center'>
          <div className='rounded-lg overflow-hidden'>
            <button
              size='sm'
              onClick={() => handleViewChange(Views.DAY)}
              className='p-1.5  bg-blue-600 transition-colors border border-white text-white'>
              Day
            </button>
            <button
              onClick={() => handleViewChange(Views.MONTH)}
              className='p-1.5  bg-blue-600  transition-colors border border-white text-white'>
              Month
            </button>
            <button
              onClick={() => handleViewChange(Views.AGENDA)}
              className='p-1.5  bg-blue-600  transition-colors border border-white text-white'>
              Agenda
            </button>
          </div>
        </div>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        style={{ height: 500 }}
        view={view}
        date={new Date().setMonth(new Date().getMonth() + calendarShow)}
        toolbar={false}
        components={components}
      />
    </div>
  );
}
