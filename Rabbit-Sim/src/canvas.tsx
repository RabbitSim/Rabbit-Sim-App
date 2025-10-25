import React, { useRef, useEffect } from 'react'

export interface Sprite {
    x: number
    y: number
    color?: string
}

export type Draw = (ctx: CanvasRenderingContext2D, frameCount: number, sprites?: Sprite[]) => void

interface CanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
    sprites?: Sprite[]
    customDraw?: Draw
    dayNum?: number
}

const Canvas: React.FC<CanvasProps> = props => {
    const { sprites, customDraw, dayNum, ...rest } = props

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    
    // day -> multiplier mapping (same mapping you provided)
    const dayMultiplier: Record<number, number> = {
        4: 0.90, // dim
        5: 0.75, // dark
        6: 0.60, // darker
        7: 0.45, // darkest
        8: 0.75, // dark
        9: 0.90  // dim
    }

    const getMult = (d?: number) => {
        if (d === undefined) return 1
        return dayMultiplier[d] ?? 1
    }

    const dimHex = (hex: string, mult: number) => {
        if (!/^#([0-9a-fA-F]{6})$/.test(hex)) return hex
        const r = Math.min(255, Math.max(0, Math.floor(parseInt(hex.slice(1,3),16) * mult)))
        const g = Math.min(255, Math.max(0, Math.floor(parseInt(hex.slice(3,5),16) * mult)))
        const b = Math.min(255, Math.max(0, Math.floor(parseInt(hex.slice(5,7),16) * mult)))
        return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
    }

    const draw: Draw = (ctx, frameCount, spritesArg) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        const mult = getMult(dayNum)
        // base grass color dimmed by day multiplier
        ctx.fillStyle = dimHex('#708a39', mult)
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        drawGrassnoise(ctx, frameCount)
        // call external draw if provided, otherwise use internal sprite drawer
        if (customDraw) {
            customDraw(ctx, frameCount, spritesArg)
        } else {
            drawSprite(ctx, frameCount, spritesArg)
        }
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

        // changed code: render noise at a lower "pixel" resolution then expand each noise pixel
        const pixelSize = 2 // increase this to make each noise "pixel" larger
        const baseScale = 0.5
        const octaves = 5
        const persistence = 0.5
        const lacunarity = 2
        const wind = frameCount * 0.0025

        const smallW = Math.ceil(w / pixelSize)
        const smallH = Math.ceil(h / pixelSize)

        const mult = getMult(dayNum) // apply same multiplier to noise colors

        // compute each small cell and write it as a block into the full image data
        for (let sy = 0; sy < smallH; sy++) {
            for (let sx = 0; sx < smallW; sx++) {
                // sample in the middle of the cell for smoother results
                const sampleX = sx * pixelSize + pixelSize / 2
                const sampleY = sy * pixelSize + pixelSize / 2

                const n = octaveNoise(sampleX + 400, sampleY + 400 + wind, octaves, lacunarity, persistence, baseScale)
                const detail = octaveNoise(sampleX, sampleY + wind * 0.6, 2, 2, 0.6, baseScale * 4)

                const g = Math.round(90 + n * 140 + detail * 30)
                const r = Math.round(15 + n * 20 + detail * 10)
                const b = Math.round(8 + n * 18)

                const peak = Math.max(0, (detail - 0.45) * 1.5)
                const rr = Math.min(255, r + peak * 40)
                const gg = Math.min(255, g + peak * 60)
                const bb = Math.min(255, b + peak * 20)

                // apply day multiplier to the noise RGB values
                const rrM = Math.min(255, Math.max(0, Math.round(rr * mult)))
                const ggM = Math.min(255, Math.max(0, Math.round(gg * mult)))
                const bbM = Math.min(255, Math.max(0, Math.round(bb * mult)))

                // fill the pixelSize x pixelSize block
                for (let dy = 0; dy < pixelSize; dy++) {
                    const py = sy * pixelSize + dy
                    if (py >= h) continue
                    for (let dx = 0; dx < pixelSize; dx++) {
                        const px = sx * pixelSize + dx
                        if (px >= w) continue
                        const idx = (py * w + px) * 4
                        d[idx + 0] = rrM
                        d[idx + 1] = ggM
                        d[idx + 2] = bbM
                        d[idx + 3] = 255
                    }
                }
            }
        }

        ctx.putImageData(img, 0, 0)
        // ensure canvas scaling stays pixelated
        ctx.imageSmoothingEnabled = false
    }

    const drawSprite: Draw = (ctx, frameCount, sprites) => {
        ctx.save()
        if (!sprites || !Array.isArray(sprites)) {
            ctx.restore()
            return
        }
        for (const sprite of sprites) {
            ctx.fillStyle = sprite.color || 'black'
            ctx.fillRect(sprite.x, sprite.y, 1, 1)
        }
        ctx.restore()
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
            // pass the current sprites prop into draw so App-provided sprites are used
            draw(context, frameCount, sprites)
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()
        
        return () => {
            window.cancelAnimationFrame(animationFrameId)
            window.removeEventListener('resize', setSize)
        }
    // re-run effect when sprites or customDraw or dayNum change so the animation uses latest values
    }, [sprites, customDraw, dayNum])
    
    return <canvas ref={canvasRef} style={{ imageRendering: 'pixelated' }} {...rest}/>
}

export default Canvas