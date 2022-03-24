export interface UpdateAccessTokenRepository{
  updateAccessToken: (value: string, token: string) => Promise<void>
}
