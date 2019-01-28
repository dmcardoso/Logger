import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import './App.scss';
import {Sidebar} from '../components/template/index';
import {Routes} from './index';
import {Modal} from '../components/modal/index';
import {Loading} from '../components/loading/index';
import axios from 'axios';
import {Server} from '../core/services/index';
import io from 'socket.io-client';


const {getServerUrl} = new Server();

const initialState = {
    project: {
        name: '',
        path_debug: '',
        path_error: ''
    },
    open: false,
    selected_project: '',
    list: [],
    ready: false
};

let socket;
export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.handleModal = this.handleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSidebar = this.handleSidebar.bind(this);
        this.updateList = this.updateList.bind(this);

        socket = io(getServerUrl());
        const online = setInterval(() => {
            socket.emit('is-online', "is server online?");
        }, 1000);
        socket.on('online', msg => {
            clearInterval(online);
            this.updateList();
            this.setState({ready: true});
        });
    }

    updateList() {
        axios(`${getServerUrl()}projects`)
            .then(projects => {
                let selected = "";
                if (window.location.pathname.split('/')[2]) selected = window.location.pathname.split('/')[2];
                this.setState({list: projects.data, selected_project: selected});
            });

        socket.on('update', (data) => {
            const list = [...this.state.list];

            const isUpdate = () => list.some(project => Number(project.id) === Number(data.id));

            if (isUpdate()) {
                list.forEach((project, index) => Number(project.id) === Number(data.id) ? list[index] = {...data} : '');
            } else {
                list.push(data);
            }

            this.setState({list});
        });

        socket.on('delete', (data) => {
            const list = [...this.state.list];

            const new_list = list.filter(project => {
                return project.id !== Number(data);
            });

            this.setState({list: new_list});
        });

    }

    componentWillUnmount() {
        socket.disconnect();
    }

    state = {
        ...initialState
    };

    handleInput(e) {
        const project = {...this.state.project};
        project[e.target.name] = e.target.value;
        this.setState({project});
    }

    handleSidebar(e, id) {
        this.setState({selected_project: id});
    }

    handleModal() {
        if (this.state.open) this.setState({project: initialState.project, open: initialState.open});
        else this.setState({open: !this.state.open});
    }

    handleSubmit(e) {
        const project = {project: {...this.state.project}};
        const method = project.project.id ? 'put' : 'post';
        const url = project.project.id ? `${getServerUrl()}projects/${project.project.id}` : `${getServerUrl()}projects`;

        axios[method](url, project)
            .then(resp => {
            });
        this.handleModal();
    }

    render() {
        const isOnline = this.state.ready;

        if (isOnline) {
            return (
                <BrowserRouter>
                    <div className="app">
                        <Sidebar handleModal={this.handleModal} projects={this.state.list}
                                 handleSidebar={this.handleSidebar} selected={this.state.selected_project}/>
                        <Modal open={this.state.open}
                               project={{
                                   name: this.state.project.name,
                                   path_debug: this.state.project.path_debug,
                                   path_error: this.state.project.path_error
                               }}
                               handleInput={this.handleInput}
                               handleModal={this.handleModal}
                               handleSubmit={this.handleSubmit}/>
                        <Routes/>
                    </div>
                </BrowserRouter>
            );
        } else {
            return (
                <Loading/>
            );
        }

    }
}