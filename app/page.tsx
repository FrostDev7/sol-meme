"use client"

import WalletContextProvider from '../components/solanaMemePage/WalletContextProvider'
import { AppBar } from '../components/solanaMemePage/AppBar'
import { BalanceDisplay } from '../components/solanaMemePage/BalanceDisplay'
import { SendSolForm } from '../components/solanaMemePage/SendSolForm'

export default function Home() {
  return (
    <div>
      <WalletContextProvider>
        <AppBar />
        <div>
          <BalanceDisplay />
          <SendSolForm />
        </div>
      </WalletContextProvider >
    </div>
  );
}
