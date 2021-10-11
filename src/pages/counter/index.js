import './index.css'
import logo from '../../assets/img/logo.svg'

import { Observer } from 'mobx-react'
import { Link } from 'react-router-dom'

import { useStore } from '../../utils/hooks/useStore'

function Counter() {
  const { counter } = useStore()

  return (
    <div className="App" style={{height: '300vh'}}>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <Observer
          render={() => (
            <>
              <div>
                <button onClick={counter.increase}>increase</button>
                &nbsp;
                <button style={{ width: 100 }} disabled={counter.loading} onClick={counter.incAfter2Sec}>
                  {counter.loading ? '...' : 'inc after 2 sec'}
                </button>
              </div>
              <div>
                <p>count: {counter.count}</p>
                <p>squareOfCount: {counter.squareOfCount}</p>
              </div>
            </>
          )}
        />

        <Link to="/about">To About</Link>

        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  )
}

export default Counter
