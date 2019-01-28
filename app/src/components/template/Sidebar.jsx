import React from 'react';
import {Link} from 'react-router-dom';
import './Sidebar.scss';


export default props => {

    const listProjects = props.projects.map(project => {
        const link = `/project/${project.id}`;
        const classes = (props.selected !== "" && Number(props.selected) === Number(project.id)) ? "project btn selected" : "project btn";
        return (
            <li key={project.id} title={project.name}>
                <Link to={link}
                      onClick={e => props.handleSidebar && props.handleSidebar(e, project.id)} className={classes}>
                    <span>{project.name}</span>
                </Link>
            </li>
        );
    });

    return (
        <aside>
            <button className="btn btn-new" onClick={e => props.handleModal && props.handleModal(e)}>Novo Projeto
            </button>
            <ul className="projects">
                {listProjects}
            </ul>
        </aside>
    );
};