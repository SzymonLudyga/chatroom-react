import { push } from 'connected-react-router';

export default function changePath(payload) {
    return push(payload.path);
}
