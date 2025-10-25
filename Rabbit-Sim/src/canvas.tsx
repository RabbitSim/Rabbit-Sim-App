import React, { useRef, useEffect } from 'react'

interface CanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {}

interface Draw {
    (ctx: CanvasRenderingContext2D, frameCount: number): void
}

const Canvas: React.FC<CanvasProps> = props => {
    
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    
    
    const draw: Draw = (ctx, frameCount) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.fillStyle = '#708a39'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        drawGrassnoise(ctx, frameCount)
        ctx.beginPath()
        ctx.fill()
    }

    const drawGrassnoise: Draw = (ctx, frameCount) => {
        const makePerlin = () => {
            const perm = [137,23,201,84,156,9,222,47,178,250,62,145,7,199,118,254,3,90,134,67,211,31,86,12,243,57,170,139,200,73,16,188,102,49,220,8,161,125,45,251,94,29,183,56,147,6,232,79,153,38,214,101,11,167,128,242,20,71,196,54,109,33,226,85,140,2,175,48,119,203,64,15,189,96,58,231,121,36,162,206,27,99,152,70,185,4,210,59,142,24,174,108,41,233,77,13,193,126,68,247,35,158,91,5,207,80,137,52,169,30,221,97,44,182,63,14,156,118,39,245,86,25,200,60,149,18,171,131,216,72,2,104,177,55,144,37,218,110,47,239,93,28,163,66,186,1,204,51,150,34,215,100,10,168,127,244,22,75,194,43,112,49,157,82,181,17,213,61,133,26,206,103,46,179,69,140,32,190,120,56,99,40,154,65,184,21,208,53,132,11,170,76,146,2,201,89,160,119,7,225,88,29,137,54,148,19,172,99,135,42,205,95,36,180,70,124,3,159,92,230,57,131,8,163,68,47,151,81,187,14,198,101,50,165,38,217,106,33,141,61,228,74,153,20,178,45,162,83,190,62,136,9,173,56,209,99,46,116,29,141,71,128,37,184,54,152,87,220,12,166,90,138,47,211,65,197,4,123,56,232,101,28,149,6,213,98,43,161,78,134,25,209,44,185,105,16,241,53,203,115]
            const p = new Array(512)
            for (let i = 0; i < 512; i++) p[i] = perm[i & 255]

            const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
            const lerp = (a: number, b: number, t: number) => a + t * (b - a)
            const grad = (hash: number, x: number, y: number) => {
                const h = hash & 3
                const u = h < 2 ? x : y
                const v = h < 2 ? y : x
                return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
            }

            return (x: number, y: number) => {
                const X = Math.floor(x) & 255
                const Y = Math.floor(y) & 255
                const xf = x - Math.floor(x)
                const yf = y - Math.floor(y)

                const u = fade(xf)
                const v = fade(yf)

                const aa = p[p[X] + Y]
                const ab = p[p[X] + Y + 1]
                const ba = p[p[X + 1] + Y]
                const bb = p[p[X + 1] + Y + 1]

                const x1 = lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u)
                const x2 = lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u)
                return (lerp(x1, x2, v) + 1) / 2 // 0..1
            }
        }

        const perlin = makePerlin()

        // simple fbm / octave wrapper
        const octaveNoise = (x: number, y: number, oct = 4, lac = 2, pers = 0.5, scale = 0.01) => {
            let amp = 1
            let freq = 1
            let sum = 0
            let max = 0
            for (let i = 0; i < oct; i++) {
                sum += amp * perlin(x * freq * scale, y * freq * scale)
                max += amp
                amp *= pers
                freq *= lac
            }
            return sum / max
        }

        const w = ctx.canvas.width
        const h = ctx.canvas.height
        const img = ctx.createImageData(w, h)
        const d = img.data

        // tweak these to taste
        const baseScale = 0.02
        const octaves = 5
        const persistence = 0.5
        const lacunarity = 2
        const wind = frameCount * 0.0025

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const idx = (y * w + x) * 4
                // base terrain + fine blades
                const n = octaveNoise(x + 400, y + 400 + wind, octaves, lacunarity, persistence, baseScale)
                const detail = octaveNoise(x, y + wind * 0.6, 2, 2, 0.6, baseScale * 4)

                // map to grassy color
                const g = Math.round(90 + n * 140 + detail * 30) // main green
                const r = Math.round(15 + n * 20 + detail * 10)  // slight warm tint
                const b = Math.round(8 + n * 18)                 // low blue

                // subtle highlights for blade crests
                const peak = Math.max(0, (detail - 0.45) * 2)
                const rr = Math.min(255, r + peak * 40)
                const gg = Math.min(255, g + peak * 60)
                const bb = Math.min(255, b + peak * 20)

                d[idx + 0] = rr
                d[idx + 1] = gg
                d[idx + 2] = bb
                d[idx + 3] = 255
            }
        }

        ctx.putImageData(img, 0, 0)
    }


    useEffect(() => {
        
        const canvas = canvasRef.current
        if (!canvas) return

        const setSize = () => {
            const dpr = window.devicePixelRatio || 1
            canvas.style.width = `${window.innerWidth}px`
            canvas.style.height = `${window.innerHeight}px`
            canvas.width = Math.floor(window.innerWidth * 0.2)
            canvas.height = Math.floor(window.innerHeight * 0.2)
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            }
        }

        setSize()
        window.addEventListener('resize', setSize)

        const context = canvas.getContext('2d') as CanvasRenderingContext2D
        let frameCount = 0
        let animationFrameId: number
        
        const render = () => {
            frameCount++
            draw(context, frameCount)
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()
        
        return () => {
            window.cancelAnimationFrame(animationFrameId)
            window.removeEventListener('resize', setSize)
        }
    }, [])
    
    return <canvas ref={canvasRef} style={{ imageRendering: 'pixelated' }} {...props}/>
}

export default Canvas