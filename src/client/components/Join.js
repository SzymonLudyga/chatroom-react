import React, { Component } from 'react';
import {
    FormControl, Button, InputLabel, Select, MenuItem, Input, FormHelperText
} from '@material-ui/core';
import { routes } from '../routing/routes';

export default class Join extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomName: ''
        };
    }

    _handleChange = (e) => {
        console.log(e.target.value);
        this.setState({
            roomName: e.target.value
        });
    }

    _handleSubmit = () => {
        this.props.history.push(routes.chat);
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                <FormControl>
                    <InputLabel shrink htmlFor="room-label-placeholder">
                        Room
                    </InputLabel>
                    <Select
                        className={classes.textField}
                        value={this.state.roomName}
                        onChange={this._handleChange}
                        input={<Input name="room" id="room-helper" />}
                    >
                        <MenuItem value="oslo">Oslo</MenuItem>
                        <MenuItem value="berlin">Berlin</MenuItem>
                        <MenuItem value="copenhagen">Copenhagen</MenuItem>
                    </Select>
                    <FormHelperText>Select room for chat</FormHelperText>
                    <Button onClick={this._handleSubmit} className={classes.big} variant="contained" color="primary">
                        Join
                    </Button>
                </FormControl>
            </div>

        );
    }
}
