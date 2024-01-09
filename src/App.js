import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {

  const [current, setCurrent] = useState({});
  const [page, setPage] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [date, setDate] = useState(new Date());
  const [maxPage, setMaxPage] = useState(0);
  const [transcript, setTranscript] = useState([]);

  useEffect(() => {
    const idFromUrl = window.location.pathname;
    console.log('idFromUrl ', idFromUrl);
    const pageId = idFromUrl.split('/')[1] ? idFromUrl.split('/')[1] : 0;
    console.log('pageId ', pageId);
    setPage(pageId);
  }, []);

  const getDate = (current) => {
    const createdDate = new Date(current.year, current.month - 1, current.day);
    setDate(createdDate);
  }

  const getPageData = () => {
    let url = "https://xkcd.com/";

    if (page === 0) {
      url += "info.0.json";
    } else {
      url += page + "/info.0.json";
    }

    const axiosInstance = axios.create({
      baseURL: 'https://xkcd.com/',
      headers: {
        'Content-Type': 'application/json',
        'Sec-Fetch-Dest': '',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
      },
    });

    axiosInstance.get(url).then(res => {
      setCurrent(res.data);
      getDate(res.data);
      setIsButtonDisabled(false);
      formatText(res.data.transcript);
      if (maxPage === 0) {
        setMaxPage(res.data.num);
      }
    });

  }

  useEffect(() => {
    getPageData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const next = () => {
    const newPage = parseInt(page) + 1;
    setPage(newPage);
    setIsButtonDisabled(true);
    window.history.pushState({ page }, null, `/${newPage}`);
  }

  const previous = () => {
    const newPage = parseInt(page) === 0 ? maxPage - 1 : parseInt(page) - 1;
    setPage(newPage);
    setIsButtonDisabled(true);
    window.history.pushState({ page }, null, `/${newPage}`);
  }

  const random = () => {
    const num = Math.floor(Math.random() * maxPage) + 1;
    setPage(num);
    window.history.pushState({ page }, null, `/${num}`);
    setIsButtonDisabled(true);
  }

  const formatText = (text) => {
    if (text) {
      const sentences = text.split(/\]\]\s+/);
      const paragraphs = sentences.map(sentence => sentence.replace(/\[\[/g, '').trim());
      const formattedText = paragraphs.join('\n\n');
      const splitBy = /[.?{{}}]/; 
      const lines = formattedText.split(splitBy);
      setTranscript(lines);
    }
  }
  

  return (
    <div className="App">
      <section className="button-controls">
        <button disabled={isButtonDisabled|| page === 1} onClick={() => previous()}>Previous</button>
        <button disabled={isButtonDisabled} onClick={() => random()}>Random</button>
        <button disabled={isButtonDisabled || page === maxPage || page === 0} onClick={() => next()}>Next</button>
      </section>
      <section className='content'>
        <h2>{current.title}</h2>
        <h2>{date.toLocaleDateString()}</h2>
        <img src={current.img} alt={current.alt} />
        <div className="transcript">
        {transcript.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        </div>
      </section>
      <section className="button-controls">
        <button disabled={isButtonDisabled|| page === 1} onClick={() => previous()}>Previous</button>
        <button disabled={isButtonDisabled} onClick={() => random()}>Random</button>
        <button disabled={isButtonDisabled || page === maxPage} onClick={() => next()}>Next</button>
      </section>
    </div>
  );
}

export default App;
