import { useState } from "react";
import ColorName from "./ColorName";
import ColorType from "./ColorType";
import ColorCode from "./ColorCode";

export default function ColorForm({ onSave, savedColors = [] }) {
    const [name, setName] = useState('');
    const [type, setType] = useState('RGB');
    const [code, setCode] = useState('');
    const [errors, setErrors] = useState({});

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        validateAndSetNameError(value, type);
    };

    const validateAndSetNameError = (nameValue, currentType) => {
        const trimmed = nameValue.trim();
        let nameError = null;

        if (!trimmed) {
            nameError = 'Название обязательно для заполнения';
        } else if (!/^[A-Za-zА-Яа-яёЁ]+$/.test(trimmed)) {
            nameError = 'Имя цвета должно содержать только буквы';
        } else {
            const existingColor = savedColors.find(c => c.name.toLowerCase() === trimmed.toLowerCase());
            if (existingColor && existingColor.codes[currentType.toUpperCase()]) {
                nameError = `Для цвета ${trimmed.toUpperCase()} код формата ${currentType.toUpperCase()} уже добавлен`;
            }
        }

        setErrors(prev => ({ ...prev, name: nameError }));
        return nameError;
    };

    const checkCodeValidity = (currentCode, currentType) => {
        const cleanCode = currentCode.trim();
        if (!cleanCode) return 'Код цвета обязателен для заполнения';
        
        const typeLower = currentType.toLowerCase();

        if (typeLower === 'hex') {
            if (!/^#[0-9A-Fa-f]{6}$/.test(cleanCode)) return 'Код HEX должен соответствовать шаблону #XXXXXX';
            return null;
        }

        const parts = cleanCode.split(',').map(s => s.trim());
        
        if (typeLower === 'rgb') {
            if (parts.length !== 3 || !parts.every(p => /^\d+$/.test(p))) {
                return 'Код RGB должен соответствовать шаблону [0-255], [0-255], [0-255]';
            }
            if (parts.some(p => parseInt(p, 10) < 0 || parseInt(p, 10) > 255)) {
                return 'Числа в RGB должны быть в диапазоне от 0 до 255';
            }
            return null;
        }

        if (typeLower === 'rgba') {
            if (parts.length !== 4) return 'Код RGBA должен соответствовать шаблону [0-255], [0-255], [0-255], [0-1]';
            
            const rgbParts = parts.slice(0, 3);
            if (!rgbParts.every(p => /^\d+$/.test(p)) || rgbParts.some(p => parseInt(p, 10) < 0 || parseInt(p, 10) > 255)) {
                return 'Числа RGB внутри RGBA должны быть в диапазоне от 0 до 255';
            }

            if (!/^(0|1|0\.\d+)$/.test(parts[3])) return 'Значение альфа-канала должно быть в диапазоне от 0 до 1';
            return null;
        }

        return 'Неизвестный тип цвета';
    };

    const handleCodeChange = (e) => {
        const value = e.target.value;
        setCode(value);
        const codeError = checkCodeValidity(value, type);
        setErrors(prev => ({ ...prev, code: codeError }));
    };

    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setType(newType);
        
        validateAndSetNameError(name, newType);
        if (code) {
            const codeError = checkCodeValidity(code, newType);
            setErrors(prev => ({ ...prev, code: codeError }));
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        
        const nameError = validateAndSetNameError(name, type);
        const codeError = checkCodeValidity(code, type);
        
        setErrors({ name: nameError, code: codeError });
        
        if (!nameError && !codeError) {
            onSave({
                name: name.trim().toUpperCase(),
                type: type.toUpperCase(),
                code: code.trim()
            });
            
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
            <div className="d-grid mt-3">
                <button type="submit" className="btn btn-warning">Save</button>
            </div>
        </form>
    );
}
