import React from 'react';
import {Switch, Route, Redirect} from 'react-router';

import {Home} from '../components/home';
import {Project} from '../components/project';

export default props =>
    <Switch>
        <Route exact path='/' component={Home}/>
        <Route path='/project/:id' component={Project}/>
        <Redirect from='*' to='/'/>
    </Switch>