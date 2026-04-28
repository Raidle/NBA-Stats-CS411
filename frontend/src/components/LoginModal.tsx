import React, { useState } from 'react';
import axios from 'axios';
import {

Button,
Modal,
ModalHeader,
ModalBody,
ModalFooter,
Form,
FormGroup,
Label,
Input,
Alert,
} from 'reactstrap';

type LoginModalProps = {
isOpen: boolean;
toggle: () => void;
onLoginSuccess?: (data: unknown) => void;
};

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, toggle, onLoginSuccess }) => {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
        const response = await axios.post('/login', {
            username,
            password,
        });

        onLoginSuccess?.(response.data);
        toggle();
        setUsername('');
        setPassword('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        setError('Login failed. Please check your username and password.');
    } finally {
        setLoading(false);
    }
};

return (
    <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Login</ModalHeader>
        <Form onSubmit={handleSubmit}>
            <ModalBody>
                {error && <Alert color="danger">{error}</Alert>}

                <FormGroup>
                    <Label for="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </FormGroup>
            </ModalBody>

            <ModalFooter>
                <Button color="secondary" type="button" onClick={toggle} disabled={loading}>
                    Cancel
                </Button>
                <Button color="primary" type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </ModalFooter>
        </Form>
    </Modal>
);
};

export default LoginModal;