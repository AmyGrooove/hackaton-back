declare module "express" {
  interface Request {
    cookies: { [key: string]: any }
  }

  interface Response {
    cookie(name: string, value: any, options?: any): Response
    clearCookie(name: string, options?: any): Response
  }
}
