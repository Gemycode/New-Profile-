import { Fragment, createElement, type ReactNode } from "react"
import { useInView } from "../lib/motion"

type Props = {
  /** One string per visual line. Wrap a word in *asterisks* to set it in italic. */
  lines: string[]
  as?: "h1" | "h2" | "h3" | "p"
  className?: string
  delay?: number
  id?: string
}

/** Headline that rises in word by word when it enters the viewport. */
export function Reveal({ lines, as = "h2", className = "", delay = 0, id }: Props) {
  const [ref] = useInView<HTMLElement>({ threshold: 0.25 })
  let i = 0
  const content: ReactNode[] = lines.map((line, li) => (
    <span className="rv-line" key={li}>
      {line.split(" ").map((raw, wi) => {
        const italic = raw.startsWith("*") && raw.endsWith("*")
        const word = italic ? raw.slice(1, -1) : raw
        const idx = i++
        return (
          <Fragment key={wi}>
            {wi > 0 ? " " : null}
            <span className="rv-word">
              <span className="rv-inner" style={{ ["--i" as string]: idx, ["--d" as string]: `${delay}ms` }}>
                {italic ? <em>{word}</em> : word}
              </span>
            </span>
          </Fragment>
        )
      })}
    </span>
  ))
  return createElement(as, { ref, id, className: `display ${className}`, "aria-label": lines.join(" ").replace(/\*/g, "") }, content)
}
