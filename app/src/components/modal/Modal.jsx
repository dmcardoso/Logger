import React from 'react';
import {Button, Header, Icon, Modal, Form} from "semantic-ui-react";

export default props => {
    const content = props.project.id ? "Edite seu projeto" : "Cadastre um novo projeto!";
    return (
        <Modal open={props.open}>
            <Header icon='archive' content={content}/>
            <Modal.Content>
                <Form>
                    <Form.Field>
                        <label>Nome do projeto</label>
                        <input placeholder='Nome do projeto' name="name"
                               onChange={e => props.handleInput && props.handleInput(e)}
                               value={props.project.name}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Caminho do arquivo de debug</label>
                        <input placeholder='Caminho do arquivo de debug'
                               onChange={e => props.handleInput && props.handleInput(e)} name="path_debug"
                               value={props.project.path_debug}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Caminho do arquivo de erro</label>
                        <input placeholder='Caminho do arquivo de erro'
                               onChange={e => props.handleInput && props.handleInput(e)} name="path_error"
                               value={props.project.path_error}/>
                    </Form.Field>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' onClick={e => props.handleModal && props.handleModal(e)}>
                    <Icon name='remove'/> Cancelar
                </Button>
                <Button color='green' onClick={e => props.handleSubmit && props.handleSubmit(e)}>
                    <Icon name='checkmark'/> Salvar
                </Button>
            </Modal.Actions>
        </Modal>);
}
