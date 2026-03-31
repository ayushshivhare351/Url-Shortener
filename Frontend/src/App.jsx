import { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  
  const handleShorten = async () => {
  try {
    const res = await axios.post("http://localhost:3000/shorten", {
      longUrl: url
    });

    setShortUrl(res.data.shortUrl);
    setUrl(""); // clears the input
    }catch (error) {
    console.log(error);
    }
  };
  
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "100px",
      fontFamily: "Arial, sans-serif",
      
    }}>
      
      <h1>URL Shortener 🔗</h1>

      <input
        type="text"
        placeholder="Enter your long URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginRight: "10px"
        }}
      />

      <button
        onClick={handleShorten}
        style={{ padding: "10px" }}
      >
        Shorten
      </button>

      {shortUrl && (
        <div>
          Short URL: <a href={shortUrl}
          target="_blank"
          rel="noopener noreferrer">{shortUrl}</a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(shortUrl); // copy text
              setCopied(true);                          // show feedback
              setTimeout(() => setCopied(false), 1500); // hide after 1.5s
            }}>Copy
          </button>
          {copied && <span style={{ marginLeft: "10px", color: "green" }}>
            Copied!</span>}
        </div>
      )}
    </div>
  );
}

export default App;