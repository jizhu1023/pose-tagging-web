import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { Stage, Sprite } from '@inlet/react-pixi';
import { Viewport } from './Viewport';
import exampleImage from './example_data/simple002.jpeg';

function App() {
  const [imagePath, setImagePath] = useState<string>(exampleImage);
  const [stageWidth, setStageWidth] = useState<number>(256);
  const [stageHeight, setStageHeight] = useState<number>(256);
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (stageRef && stageRef.current) {
      setStageWidth(stageRef.current.offsetWidth);
      setStageHeight(stageRef.current.offsetHeight);
      // console.log(
      //   `${stageRef.current.offsetWidth} * ${stageRef.current.offsetHeight}`
      // );
    }
  }, [stageRef]);
  return (
    <div className="App">
      <header className="App-header"></header>
      <main className="App-main">
        <div className="Stage" ref={stageRef}>
          <Stage width={stageWidth} height={stageHeight}>
            <Viewport width={200} height={100}>
              <Sprite image={imagePath} x={0} y={0} />
            </Viewport>
          </Stage>
        </div>
      </main>
      <footer className="App-footer"></footer>
    </div>
  );
}

export default App;
