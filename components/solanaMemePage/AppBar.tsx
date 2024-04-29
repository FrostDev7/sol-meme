"use client"

import { FC } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export const AppBar: FC = () => {
    return (
        <div style={{
            "display" : "flex",
            "justifyContent": "space-between"
        }}>
            <h1>Wallet-Adapter Example</h1>
            <WalletMultiButton />
        </div>
    )
}