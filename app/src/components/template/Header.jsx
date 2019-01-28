import React from 'react';
import './Header.scss';
import {Icon} from 'semantic-ui-react';

export default props => {
    let class_header = (props.project_open && props.project_open.name) ? '' : 'home-scale';
    return (
        <header className={class_header}>
            <h2>{props.project_open !== undefined ? props.project_open.name : ''}</h2>
            <div className="actions">
                {(props.project_open && props.project_open.id) ?
                    <Icon name='delete' color='grey' size='big' title='Excluir projeto'
                          onClick={e => props.handleDeleteModal && props.handleDeleteModal(e)}/> : ''}
                <Icon name='pencil' color='grey' size='big'
                      onClick={e => props.handleEditModal && props.handleEditModal(e)} title='Editar projeto'/>
                {(props.project_open && props.project_open.path_error) ?
                    <Icon name='warning circle' color='grey' size='big' title='Log de erro'
                          onClick={e => props.handleProject && props.handleProject(e, 'error')}/> : ''}
                {(props.project_open && props.project_open.path_debug) ?
                    <Icon name='code' color='grey' size='big' title='Debug'
                          onClick={e => props.handleProject && props.handleProject(e, 'debug')}/> : ''}
            </div>
        </header>
    );
}