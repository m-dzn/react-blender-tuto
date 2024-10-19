import { Canvas, useFrame, useThree } from "@react-three/fiber";

import "./App.css";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import Model from "./components/Model";
import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import monitorDisplayVertexShader from "./shaders/vertex.glsl?raw";
import monitorDisplayFragmentShader from "./shaders/fragment.glsl?raw";
import Room from "./components/Room";

const FURNITURE_INFO = [
  {
    name: "Chair",
    url: "/assets/models/chair.glb",
    scale: [1, 1, 1],
  },
  {
    name: "Table",
    url: "/assets/models/table.glb",
    scale: [0.6, 0.6, 0.6],
  },
  {
    name: "Desk",
    url: "/assets/models/desk.glb",
    scale: [4, 4, 4],
  },
];

const App = () => {
  const [currentItem, setCurrentItem] = useState();
  const [furniture, setFurniture] = useState([]);

  const handleClickFurnitureButton = (index) => {
    setCurrentItem(FURNITURE_INFO[index]);
  };

  const addNewFurniture = (newFurniture, position) => {
    setFurniture((prev) => [
      ...prev,
      {
        ...newFurniture,
        position,
      },
    ]);
  };

  console.log(furniture);

  return (
    <div className="App">
      <Canvas>
        <Camera />

        <Lightings />

        <CurrentItem
          currentItem={currentItem}
          setCurrentItem={setCurrentItem}
          addNewFurniture={addNewFurniture}
        />

        {furniture.map(({ url, position, name, ...rest }, index) => (
          <Model
            key={`${name}-${index}`}
            url={url}
            position={position}
            {...rest}
          />
        ))}
      </Canvas>

      <div className="bottom-nav">
        {FURNITURE_INFO.map((item, index) => (
          <button
            key={item.name}
            onClick={() => handleClickFurnitureButton(index)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

const bounds = {
  minX: -8,
  maxX: 8,
  minZ: -8,
  maxZ: 8,
};

const CurrentItem = ({ currentItem, setCurrentItem, addNewFurniture }) => {
  const meshRef = useRef();
  const { pointer, camera } = useThree();
  const planeX = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  const raycaster = new THREE.Raycaster();

  const handlePlaceFurniture = () => {
    if (meshRef.current) {
      const position = meshRef.current.position.clone();
      addNewFurniture(currentItem, position);
    }

    // 마우스 커서 초기화
    setCurrentItem();
  };

  useFrame(() => {
    if (meshRef.current) {
      raycaster.setFromCamera(pointer, camera);

      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(planeX, intersection);

      // x, y 좌표를 경계 내로 제한
      const clampedX = Math.max(
        bounds.minX,
        Math.min(bounds.maxX, intersection.x)
      );
      const clampedZ = Math.max(
        bounds.minZ,
        Math.min(bounds.maxZ, intersection.z)
      );

      meshRef.current.position.set(clampedX, 0, clampedZ);
    }
  });

  return (
    <>
      {currentItem && (
        <Model ref={meshRef} url={currentItem.url} scale={currentItem.scale} />
      )}

      <Room onClickFloor={handlePlaceFurniture} />
    </>
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
