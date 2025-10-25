
import React, { useRef, useEffect } from 'react'

interface CanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {}

interface Draw {
    (ctx: CanvasRenderingContext2D, frameCount: number): void
}

const Canvas: React.FC<CanvasProps> = props => {
    
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    
    const draw: Draw = (ctx, frameCount) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        initalizeCanvas(ctx.canvas)
        ctx.fillStyle = 'black'
        ctx.beginPath()
        ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
        ctx.fill()
    }

    const initalizeCanvas = (canvas: HTMLCanvasElement) => {
        const context = canvas.getContext('2d')
        if (context) {
            context.fillStyle = '#7CFC00'
            context.fillRect(0, 0, canvas.width, canvas.height)
        }
    }
    
    useEffect(() => {
        
        const canvas = canvasRef.current as HTMLCanvasElement
        const context = canvas.getContext('2d') as CanvasRenderingContext2D
        let frameCount = 0
        let animationFrameId: number
        
        //Our draw came here
        const render = () => {
            frameCount++
            draw(context, frameCount)
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()
        
        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [draw])
    
    return <canvas ref={canvasRef} {...props}/>
}

export default Canvas