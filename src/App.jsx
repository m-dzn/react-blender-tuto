import { Canvas, useThree } from "@react-three/fiber";

import "./App.css";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import Model from "./components/Model";
import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";

import monitorDisplayVertexShader from "./shaders/vertex.glsl?raw";
import monitorDisplayFragmentShader from "./shaders/fragment.glsl?raw";

const App = () => {
  const { x, y, z } = useControls("Model Position", {
    x: { value: 0, min: -100, max: 100 },
    y: { value: -10, min: -100, max: 100 },
    z: { value: 0, min: -100, max: 100 },
  });

  return (
    <div className="App">
      <Canvas>
        <Camera />

        <Lightings />

        <Model url={"/assets/models/home.glb"} position={[x, y, z]} />
      </Canvas>
    </div>
  );
};

const Camera = () => {
  const { camera } = useThree();

  const { cameraX, cameraY, cameraZ } = useControls("Camera Position", {
    cameraX: { value: 100, min: 0, max: 200 },
    cameraY: { value: 100, min: 0, max: 200 },
    cameraZ: { value: 100, min: 0, max: 200 },
  });

  useEffect(() => {
    camera.position.set(cameraX, cameraY, cameraZ);
  }, [cameraX, cameraY, cameraZ, camera]);

  return (
    <>
      <OrthographicCamera makeDefault zoom={15} near={0.1} far={1000} />

      <OrbitControls />
    </>
  );
};

const Lightings = () => {
  const lightRef = useRef();

  const { lightX, lightY, lightZ, intensity } = useControls("Light Position", {
    lightX: { value: 2, min: -10, max: 10 },
    lightY: { value: 10, min: -10, max: 10 },
    lightZ: { value: -2, min: -10, max: 10 },
    intensity: { value: 5, min: -2, max: 50, step: 0.1 },
  });

  const { scene } = useThree();
  const [bulbLight, setBulbLight] = useState();

  useEffect(() => {
    scene.traverse((child) => {
      if (child.name === "stand") {
        const pointLight = (
          <pointLight
            position={child.position.clone()}
            intensity={100}
            scale={{ x: 0.001, y: 0.001, z: 0.001 }}
          />
        );

        setBulbLight(pointLight);
      }

      if (child.name === "monitor_display") {
        child.material = (
          <shaderMaterial
            vertexShader={monitorDisplayVertexShader}
            fragmentShader={monitorDisplayFragmentShader}
          />
        );
      }
    });
  }, [scene]);

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.position.set(lightX, lightY, lightZ);
      lightRef.current.intensity = intensity;
    }
  }, [lightX, lightY, lightZ, intensity]);

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight
        ref={lightRef}
        position={[10, 10, 5]}
        intensity={intensity}
        castShadow
      />

      {bulbLight}
    </>
  );
};

const Studio = () => {
  return (
    <>
      <mesh scale={[50, 1, 50]} position={[8, -1, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="#aaa" />
      </mesh>
      <mesh scale={[50, 25, 1]} position={[8, 11, -25]}>
        <boxGeometry />
        <meshStandardMaterial color="#aaa" />
      </mesh>
      <mesh
        scale={[50, 25, 1]}
        position={[33, 11, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <boxGeometry />
        <meshStandardMaterial color="#aaa" />
      </mesh>
    </>
  );
};

export default App;
