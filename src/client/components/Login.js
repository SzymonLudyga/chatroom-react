import React, { Component } from 'react';
import {
    FormControl, Button, TextField
} from '@material-ui/core';
import { routes } from '../routing/routes';

export default class Login extends Component {
    _handleChange = (e) => {
        console.log(e.target.value);
    }

    _handleSubmit = () => {
        this.props.history.push(routes.join);
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
                    onChange={this._handleChange}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    id="outlined-password-input"
                    label="Password"
                    className={classes.textField}
                    type="password"
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
