import { getGradeColor } from "@/utils";

export const GradeDisplay = ({ grade, marks, gpa, isRetake }) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-2 text-sm">
        <span
          className={`text-white px-2 py-1 rounded-lg ${getGradeColor(grade)}`}
        >
          {grade}
        </span>

        <span
          className={`px-2 py-1 ${
            isRetake ? "bg-gray-400" : "bg-gray-900"
          } text-white rounded-md font-medium`}
        >
          {marks}
        </span>
        <span className="px-2 py-1 bg-green-600 text-white rounded-md font-medium">
          {gpa}
        </span>
      </div>
    </div>
  );
};
