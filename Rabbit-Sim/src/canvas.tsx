import React, { useRef, useEffect } from 'react'

interface CanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {}

interface Draw {
    (ctx: CanvasRenderingContext2D, frameCount: number): void
}

const Canvas: React.FC<CanvasProps> = props => {
    
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    
    // const draw: Draw = (ctx, frameCount) => {
    //     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    //     initalizeCanvas(ctx.canvas)
    //     ctx.fillStyle = 'black'
    //     ctx.beginPath()
    //     ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
    //     ctx.fill()
    // }

    // const initalizeCanvas = (canvas: HTMLCanvasElement) => {
    //     const context = canvas.getContext('2d')
    //     if (context) {
    //         context.fillStyle = '#7CFC00'
    //         context.fillRect(0, 0, canvas.width, canvas.height)
    //     }
    // }
    
    const draw: Draw = (ctx, frameCount) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.fillStyle = '#7CFC00'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.fillStyle = 'black'
        ctx.beginPath()
        ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
        ctx.fill()
    }


    useEffect(() => {
        
        const canvas = canvasRef.current
        if (!canvas) return

        const setSize = () => {
            const dpr = window.devicePixelRatio || 1
            canvas.style.width = `${window.innerWidth}px`
            canvas.style.height = `${window.innerHeight}px`
            canvas.width = Math.floor(window.innerWidth * dpr)
            canvas.height = Math.floor(window.innerHeight * dpr)
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
    
    return <canvas ref={canvasRef} {...props}/>
}

export default Canvas