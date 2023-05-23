import Moralis from 'moralis'

export const APP_ID = "HhJtTqzu8ZZmrChihL0g5vRzgp5LyzswXIJ27qrj"
export const SERVER_URL = "https://nrnhzxloybjl.usemoralis.com:2053/server"

Moralis.initialize(APP_ID)
Moralis.serverURL = SERVER_URL

export default Moralis