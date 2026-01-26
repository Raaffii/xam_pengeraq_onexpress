import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import PageHeader from "@/components/common/PageHeader";
import { useNavigate, useLocation } from "react-router-dom";
import { monthsAndYear } from "@/utils/monthsYear";
import { useState } from "react";
import { useClassScheduleDetail } from "@/hooks/useClassScheduleDetail";
import { useEffect } from "react";
import CalendarDetailPage from "@/components/calendar/CalendarDetailPage";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CalendarPage() {
  usePageTitle("Calendar");

  const locales = {
    "en-US": enUS,
  };
  const navigate = useNavigate();
  const location = useLocation();

  const currentView =
    location.pathname === "/schedule/calendar" ? "calendar" : "list";

  const [calendarShow, setCalendarShow] = useState(0);
  const [view, setView] = useState(Views.MONTH);
  const [events, setEvents] = useState();
  const [openDetailDate, setOpenDetailDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
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

  const components = {
    event: ({ event }) => {
      if (event?.appointment) {
        return (
          <div
            onClick={() => handleDetailDate(event)}
            className={`flex gap-1 p-0.5 rounded-sm text-black hover:bg-white ${
              event.repeatvalue === "daily"
                ? "bg-red-300 border-2 border-red-500"
                : event.repeatvalue === "weekly"
                  ? "bg-yellow-300 border-2 border-yellow-500"
                  : event.repeatvalue === "monthly"
                    ? "bg-green-300 border-2 border-green-500"
                    : "bg-blue-300 border-2 border-blue-500"
            }`}>
            <div className=' gap-1'>
              {/* <UserIcon className='w-4' /> */}
              <h2 className='text-sm font-semibold'>{event?.teacher} </h2>
              <h3 className='text-xs'>{event?.examsubject}</h3>
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
    const mappedEvents = data.map((item) => ({
      start: new Date(item.classDateTime),
      end: new Date(new Date(item.classDateTime).getTime() + 40 * 60 * 1000),
      appointment: true,
      teacher: item.teacherName,
      examseries: item.examSeriesDescription,
      examsubject: item.subjDesc,
      repeatvalue: item.repeatValue,
      scheduleId: item.classSchDetailsId,
    }));

    setEvents(mappedEvents);
  };

  const actionsChildren = (
    <Select
      onValueChange={(value) => {
        if (value === "list") {
          navigate("/schedule");
        }

        if (value === "calendar") {
          navigate("/schedule/calendar");
        }
      }}
      value={currentView}>
      <SelectTrigger className='w-full max-w-48'>
        <SelectValue placeholder='View By' />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>View By</SelectLabel>

          <SelectItem value='list'>View By List</SelectItem>
          <SelectItem value='calendar'>View By Calendar</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );

  const handleChangeCalendar = async (con) => {
    if (con == "next") {
      const resultOri = await fetchClassScheduleDetail({
        date: new Date().setMonth(new Date().getMonth() + calendarShow + 1),
      });

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

  const handleDetailDate = (date) => {
    setOpenDetailDate(true);
    setSelectedDate(date.start);
  };

  return (
    <div>
      <PageHeader
        title='Schedule'
        subtitle='Manage Schedule'
        showSearch={false}
        searchPlaceholder='Search by name'
        searchMaxLength={50}
        children={actionsChildren}
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
            className='p-1.5  text-black rounded-md transition-colors font-bold hover:text-blue-500'>
            Prev
          </button>
          <button
            onClick={() => handleChangeCalendar("next")}
            className='p-1.5 text-black rounded-md transition-colors font-bold hover:text-blue-500'>
            Next
          </button>
        </div>

        <div className='flex gap-3 items-center'>
          <div className='rounded-lg overflow-hidden'>
            <button
              size='sm'
              onClick={() => handleViewChange(Views.DAY)}
              className='p-1.5  bg-blue-600 transition-colors border border-white text-white hover:bg-blue-800'>
              Today Agenda
            </button>
            <button
              onClick={() => handleViewChange(Views.MONTH)}
              className='p-1.5  bg-blue-600  transition-colors border border-white text-white hover:bg-blue-800'>
              Month
            </button>
            <button
              onClick={() => handleViewChange(Views.AGENDA)}
              className='p-1.5  bg-blue-600  transition-colors border border-white text-white hover:bg-blue-800'>
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
        selectable
        onSelectSlot={handleDetailDate}
        components={components}
        onView={handleViewChange}
        onNavigate={handleChangeCalendar}
      />

      <CalendarDetailPage
        open={openDetailDate}
        setOpen={setOpenDetailDate}
        data={events}
        selectedDate={selectedDate}
      />
      <div className='flex flex-wrap gap-3 my-3 text-sm'>
        <div className='flex items-center gap-2'>
          <span className='w-4 h-4 bg-red-400 border border-red-600 rounded'></span>
          <span>Daily Schedule</span>
        </div>

        <div className='flex items-center gap-2'>
          <span className='w-4 h-4 bg-yellow-400 border border-yellow-600 rounded'></span>
          <span>Weekly Schedule</span>
        </div>

        <div className='flex items-center gap-2'>
          <span className='w-4 h-4 bg-green-400 border border-green-600 rounded'></span>
          <span>Monthly Schedule</span>
        </div>

        <div className='flex items-center gap-2'>
          <span className='w-4 h-4 bg-blue-400 border border-blue-600 rounded'></span>
          <span>No Repetition Schedule</span>
        </div>
      </div>
    </div>
  );
}
