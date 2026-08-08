import { useState } from "react";
import ColorName from "./ColorName";
import ColorType from "./ColorType";
import ColorCode from "./ColorCode";
import { validateName, checkCodeValidity } from "../helpers/colorValidators";

export default function ColorForm({ onSave, savedColors = [] }) {
    const [name, setName] = useState('');
    const [type, setType] = useState('RGB');
    const [code, setCode] = useState('');
    const [errors, setErrors] = useState({});

    const handleNameChange = (e) => {
        setName(e.target.value);
        const nameError = validateName(e.target.value, savedColors, type);
        setErrors(prev => ({ ...prev, name: nameError }));
    };

    const handleCodeChange = (e) => {
        setCode(e.target.value);
        const codeError = checkCodeValidity(e.target.value, type);
        setErrors(prev => ({ ...prev, code: codeError }));
    };

    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setType(newType);
        
        const nameError = validateName(name, savedColors, newType);
        const codeError = code ? checkCodeValidity(code, newType) : null;
        setErrors({ name: nameError, code: codeError });
    };

    const handleSave = (e) => {
        e.preventDefault();
        
        const nameError = validateName(name, savedColors, type);
        const codeError = checkCodeValidity(code, type);
        
        setErrors({ name: nameError, code: codeError });
        
        if (!nameError && !codeError) {
            onSave({ name: name.trim().toUpperCase(), type: type.toUpperCase(), code: code.trim() });
            setName('');
            setCode('');
            setErrors({});
        }
    };

    const codePlaceholder = type.toLowerCase() === 'hex' ? '#FF4500' : type.toLowerCase() === 'rgb' ? '154, 205, 50' : '0, 139, 139, 1';

    return (
        <form onSubmit={handleSave}>
            <ColorName value={name} onChange={handleNameChange} error={errors.name} placeholder="Например: YELLOW"/>
            <ColorType value={type} onChange={handleTypeChange} />
            <ColorCode value={code} onChange={handleCodeChange} error={errors.code} placeholder={codePlaceholder} />
            <div className="d-grid mt-3"><button type="submit" className="btn btn-warning">Save</button></div>
        </form>
    );
}
