import { useGLTF } from "@react-three/drei";
import { forwardRef, useMemo } from "react";

const Model = forwardRef(({ url, position, ...rest }, ref) => {
  const { scene } = useGLTF(url, true);
  const copiedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <primitive ref={ref} object={copiedScene} position={position} {...rest} />
  );
});

export default Model;
