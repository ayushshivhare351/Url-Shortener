import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Stats() {
  const { shortId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(
      `${import.meta.env.VITE_API_URL}/stats/${shortId}`
    ).then(res => setData(res.data));
  }, []);

  if (!data) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>URL Stats</h1>
      <p>Short ID: {data.shortId}</p>
      <p>Original URL: {data.longUrl}</p>
      <p>Total Clicks: {data.totalClicks}</p>
    </div>
  );
}