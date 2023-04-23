/* eslint-disable camelcase */
import jwt_decode, { JwtPayload } from 'jwt-decode'

interface JwtPayloadToken extends JwtPayload {
  id: number
}

export interface JwtPayloadData {
  id: number,
  iat: number | undefined,
  exp: number
}

const getPayload = (token: string):JwtPayloadData | undefined => {
  if (!token) return
  const jwtPayload = jwt_decode<JwtPayloadToken>(token)
  if (!jwtPayload.exp) return

  // set a timeout to refresh the token a minute before it expires
  const expires = new Date(jwtPayload.exp * 1000)
  const timeout = expires.getTime() - Date.now() - (60 * 1000)

  const payload: JwtPayloadData = {
    id: jwtPayload.id,
    iat: jwtPayload.iat,
    exp: timeout
  }
  return payload
}

const Jwt = {
  getPayload,
}

export default Jwt
