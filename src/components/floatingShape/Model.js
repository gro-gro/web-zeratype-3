import React, { useEffect, useState, useMemo } from "react";
import { useGLTF, Float } from "@react-three/drei";
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useTransform } from 'framer-motion';
import { motion } from 'framer-motion-3d';

export default function Model({mouse, viewport, cameraZoom}) {
  const [activeShape, setActiveShape] = useState(1);

  useEffect( () => {
    setTimeout( () => {
      if(activeShape == 12){
        setActiveShape(1)
      }
      else{
        setActiveShape(activeShape + 1)
      }
    }, 2000)
  }, [activeShape])

  const { nodes } = useGLTF("/medias/proyectos.glb");
  
  // Load the diffuse texture for CeroMiligramos
  const ceroMiligramosTexture = useLoader(TextureLoader, '/textures/0MG_Textura.png');

  // Get all mesh nodes and their original positions, filter out undefined
  const meshNodes = useMemo(() => [
    nodes.A1000,
    nodes.CeroMiligramos,
    nodes.CriemosLibres,
    nodes.ElSueno,
    nodes.EnTeoria,
    nodes.EspacioSeguro,
    nodes.Meli,
    nodes.PausaActiva,
    nodes.Rufian,
    nodes.Sobremesa,
    nodes.ValenYSofi,
    nodes.Zeratype
  ].filter(Boolean), [nodes]);

  // Calculate bounding box for X and Y (excluding Zeratype and undefined)
  const meshNodesWithoutZeratype = useMemo(
    () => meshNodes.filter(n => n && n !== nodes.Zeratype),
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
      // Landscape: both margins 10%
      marginX = 0.1;
      marginY = 0.1;
      xArea = 200 * (1 - 2 * marginX) * aspectRatio * responsiveScale;
      yArea = 200 * (1 - 2 * marginY) * responsiveScale;
      portrait = false;
    } else {
      // Portrait: horizontal margin 10%, vertical margin 5%
      marginX = 0.3;
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
        node === nodes.CeroMiligramos ? (
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
          />
        )
      ))}
      {/* Render Zeratype logo at center, static */}
      {nodes.Zeratype && <StaticMesh node={nodes.Zeratype} />}
    </group>
  );
}

useGLTF.preload("/medias/proyectos.glb");

function Mesh({node, multiplier, mouse, isActive, responsiveScale, viewport, bounds, availableArea, texture}) {
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
  const rotationX = useTransform(mouse.x, [0,1], [rotation.x - a, rotation.x + a]);
  const rotationY = useTransform(mouse.y, [0,1], [rotation.y - a, rotation.y + a]);
  
  // Responsive mouse movement based on viewport
  const responsiveMultiplier = multiplier * responsiveScale;
  const positionX = useTransform(mouse.x, [0,1], [responsivePosition.x - responsiveMultiplier * 2, responsivePosition.x + responsiveMultiplier * 2]);
  const positionY = useTransform(mouse.y, [0,1], [responsivePosition.y + responsiveMultiplier * 2, responsivePosition.y - responsiveMultiplier * 2]);
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
    <Float>
      <motion.mesh
        castShadow={true}
        receiveShadow={true}
        geometry={geometry}
        material={meshMaterial}
        position={[0, 0, 0]}
        rotation={rotation}
        scale={scale}
        rotation-y={rotationX}
        rotation-x={rotationY}
        position-x={positionX}
        position-y={positionY}
        position-z={positionZ}
        animate={{rotateZ: isActive ? rotation.z + getRandomMultiplier() : null}}
        transition={{type: "spring", stiffness: 75, damping: 100, mass: 3}}
      />
    </Float>
  )
}

// Helper
function remap(val, inMin, inMax, outMin, outMax) {
  if (inMax - inMin === 0) return (outMin + outMax) / 2;
  return ((val - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

// Static mesh for Zeratype logo
function StaticMesh({ node }) {
  const { geometry, material, scale, rotation } = node;
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[0, 0, 0]}
      scale={scale}
      rotation={rotation}
      castShadow={true}
      receiveShadow={true}
    />
  );
}
