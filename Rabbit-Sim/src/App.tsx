import Canvas, { type Sprite, type Draw } from './canvas';
import './App.css'

function App() {
  // move sprite state/data here
  const sprites: Sprite[] = [
    { x: 2, y: 2, color: 'brown' },
    { x: 60, y: 70, color: 'gray' },
    { x: 80, y: 90, color: 'black' }
  ]

  // optional: implement custom drawing (overrides canvas's internal sprite drawing)
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
