import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
export default function StudentsDetailPage() {
  const { id } = useParams();

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto'>
        <div className='px-4 sm:px-6 lg:px-8 py-6'>
          <div className='bg-white overflow-hidden shadow-xl ring-1 ring-gray-200 rounded-xl border border-gray-100 mb-6'>
            <div className='px-6 py-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Student Information
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Student ID
                  </label>
                  <div className='bg-gray-50 rounded-lg px-4 py-3 border border-gray-200'>
                    <span className='text-gray-900 font-medium'>
                      {/* {student.studentidno || "Loading..."} */} 1234B
                    </span>
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Student Name
                  </label>
                  <div className='bg-gray-50 rounded-lg px-4 py-3 border border-gray-200'>
                    <span className='text-gray-900 font-medium'>
                      {/* {student.studentname || "Loading..."} */} Ceko
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* cecleclelc */}
      </div>
    </div>
  );
}
