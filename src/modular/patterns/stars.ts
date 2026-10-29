import type { ModularPattern } from "@/types/modular";

/**
 * `--m-pattern` five-pointed stars, about 30px across, on a 120px tile: one
 * in the middle and a quarter at each corner, so the corners meet in whole
 * stars and the rows sit staggered (the 40px drawing at three times its
 * size). A drawing, so a mask, as Pebbles: a layer behind the content
 * (`before:`) in the pattern colour, showing only where the stars are.
 */
export const pattern: ModularPattern = {
  id: "stars",
  name: "Stars",
  className:
    "before:absolute before:inset-0 before:-z-10 before:bg-[var(--m-pattern)] before:[mask-image:url(data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2740%27%20height=%2740%27%20viewBox=%270%200%2040%2040%27%3E%3Cpath%20d=%27M23.222%2025.097l-3.266-2.056-3.219%202.058.983-3.847-3.042-2.503%203.936-.18%201.52-3.668%201.342%203.578%203.846.312-2.996%202.505z%27/%3E%3Cpath%20d=%27M.133-5.1l-1.52%203.668-3.935.18%203.043%202.504-.985%203.848L-.043%203.04l3.264%202.057-.895-3.803L5.322-1.21l-3.845-.312L.133-5.1zm40%200l-1.52%203.668-3.935.18%203.043%202.504-.985%203.848%203.221-2.059%203.264%202.057-.895-3.803%202.996-2.504-3.845-.312L40.133-5.1zm-40%2040l-1.52%203.668-3.935.18%203.043%202.504-.985%203.848%203.221-2.059%203.264%202.057-.895-3.803%202.996-2.504-3.845-.312L.133%2034.9zm40%200l-1.52%203.668-3.935.18%203.043%202.504-.985%203.848%203.221-2.059%203.264%202.057-.895-3.803%202.996-2.504-3.845-.312-1.344-3.579z%27/%3E%3C/svg%3E)] before:[mask-size:120px_120px]",
};
