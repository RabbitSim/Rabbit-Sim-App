import Canvas, { type Sprite, type Draw } from './canvas';
import { type Decoration, TreeSprite, RockSprite, BurrowSprite } from './classes/ui/Decorations';
import Rabbit from './classes/ui/Rabbit';
import DeadRabbit from './classes/ui/DeadRabbit';
import FoodStorage from './classes/ui/FoodStorage';
import './App.css'
import { useEffect, useState, useRef } from 'react'
import Button from './components/Button';
 
function App() {
  const [simulating, setSimulating] = useState<boolean>(false)
  const [sPressed, setSPressed] = useState<boolean>(false)
  const [dPressed, setDPressed] = useState<boolean>(false)
  const [threePressed, setThreePressed] = useState<boolean>(false)
  const [ePressed, setEPressed] = useState<boolean>(false)
  const [nPressed, setNPressed] = useState<boolean>(false)
  const [dayNum, setDayNum] = useState<number>(0)
  const rabbitsRef = useRef<Rabbit[]>([]);
  const deadRabbitsRef = useRef<DeadRabbit[]>([]);
  const foodStorageRef = useRef<FoodStorage[]>([]);
  const [, setTick] = useState(0) // force re-render each frame
   const rabbitCount = 10;
  
  const RabbitMinDis = 1;
 
  const sprites: Sprite[] = [];
 
  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 's') {
        if (!sPressed) {
          console.log("'s' key pressed")
          setSPressed(true)

          // spawn 20 rabbits at 60 40
          for (let i = 0; i < rabbitCount; i++) {
            rabbitsRef.current.push(new Rabbit(60 + Math.random() * 2, 40 + Math.random() * 2, { x: 0, y: 0 }));
          }

        }
      }
      if (e.key.toLowerCase() === 'd') {
        if (!dPressed) {
          console.log("'d' key pressed")
          setDPressed(true)

          // turn all rabbits to dead
          for (const r of rabbitsRef.current) {
            deadRabbitsRef.current.push(new DeadRabbit(r.x, r.y, 100));
          }
          rabbitsRef.current = [];
        }
      }
      if (e.key.toLowerCase() === '3') {
        if (!threePressed) {
          console.log("'3' key pressed")
          setThreePressed(true)

          // add 100 food to the second food storage unit
          if (foodStorageRef.current.length >= 2) {
            foodStorageRef.current[1].storeFood(100);
          }
        }
      }
      if (e.key.toLowerCase() === 'e') {
        if (!ePressed) {
          console.log("'e' key pressed")
          setEPressed(true)

          // remove 100 food from the second food storage unit
          if (foodStorageRef.current.length >= 2) {
            foodStorageRef.current[1].retrieveFood(100);
          }
        }
      }
      if (e.key.toLowerCase() === 'n') {
        if (!nPressed) {
        console.log("'n' key pressed")
        setNPressed(true)

        // advance day number by 1 if it reaches 10 reset to 0
        setDayNum(prevDay => (prevDay + 1) % 10);
        console.log(`Day advanced to ${ (dayNum + 1) % 10 }`);
        }
      }
    }
    const upHandler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 's') {
        console.log("'s' key released")
        setSPressed(false)
      }
      if (e.key.toLowerCase() === 'd') {
        console.log("'d' key released")
        setDPressed(false)
      }
      if (e.key.toLowerCase() === '3') {
        console.log("'3' key released")
        setThreePressed(false)
      }
      if (e.key.toLowerCase() === 'e') {
        console.log("'e' key released")
        setEPressed(false)
      }
      if (e.key.toLowerCase() === 'n') {
        console.log("'n' key released")
        setNPressed(false)
      }
      
    }

    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [sPressed, dPressed, threePressed, ePressed, nPressed]);
 
  // animation loop: call behavior update for each rabbit every frame
  useEffect(() => {
    let raf = 0
    const loop = () => {
      const arr = rabbitsRef.current
      for (const r of arr) {
        // call the flocking/separation step
        r.seperateFromAlignmentCohesion(arr, RabbitMinDis, 5);
      }

      // remove rabbits that finished their round-trip
      rabbitsRef.current = rabbitsRef.current.filter(r => !r.isCompleted());

      // reduce lifetime of dead rabbits and remove expired ones
      for (const dr of deadRabbitsRef.current) {
        dr.decreaseLifetime();
      }
      deadRabbitsRef.current = deadRabbitsRef.current.filter(dr => !dr.isExpired());

      // force a render so sprites are recomputed and Canvas redraws
      setTick(t => t + 1)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
 
  const treePositions = [{ x: 12, y: 8 }, { x: 14, y: 9 }, { x: 13, y: 7 }, { x: 15, y: 10 }, { x: 11, y: 9 },{ x: 17, y: 8 }, { x: 16, y: 11 }, { x: 18, y: 9 },{ x: 55, y: 28 }, { x: 56, y: 29 }, { x: 57, y: 27 }, { x: 58, y: 30 }, { x: 54, y: 29 },{ x: 60, y: 28 }, { x: 61, y: 31 }, { x: 59, y: 27 },{ x: 22, y: 45 }, { x: 23, y: 44 }, { x: 24, y: 46 }, { x: 21, y: 47 }, { x: 17, y: 44 },{ x: 20, y: 46 }, { x: 26, y: 43 }, { x: 20, y: 43 },{ x: 95, y: 10 }, { x: 96, y: 11 }, { x: 97, y: 9 }, { x: 98, y: 12 }, { x: 94, y: 10 },{ x: 100, y: 9 }, { x: 99, y: 11 }, { x: 101, y: 10 },{ x: 108, y: 50 }, { x: 110, y: 51 }, { x: 111, y: 52 }, { x: 109, y: 49 }, { x: 107, y: 50 },{ x: 112, y: 51 }, { x: 110, y: 53 }, { x: 108, y: 52 }, { x: 3, y: 5 }, { x: 40, y: 22 }, { x: 70, y: 15 }, { x: 88, y: 33 }, { x: 47, y: 12 },{ x: 33, y: 38 }, { x: 64, y: 55 }, { x: 115, y: 42 }, { x: 77, y: 19 }, { x: 52, y: 59 },{ x: 6, y: 26 }, { x: 82, y: 8 }, { x: 119, y: 24 }, { x: 92, y: 57 }];
 
  const rockPositions = [{ x: 12, y: 10 }, { x: 15, y: 12 }, { x: 14, y: 15 }, { x: 17, y: 13 },{ x: 44, y: 18 }, { x: 46, y: 21 }, { x: 49, y: 20 },{ x: 28, y: 38 }, { x: 31, y: 40 }, { x: 33, y: 37 }, { x: 59, y: 47 }, { x: 61, y: 50 }, { x: 63, y: 48 },{ x: 20, y: 72 }, { x: 23, y: 75 }, { x: 25, y: 73 },{ x: 96, y: 42 }, { x: 98, y: 45 }, { x: 101, y: 44 },{ x: 107, y: 83 }, { x: 109, y: 85 }, { x: 111, y: 84 },{ x: 114, y: 18 }, { x: 117, y: 21 }, { x: 119, y: 19 },{ x: 6, y: 30 }, { x: 22, y: 54 }, { x: 36, y: 63 }, { x: 41, y: 26 },{ x: 53, y: 71 }, { x: 68, y: 59 }, { x: 72, y: 33 }, { x: 77, y: 92 },{ x: 82, y: 67 }, { x: 88, y: 53 }, { x: 93, y: 95 }, { x: 115, y: 62 },{ x: 50, y: 88 }];

  const burrowPositions = [{ x: 100, y: 30 }, { x: 60, y: 40 }, { x: 30, y: 15 }, { x: 10, y: 62 },  { x: 110, y: 70 }];

  // add the food storage units next to each burrow to the right (initialize once)
  useEffect(() => {
    if (foodStorageRef.current.length === 0) {
      foodStorageRef.current = burrowPositions.map(pos => new FoodStorage(pos.x + 4, pos.y + 1));
    }
  }, []);
 
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
 
 
  const rabbitsprites: Sprite[] = rabbitsRef.current.map(rabbit => {
     const pos = rabbit.getPosition();
     return { x: pos.x, y: pos.y, color: rabbit.color };
   });

   // add dead rabbit sprites to main sprite list
   for (const dr of deadRabbitsRef.current) {
     sprites.push({ x: dr.x, y: dr.y, color: dr.color });
   }

   // add food storage sprites to main sprite list
   for (const fs of foodStorageRef.current) {
     // from the base position, add sprites up to the current height
     for (let h = 0; h < fs.height; h++) {
      const t = fs.height <= 1 ? 0 : h / (fs.height - 1);
      const hue = 35; // orange/brown hue
      const sat = 60; // saturation %
      const light = 85 - t * 50; // lightness 85% (top) -> ~35% (bottom)
      sprites.push({ x: fs.x, y: fs.y - h, color: `hsl(${hue}, ${sat}%, ${light}%)` });
     }
   }

  // add rocks to main sprite list
  for (const rock of addRandomRocks) {
    for (const sprite of rock.sprites) {
      sprites.push({ x: rock.x + sprite.x, y: rock.y + sprite.y, color: sprite.color })
    }
  }

  // add rabbit sprites to main sprite list
  for (const rs of rabbitsprites) {
    sprites.push(rs);
  }
 
  // add decoration sprites to main sprite list
  for (const decor of addRandomTrees) {
    for (const sprite of decor.sprites) {
      sprites.push({ x: decor.x + sprite.x, y: decor.y + sprite.y, color: sprite.color })
    }
  }

  const dayNumHelper = (dayNumParam?: number, color?: string) => {
        if (dayNumParam === undefined) return color
        if (color === undefined) return color

        if (!/^#([0-9a-fA-F]{6})$/.test(color)) return color

        // mapping of day -> multiplier (lower = darker)
        const mapping: Record<number, number> = {
          4: 0.90, // dim
          5: 0.75, // dark
          6: 0.60, // darker
          7: 0.45, // darkest
          8: 0.75, // dark (returns toward less dark)
          9: 0.90  // dim (back to dim)
        }

        const mult = mapping[dayNumParam]
        if (mult === undefined) return color // days outside 4-9 unchanged

        const r = Math.min(255, Math.max(0, Math.floor(parseInt(color.slice(1, 3), 16) * mult)))
        const g = Math.min(255, Math.max(0, Math.floor(parseInt(color.slice(3, 5), 16) * mult)))
        const b = Math.min(255, Math.max(0, Math.floor(parseInt(color.slice(5, 7), 16) * mult)))
        const dimmedColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`

        return dimmedColor
    }
 
  const drawSprites: Draw = (ctx, frameCount, spritesArg) => {
    if (!spritesArg) return
    ctx.save()
    for (const s of spritesArg) {
      ctx.fillStyle = dayNumHelper(dayNum, s.color) || 'brown'
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), 1, 1)
    }
    ctx.restore()
  }
 
  return (
    <>
      <div>
        <h1>Rabbit Simulation</h1>
      </div>
      <div className='buttons'>
      {!simulating && (
          <Button label="Start Simulation ▶" onClick={() => setSimulating(true)} />
      ) || (
          <Button label="Stop Simulation ■" onClick={() => setSimulating(false)} />
      )}

      <Button label="Reset Simulation ◀" onClick={() => true} />
      </div>


      <Canvas sprites={sprites} customDraw={drawSprites} dayNum={dayNum} />

      <div className='stats'>
        <h2> Current Colony Stats: </h2>
        <p> Population: {rabbitsRef.current.length} </p>
        <p> Agriculture: </p>
        <p> Offence:  </p>
        <p> Energy: </p>
        <p> Unrest: </p>
        <p> Food Storage: </p>
        <p> Relationships: </p>
      </div>
    </>
  )
}
 
export default App
