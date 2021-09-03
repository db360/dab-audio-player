import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Wave from "@foobar404/wave";
import { LazyLoadImage } from "react-lazy-load-image-component";
/* Components */
import PlayPauseBtn from "./components/PlayPauseBtn";
import NextBtn from "./components/NextBtn";
import PrevBtn from "./components/PrevBtn";
import audios from "./static/audios";

function App() {
  const songRef = useRef(null);
  const [wave] = useState(new Wave());
  const [barValue, setBarValue] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [hasChange, setHasChange] = useState(false);
  const currentSong = audios[currentSongIndex];

  useEffect(() => {
    window.document
      .getElementById("audio_element")
      .addEventListener("loadedmetadata", (e) => {
        songRef.current = e.target;
      });
    wave.fromElement("audio_element", "canvas_element", {
      type: "flower",
      colors: ['#000', '#fff']
    });
  }, [setCurrentSongIndex, wave]);

  const goToNextSong = (value) => {
    const nextSongIndex = currentSongIndex + value;
    const firstSongIndex = 0;
    const lastSongIndex = audios.length - 1;
    if(nextSongIndex >= audios.length){
      setCurrentSongIndex(firstSongIndex);
    } else if (nextSongIndex < firstSongIndex) {
      setCurrentSongIndex(lastSongIndex);
    } else {
      setCurrentSongIndex(nextSongIndex);
    }
    setHasChange(true);
    setIsPaused(false);
  }

  return (
    <div className="root">
      <div className="container">
        <div className="img-container">
        <LazyLoadImage
          effect="blur"
          placeholderSrc={currentSong.placeholder}
          src={currentSong.img}
          width="350px"
          className={`img ${!isPaused ? "animation-spin" : ""}`}
        />
        <canvas width="350px" height="350px" id="canvas_element" />
        </div>

        <div className="song-info">
          <h1>{currentSong.songName}</h1>
          <p>{currentSong.artist}</p>
          <audio
            autoPlay={hasChange}
            onEnded={() => goToNextSong(1)}
            src={currentSong.src}
            id="audio_element"
            onTimeUpdate={() => setBarValue(songRef.current.currentTime)}
          />
        </div>
        <div>
          <input
            value={barValue}
            type="range"
            min={0}
            max={songRef.current?.duration || 100 }
            className="input"
            onChange={(e) => (songRef.current.currentTime = e.target.value)}
          />
        </div>
        <div className="controller">
          <PrevBtn goToNextSong={goToNextSong}/>
          <PlayPauseBtn
            songRef={songRef}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
          />
          <NextBtn goToNextSong={goToNextSong} />
        </div>
      </div>
    </div>
  );
}

export default App;
