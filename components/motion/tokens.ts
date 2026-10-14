// Courbes et durées "Apple" partagées par toutes les animations du site.
export const EASE_OUT = [0.16, 1, 0.3, 1] as const // expo-out : départ vif, arrivée très douce
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const
export const SPRING_SOFT = { type: 'spring', stiffness: 140, damping: 20, mass: 0.8 } as const
export const SPRING_SNAPPY = { type: 'spring', stiffness: 380, damping: 26 } as const
export const VIEWPORT_ONCE = { once: true, margin: '0px 0px -12% 0px' } as const
