import AbstractWeb3Connector from './AbstractWeb3Connector'
import { verifyChainId } from './utils'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { configureChains, createConfig, getAccount } from '@wagmi/core'
import { mainnet, goerli } from '@wagmi/core/chains'

export const WalletConnectEvent = Object.freeze({
    ACCOUNTS_CHANGED: 'accountsChanged',
    CHAIN_CHANGED: 'chainChanged',
    DISCONNECT: 'disconnect',
})

class WalletConnectWeb3ConnectorV2 extends AbstractWeb3Connector {
    type = 'WalletConnectV2'

    async activate({ chainId: providedChainId, mobileLinks, newSession } = {}) {
        return new Promise((resolve, reject) => {
            try {
                // Log out of any previous sessions
                if (newSession) {
                    this.cleanup()
                }

                const chains = [goerli, mainnet]
                const projectId = "7b60ed634f5c9e1a88fb7cf6ed8becff"
                const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
                const wagmiConfig = createConfig({
                    autoConnect: true,
                    connectors: w3mConnectors({ projectId, version: 1, chains }),
                    publicClient
                })

                let account = getAccount()
                console.log("Activating provider, account details:", JSON.stringify(account))

                const ethereumClient = new EthereumClient(wagmiConfig, chains)
                const web3modal = new Web3Modal({ projectId }, ethereumClient)

                this.wagmiConfig = wagmiConfig
                this.web3modal = web3modal

                web3modal.subscribeModal(() => {
                    account = getAccount()
                    if (!account.address || !account.connector) return;
                    const address = account.address.toLowerCase()
                    const verifiedChainId = verifyChainId(wagmiConfig.args.connectors[0].chains[0].id)

                    account.connector.getProvider().then(provider => {
                        console.log("Got provider", provider)
                        this.provider = provider
                        this.account = address
                        this.chainId = verifiedChainId
                        this.subscribeToEvents(this.provider)

                        const res = {
                            account: this.account,
                            provider: this.provider,
                            chainId: this.chainId
                        }
                        console.log("Resolving", res)
                        resolve(res)
                    })

                })
                web3modal.openModal()
            } catch (e) {
                console.log("connect wallet error", e)
                reject(e)
            }
        })
    }

    // Cleanup old sessions
    cleanup() {
        try {
            if (window) {
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith("wagmi") || key.startsWith("wc@2")) {
                        window.localStorage.removeItem(key)
                    }
                })
            }
        } catch (error) {
            // Do nothing
        }
    }

    async deactivate() {
        this.unsubscribeToEvents(this.provider)

        console.log("Deactivate: provider", this.wagmiConfig?.args?.connectors[1])
        if (this.wagmiConfig?.args?.connectors[1]) {
            try {
                await this.wagmiConfig.args.connectors[1].clearCachedProvider()
            } catch {
                // Do nothing
            }
        }

        this.web3modal = null
        this.account = null
        this.chainId = null
        this.provider = null
    }
}

export default WalletConnectWeb3ConnectorV2
