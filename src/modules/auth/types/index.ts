export type JwtPayload = {
  id: string
  username: string
  iat: number
  exp: number
}

const usernameValidation = /^[a-zA-Z0-9_-]{3,20}$/

export { usernameValidation }
