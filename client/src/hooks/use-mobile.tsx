import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Por defecto, asumimos que es desktop hasta que se compruebe
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    // Función para comprobar si es un dispositivo móvil
    const checkIfMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
    }

    // Comprobar inmediatamente
    checkIfMobile()
    
    // Añadir listener para redimensionamientos
    window.addEventListener('resize', checkIfMobile)
    
    // Limpieza al desmontar
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  return isMobile
}

// Hook auxiliar para controlar la barra lateral
export function useSidebar(initialState = false) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = React.useState(!isMobile)
  
  // Ajustar apertura según tamaño de pantalla
  React.useEffect(() => {
    if (isMobile) {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }, [isMobile])
  
  // Funciones auxiliares
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(prev => !prev)
  
  return {
    isOpen,
    setIsOpen,
    open,
    close,
    toggle,
    isMobile
  }
}
