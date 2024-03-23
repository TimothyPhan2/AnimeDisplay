import React, { useState } from "react";
import "./App.css";
import anilist from "./api/anilist";
import BanList from "./components/BanList";
import HistoryList from "./components/HistoryList";
import AnimeBG from "./assets/AnimeBG.mp4";
const App = () => {
  const [anime, setAnime] = useState(null);
  const [banList, setBanList] = useState({
    seasons: [],
    statuses: [],
    genres: [],
    studios: [],
  });
  const [history, setHistory] = useState([]);

  const fetchRandomanime = (() => {
    let currentPage = 1;
    let maxPages = 100;
    let delay = 10000;

    return async () => {
      const query = `
        query ($page: Int, $perPage: Int) {
          Page(page: $page, perPage: $perPage) {
            media(type: ANIME, isAdult: false) {
              id
              title {
                romaji
              }
              coverImage {
                large
              }
              status
              season
              genres
              studios {
                nodes {
                 name
                }
              }
            }
          }
        }
      `;

      const variables = {
        page: currentPage,
        perPage: 50,
      };

      try {
        const response = await anilist.post("", {
          query: query,
          variables: variables,
        });
        const media = response.data.data.Page.media;
        const filteredMedia = media.filter(
          (anime) =>
            !banList.seasons.includes(anime.season) &&
            !banList.statuses.includes(anime.status) &&
            !anime.genres.some((genre) => banList.genres.includes(genre)) &&
            !anime.studios.nodes.some((studio) =>
              banList.studios.includes(studio.name)
            )
        );

        if (filteredMedia.length > 0) {
          const randomAnime =
            filteredMedia[Math.floor(Math.random() * filteredMedia.length)];
          setAnime(randomAnime);
          setHistory((prevHistory) => [...prevHistory, randomAnime]);
        } else if (currentPage < maxPages) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          currentPage++;
          await fetchRandomanime();
        } else {
          console.error("No anime found");
        }
      } catch (error) {
        console.error("Failed to fetch anime:", error);
      }
    };
  })();

  const addToBanList = (attributeType, value) => {
    setBanList((prevBanList) => ({
      ...prevBanList,
      [attributeType]: [...prevBanList[attributeType], value],
    }));
  };

  const removeFromBanList = (attributeType, value) => {
    setBanList((prevBanList) => ({
      ...prevBanList,
      [attributeType]: prevBanList[attributeType].filter(
        (item) => item !== value
      ),
    }));
  };
  return (
    <>
      <div>
        <video id="vidBG" src={AnimeBG} autoPlay loop muted />
      </div>
      <div className="History">
        <HistoryList history={history} />
      </div>
      <div style={{ color: "black" }}>
        <h1>AnimeShow</h1>
        <h2>Discover new animes</h2>
      </div>
      <div className="main">
        {anime ? (
          <div>
            <h2>{anime.title.romaji}</h2>
            <div className="attributes">
              <button onClick={() => addToBanList("seasons", anime.season)}>
                {anime.season}
              </button>
              <button onClick={() => addToBanList("statuses", anime.status)}>
                {anime.status}
              </button>
              {anime.genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => addToBanList("genres", genre)}
                >
                  {genre}
                </button>
              ))}
              {anime.studios.nodes.map((studio) => (
                <button
                  key={studio.name}
                  onClick={() => addToBanList("studios", studio.name)}
                >
                  {studio.name}
                </button>
              ))}
            </div>
            <div className="image-container">
              <img src={anime.coverImage.large} alt={anime.title.romaji} />
            </div>
            <button onClick={fetchRandomanime}>Find New anime</button>
          </div>
        ) : (
          <button onClick={fetchRandomanime}>Find New anime</button>
        )}
      </div>
      <div className="Banlist">
        <BanList banList={banList} handleRemove={removeFromBanList} />
      </div>
    </>
  );
};

export default App;
