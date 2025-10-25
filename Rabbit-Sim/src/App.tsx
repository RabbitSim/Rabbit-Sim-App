import Canvas, { type Sprite, type Draw } from './canvas';
import { type Decoration, TreeSprite, RockSprite, BurrowSprite } from './classes/ui/Decorations';
import Rabbit from './classes/ui/Rabbit';
import './App.css'
import { useEffect, useState, useRef } from 'react'
 
function App() {
  const [sPressed, setSPressed] = useState(false)
  const rabbitsRef = useRef<Rabbit[]>([]);
  const [, setTick] = useState(0) // force re-render each frame
   const rabbitCount = 2;
  
  const RabbitMinDis = 1;
 
  const sprites: Sprite[] = [
    { x: 2, y: 2, color: 'brown' },
  ]
 
  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 's') {
        if (!sPressed) {
          console.log("'s' key pressed")
          setSPressed(true)
 
          // spawn 20 rabbits at 60 40
          for (let i = 0; i < rabbitCount; i++) {
            rabbitsRef.current.push(new Rabbit(50 + Math.random() * 2, 30 + Math.random() * 2, { x: 0, y: 0 }));
          }
 
        }
      }
    }
    const upHandler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 's') {
        console.log("'s' key released")
        setSPressed(false)
      }
    }
 
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [sPressed])
 
  // animation loop: call behavior update for each rabbit every frame
  useEffect(() => {
    let raf = 0
    const loop = () => {
      const arr = rabbitsRef.current
      for (const r of arr) {
        // call the flocking/separation step
        r.seperateFromAlignmentCohesion(arr, RabbitMinDis);
      }
      // force a render so sprites are recomputed and Canvas redraws
      setTick(t => t + 1)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
 
  const treePositions = [{ x: 12, y: 8 }, { x: 14, y: 9 }, { x: 13, y: 7 }, { x: 15, y: 10 }, { x: 11, y: 9 },{ x: 17, y: 8 }, { x: 16, y: 11 }, { x: 18, y: 9 },{ x: 55, y: 28 }, { x: 56, y: 29 }, { x: 57, y: 27 }, { x: 58, y: 30 }, { x: 54, y: 29 },{ x: 60, y: 28 }, { x: 61, y: 31 }, { x: 59, y: 27 },{ x: 22, y: 45 }, { x: 23, y: 44 }, { x: 24, y: 46 }, { x: 21, y: 47 }, { x: 17, y: 44 },{ x: 20, y: 46 }, { x: 26, y: 43 }, { x: 20, y: 43 },{ x: 95, y: 10 }, { x: 96, y: 11 }, { x: 97, y: 9 }, { x: 98, y: 12 }, { x: 94, y: 10 },{ x: 100, y: 9 }, { x: 99, y: 11 }, { x: 101, y: 10 },{ x: 108, y: 50 }, { x: 110, y: 51 }, { x: 111, y: 52 }, { x: 109, y: 49 }, { x: 107, y: 50 },{ x: 112, y: 51 }, { x: 110, y: 53 }, { x: 108, y: 52 }, { x: 3, y: 5 }, { x: 40, y: 22 }, { x: 70, y: 15 }, { x: 88, y: 33 }, { x: 47, y: 12 },{ x: 33, y: 38 }, { x: 64, y: 55 }, { x: 115, y: 42 }, { x: 77, y: 19 }, { x: 52, y: 59 },{ x: 6, y: 26 }, { x: 82, y: 8 }, { x: 119, y: 24 }, { x: 92, y: 57 }];
 
  const rockPositions = [{ x: 12, y: 10 }, { x: 15, y: 12 }, { x: 14, y: 15 }, { x: 17, y: 13 },{ x: 44, y: 18 }, { x: 46, y: 21 }, { x: 49, y: 20 },{ x: 28, y: 38 }, { x: 31, y: 40 }, { x: 33, y: 37 }, { x: 59, y: 47 }, { x: 61, y: 50 }, { x: 63, y: 48 },{ x: 20, y: 72 }, { x: 23, y: 75 }, { x: 25, y: 73 },{ x: 96, y: 42 }, { x: 98, y: 45 }, { x: 101, y: 44 },{ x: 107, y: 83 }, { x: 109, y: 85 }, { x: 111, y: 84 },{ x: 114, y: 18 }, { x: 117, y: 21 }, { x: 119, y: 19 },{ x: 6, y: 30 }, { x: 22, y: 54 }, { x: 36, y: 63 }, { x: 41, y: 26 },{ x: 53, y: 71 }, { x: 68, y: 59 }, { x: 72, y: 33 }, { x: 77, y: 92 },{ x: 82, y: 67 }, { x: 88, y: 53 }, { x: 93, y: 95 }, { x: 115, y: 62 },{ x: 50, y: 88 }];
 
  const burrowPositions = [{ x: 5, y: 5 }, { x: 60, y: 40 }, { x: 30, y: 15 }];
 
  for (const pos of burrowPositions) {
    for (const sprite of BurrowSprite) {
      sprites.push({ x: pos.x + sprite.x, y: pos.y + sprite.y, color: sprite.color })
    }
  }
 
  const addRandomTrees: Decoration[] = [];
  for (let i = 0; i < 60; i++) {
    const pos = treePositions[i % treePositions.length];
    addRandomTrees.push({
      x: pos.x,
      y: pos.y,
      sprites: TreeSprite
    });
  }
 
  const addRandomRocks: Decoration[] = [];
  for (let i = 0; i < 60; i++) {
    const pos = rockPositions[i % rockPositions.length];
    addRandomRocks.push({
      x: pos.x,
      y: pos.y,
      sprites: RockSprite
    });
  }
 
  const decorations: Decoration[] = addRandomRocks.concat(addRandomTrees);
 
  const rabbitsprites: Sprite[] = rabbitsRef.current.map(rabbit => {
     const pos = rabbit.getPosition();
     return { x: pos.x, y: pos.y, color: rabbit.color };
   });
 
  // add rabbit sprites to main sprite list
  for (const rs of rabbitsprites) {
    sprites.push(rs);
  }
 
  // add decoration sprites to main sprite list
  for (const decor of decorations) {
    for (const sprite of decor.sprites) {
      sprites.push({ x: decor.x + sprite.x, y: decor.y + sprite.y, color: sprite.color })
    }
  }
 
  const drawSprites: Draw = (ctx, frameCount, spritesArg) => {
    if (!spritesArg) return
    ctx.save()
    for (const s of spritesArg) {
      ctx.fillStyle = s.color || 'brown'
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), 1, 1)
    }
    ctx.restore()
  }
 
  return (
    <>
      <div>
        <h1>Rabbit Simulation</h1>
      </div>
      <Canvas sprites={sprites} customDraw={drawSprites} />
    </>
  )
}
 
export default App
