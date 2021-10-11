import React from 'react'
import { MobXProviderContext } from 'mobx-react'

export const useStore = () => React.useContext(MobXProviderContext)
