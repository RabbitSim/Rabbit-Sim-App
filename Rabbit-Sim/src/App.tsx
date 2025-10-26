import Canvas, { type Sprite, type Draw } from './canvas';
import { type Decoration, TreeSprite, RockSprite, BurrowSprite } from './classes/ui/Decorations';
import Rabbit from './classes/ui/Rabbit';
import DeadRabbit from './classes/ui/DeadRabbit';
import FoodStorage from './classes/ui/FoodStorage';
import './App.css'
import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import Button from './components/Button';
import { GameController } from "./classes/GameController";
import { JSONInterpreter } from './classes/jsonInterpreter';


// --- Constants ---

const treePositions = [{ x: 12, y: 8 }, { x: 14, y: 9 }, { x: 13, y: 7 }, { x: 15, y: 10 }, { x: 11, y: 9 },{ x: 17, y: 8 }, { x: 16, y: 11 }, { x: 18, y: 9 },{ x: 55, y: 28 }, { x: 56, y: 29 }, { x: 57, y: 27 }, { x: 58, y: 30 }, { x: 54, y: 29 },{ x: 60, y: 28 }, { x: 61, y: 31 }, { x: 59, y: 27 },{ x: 22, y: 45 }, { x: 23, y: 44 }, { x: 24, y: 46 }, { x: 21, y: 47 }, { x: 17, y: 44 },{ x: 20, y: 46 }, { x: 26, y: 43 }, { x: 20, y: 43 },{ x: 95, y: 10 }, { x: 96, y: 11 }, { x: 97, y: 9 }, { x: 98, y: 12 }, { x: 94, y: 10 },{ x: 100, y: 9 }, { x: 99, y: 11 }, { x: 101, y: 10 },{ x: 108, y: 50 }, { x: 110, y: 51 }, { x: 111, y: 52 }, { x: 109, y: 49 }, { x: 107, y: 50 },{ x: 112, y: 51 }, { x: 110, y: 53 }, { x: 108, y: 52 }, { x: 3, y: 5 }, { x: 40, y: 22 }, { x: 70, y: 15 }, { x: 88, y: 33 }, { x: 47, y: 12 },{ x: 33, y: 38 }, { x: 64, y: 55 }, { x: 115, y: 42 }, { x: 77, y: 19 }, { x: 52, y: 59 },{ x: 6, y: 26 }, { x: 82, y: 8 }, { x: 119, y: 24 }, { x: 92, y: 57 }];
 
const rockPositions = [{ x: 12, y: 10 }, { x: 15, y: 12 }, { x: 14, y: 15 }, { x: 17, y: 13 },{ x: 44, y: 18 }, { x: 46, y: 21 }, { x: 49, y: 20 },{ x: 28, y: 38 }, { x: 31, y: 40 }, { x: 33, y: 37 }, { x: 59, y: 47 }, { x: 61, y: 50 }, { x: 63, y: 48 },{ x: 20, y: 72 }, { x: 23, y: 75 }, { x: 25, y: 73 },{ x: 96, y: 42 }, { x: 98, y: 45 }, { x: 101, y: 44 },{ x: 107, y: 83 }, { x: 109, y: 85 }, { x: 111, y: 84 },{ x: 114, y: 18 }, { x: 117, y: 21 }, { x: 119, y: 19 },{ x: 6, y: 30 }, { x: 22, y: 54 }, { x: 36, y: 63 }, { x: 41, y: 26 },{ x: 53, y: 71 }, { x: 68, y: 59 }, { x: 72, y: 33 }, { x: 77, y: 92 },{ x: 82, y: 67 }, { x: 88, y: 53 }, { x: 93, y: 95 }, { x: 115, y: 62 },{ x: 50, y: 88 }];

const burrowPositions = [{ x: 100, y: 30 }, { x: 60, y: 40 }, { x: 30, y: 15 }, { x: 10, y: 62 },  { x: 110, y: 70 }];

const rabbitCount = 10;
const RabbitMinDis = 1;

// --- Helper Function ---

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

// --- Component ---

function App() {
  const [running, setRunning] = useState(false);
  const [simulating, setSimulating] = useState<boolean>(false)
  
  // Use refs for key state to prevent re-running useEffect
  const sPressedRef = useRef<boolean>(false)
  const aPressedRef = useRef<boolean>(false)
  const zPressedRef = useRef<boolean>(false)
  const xPressedRef = useRef<boolean>(false)
  const cPressedRef = useRef<boolean>(false)
  const dPressedRef = useRef<boolean>(false)
  const threePressedRef = useRef<boolean>(false)
  const ePressedRef = useRef<boolean>(false)
  const nPressedRef = useRef<boolean>(false)
  
  const [dayNum, setDayNum] = useState<number>(0)
  const rabbitsRef1 = useRef<Rabbit[]>([]);
  const rabbitsRef2 = useRef<Rabbit[]>([]);
  const rabbitsRef3 = useRef<Rabbit[]>([]);
  const rabbitsRef4 = useRef<Rabbit[]>([]);
  const rabbitsRef5 = useRef<Rabbit[]>([]);

  const controllerRef = useRef<GameController | null>(null);

  type Goal = { x: number; y: number };

  // Define one goal for each rabbit group (rabbitsRef1..rabbitsRef5)
  const groupGoals = useMemo<Goal[]>(
    () => [
      { x: 0, y: 0 }, // goal for rabbitsRef1
      { x: 100, y: 0 }, // goal for rabbitsRef2
      { x: 0, y: 75 }, // goal for rabbitsRef3
      { x: 100, y: 75 }, // goal for rabbitsRef4
      { x: 50, y: 50 } // goal for rabbitsRef5
    ],
    []
  );

  const deadRabbitsRef = useRef<DeadRabbit[]>([]);
  const foodStorageRef = useRef<FoodStorage[]>([]);
  const [, setTick] = useState(0) // force re-render each frame
 
  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (key === 's') {
        if (!sPressedRef.current) {
          console.log("'s' key pressed")
          sPressedRef.current = true;

          for (let i = 0; i < rabbitCount; i++) {
            // white colored rabbits for this group
            rabbitsRef1.current.push(new Rabbit(100 + Math.random() * 2, 30 + Math.random() * 2, groupGoals[0], '#ffffff'));
          }
        }
      }
      if (key === 'a') {
        if (!aPressedRef.current) {
          console.log("'a' key pressed")
          aPressedRef.current = true;

          for (let i = 0; i < rabbitCount; i++) {
            // Pink colored rabbits for this group
            rabbitsRef2.current.push(new Rabbit(60 + Math.random() * 2, 40 + Math.random() * 2, groupGoals[1], '#ff69b4'));
          }
        }
      }
      if (key === 'z') {
        if (!zPressedRef.current) {
          console.log("'z' key pressed")
          zPressedRef.current = true;

          for (let i = 0; i < rabbitCount; i++) {
            // light blue colored rabbits for this group
            rabbitsRef3.current.push(new Rabbit(30 + Math.random() * 2, 15 + Math.random() * 2, groupGoals[2], '#50c2e7ff'));
          }
        }
      }
      if (key === 'x') {
        if (!xPressedRef.current) {
          console.log("'x' key pressed")
          xPressedRef.current = true;

          for (let i = 0; i < rabbitCount; i++) {
            // light purple colored rabbits for this group
            rabbitsRef4.current.push(new Rabbit(10 + Math.random() * 2, 62 + Math.random() * 2, groupGoals[3], '#bbbb10ff'));
          }
        }
      }
      if (key === 'c') {
        if (!cPressedRef.current) {
          console.log("'c' key pressed")
          cPressedRef.current = true;

          for (let i = 0; i < rabbitCount; i++) {
            // grey colored rabbits for this group
            rabbitsRef5.current.push(new Rabbit(110 + Math.random() * 2, 75 + Math.random() * 2, groupGoals[4], '#808080'));
          }
        }
      }
      if (key === 'd') {
        if (!dPressedRef.current) {
          console.log("'d' key pressed")
          dPressedRef.current = true;

          // turn all rabbits to dead
          for (const r of rabbitsRef1.current) {
            deadRabbitsRef.current.push(new DeadRabbit(r.x, r.y, 100));
          }
          rabbitsRef1.current = [];
        }
      }
      if (key === '3') {
        if (!threePressedRef.current) {
          console.log("'3' key pressed")
          threePressedRef.current = true;

          // add 100 food to the second food storage unit
          if (foodStorageRef.current.length >= 2) {
            foodStorageRef.current[1].storeFood(100);
          }
        }
      }
      if (key === 'e') {
        if (!ePressedRef.current) {
          console.log("'e' key pressed")
          ePressedRef.current = true;

          // remove 100 food from the second food storage unit
          if (foodStorageRef.current.length >= 2) {
            foodStorageRef.current[1].retrieveFood(100);
          }
        }
      }
      if (key === 'n') {
        if (!nPressedRef.current) {
          console.log("'n' key pressed")
          nPressedRef.current = true;

          // advance day number by 1, reset to 0 if it reaches 10
          // Use functional update to get the correct previous state
          setDayNum(prevDay => {
            const nextDay = (prevDay + 1) % 10;
            console.log(`Day advanced to ${nextDay}`);
            return nextDay;
          });
        }
      }
    }
    
    const upHandler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 's') {
        console.log("'s' key released")
        sPressedRef.current = false;
      }
      if (key === 'a') {
        console.log("'a' key released")
        aPressedRef.current = false;
      }
      if (key === 'z') {
        console.log("'z' key released")
        zPressedRef.current = false;
      }
      if (key === 'x') {
        console.log("'x' key released")
        xPressedRef.current = false;
      }
      if (key === 'c') {
        console.log("'c' key released")
        cPressedRef.current = false;
      }
      if (key === 'd') {
        console.log("'d' key released")
        dPressedRef.current = false;
      }
      if (key === '3') {
        console.log("'3' key released")
        threePressedRef.current = false;
      }
      if (key === 'e') {
        console.log("'e' key released")
        ePressedRef.current = false;
      }
      if (key === 'n') {
        console.log("'n' key released")
        nPressedRef.current = false;
      }
    }

    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, []); // Empty dependency array: this effect runs only once

  const handleRun = () => {
        if (running) return;
        const controller = new GameController();
        controllerRef.current = controller;
        setRunning(true);

        try {
            // startGame may return void or a Promise; treat the return as unknown and
            // detect a Promise at runtime to handle async completion.
            controller.startGame() as unknown;
            // handle async startGame if it returns a Promise
                setRunning(false);
                console.log("----------------------------------------------------------------------------");
                console.log("----------------------------------------------------------------------------");
                console.log("----------------------------------------------------------------------------");

                const theJSON = controller.logger.toJSON();
                const interpreter = new JSONInterpreter();
                const success = interpreter.interpret(theJSON);
                if (success) {
                    console.log("Successfully interpreted JSON log.");
                } else {
                    console.error("Failed to interpret JSON log.");
                    return;
                }
        } catch (err) {
            console.error(err);
            setRunning(false);
        }
    };
 
  // animation loop: call behavior update for each rabbit every frame
  useEffect(() => {
    let raf = 0
    const loop = () => {
      // This logic will run only if simulating
      if (simulating) {
        const allGroups = [
          rabbitsRef1.current,
          rabbitsRef2.current,
          rabbitsRef3.current,
          rabbitsRef4.current,
          rabbitsRef5.current
        ];


        for (const group of allGroups) {
          for (const r of group) {
            // call the flocking/separation step using the combined list
            r.seperateFromAlignmentCohesion(group, RabbitMinDis, 5);
          }
        }

        // remove rabbits that finished their round-trip
        rabbitsRef1.current = rabbitsRef1.current.filter(r => !r.isCompleted());
        rabbitsRef2.current = rabbitsRef2.current.filter(r => !r.isCompleted());
        rabbitsRef3.current = rabbitsRef3.current.filter(r => !r.isCompleted());
        rabbitsRef4.current = rabbitsRef4.current.filter(r => !r.isCompleted());
        rabbitsRef5.current = rabbitsRef5.current.filter(r => !r.isCompleted());

        // reduce lifetime of dead rabbits and remove expired ones
        for (const dr of deadRabbitsRef.current) {
          dr.decreaseLifetime();
        }
        deadRabbitsRef.current = deadRabbitsRef.current.filter(dr => !dr.isExpired());

        // force a render so sprites are recomputed and Canvas redraws
        setTick(t => t + 1)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [simulating]) // Re-run if `simulating` changes (though loop checks it internally)
 
  // add the food storage units next to each burrow to the right (initialize once)
  useEffect(() => {
    if (foodStorageRef.current.length === 0) {
      foodStorageRef.current = burrowPositions.map(pos => new FoodStorage(pos.x + 4, pos.y + 1));
    }
  }, []); // Empty deps, runs once
  
  // --- Memoized Static Sprites ---

  const staticBurrowSprites = useMemo(() => {
    const sprites: Sprite[] = [];
    for (const pos of burrowPositions) {
      for (const sprite of BurrowSprite) {
        sprites.push({ x: pos.x + sprite.x, y: pos.y + sprite.y, color: sprite.color })
      }
    }
    return sprites;
  }, []); // Empty deps, calculates once

  const staticTreeSprites = useMemo(() => {
    const sprites: Sprite[] = [];
    const addRandomTrees: Decoration[] = [];
    for (let i = 0; i < 60; i++) {
      const pos = treePositions[i % treePositions.length];
      addRandomTrees.push({
        x: pos.x,
        y: pos.y,
        sprites: TreeSprite
      });
    }
    for (const decor of addRandomTrees) {
      for (const sprite of decor.sprites) {
        sprites.push({ x: decor.x + sprite.x, y: decor.y + sprite.y, color: sprite.color })
      }
    }
    return sprites;
  }, []);

  const staticRockSprites = useMemo(() => {
    const sprites: Sprite[] = [];
    const addRandomRocks: Decoration[] = [];
    for (let i = 0; i < 60; i++) {
      const pos = rockPositions[i % rockPositions.length];
      addRandomRocks.push({
        x: pos.x,
        y: pos.y,
        sprites: RockSprite
      });
    }
    for (const rock of addRandomRocks) {
      for (const sprite of rock.sprites) {
        sprites.push({ x: rock.x + sprite.x, y: rock.y + sprite.y, color: sprite.color })
      }
    }
    return sprites;
  }, []); // Empty deps, calculates once

  // --- Dynamic Sprites ---

  const rabbitsprites: Sprite[] = [
    ...rabbitsRef1.current.map(rabbit => {
      const pos = rabbit.getPosition();
      return { x: pos.x, y: pos.y, color: rabbit.color };
    }),
    ...rabbitsRef2.current.map(rabbit => {
      const pos = rabbit.getPosition();
      return { x: pos.x, y: pos.y, color: rabbit.color };
    }),
    ...rabbitsRef3.current.map(rabbit => {
      const pos = rabbit.getPosition();
      return { x: pos.x, y: pos.y, color: rabbit.color };
    }),
    ...rabbitsRef4.current.map(rabbit => {
      const pos = rabbit.getPosition();
      return { x: pos.x, y: pos.y, color: rabbit.color };
    }),
    ...rabbitsRef5.current.map(rabbit => {
      const pos = rabbit.getPosition();
      return { x: pos.x, y: pos.y, color: rabbit.color };
    })
  ];

   const deadRabbitSprites: Sprite[] = deadRabbitsRef.current.map(dr => ({
     x: dr.x, y: dr.y, color: dr.color
   }));

   const foodStorageSprites: Sprite[] = [];
   for (const fs of foodStorageRef.current) {
     for (let h = 0; h < fs.height; h++) {
      const t = fs.height <= 1 ? 0 : h / (fs.height - 1);
      const hue = 35; // orange/brown hue
      const sat = 60; // saturation %
      const light = 85 - t * 50; // lightness 85% (top) -> ~35% (bottom)
      foodStorageSprites.push({ x: fs.x, y: fs.y - h, color: `hsl(${hue}, ${sat}%, ${light}%)` });
     }
   }

  // --- Assemble Final Sprite List ---
  const sprites: Sprite[] = [
    ...staticBurrowSprites,
    ...deadRabbitSprites,
    ...foodStorageSprites,
    ...staticRockSprites,
    ...rabbitsprites,
    ...staticTreeSprites
  ];
 
  // --- Memoized Draw Function ---
  const drawSprites = useCallback<Draw>((ctx, frameCount, spritesArg) => {
    if (!spritesArg) return
    ctx.save()
    for (const s of spritesArg) {
      ctx.fillStyle = dayNumHelper(dayNum, s.color) || 'brown'
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), 1, 1)
    }
    ctx.restore()
  }, [dayNum]); // Only recreate this function if dayNum changes
 
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
        <p> Population: {rabbitsRef1.current.length} </p>
        <p> Agriculture: </p>
        <p> Offence:  </p>
        <p> Energy: </p>
        <p> Unrest: </p>
        <p> Food Storage: </p>
        <p> Relationships: </p>
      </div>
      <button onClick={handleRun} disabled={running}>
        {running ? "Running..." : "Load Simulation"}
      </button>
    </>
  )
}
 
export default App;