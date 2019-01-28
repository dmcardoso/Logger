import React from 'react';
import {Button, Header, Icon, Modal} from 'semantic-ui-react';

export default props =>
    <Modal  basic size='small' open={props.open_delete}>
        <Header icon='archive' content={props.project_open.name}/>
        <Modal.Content>
            <p>
                Deseja realmente excluir o projeto {props.project_open.name} ?
            </p>
        </Modal.Content>
        <Modal.Actions>
            <Button basic color='red' inverted onClick={e => props.handleDeleteModal && props.handleDeleteModal(e)}>
                <Icon name='remove'/> Não
            </Button>
            <Button color='green' inverted onClick={e => props.deleteProject && props.deleteProject(e)}>
                <Icon name='checkmark'/> Sim
            </Button>
        </Modal.Actions>
    </Modal>
