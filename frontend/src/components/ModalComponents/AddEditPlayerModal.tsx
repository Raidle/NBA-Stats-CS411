import Modal from '../Modal';
import {
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import React from 'react';
import Axios from 'axios';
import type PlayerDTO from '../../models/DTO/PlayerDTO';

const getPlayerId = (player: PlayerDTO): number | undefined => {
    return player.id ?? (player as PlayerDTO & { playerId?: number }).playerId;
};

const parseNumericField = (value: string): number | null => {
    const trimmedValue = value.trim();

    if (trimmedValue === '') {
        return null;
    }

    const parsedValue = Number(trimmedValue);

    return Number.isFinite(parsedValue) ? parsedValue : null;
};

interface AddEditPlayerModalProps {
    isOpen: boolean;
    toggle: () => void;
    player: PlayerDTO | null;
    onSaveSuccess?: () => void | Promise<void>;
}

const sendData = async ({ firstName, lastName, heightInches, bodyWeightPounds }: { firstName: string; lastName: string; heightInches: string; bodyWeightPounds: string }) => {
    const parsedHeightInches = parseNumericField(heightInches);
    const parsedBodyWeightLbs = parseNumericField(bodyWeightPounds);

    if (parsedHeightInches === null || parsedBodyWeightLbs === null) {
        throw new Error('Height and body weight must be valid numbers.');
    }

    await Axios.post('/players', {
        firstName,
        lastName,
        heightInches: parsedHeightInches,
        bodyWeightLbs: parsedBodyWeightLbs,
    });
};

const AddEditPlayerModal: React.FC<AddEditPlayerModalProps> = ({ isOpen, toggle, player, onSaveSuccess }) => {
    const [firstName, setFirstName] = React.useState<string>(player?.firstName ?? '')
    const [lastName, setLastName] = React.useState<string>(player?.lastName ?? '')
    const [heightInches, setHeightInches] = React.useState<string>(player?.heightInches?.toString() ?? '')
    const [bodyWeightPounds, setBodyWeightPounds] = React.useState<string>(player?.bodyWeightLbs?.toString() ?? '');

    const handleSave = async () => {
        try {
            const playerId = player ? getPlayerId(player) : undefined;
            const parsedHeightInches = parseNumericField(heightInches);
            const parsedBodyWeightLbs = parseNumericField(bodyWeightPounds);

            if (parsedHeightInches === null || parsedBodyWeightLbs === null) {
                throw new Error('Height and body weight must be valid numbers.');
            }

            const playerPayload = {
                firstName,
                lastName,
                heightInches: parsedHeightInches,
                bodyWeightLbs: parsedBodyWeightLbs,
            };

            if (playerId) {
                await Axios.put(`/players/${playerId}`, playerPayload);
            } else {
                await sendData({ firstName, lastName, heightInches, bodyWeightPounds });
            }

            await onSaveSuccess?.();
            toggle();
        } catch (error) {
            console.error('Error saving player:', error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            toggle={toggle}
            title={player ? 'Edit Player' : 'Add Player'}
            body={
                <Form>
                    <FormGroup>
                        <Label for="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter first name"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter last name"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="heightInches">Height (inches)</Label>
                        <Input
                            id="heightInches"
                            type="number"
                            value={heightInches}
                            onChange={(e) => setHeightInches(e.target.value)}
                            placeholder="Enter height in inches"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="bodyWeightPounds">Body Weight (pounds)</Label>
                        <Input
                            id="bodyWeightPounds"
                            type="number"
                            value={bodyWeightPounds}
                            onChange={(e) => setBodyWeightPounds(e.target.value)}
                            placeholder="Enter body weight in pounds"
                        />
                    </FormGroup>
                </Form>
            }
            onConfirm={handleSave}
            confirmText={player ? 'Save Changes' : 'Add Player'}
        />
    );
};

export default AddEditPlayerModal;