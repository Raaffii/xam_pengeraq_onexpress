import { useParams } from "react-router-dom";

export const ExamSubjectGradePage = () => {
  const { subjectId } = useParams();

  return <p className="text-sm text-gray-600">Subject ID: {subjectId}</p>;
};
