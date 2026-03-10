export interface FieldDef {
  name: string
  masked?: boolean
  inputType?: 'text' | 'email' | 'password'
  autoComplete?: string
}

export interface CommittedLine {
  prompt: string
  value: string
  masked: boolean
}
