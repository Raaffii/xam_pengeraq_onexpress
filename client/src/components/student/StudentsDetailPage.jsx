import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
export default function StudentsDetailPage() {
  const { id } = useParams();

  return <h1>{id}</h1>;
}
