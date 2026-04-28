import {
    Modal as ReactstrapModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from 'reactstrap';

interface ModalProps {
    isOpen: boolean;
    toggle: () => void;
    title: string;
    body: React.ReactNode;
    onConfirm?: () => void;
    confirmText?: string;
}

export const Modal = ({ isOpen, toggle, title, body, onConfirm, confirmText = 'Confirm' }: ModalProps): React.JSX.Element => {
    return (
        <ReactstrapModal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>{title}</ModalHeader>
            <ModalBody>{body}</ModalBody>
            <ModalFooter>
                {onConfirm && <Button color="primary" onClick={onConfirm}>{confirmText}</Button>}
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </ReactstrapModal>
    );
};

export default Modal;