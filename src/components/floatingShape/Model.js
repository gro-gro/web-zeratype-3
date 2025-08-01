import React, { useEffect, useState, useMemo } from "react";
import { useGLTF, Float } from "@react-three/drei";
import { useLoader } from '@react-three/fiber';
import { TextureLoader, MeshBasicMaterial } from 'three';
import { useTransform } from 'framer-motion';
import { motion } from 'framer-motion-3d';

export default function Model({ mouse, viewport, cameraZoom }) {
  const [activeShape, setActiveShape] = useState(1);

  // Props globales para Float
  const floatProps = { floatIntensity: 2, speed: 1, rotationIntensity: 0.1 };

  useEffect(() => {
    setTimeout(() => {
      if (activeShape == 11) {
        setActiveShape(1)
      }
      else {
        setActiveShape(activeShape + 1)
      }
    }, 2000)
  }, [activeShape])

  const { nodes } = useGLTF("/medias/proyectos.glb");

  // DEBUG: Mostrar los nombres de los nodos cargados
  useEffect(() => {
    if (nodes) {
      console.log('NODOS GLTF:', Object.keys(nodes));
    }
  }, [nodes]);

  // Load the diffuse texture for CeroMiligramos
  const ceroMiligramosTexture = useLoader(TextureLoader, '/textures/0MG_Textura.png');

  // Define nodes that preserve their fixed positions (never randomized)
  const fixedNodes = useMemo(() => [
    nodes.Zeratype,
    nodes.Meli,
    nodes.PausaActiva,
    nodes.ElSueno,
    nodes.Sobremesa,
  ].filter(Boolean), [nodes]);

  // Define nodes that can be randomized (excluding fixed nodes)
  const randomizableNodes = useMemo(() => [
    nodes.A1000,
    nodes.CeroMiligramos,
    nodes.CriemosLibres,
    nodes.EnTeoria,
    nodes.EspacioSeguro,
    nodes.Rufian,
    nodes.Mascara,
    // Agrupamos Microfono y MicFiltro en un solo nodo visual
    nodes.Microfono && nodes.MicFiltro ? { microfono: nodes.Microfono, micfiltro: nodes.MicFiltro } : nodes.Microfono,
    // Agrupamos Camara y Lente en un solo nodo visual
    nodes.Camara && nodes.Lente ? { camara: nodes.Camara, lente: nodes.Lente } : nodes.Camara,
  ].filter(Boolean), [nodes]);

  // Extract original positions from randomizable nodes
  const originalPositions = useMemo(() => {
    return randomizableNodes.map(node => {
      if (node.microfono && node.micfiltro) {
        return node.microfono.position;
      } else if (node.camara && node.lente) {
        return node.camara.position;
      } else {
        return node.position;
      }
    }).filter(pos => pos);
  }, [randomizableNodes]);

  // Shuffle positions randomly on mount
  const shuffledPositions = useMemo(() => {
    const positions = [...originalPositions];
    // Fisher-Yates shuffle algorithm
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    return positions;
  }, [originalPositions]);

  // Create final mesh nodes array with randomized positions
  const meshNodes = useMemo(() => {
    const randomizedNodes = randomizableNodes.map((node, index) => {
      const newPosition = shuffledPositions[index];
      if (!newPosition) return node;

      // Create a new node object with randomized position
      if (node.microfono && node.micfiltro) {
        return {
          ...node,
          microfono: { ...node.microfono, position: newPosition }
        };
      } else if (node.camara && node.lente) {
        return {
          ...node,
          camara: { ...node.camara, position: newPosition }
        };
      } else {
        return { ...node, position: newPosition };
      }
    });

    // Add all fixed nodes at the end (never randomized)
    return [...randomizedNodes, ...fixedNodes].filter(Boolean);
  }, [randomizableNodes, shuffledPositions, nodes.Zeratype]);

  // Calculate bounding box for X and Y (excluding Zeratype, undefined y grupos)
  const meshNodesWithoutZeratype = useMemo(
    () => meshNodes.filter(n => n && n !== nodes.Zeratype && n.position),
    [meshNodes, nodes]
  );
  const bounds = useMemo(() => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    meshNodesWithoutZeratype.forEach(n => {
      if (n.position.x < minX) minX = n.position.x;
      if (n.position.x > maxX) maxX = n.position.x;
      if (n.position.y < minY) minY = n.position.y;
      if (n.position.y > maxY) maxY = n.position.y;
    });
    return { minX, maxX, minY, maxY };
  }, [meshNodesWithoutZeratype]);

  // Calculate responsive scaling based on viewport and camera zoom
  const responsiveScale = useMemo(() => {
    if (!viewport || !cameraZoom) return 1;

    // Calculate the visible area in 3D space
    // With 10% margins, we want to use 80% of the viewport
    const marginFactor = 0.8;

    // Base scale calculation - adjust based on camera zoom and viewport
    const baseScale = 200 / cameraZoom; // 200 is the camera distance

    // Calculate scale based on viewport aspect ratio
    const aspectRatio = viewport.width / viewport.height;
    let scaleFactor;

    if (aspectRatio > 1) {
      // Landscape - scale based on height
      scaleFactor = (viewport.height * marginFactor) / baseScale;
    } else {
      // Portrait - scale based on width
      scaleFactor = (viewport.width * marginFactor) / baseScale;
    }

    // Normalize to a reasonable range
    return Math.max(0.5, Math.min(scaleFactor / 100, 3));
  }, [viewport, cameraZoom]);

  // Calculate available area for X and Y (with axis-specific margins)
  const availableArea = useMemo(() => {
    if (!viewport) return { x: 100, y: 100, portrait: false };
    const aspectRatio = viewport.width / viewport.height;
    let xArea, yArea, portrait;
    let marginX, marginY;
    if (aspectRatio > 1) {
      // Landscape: reduced margins for better distribution
      marginX = 0.2;
      marginY = 0.15;
      xArea = 200 * (1 - 2 * marginX) * aspectRatio * responsiveScale;
      yArea = 200 * (1 - 2 * marginY) * responsiveScale;
      portrait = false;
    } else {
      // Portrait: reduced margins for better distribution
      marginX = 0.25;
      marginY = 0.2;
      xArea = 200 * (1 - 2 * marginX) * responsiveScale;
      yArea = 200 * (1 - 2 * marginY) / aspectRatio * responsiveScale;
      portrait = true;
    }
    return { x: xArea, y: yArea, portrait };
  }, [viewport, responsiveScale]);

  return (
    <group>
      {/* Render all except Zeratype as interactive */}
      {meshNodes.filter(n => n !== nodes.Zeratype).map((node, i) => (
        // Si es el grupo Microfono+MicFiltro
        node.microfono && node.micfiltro ? (
          <GroupMicrofonoMicFiltro
            key={"microfono-micfiltro"}
            microfono={node.microfono}
            micfiltro={node.micfiltro}
            multiplier={1.5}
            mouse={mouse}
            isActive={activeShape === i + 1}
            responsiveScale={responsiveScale}
            viewport={viewport}
            bounds={bounds}
            availableArea={availableArea}
            floatProps={floatProps}
          />
        ) : // Si es el grupo Camara+Lente
          node.camara && node.lente ? (
            <GroupCamaraLente
              key={"camara-lente"}
              camara={node.camara}
              lente={node.lente}
              multiplier={1.5}
              mouse={mouse}
              isActive={activeShape === i + 1}
              responsiveScale={responsiveScale}
              viewport={viewport}
              bounds={bounds}
              availableArea={availableArea}
              floatProps={floatProps}
            />
          ) : node === nodes.CeroMiligramos ? (
            <Mesh
              key={i}
              node={node}
              multiplier={1.5}
              mouse={mouse}
              isActive={activeShape === i + 1}
              responsiveScale={responsiveScale}
              viewport={viewport}
              bounds={bounds}
              availableArea={availableArea}
              texture={ceroMiligramosTexture}
              floatProps={floatProps}
            />
          ) : (
            <Mesh
              key={i}
              node={node}
              multiplier={
                i === 0 || i === 1 ? 2.4 :
                  i === 2 ? 1.2 :
                    i === 3 ? 1 :
                      i === 4 || i === 5 ? 1.8 :
                        i === 6 ? 2 :
                          i === 7 ? 1.2 :
                            i === 8 ? 1.6 :
                              i === 9 ? 1.8 :
                                1.5
              }
              mouse={mouse}
              isActive={activeShape === i + 1}
              responsiveScale={responsiveScale}
              viewport={viewport}
              bounds={bounds}
              availableArea={availableArea}
              floatProps={floatProps}
            />
          )
      ))}
      {/* Render Zeratype logo at center */}
      {nodes.Zeratype && (
        <ZeratypeLogo node={nodes.Zeratype} />
      )}
    </group>
  );
}

useGLTF.preload("/medias/proyectos.glb");

function Mesh({ node, multiplier, mouse, isActive, responsiveScale, viewport, bounds, availableArea, texture, floatProps }) {
  const { geometry, material, position, scale, rotation } = node;

  // Remap X and Y to fill the available area with axis-specific margins
  const responsivePosition = useMemo(() => {
    if (!viewport || !responsiveScale || !bounds || !availableArea) return position;
    let x, y;
    if (availableArea.portrait) {
      // Portrait: Y is main axis (vertical), X is secondary
      y = remap(position.y, bounds.minY, bounds.maxY, -availableArea.y / 2, availableArea.y / 2);
      x = remap(position.x, bounds.minX, bounds.maxX, -availableArea.x / 2, availableArea.x / 2);
    } else {
      // Landscape: X is main axis (horizontal), Y is secondary
      x = remap(position.x, bounds.minX, bounds.maxX, -availableArea.x / 2, availableArea.x / 2);
      y = remap(position.y, bounds.minY, bounds.maxY, -availableArea.y / 2, availableArea.y / 2);
    }
    // Z stays as original (no remapping, no mouse movement)
    return { x, y, z: position.z };
  }, [position, viewport, responsiveScale, bounds, availableArea]);

  const a = multiplier / 2;
  const rotationX = useTransform(mouse.x, [0, 1], [rotation.x - a, rotation.x + a]);
  const rotationY = useTransform(mouse.y, [0, 1], [rotation.y - a, rotation.y + a]);

  // Responsive mouse movement based on viewport
  const responsiveMultiplier = multiplier * responsiveScale;
  const positionX = useTransform(mouse.x, [0, 1], [responsivePosition.x - responsiveMultiplier * 2, responsivePosition.x + responsiveMultiplier * 2]);
  const positionY = useTransform(mouse.y, [0, 1], [responsivePosition.y + responsiveMultiplier * 2, responsivePosition.y - responsiveMultiplier * 2]);
  // Z is fixed
  const positionZ = responsivePosition.z;

  const getRandomMultiplier = () => {
    return Math.floor(Math.random() * 2) * (Math.round(Math.random()) ? 1 : -1)
  }

  // If texture is provided, clone the material and assign the map
  let meshMaterial = material;
  if (texture) {
    meshMaterial = material.clone();
    meshMaterial.map = texture;
    meshMaterial.needsUpdate = true;
  }

  return (
    <Float {...floatProps}>
      <motion.mesh
        castShadow={true}
        receiveShadow={true}
        geometry={geometry}
        material={meshMaterial}
        position={[0, 0, 0]}
        rotation={rotation}
        scale={[scale.x * 1.25, scale.y * 1.25, scale.z * 1.25]}
        rotation-y={rotationX}
        rotation-x={rotationY}
        position-x={positionX}
        position-y={positionY}
        position-z={positionZ}
        animate={{ rotateZ: isActive ? rotation.z + getRandomMultiplier() : null }}
        transition={{ type: "spring", stiffness: 75, damping: 100, mass: 3 }}
      />
    </Float>
  )
}

// Helper
function remap(val, inMin, inMax, outMin, outMax) {
  if (inMax - inMin === 0) return (outMin + outMax) / 2;
  return ((val - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

// ZeratypeLogo: reacts to mouse for rotation, fixed at [0,0,0], no Float
function ZeratypeLogo({ node }) {
  const { geometry, material, scale, rotation } = node;

  // Create completely black material from scratch, ignoring GLTF material
  const blackMaterial = useMemo(() => {
    return new MeshBasicMaterial({
      color: 0x000000,
    });
  }, []);

  // Detectar si es móvil (portrait)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkMobile() {
      // Use consistent breakpoint: mobile if width < 768px
      setIsMobile(window.innerWidth < 768);
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  // Escala responsiva: más pequeña en móvil
  const responsiveScale = useMemo(() => {
    console.log('ZeratypeLogo - isMobile:', isMobile, 'original scale:', scale);
    if (isMobile) {
      const mobileScale = [scale.x * 0.7, scale.y * 0.7, scale.z * 0.7];
      console.log('ZeratypeLogo - mobile scale:', mobileScale);
      return mobileScale;
    }
    return scale; // Tamaño original en desktop
  }, [scale, isMobile]);

  return (
    <mesh
      castShadow={true}
      receiveShadow={true}
      geometry={geometry}
      material={blackMaterial}
      position={[0, 0, -200]}
      scale={responsiveScale}
      rotation={rotation}
    />
  );
}

function GroupCamaraLente({ camara, lente, multiplier, mouse, isActive, responsiveScale, viewport, bounds, availableArea, floatProps }) {
  // Usamos la posición, rotación y escala original de Camara como base del grupo
  // Lente se posiciona relativa a Camara, igual que en el GLTF
  // El grupo se comporta igual que los otros nodos

  // Calculamos la posición responsiva para la camara (el grupo)
  const { position, rotation, scale } = camara;
  const responsivePosition = React.useMemo(() => {
    if (!viewport || !responsiveScale || !bounds || !availableArea) return position;
    let x, y;
    if (availableArea.portrait) {
      y = remap(position.y, bounds.minY, bounds.maxY, -availableArea.y / 2, availableArea.y / 2);
      x = remap(position.x, bounds.minX, bounds.maxX, -availableArea.x / 2, availableArea.x / 2);
    } else {
      x = remap(position.x, bounds.minX, bounds.maxX, -availableArea.x / 2, availableArea.x / 2);
      y = remap(position.y, bounds.minY, bounds.maxY, -availableArea.y / 2, availableArea.y / 2);
    }
    return { x, y, z: position.z };
  }, [position, viewport, responsiveScale, bounds, availableArea]);

  const a = multiplier / 2;
  const rotationX = useTransform(mouse.x, [0, 1], [rotation.x - a, rotation.x + a]);
  const rotationY = useTransform(mouse.y, [0, 1], [rotation.y - a, rotation.y + a]);
  const responsiveMultiplier = multiplier * responsiveScale;
  const positionX = useTransform(mouse.x, [0, 1], [responsivePosition.x - responsiveMultiplier * 2, responsivePosition.x + responsiveMultiplier * 2]);
  const positionY = useTransform(mouse.y, [0, 1], [responsivePosition.y + responsiveMultiplier * 2, responsivePosition.y - responsiveMultiplier * 2]);
  const positionZ = responsivePosition.z;

  const getRandomMultiplier = () => {
    return Math.floor(Math.random() * 2) * (Math.round(Math.random()) ? 1 : -1)
  }

  return (
    <Float {...floatProps}>
      <motion.group
        position={[0, 0, 0]}
        rotation={rotation}
        scale={[scale.x * 1.25, scale.y * 1.25, scale.z * 1.25]}
        rotation-y={rotationX}
        rotation-x={rotationY}
        position-x={positionX}
        position-y={positionY}
        position-z={positionZ}
        animate={{ rotateZ: isActive ? rotation.z + getRandomMultiplier() : null }}
        transition={{ type: "spring", stiffness: 75, damping: 100, mass: 3 }}
      >
        <mesh
          castShadow={true}
          receiveShadow={true}
          geometry={camara.geometry}
          material={camara.material}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={[1, 1, 1]}
        />
        <mesh
          castShadow={true}
          receiveShadow={true}
          geometry={lente.geometry}
          material={lente.material}
          position={lente.position}
          rotation={lente.rotation}
          scale={lente.scale}
        />
      </motion.group>
    </Float>
  );
}

function GroupMicrofonoMicFiltro({ microfono, micfiltro, multiplier, mouse, isActive, responsiveScale, viewport, bounds, availableArea, floatProps }) {
  // Usamos la posición, rotación y escala original de Microfono como base del grupo
  // MicFiltro se posiciona relativa a Microfono, igual que en el GLTF
  // El grupo se comporta igual que los otros nodos

  // Calculamos la posición responsiva para el microfono (el grupo)
  const { position, rotation, scale } = microfono;
  const responsivePosition = React.useMemo(() => {
    if (!viewport || !responsiveScale || !bounds || !availableArea) return position;
    let x, y;
    if (availableArea.portrait) {
      y = remap(position.y, bounds.minY, bounds.maxY, -availableArea.y / 2, availableArea.y / 2);
      x = remap(position.x, bounds.minX, bounds.maxX, -availableArea.x / 2, availableArea.x / 2);
    } else {
      x = remap(position.x, bounds.minX, bounds.maxX, -availableArea.x / 2, availableArea.x / 2);
      y = remap(position.y, bounds.minY, bounds.maxY, -availableArea.y / 2, availableArea.y / 2);
    }
    return { x, y, z: position.z };
  }, [position, viewport, responsiveScale, bounds, availableArea]);

  const a = multiplier / 2;
  const rotationX = useTransform(mouse.x, [0, 1], [rotation.x - a, rotation.x + a]);
  const rotationY = useTransform(mouse.y, [0, 1], [rotation.y - a, rotation.y + a]);
  const responsiveMultiplier = multiplier * responsiveScale;
  const positionX = useTransform(mouse.x, [0, 1], [responsivePosition.x - responsiveMultiplier * 2, responsivePosition.x + responsiveMultiplier * 2]);
  const positionY = useTransform(mouse.y, [0, 1], [responsivePosition.y + responsiveMultiplier * 2, responsivePosition.y - responsiveMultiplier * 2]);
  const positionZ = responsivePosition.z;

  const getRandomMultiplier = () => {
    return Math.floor(Math.random() * 2) * (Math.round(Math.random()) ? 1 : -1)
  }

  return (
    <Float {...floatProps}>
      <motion.group
        position={[0, 0, 0]}
        rotation={rotation}
        scale={[scale.x * 1.25, scale.y * 1.25, scale.z * 1.25]}
        rotation-y={rotationX}
        rotation-x={rotationY}
        position-x={positionX}
        position-y={positionY}
        position-z={positionZ}
        animate={{ rotateZ: isActive ? rotation.z + getRandomMultiplier() : null }}
        transition={{ type: "spring", stiffness: 75, damping: 100, mass: 3 }}
      >
        <mesh
          castShadow={true}
          receiveShadow={true}
          geometry={microfono.geometry}
          material={microfono.material}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={[1, 1, 1]}
        />
        <mesh
          castShadow={true}
          receiveShadow={true}
          geometry={micfiltro.geometry}
          material={micfiltro.material}
          position={micfiltro.position}
          rotation={micfiltro.rotation}
          scale={micfiltro.scale}
        />
      </motion.group>
    </Float>
  );
}
