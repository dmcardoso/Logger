import React, {Component} from 'react';
import './Project.scss';

import axios from 'axios';
import {Server} from '../../core/services/index';
import {Main} from '../template/index';
import {Logview} from './index';
import {ModalDelete} from './modal/index';
import {Modal} from '../modal/index';
import {Redirect} from 'react-router-dom';
import io from 'socket.io-client';

const {getServerUrl} = new Server();

const initialState = {
    project_open: {
        id: '',
        path_error: '',
        path_debug: '',
        created_ad: '',
        name: ''
    },
    type: '',
    content: '',
    open_delete: false,
    open_edit: false,
    redirect: false
};

let watcher = "";
export default class Project extends Component {

    state = {...initialState};

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({...initialState});
        const id = nextProps.match.params.id;
        axios.get(`${getServerUrl()}projects/${id}`)
            .then(project => {
                this.setState({project_open: project.data});
            });
    }

    componentWillMount() {
        this.setState({...initialState});
        const id = this.props.match.params.id;
        axios.get(`${getServerUrl()}projects/${id}`)
            .then(project => {
                this.setState({project_open: project.data});
            });
        watcher = io(getServerUrl());
        watcher.on('log-data', (data) => {
            this.setState({content: this.state.content + data});
        });
    }

    constructor(props) {
        super(props);

        this.handleProject = this.handleProject.bind(this);
        this.onClear = this.onClear.bind(this);
        this.handleDeleteModal = this.handleDeleteModal.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.handleEditModal = this.handleEditModal.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillUnmount() {
        this.setState({...initialState});
        watcher.disconnect();
    }

    handleProject(e, type) {
        if (type !== this.state.type) {
            this.setState({type});
            axios.get(`${getServerUrl()}projects/${this.state.project_open.id}/${type}`)
                .then(res => {
                });
        }
    }

    onClear() {
        axios.post(`${getServerUrl()}projects/${this.state.project_open.id}/${this.state.type}`)
            .then(res => {
                this.setState({content: ""});
            });
    }

    deleteProject() {
        axios.delete(`${getServerUrl()}projects/${this.state.project_open.id}`)
            .then(res => {
                this.handleDeleteModal();
                this.setState({redirect: true})
            });
    }

    handleDeleteModal() {
        this.setState({open_delete: !this.state.open_delete});
    }

    handleEditModal() {
        this.setState({open_edit: !this.state.open_edit});
    }

    handleSubmit() {
        const project = {project: {...this.state.project_open}};
        const method = project.project.id ? 'put' : 'post';
        const url = project.project.id ? `${getServerUrl()}projects/${project.project.id}` : `${getServerUrl()}projects`;

        axios[method](url, project)
            .then(resp => {
            });
        this.handleEditModal();
    }

    handleInput(e) {
        const project_open = {...this.state.project_open};
        project_open[e.target.name] = e.target.value;
        this.setState({project_open});
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to='/'/>;
        } else {
            return (
                <Main project_open={this.state.project_open} handleDeleteModal={this.handleDeleteModal}
                      handleProject={this.handleProject} handleEditModal={this.handleEditModal}>
                    <Logview content={this.state.content} type={this.state.type} onClear={this.onClear}/>
                    <ModalDelete handleDeleteModal={this.handleDeleteModal}
                                 deleteProject={this.deleteProject}
                                 open_delete={this.state.open_delete}
                                 project_open={this.state.project_open}/>
                    <Modal
                        open={this.state.open_edit}
                        project={this.state.project_open}
                        handleModal={this.handleEditModal}
                        handleSubmit={this.handleSubmit}
                        handleInput={this.handleInput}
                    />
                </Main>
            );
        }
    }

}