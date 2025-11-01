import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Começa como undefined para que a renderização inicial no cliente e no servidor seja a mesma.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Esta parte só roda no cliente.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(mql.matches)
    }

    // Define o valor inicial no cliente
    setIsMobile(mql.matches)
    
    mql.addEventListener("change", onChange)

    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
