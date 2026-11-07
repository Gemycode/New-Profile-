import { useRef } from "react"

/** Drag-and-drop (plus button) reordering for a list; `save` receives the new id order. */
export function useReorder<T extends { id: number }>(save: (ids: number[]) => Promise<void>) {
  const dragFrom = useRef<number | null>(null)

  const commit = (list: T[], from: number, to: number) => {
    if (from === to || to < 0 || to >= list.length) return
    const next = [...list]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    void save(next.map((x) => x.id))
  }

  return {
    move: (list: T[], i: number, d: -1 | 1) => commit(list, i, i + d),
    itemProps: (list: T[], i: number) => ({
      draggable: true,
      onDragStart: (e: React.DragEvent) => {
        dragFrom.current = i
        e.dataTransfer.effectAllowed = "move"
      },
      onDragOver: (e: React.DragEvent) => e.preventDefault(),
      onDrop: (e: React.DragEvent) => {
        e.preventDefault()
        if (dragFrom.current !== null) commit(list, dragFrom.current, i)
        dragFrom.current = null
      },
    }),
  }
}
