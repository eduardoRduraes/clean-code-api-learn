export interface UpdateAccessTokenRepository{
  update: (value: string, token: string) => Promise<void>
}
