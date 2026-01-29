import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";

import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import PageHeader from "@/components/common/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { monthsAndYear } from "@/utils/monthsYear";
import { useState, useRef } from "react";
import { useClassScheduleDetail } from "@/hooks/useClassScheduleDetail";
import { useEffect } from "react";
import { SearchableDropdown } from "@/components/common";
import { Filter } from "lucide-react";

export default function TeacherCalendarPage() {
  const { id } = useParams();
  const locales = {
    "en-US": enUS,
  };
  const navigate = useNavigate();
  const [calendarShow, setCalendarShow] = useState(0);
  const [view, setView] = useState(Views.MONTH);
  const [events, setEvents] = useState();
  const hasFetchedData = useRef(false);
  const { fetchClassScheduleDetail, onSearch, classScheduleDetail, isLoading } =
    useClassScheduleDetail();

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    const fetchData = async () => {
      const result = await fetchClassScheduleDetail({
        date: new Date().setMonth(new Date().getMonth() + calendarShow),
        scheduleId: id || null,
      });
      await handleEvent(result.data);
    };

    fetchData();
  }, [fetchClassScheduleDetail]);

  const components = {
    event: ({ event }) => {
      if (event?.appointment) {
        const isPast = new Date() > new Date(event?.start);
        const today = new Date();
        const isToday = event.start.toDateString() === today.toDateString();

        return (
          <div
            className={`flex gap-1 px-0.5 rounded-sm overflow-hidden text-white ${isToday ? "    bg-blue-400 border-2 border-blue-900" : "bg-purple-400 border-2 border-purple-900 "}   font-semibold ${
              isPast ? "line-through opacity-60 hover:bg-blue-900" : ""
            }`}
            onClick={() => {
              isPast
                ? navigate(`/teacher/class-attendance/${event?.scheduleid}`)
                : alert("Class Session Has Not Begun Yet");
            }}>
            <div className='flex items-center gap-1'>
              {/* <UserIcon className='w-4' /> */}
              <h2>{event?.examsubject} </h2>
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
      scheduleid: item.classSchDetailsId,
      appointment: true,
      teacher: item.teacherName,
      examseries: item.examSeriesDescription,
      examsubject: item.subjDesc,
      repeatvalue: item.repeatValue,
    }));

    setEvents(mappedEvents);
  };

  const handleChangeCalendar = async (con) => {
    const baseDate = new Date();

    baseDate.setDate(1);

    let newMonthOffset = calendarShow;

    if (con === "next") {
      newMonthOffset = calendarShow + 1;
      setCalendarShow(calendarShow + 1);
    } else if (con === "prev") {
      newMonthOffset = calendarShow - 1;
      setCalendarShow(calendarShow - 1);
    } else {
      newMonthOffset = 0;
      setCalendarShow(0);
    }

    baseDate.setMonth(baseDate.getMonth() + newMonthOffset);

    const resultOri = await fetchClassScheduleDetail({
      date: baseDate,
      usePagination: false,
      scheduleId: id || null,
    });

    await handleEvent(resultOri.data);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const monthYear = monthsAndYear(calendarShow);

  let currentView;

  if (id) {
    currentView =
      location.pathname === `/teacher/schedule/calendar/${id}`
        ? "calendar"
        : "list";
  } else {
    currentView =
      location.pathname === "/teacher/schedule/calendar" ? "calendar" : "list";
  }

  const actions = [
    {
      label: "Back",
      onClick: () => navigate(`/teacher/schedule`),
    },
  ];

  const calendarDate = new Date();
  calendarDate.setDate(1);
  calendarDate.setMonth(calendarDate.getMonth() + calendarShow);

  return (
    <div>
      <PageHeader
        title={`Teacher Schedules ${id ? `Detail - ${classScheduleDetail[0]?.subjDesc || "loading"} ` : ""} `}
        subtitle={`${isLoading ? "...Loading" : "Your Schedule"}`}
        showSearch={false}
        onSearch={onSearch}
        searchPlaceholder='Search by name'
        searchMaxLength={50}
        actions2={id ? actions : undefined}>
        <div className='w-full md:min-w-[200px] md:w-auto'>
          <SearchableDropdown
            id={"value"}
            name={"value"}
            value={currentView}
            onChange={(e) => {
              const { value } = e.target;
              if (value === "list") {
                if (id) {
                  navigate(`/teacher/schedule/detail/${id}`);
                } else {
                  navigate(`/teacher/schedule`);
                }
              }

              if (value === "calendar") {
                if (id) {
                  navigate(`/teacher/schedule/calendar/${id}`);
                } else {
                  navigate(`/teacher/schedule/calendar`);
                }
              }
            }}
            options={[
              { value: "list", label: "View By List" },
              { value: "calendar", label: "View By Calendar" },
            ]}
            placeholder={"View By"}
            searchPlaceholder='Search...'
            emptyMessage='No items found'
            icon={Filter}
            minSearchLength={0}
            className='h-10'
          />
        </div>
      </PageHeader>

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
              className='p-1.5  bg-blue-600 transition-colors border border-white text-white hover:bg-blue-900'>
              Today Agenda
            </button>
            <button
              onClick={() => handleViewChange(Views.MONTH)}
              className='p-1.5  bg-blue-600  transition-colors border border-white text-white hover:bg-blue-900'>
              Month
            </button>
            <button
              onClick={() => handleViewChange(Views.AGENDA)}
              className='p-1.5  bg-blue-600  transition-colors border border-white text-white hover:bg-blue-900'>
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
        onView={handleViewChange}
        view={view}
        date={calendarDate}
        onNavigate={handleChangeCalendar}
        toolbar={false}
        components={components}
      />
    </div>
  );
}
