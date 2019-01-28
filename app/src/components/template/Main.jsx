import React from 'react';
import './Main.scss';
import {Header} from './index';

export default props =>
    <main>
        <Header project_open={props.project_open} handleProject={props.handleProject}
                handleDeleteModal={props.handleDeleteModal} handleEditModal={props.handleEditModal}/>
        <div className="content">
            {props.children}
        </div>
    </main>