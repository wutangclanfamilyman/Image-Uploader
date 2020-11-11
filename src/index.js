import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import App from './components/app'
import store from './store'
import './index.scss'

render(
    <Provider store={store}>
        <div className="box">
            <App />
        </div>
    </Provider>,
    document.getElementById('app')
)