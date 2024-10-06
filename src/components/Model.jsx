import { useGLTF } from "@react-three/drei";

const Model = ({ url, position, ...rest }) => {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene} position={position} {...rest} />;
};

export default Model;
