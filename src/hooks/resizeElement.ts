import { useLayoutEffect, useState } from 'react'

export default function useResizeElement(ref: React.RefObject<HTMLCanvasElement>) {
  const [size, setSize] = useState<[number, number] | null>(null)
  useLayoutEffect(() => {
    const r = ref.current as Element
    function updateSize(newSize: [number, number]) {
      if (!size || newSize[0] !== size[0] || newSize[1] !== size[1]) setSize(newSize)
    }
    const ro = new ResizeObserver((entries) => {
      entries.forEach((ent) => {
        const target = ent.target as HTMLCanvasElement
        updateSize([target.width, target.height])
      })
    })
    ro.observe(r)
    return () => ro.unobserve(r)
  }, [ref])

  return size
}
