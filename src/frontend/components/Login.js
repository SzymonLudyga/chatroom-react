import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    FormControl, Button, TextField
} from '@material-ui/core';
import { routes } from '../routing/routes';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            option: 'login',
            name: '',
            password: '',
        };
    }

    _handleNameChange = (e) => {
        this.setState({ name: e.target.value });
    }

    _handlePasswordChange = (e) => {
        this.setState({ password: e.target.value });
    }

    _handleSubmit = () => {
        const { name, password, option } = this.state;
        option === 'login' ? this.props.login({ name, password }) : this.props.register({ name, password });
        this.props.history.push(routes.join);
    }

    _change = (option) => {
        this.setState({ option });
    }

    render() {
        const { classes } = this.props;
        const { option } = this.state;
        return (
            <>
                <Button onClick={() => this._change('login')} className={classes.option} variant="outlined" color="primary">
                    Login
                </Button>
                <Button onClick={() => this._change('register')} className={classes.option} variant="outlined" color="secondary">
                    Register
                </Button>
                <FormControl className={classes.container}>
                    <TextField
                        id="outlined-name"
                        label="Name"
                        className={classes.textField}
                        onChange={this._handleNameChange}
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        id="outlined-password-input"
                        label="Password"
                        className={classes.textField}
                        type="password"
                        onChange={this._handlePasswordChange}
                        autoComplete="current-password"
                        margin="normal"
                        variant="outlined"
                    />
                    <Button onClick={this._handleSubmit} className={classes.big} variant="contained" color={option === 'login' ? 'primary' : 'secondary'}>
                        {option === 'login' ? 'Login' : 'Register'}
                    </Button>
                </FormControl>
            </>
        );
    }
}

Login.propTypes = {
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
};
