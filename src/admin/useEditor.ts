import { useCallback, useRef, useState } from "react"
import { api } from "./api"
import { useUnsavedGuard } from "./feedback"

/**
 * Form state for a project or review editor:
 * - `dirty` compares against what was loaded and drives the unsaved-changes warning;
 * - images uploaded during the session are remembered, so the ones that end up unused
 *   (editor cancelled, or an image replaced twice before saving) are deleted from storage.
 */
export function useEditor<T>(initial: T) {
  const [value, setValue] = useState<T>(initial)
  const baseline = useRef(JSON.stringify(initial))
  const uploaded = useRef(new Set<string>())
  const dirty = JSON.stringify(value) !== baseline.current
  useUnsavedGuard(dirty)

  const trackUpload = useCallback((key: string) => uploaded.current.add(key), [])

  /** Deletes uploads from this session that aren't in `keep`. Failures are ignored (the API refuses in-use images). */
  const discardUploads = useCallback(async (keep: Array<string | undefined> = []) => {
    const keepSet = new Set(keep)
    const stale = [...uploaded.current].filter((k) => !keepSet.has(k))
    uploaded.current = new Set([...uploaded.current].filter((k) => keepSet.has(k)))
    await Promise.all(stale.map((k) => api.deleteImage(k).catch(() => {})))
  }, [])

  const markSaved = useCallback((saved: T) => {
    baseline.current = JSON.stringify(saved)
    setValue(saved)
  }, [])

  return { value, setValue, dirty, trackUpload, discardUploads, markSaved }
}
