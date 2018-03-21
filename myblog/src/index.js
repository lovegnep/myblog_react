import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './util/setRem';
import './util/base.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
