import React, { Component } from 'react';
import PropTypes from "prop-types";
import {
    FormControl, Button, TextField
} from '@material-ui/core';
import { routes } from '../routing/routes';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: '',
            password: '',
        };
    }

    _handleLoginChange = (e) => {
        this.setState({ login: e.target.value });
    }

    _handlePasswordChange = (e) => {
        this.setState({ password: e.target.value });
    }

    _handleSubmit = () => {
        this.props.login({ name: this.state.login, password: this.state.password });
        // this.props.history.push(routes.join);
    }

    render() {
        const { classes } = this.props;
        return (
            <FormControl className={classes.container}>
                <TextField
                    id="outlined-name"
                    label="Name"
                    className={classes.textField}
                    // value={values.name}
                    onChange={this._handleLoginChange}
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
                <Button onClick={this._handleSubmit} className={classes.big} variant="contained" color="primary">
                    Login
                </Button>
            </FormControl>
        );
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
};
