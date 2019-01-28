import React from 'react';
import './Logview.scss';
import renderHTML from 'react-render-html';

export default props =>
    <div className="container-log">
        {renderHTML(props.content)}
        <div className="btn" onClick={e => props.onClear && props.onClear(e)}>Limpar</div>
    </div>