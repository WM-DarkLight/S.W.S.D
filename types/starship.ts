export interface Starship {
  id: string
  name: string
  model?: string
  manufacturer: string
  class: string
  faction: string
  description?: string
  specs?: {
    [key: string]: string
    length?: string
    width?: string
    height?: string
    max_speed_atmos?: string
    hyperdrive?: string
    backup_hyperdrive?: string
    crew?: string
    passengers?: string
    cargo_capacity?: string
    consumables?: string
    armament?: string
    shielding?: string
    complement?: string
  }
  // Additional properties for the wiki section
  hyperdrive_rating?: string
  backup_hyperdrive_rating?: string
  MGLT?: string
  length?: string
  cargo_capacity?: string
  crew?: string
  passengers?: string
  armament?: string
  shields?: string

  // Extended information fields
  technicalNotes?: string[]
  lore?: {
    history?: string
    tacticalAssessment?: string
    notableEvents?: string[]
    quotes?: { text: string; author: string }[]
    strengths?: string[]
    weaknesses?: string[]
    fleetRole?: string
  }
  missions?: {
    notable: {
      name: string
      code: string
      date: string
      description: string
      status: "Completed" | "Failed" | "Ongoing" | "Classified"
      outcome: string
    }[]
  }
  personnel?: {
    notableCrew: {
      name: string
      rank: string
      species?: string
      role?: string
    }[]
    standardComplement?: {
      officers?: number
      enlisted?: number
      troops?: number
      droids?: number | string
    }
  }
}
