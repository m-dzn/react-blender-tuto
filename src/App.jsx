import { useLoader, Canvas } from "@react-three/fiber";

import "./App.css";
import { OrbitControls } from "@react-three/drei";
import Model from "./components/Model";

function App() {
  return (
    <div className="App">
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={10} />

        <Model url={"/assets/models/table.glb"} />
        <Model
          url={"/assets/models/chair.glb"}
          position={[11, 1, 0]}
          scale={[1.7, 1.7, 1.7]}
        />
        <Model
          url={"/assets/models/desk.glb"}
          position={[10, 3, 6]}
          scale={[7, 7, 7]}
          rotation={[0, Math.PI, 0]}
        />
        <Model
          url={"/assets/models/cubi.glb"}
          position={[25, 3, 0]}
          scale={[4, 4, 4]}
          rotation={[0, (-Math.PI * 3) / 8, 0]}
        />
      </Canvas>
    </div>
  );
}

export default App;
