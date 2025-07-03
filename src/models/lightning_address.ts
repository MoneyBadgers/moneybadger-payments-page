export default class LightningAddress {
  username: string
  domain: string

  constructor(public raw: string) {
    const [username, domain] = raw.split('@')
    this.username = username || ''
    this.domain = domain || ''
  }

  get lnurlpUrl(): string | null {
    if (!this.username || !this.domain) return null
    return `https://${this.domain}/.well-known/lnurlp/${this.username}`
  }

  async valid(): Promise<boolean> {
    const url = this.lnurlpUrl
    if (!url) return false

    try {
      const res = await fetch(url)
      if (!res.ok) return false

      const json = await res.json()

      return (
        json.callback &&
        json.minSendable &&
        json.maxSendable &&
        json.tag === 'payRequest'
      )
    } catch (e) {
      console.error(`LightningAddress: validation failed for ${this.raw}`, e)
      return false
    }
  }
}