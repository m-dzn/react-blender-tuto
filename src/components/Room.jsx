import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const Room = ({ onClickFloor }) => {
  const { gl, camera } = useThree();

  const handlePointerDown = (event) => {
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(
      (event.clientX / gl.domElement.clientWith) * 2 - 1,
      -(event.clientY / gl.domElement.clientHeight) * 2 + 1
    );

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects([event.object]);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      onClickFloor(intersect);
    }
  };

  return (
    <>
      <mesh
        position={[0, -0.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={handlePointerDown}
      >
        <boxGeometry args={[20, 20]} />
        <meshStandardMaterial color="#fffffff" />
      </mesh>

      <mesh position={[-10.5, 4, -0.5]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[10, 1, 21]} />
        <meshStandardMaterial color="#fffffff" />
      </mesh>

      <mesh position={[0, 4, -10.5]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[20, 1, 10]} />
        <meshStandardMaterial color="#fffffff" />
      </mesh>
    </>
  );
};

export default Room;
